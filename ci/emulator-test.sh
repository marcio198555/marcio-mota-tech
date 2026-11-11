#!/usr/bin/env bash
# Runs on the build machine's Android emulator.
#   1. installs the test build and starts it; the game plays by itself
#   2. each time a full-screen ad shows up, takes a picture and closes it
#   3. restarts the game and asks for a rewarded video
#   4. leaves the app, comes back, presses the back button
# Pictures and the device log are saved in $OUT/emulator. The verdict goes
# to $OUT/STATUS.txt. This script never fails the build.
set -uo pipefail

OUT_ROOT="$1"
APK="$2"
OUT="$OUT_ROOT/emulator"
PKG=com.motagames.arrows.dev
ACT=com.motagames.arrows.MainActivity
mkdir -p "$OUT"

log() { echo "[$(date -u +%T)] $*" | tee -a "$OUT/steps.txt"; }
shot() {
  adb exec-out screencap -p > "$OUT/$1.png" 2>/dev/null
  [ -s "$OUT/$1.png" ] || rm -f "$OUT/$1.png"
}
top() { adb shell dumpsys activity activities 2>/dev/null | tr -d '\r' | grep -m1 -E 'topResumedActivity|mResumedActivity'; }
on_ad() { top | grep -q 'AdActivity'; }
alive() { [ -n "$(adb shell pidof "$PKG" 2>/dev/null | tr -d '\r')" ]; }
close_ad() {
  # Test ads close with the back button; otherwise tap the usual close corners.
  adb shell input keyevent 4
  sleep 2
  if on_ad; then
    local size w h
    size="$(adb shell wm size | tr -d '\r' | grep -oE '[0-9]+x[0-9]+' | tail -1)"
    w="${size%x*}"
    h="${size#*x}"
    adb shell input tap $((w - 70)) 160
    sleep 2
    if on_ad; then
      adb shell input tap 70 160
      sleep 2
    fi
    if on_ad; then
      adb shell input keyevent 4
      sleep 2
    fi
  fi
}

verdict=ok
fail() {
  verdict=failed
  log "PROBLEM: $*"
}

adb wait-for-device
adb shell input keyevent 82 >/dev/null 2>&1
log "android $(adb shell getprop ro.build.version.release | tr -d '\r') (api $(adb shell getprop ro.build.version.sdk | tr -d '\r'))"
log "webview $(adb shell dumpsys package com.google.android.webview 2>/dev/null | tr -d '\r' | grep -m1 versionName | xargs)"
log "screen $(adb shell wm size | tr -d '\r' | xargs) $(adb shell wm density | tr -d '\r' | xargs)"

if ! adb install -r "$APK" 2>&1 | tee -a "$OUT/steps.txt" | grep -q Success; then
  fail "the app could not be installed"
  echo "emulator=failed" >> "$OUT_ROOT/STATUS.txt"
  exit 0
fi
adb logcat -c
adb logcat -G 16M >/dev/null 2>&1

# ---- 1. the game plays by itself ------------------------------------------
log "start: the game plays by itself"
adb shell "am start -W -n $PKG/$ACT --es q 'debug&autoplay=12'" 2>&1 | tr -d '\r' | tee -a "$OUT/steps.txt"
sleep 7
shot 01-home
breaks=0
for i in $(seq 1 22); do
  sleep 5
  if on_ad; then
    breaks=$((breaks + 1))
    log "ad break on screen (#$breaks)"
    sleep 2
    shot "ad-break-$breaks"
    close_ad
    on_ad && fail "the ad break could not be closed"
  else
    shot "$(printf 'play-%02d' "$i")"
  fi
  if ! alive; then
    fail "the app stopped while playing"
    break
  fi
done
log "ad breaks seen: $breaks"

# ---- 2. rewarded video ------------------------------------------------------
log "restart: ask for a rewarded video"
adb shell am force-stop "$PKG"
sleep 1
adb shell "am start -W -n $PKG/$ACT --es q 'debug&video=5'" >/dev/null 2>&1
video=no
for i in $(seq 1 30); do
  sleep 3
  if on_ad; then
    video=yes
    break
  fi
done
if [ "$video" = yes ]; then
  log "rewarded video on screen"
  sleep 3
  shot video-1-start
  sleep 20
  shot video-2-middle
  sleep 20
  shot video-3-end
  close_ad
  sleep 3
  on_ad && fail "the rewarded video could not be closed"
  shot video-4-back-in-game
else
  log "no rewarded video appeared"
  shot video-none
fi

# ---- 3. leave, come back, back button ---------------------------------------
log "leave the app and come back"
adb shell input keyevent 3
sleep 3
adb shell "am start -n $PKG/$ACT" >/dev/null 2>&1
sleep 4
shot resume-1
alive || fail "the app did not survive leaving and coming back"
adb shell input keyevent 4
sleep 3
shot resume-2-after-back

# ---- device log and verdict -------------------------------------------------
adb logcat -d -v threadtime > "$OUT/logcat-full.txt" 2>/dev/null
grep -E " [VDIWE] Fletch *:| [IWE] Ads *:|AndroidRuntime|FATAL EXCEPTION|UserMessagingPlatform|chromium.*Uncaught" \
  "$OUT/logcat-full.txt" | head -800 > "$OUT/logcat.txt"
gzip -9 -f "$OUT/logcat-full.txt"

if grep -q "FATAL EXCEPTION" "$OUT/logcat.txt" && grep -A3 "FATAL EXCEPTION" "$OUT/logcat.txt" | grep -q "com.motagames"; then
  fail "the app crashed (see logcat.txt)"
fi
grep -q "\[fletch\] won level" "$OUT/logcat.txt" || fail "no level was finished"
grep -q "page: .*line" "$OUT/logcat.txt" && grep " E Fletch" "$OUT/logcat.txt" | head -5 | tee -a "$OUT/steps.txt"
wins="$(grep -c "\[fletch\] won level" "$OUT/logcat.txt")"
log "levels finished: $wins, ad breaks shown: $breaks, rewarded video shown: $video"
{
  echo "emulator=$verdict"
  echo "emulator_levels=$wins"
  echo "emulator_ad_breaks=$breaks"
  echo "emulator_video=$video"
} >> "$OUT_ROOT/STATUS.txt"
exit 0
