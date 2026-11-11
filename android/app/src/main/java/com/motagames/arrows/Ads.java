package com.motagames.arrows;

import android.util.Log;

import androidx.activity.ComponentActivity;
import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Google AdMob: one full-screen ad kept ready for the break between two
 * levels, and one rewarded video kept ready for hints and extra hearts.
 * No ad is requested before the consent step has run (required in Europe
 * and Switzerland).
 */
final class Ads {

    interface Listener {
        void interstitialDone();

        void rewardedDone(boolean earned);
    }

    private final ComponentActivity activity;
    private final Listener listener;
    private final AtomicBoolean started = new AtomicBoolean(false);
    private ConsentInformation consent;
    private InterstitialAd interstitial;
    private RewardedAd rewarded;
    private volatile boolean rewardedReady;
    private boolean loadingInterstitial;
    private boolean loadingRewarded;
    private int failedInterstitial;
    private int failedRewarded;
    private boolean showing;
    private boolean stopped;
    private boolean ready;
    private boolean muted;

    Ads(ComponentActivity activity, Listener listener) {
        this.activity = activity;
        this.listener = listener;
    }

    void start() {
        consent = UserMessagingPlatform.getConsentInformation(activity);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
        consent.requestConsentInfoUpdate(activity, params,
                () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity, formError -> {
                    if (formError != null) Log.w(MainActivity.TAG, "consent form: " + formError.getMessage());
                    initIfAllowed();
                }),
                requestError -> {
                    Log.w(MainActivity.TAG, "consent request: " + requestError.getMessage());
                    initIfAllowed();
                });
        // Consent given in an earlier session is still valid: start right away.
        initIfAllowed();
    }

    void stop() {
        stopped = true;
        interstitial = null;
        rewarded = null;
        rewardedReady = false;
    }

    private void initIfAllowed() {
        if (stopped || consent == null || !consent.canRequestAds()) return;
        if (!started.compareAndSet(false, true)) return;
        MobileAds.setRequestConfiguration(new RequestConfiguration.Builder()
                .setMaxAdContentRating(BuildConfig.AD_RATING)
                .build());
        new Thread(() -> MobileAds.initialize(activity.getApplicationContext(), status ->
                activity.runOnUiThread(() -> {
                    if (stopped) return;
                    ready = true;
                    MobileAds.setAppMuted(muted);
                    Log.i(MainActivity.TAG, "ads: ready");
                    loadInterstitial();
                    loadRewarded();
                }))).start();
    }

    /** Ads start silent when the player has turned the game sound off. */
    void setMuted(boolean value) {
        muted = value;
        if (ready && !stopped) MobileAds.setAppMuted(value);
    }

    private void later(Runnable r, int failures) {
        if (stopped) return;
        long delay = Math.min(300000L, 15000L * (1L << Math.min(failures - 1, 5)));
        ((MainActivity) activity).mainHandler().postDelayed(() -> {
            if (!stopped) r.run();
        }, delay);
    }

    private void loadInterstitial() {
        if (stopped || !started.get() || interstitial != null || loadingInterstitial) return;
        loadingInterstitial = true;
        InterstitialAd.load(activity, BuildConfig.INTERSTITIAL_ID, new AdRequest.Builder().build(),
                new InterstitialAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull InterstitialAd ad) {
                        loadingInterstitial = false;
                        failedInterstitial = 0;
                        interstitial = ad;
                        Log.i(MainActivity.TAG, "ads: break ad loaded");
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        Log.w(MainActivity.TAG, "ads: break ad not loaded: " + error.getMessage());
                        loadingInterstitial = false;
                        interstitial = null;
                        later(Ads.this::loadInterstitial, ++failedInterstitial);
                    }
                });
    }

    private void loadRewarded() {
        if (stopped || !started.get() || rewarded != null || loadingRewarded) return;
        loadingRewarded = true;
        RewardedAd.load(activity, BuildConfig.REWARDED_ID, new AdRequest.Builder().build(),
                new RewardedAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd ad) {
                        loadingRewarded = false;
                        failedRewarded = 0;
                        rewarded = ad;
                        rewardedReady = true;
                        Log.i(MainActivity.TAG, "ads: video loaded");
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        Log.w(MainActivity.TAG, "ads: video not loaded: " + error.getMessage());
                        loadingRewarded = false;
                        rewarded = null;
                        rewardedReady = false;
                        later(Ads.this::loadRewarded, ++failedRewarded);
                    }
                });
    }

    /** Shows the ad if one is ready. The game always gets an answer. */
    void showInterstitial() {
        if (stopped || showing || interstitial == null) {
            listener.interstitialDone();
            loadInterstitial();
            return;
        }
        final InterstitialAd ad = interstitial;
        interstitial = null;
        showing = true;
        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdDismissedFullScreenContent() {
                showing = false;
                listener.interstitialDone();
                loadInterstitial();
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError error) {
                showing = false;
                listener.interstitialDone();
                loadInterstitial();
            }
        });
        ad.show(activity);
    }

    boolean rewardedReady() {
        return rewardedReady;
    }

    void showRewarded() {
        if (stopped || showing || rewarded == null) {
            listener.rewardedDone(false);
            loadRewarded();
            return;
        }
        final RewardedAd ad = rewarded;
        rewarded = null;
        rewardedReady = false;
        showing = true;
        final boolean[] earned = {false};
        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdDismissedFullScreenContent() {
                showing = false;
                listener.rewardedDone(earned[0]);
                loadRewarded();
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError error) {
                showing = false;
                listener.rewardedDone(false);
                loadRewarded();
            }
        });
        ad.show(activity, reward -> earned[0] = true);
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
}
