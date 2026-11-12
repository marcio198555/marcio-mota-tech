package com.motagames.arrows;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.util.Log;
import android.view.ViewGroup;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import androidx.activity.ComponentActivity;
import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;

import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;

import java.util.Locale;

/**
 * The whole game is a web page shipped inside the app. This activity shows it
 * full screen and gives it what a web page cannot do alone: ads, vibration,
 * the back button, a backed-up copy of the saved game.
 */
public final class MainActivity extends ComponentActivity implements Ads.Listener {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String HOME = "https://" + HOST + "/assets/index.html";
    private static final String PREFS = "fletch";
    static final String TAG = "Fletch";
    private static final int NIGHT = 0xFF0A0E1D;
    private static final int DAY = 0xFFECE7DC;

    private final Handler main = new Handler(Looper.getMainLooper());
    private FrameLayout root;
    private WebView web;
    private Ads ads;
    private SharedPreferences prefs;
    private boolean pageReady;
    private String insetsJs = "";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences(PREFS, MODE_PRIVATE);

        root = new FrameLayout(this);
        root.setBackgroundColor(NIGHT);
        web = new WebView(this);
        root.addView(web, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        // The page draws under the status and navigation bars. Their sizes are
        // handed to it so that buttons never sit under a bar or a camera cut-out.
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets bars = insets.getInsets(
                    WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            float d = getResources().getDisplayMetrics().density;
            insetsJs = String.format(Locale.US,
                    "(function(){var s=document.documentElement.style;"
                            + "s.setProperty('--sat','%.1fpx');s.setProperty('--sab','%.1fpx');"
                            + "s.setProperty('--sal','%.1fpx');s.setProperty('--sar','%.1fpx');"
                            + "window.dispatchEvent(new Event('resize'));})()",
                    bars.top / d, bars.bottom / d, bars.left / d, bars.right / d);
            if (pageReady) js(insetsJs);
            return WindowInsetsCompat.CONSUMED;
        });

