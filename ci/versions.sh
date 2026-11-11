#!/usr/bin/env bash
# Prints the newest stable versions of the libraries the app uses, so that
# they can be kept up to date. Information only: it never fails the build.
m() {
  echo "== $1"
  curl -fsSL --max-time 20 "https://dl.google.com/android/maven2/$1/maven-metadata.xml" \
    | grep -oE '<version>[^<]+' | sed 's/<version>//' | grep -viE 'alpha|beta|rc|dev' | tail -6 | tr '\n' ' '
  echo
}
m com/android/tools/build/gradle
m androidx/activity/activity
m androidx/core/core
m androidx/webkit/webkit
m com/google/android/gms/play-services-ads
m com/google/android/ump/user-messaging-platform
m com/google/android/play/review
m com/android/billingclient/billing
echo "== gradle"
curl -fsSL --max-time 20 https://services.gradle.org/versions/current | tr -d '\n' | head -c 300
echo
echo "== installed sdk platforms"
ls "${ANDROID_HOME:-/usr/local/lib/android/sdk}/platforms" 2>/dev/null | tr '\n' ' '
echo
echo "== installed build-tools"
ls "${ANDROID_HOME:-/usr/local/lib/android/sdk}/build-tools" 2>/dev/null | tr '\n' ' '
echo
