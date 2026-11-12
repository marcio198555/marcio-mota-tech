package com.motagames.arrows;

import android.content.Context;
import android.os.Handler;
import android.util.Log;

import androidx.activity.ComponentActivity;
import androidx.annotation.NonNull;

import com.google.android.libraries.ads.mobile.sdk.MobileAds;
import com.google.android.libraries.ads.mobile.sdk.common.AdLoadCallback;
import com.google.android.libraries.ads.mobile.sdk.common.AdRequest;
import com.google.android.libraries.ads.mobile.sdk.common.FullScreenContentError;
import com.google.android.libraries.ads.mobile.sdk.common.LoadAdError;
import com.google.android.libraries.ads.mobile.sdk.common.RequestConfiguration;
import com.google.android.libraries.ads.mobile.sdk.initialization.InitializationConfig;
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAd;
import com.google.android.libraries.ads.mobile.sdk.interstitial.InterstitialAdEventCallback;
import com.google.android.libraries.ads.mobile.sdk.rewarded.RewardedAd;
import com.google.android.libraries.ads.mobile.sdk.rewarded.RewardedAdEventCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Google AdMob (Google Mobile Ads "Next-Gen" SDK): one full-screen ad kept
 * ready for the break between two levels, and one rewarded video kept ready
 * for hints and extra hearts.
 *
 * No ad is requested before the consent step has run (required in Europe and
 * Switzerland). The SDK reports its events on background threads; everything
 * here is brought back to the main thread before any state is touched.
 */
final class Ads {

    interface Listener {
        void interstitialDone();

        void rewardedDone(boolean earned);
    }

    private final ComponentActivity activity;
    private final Listener listener;
    private final Handler main;
    private final AtomicBoolean started = new AtomicBoolean(false);
    private ConsentInformation consent;
    private InterstitialAd interstitial;
    private RewardedAd rewarded;
    private volatile boolean rewardedReady;
    private boolean loadingInterstitial;
    private boolean loadingRewarded;
    private int failedInterstitial;
    private int failedRewarded;
    private boolean stopped;
    private boolean ready;
    private boolean muted;
    private boolean consentBusy;
    private int consentFailures;
    /** Ends the ad on screen, whichever way it ends. Null when no ad is showing. */
    private Runnable closeShowing;

    Ads(ComponentActivity activity, Listener listener, Handler main) {
        this.activity = activity;
        this.listener = listener;
        this.main = main;
    }

    private void ui(Runnable r) {
        main.post(r);
    }

    // ---- consent ----

    void start() {
        consent = UserMessagingPlatform.getConsentInformation(activity);
        requestConsent();
        // Consent given in an earlier session is still valid: start right away.
        initIfAllowed();
    }

    /** Called each time the game comes back to the front. */
    void resume() {
        if (consent != null && !started.get() && !stopped) {
            consentFailures = 0;
            requestConsent();
        }
        // The game is in front again, so no ad covers it any more. If the SDK
        // did not say that the ad was closed, do not leave the player waiting.
        final Runnable pending = closeShowing;
        if (pending != null) main.postDelayed(pending, 2500);
    }