        setUpWeb();
        ads = new Ads(this, this, main);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (!pageReady) {
                    finish();
                    return;
                }
                web.evaluateJavascript(
                        "(function(){try{return !!(window.__fletch&&window.__fletch.back())}catch(e){return false}})()",
                        value -> {
                            if (!"true".equals(value)) finish();
                        });
            }
        });

        web.loadUrl(startUrl());
        ads.start();
    }

    @SuppressLint({"SetJavaScriptEnabled", "ClickableViewAccessibility"})
    private void setUpWeb() {
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);
        web.setBackgroundColor(NIGHT);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);
        web.setHapticFeedbackEnabled(true);
        web.setLongClickable(false);
        web.setOnLongClickListener(v -> true);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (HOST.equals(uri.getHost())) return false;
                openExternal(uri.toString());
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pageReady = true;
                if (!insetsJs.isEmpty()) js(insetsJs);
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                // The system killed the page's process (low memory): start again cleanly.
                recreate();
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                // Page errors show up in the device log, which is how bugs get found.
                if (m.messageLevel() == ConsoleMessage.MessageLevel.ERROR) {
                    Log.e(TAG, "page: " + m.message() + " (line " + m.lineNumber() + ")");
                } else if (BuildConfig.DEBUG) {
                    Log.d(TAG, "page: " + m.message());
                }
                return true;
            }
        });
        web.addJavascriptInterface(new Bridge(), "FletchNative");
    }

    /** Test builds can pass options to the page, e.g. to make it play by itself. */
    private String startUrl() {
        if (BuildConfig.DEBUG) {
            String q = getIntent() != null ? getIntent().getStringExtra("q") : null;
            if (q != null && q.matches("[a-z0-9=&]{1,60}")) return HOME + "?" + q;
        }
        return HOME;
    }

    private void js(String code) {
        if (web != null) web.evaluateJavascript(code, null);
    }

    private void openExternal(String url) {
        if (url == null || !url.startsWith("https://")) return;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        } catch (ActivityNotFoundException ignored) {
            // No browser on this device: nothing to open.
        }
    }

    private void doHaptic(String kind) {
        int c;
        if ("bump".equals(kind)) {
            c = Build.VERSION.SDK_INT >= 30 ? HapticFeedbackConstants.REJECT : HapticFeedbackConstants.LONG_PRESS;
        } else if ("win".equals(kind)) {
            c = Build.VERSION.SDK_INT >= 30 ? HapticFeedbackConstants.CONFIRM : HapticFeedbackConstants.VIRTUAL_KEY;
        } else {
            c = HapticFeedbackConstants.KEYBOARD_TAP;
        }
        web.performHapticFeedback(c);
    }

    private void applyTheme(boolean dark) {
        int color = dark ? NIGHT : DAY;
        root.setBackgroundColor(color);
        web.setBackgroundColor(color);
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), root);
        c.setAppearanceLightStatusBars(!dark);
        c.setAppearanceLightNavigationBars(!dark);
    }

    private void askReview() {
        try {
            ReviewManager manager = ReviewManagerFactory.create(this);
            manager.requestReviewFlow().addOnCompleteListener(task -> {
                if (task.isSuccessful() && !isFinishing() && !isDestroyed()) {
                    manager.launchReviewFlow(this, task.getResult());
                }
            });
        } catch (RuntimeException ignored) {
            // Rating sheet not available (app not installed from Google Play).
        }
    }

    // ---- ads -> page ----

    @Override
    public void interstitialDone() {
        js("window.__fletch&&window.__fletch.interstitialDone()");
    }

    @Override
    public void rewardedDone(boolean earned) {
        js("window.__fletch&&window.__fletch.rewardedDone(" + (earned ? "true" : "false") + ")");
    }

    // ---- lifecycle ----

    @Override
    protected void onPause() {
        if (pageReady) js("window.__fletch&&window.__fletch.pause()");
        if (ads != null) ads.pause();
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        if (ads != null) ads.resume();
        if (pageReady) js("window.__fletch&&window.__fletch.resume()");
    }

    @Override
    protected void onDestroy() {
        ads.stop();
        main.removeCallbacksAndMessages(null);
        root.removeView(web);
        web.destroy();
        super.onDestroy();
    }

    /** Methods the game page can call. They arrive on a background thread. */
    private final class Bridge {
        @JavascriptInterface
        public void showInterstitial() {
            main.post(() -> ads.showInterstitial());
        }

        @JavascriptInterface
        public void showRewarded(String tag) {
            main.post(() -> ads.showRewarded());
        }

        @JavascriptInterface
        public boolean rewardedReady() {
            return ads.rewardedReady();
        }

        @JavascriptInterface
        public void haptic(String kind) {
            main.post(() -> doHaptic(kind));
        }

        @JavascriptInterface
        public void openUrl(String url) {
            main.post(() -> openExternal(url));
        }

        @JavascriptInterface
        public void exitApp() {
            main.post(MainActivity.this::finish);
        }

        @JavascriptInterface
        public String appVersion() {
            return BuildConfig.VERSION_NAME;
        }

        @JavascriptInterface
        public void saveState(String json) {
            if (json != null && json.length() < 400000) prefs.edit().putString("save", json).apply();
        }

        @JavascriptInterface
        public String loadState() {
            return prefs.getString("save", "");
        }

        @JavascriptInterface
        public void review() {
            main.post(MainActivity.this::askReview);
        }

        @JavascriptInterface
        public boolean adChoicesRequired() {
            return ads.adChoicesRequired();
        }

        @JavascriptInterface
        public void showAdChoices() {
            main.post(() -> ads.showAdChoices());
        }

        @JavascriptInterface
        public void setTheme(boolean dark) {
            main.post(() -> applyTheme(dark));
        }

        @JavascriptInterface
        public void setSound(boolean on) {
            main.post(() -> ads.setMuted(!on));
        }
    }
}
