#!/usr/bin/env bash
# Information only: prints the public API of a few libraries fetched by the
# "probe" configuration, so that code can be written against the exact API.
set -u
cd android
./gradlew --no-daemon -q probeLibraries 2>&1 | grep '^PROBE ' | sed 's/^PROBE //' > "$RUNNER_TEMP/probe.txt"
cd ..
W="$(mktemp -d)"
{
  while read -r aar; do
    [ -f "$aar" ] || continue
    name="$(basename "$aar" .aar)"
    echo "################ $name"
    mkdir -p "$W/$name"
    unzip -q -o "$aar" -d "$W/$name"
    echo "--- aar metadata"
    cat "$W/$name/META-INF/com/android/build/gradle/aar-metadata.properties" 2>/dev/null
    pom="$(dirname "$(dirname "$aar")")"
    echo "--- pom dependencies"
    find "$pom" -name '*.pom' -exec grep -E "<groupId>|<artifactId>|<version>" {} \; 2>/dev/null | tr -d ' \t' | paste -sd' ' | head -c 3000
    echo
    jar="$W/$name/classes.jar"
    [ -f "$jar" ] || continue
    case "$name" in
      ads-mobile-sdk*)
        pat='^com/google/android/libraries/ads/mobile/sdk/(MobileAds|common/(RequestConfiguration|AdRequest|AdLoadCallback|LoadAdError|AdError|FullScreenContentError|PreloadConfiguration|PreloadCallback|AgeRestrictedTreatment)|interstitial/(InterstitialAd|InterstitialAdEventCallback|InterstitialAdPreloader)|rewarded/(RewardedAd|RewardedAdEventCallback|RewardedAdPreloader|OnUserEarnedRewardListener|RewardItem)|initialization/(InitializationConfig|InitializationStatus|OnAdapterInitializationCompleteListener))(\$[A-Za-z]+)*\.class$' ;;
      user-messaging-platform*)
        pat='^com/google/android/ump/(UserMessagingPlatform|ConsentInformation|ConsentRequestParameters|FormError|ConsentForm)(\$[A-Za-z]+)*\.class$' ;;
      billing*)
        pat='^com/android/billingclient/api/(BillingClient|BillingResult|ProductDetails|Purchase|PendingPurchasesParams|QueryProductDetailsParams|QueryProductDetailsResult|QueryPurchasesParams|BillingFlowParams|AcknowledgePurchaseParams|PurchasesUpdatedListener|BillingClientStateListener|ProductDetailsResponseListener|PurchasesResponseListener|AcknowledgePurchaseResponseListener|UnfetchedProduct)(\$[A-Za-z]+)*\.class$' ;;
      *) pat='' ;;
    esac
    echo "--- all top-level classes (first 120)"
    unzip -Z1 "$jar" | grep -E '\.class$' | grep -v '\$' | head -120 | tr '\n' ' '
    echo
    if [ -n "$pat" ]; then
      echo "--- public api"
      unzip -Z1 "$jar" | grep -E "$pat" | sed 's/\.class$//; s#/#.#g' | sort | while read -r cls; do
        javap -classpath "$jar" -public "$cls" 2>/dev/null | grep -v '^Compiled from'
      done
    fi
  done < "$RUNNER_TEMP/probe.txt"
} > "$OUT/api.txt" 2>&1
wc -c "$OUT/api.txt"
exit 0