    private void requestConsent() {
        if (stopped || consentBusy) return;
        consentBusy = true;
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
        consent.requestConsentInfoUpdate(activity, params,
                () -> ui(() -> {
                    consentBusy = false;
                    consentFailures = 0;
                    if (stopped) return;
                    UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity, formError -> ui(() -> {
                        if (formError != null) Log.w(MainActivity.TAG, "consent form: " + formError.getMessage());
                        initIfAllowed();
                    }));
                }),
                requestError -> ui(() -> {
                    initIfAllowed();
                    if (!consentBusy) return; // the same failure can be reported twice
                    consentBusy = false;
                    Log.w(MainActivity.TAG, "consent request: " + requestError.getMessage());
                    // Usually a slow network at launch: ask again a little later.
                    if (!stopped && !started.get() && ++consentFailures <= 6) {
                        main.postDelayed(this::requestConsent, 4000L << Math.min(consentFailures - 1, 5));
                    }
                }));
    }

    boolean adChoicesRequired() {
        return consent != null
                && consent.getPrivacyOptionsRequirementStatus()
                == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED;
    }

    void showAdChoices() {
        if (stopped) return;
        UserMessagingPlatform.showPrivacyOptionsForm(activity, formError -> {
        });
    }

    // ---- start-up ----

    private static RequestConfiguration.MaxAdContentRating rating() {
        switch (BuildConfig.AD_RATING) {
            case "G":
                return RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_G;
            case "T":
                return RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_T;
            case "MA":
                return RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_MA;
            default:
                return RequestConfiguration.MaxAdContentRating.MAX_AD_CONTENT_RATING_PG;
        }
    }

    private void initIfAllowed() {
        if (stopped || consent == null || !consent.canRequestAds()) return;
        if (!started.compareAndSet(false, true)) return;
        final Context app = activity.getApplicationContext();
        final InitializationConfig config = new InitializationConfig.Builder(BuildConfig.ADMOB_APP_ID)
                .setRequestConfiguration(new RequestConfiguration.Builder()
                        .setMaxAdContentRating(rating())
                        .build())
                .build();
        // The SDK must be started away from the main thread.
        new Thread(() -> {
            try {
                MobileAds.initialize(app, config);
            } catch (RuntimeException e) {
                Log.e(MainActivity.TAG, "ads: could not start", e);
                return;
            }
            ui(() -> {
                if (stopped) return;
                ready = true;
                MobileAds.setUserMutedApp(muted);
                Log.i(MainActivity.TAG, "ads: ready");
                loadInterstitial();
                loadRewarded();
            });
        }, "ads-start").start();
    }

    void stop() {
        stopped = true;
        interstitial = null;
        rewarded = null;
        rewardedReady = false;
        closeShowing = null;
    }

    /** Ads start silent when the player has turned the game sound off. */
    void setMuted(boolean value) {
        muted = value;
        if (ready && !stopped) MobileAds.setUserMutedApp(value);
    }

    private void later(Runnable r, int failures) {
        if (stopped) return;
        long delay = Math.min(300000L, 15000L * (1L << Math.min(failures - 1, 5)));
        main.postDelayed(() -> {
            if (!stopped) r.run();
        }, delay);
    }

    // ---- the ad between two levels ----

    private void loadInterstitial() {
        if (stopped || !ready || interstitial != null || loadingInterstitial) return;
        loadingInterstitial = true;
        InterstitialAd.load(new AdRequest.Builder(BuildConfig.INTERSTITIAL_ID).build(),
                new AdLoadCallback<InterstitialAd>() {
                    @Override
                    public void onAdLoaded(@NonNull InterstitialAd ad) {
                        ui(() -> {
                            loadingInterstitial = false;
                            failedInterstitial = 0;
                            if (stopped) return;
                            interstitial = ad;
                            Log.i(MainActivity.TAG, "ads: break ad loaded");
                        });
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        ui(() -> {
                            Log.w(MainActivity.TAG, "ads: break ad not loaded: " + error.getMessage());
                            loadingInterstitial = false;
                            later(Ads.this::loadInterstitial, ++failedInterstitial);
                        });
                    }
                });
    }

    /** Shows the ad if one is ready. The game always gets an answer. */
    void showInterstitial() {
        if (stopped || closeShowing != null || interstitial == null) {
            listener.interstitialDone();
            loadInterstitial();
            return;
        }
        final InterstitialAd ad = interstitial;
        interstitial = null;
        final Runnable close = new Runnable() {
            @Override
            public void run() {
                if (closeShowing != this) return; // already ended
                closeShowing = null;
                listener.interstitialDone();
                loadInterstitial();
            }
        };
        closeShowing = close;
        ad.setAdEventCallback(new InterstitialAdEventCallback() {
            @Override
            public void onAdShowedFullScreenContent() {
                Log.i(MainActivity.TAG, "ads: break ad on screen");
            }

            @Override
            public void onAdDismissedFullScreenContent() {
                ui(close);
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull FullScreenContentError error) {
                Log.w(MainActivity.TAG, "ads: break ad not shown: " + error.getMessage());
                ui(close);
            }
        });
        ad.show(activity);
    }

    // ---- the video the player chooses to watch ----

    private void loadRewarded() {
        if (stopped || !ready || rewarded != null || loadingRewarded) return;
        loadingRewarded = true;
        RewardedAd.load(new AdRequest.Builder(BuildConfig.REWARDED_ID).build(),
                new AdLoadCallback<RewardedAd>() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd ad) {
                        ui(() -> {
                            loadingRewarded = false;
                            failedRewarded = 0;
                            if (stopped) return;
                            rewarded = ad;
                            rewardedReady = true;
                            Log.i(MainActivity.TAG, "ads: video loaded");
                        });
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        ui(() -> {
                            Log.w(MainActivity.TAG, "ads: video not loaded: " + error.getMessage());
                            loadingRewarded = false;
                            rewardedReady = false;
                            later(Ads.this::loadRewarded, ++failedRewarded);
                        });
                    }
                });
    }

    boolean rewardedReady() {
        return rewardedReady;
    }

    void showRewarded() {
        if (stopped || closeShowing != null || rewarded == null) {
            listener.rewardedDone(false);
            loadRewarded();
            return;
        }
        final RewardedAd ad = rewarded;
        rewarded = null;
        rewardedReady = false;
        final AtomicBoolean earned = new AtomicBoolean(false);
        final Runnable close = new Runnable() {
            @Override
            public void run() {
                if (closeShowing != this) return; // already ended
                closeShowing = null;
                listener.rewardedDone(earned.get());
                loadRewarded();
            }
        };
        closeShowing = close;
        ad.setAdEventCallback(new RewardedAdEventCallback() {
            @Override
            public void onAdShowedFullScreenContent() {
                Log.i(MainActivity.TAG, "ads: video on screen");
            }

            @Override
            public void onAdDismissedFullScreenContent() {
                ui(close);
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull FullScreenContentError error) {
                Log.w(MainActivity.TAG, "ads: video not shown: " + error.getMessage());
                ui(close);
            }
        });
        ad.show(activity, reward -> earned.set(true));
    }
}
