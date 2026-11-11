#!/usr/bin/env bash
# Gathers what the build produced into the $OUT folder.
set -u
B=android/app/build
mkdir -p "$OUT"
cp "$B/outputs/apk/debug/app-debug.apk" "$OUT/fletch-test.apk" 2>/dev/null
cp "$B/outputs/apk/release/app-release-unsigned.apk" "$OUT/fletch-release-unsigned.apk" 2>/dev/null
cp "$B/outputs/apk/release/app-release.apk" "$OUT/fletch-release-signed-by-ci.apk" 2>/dev/null
cp "$B/outputs/bundle/release/app-release.aab" "$OUT/fletch-release-unsigned.aab" 2>/dev/null
cp "$B/outputs/mapping/release/mapping.txt" "$OUT/mapping.txt" 2>/dev/null
cp "$B/reports/lint.txt" "$OUT/lint.txt" 2>/dev/null
find "$B/reports" -maxdepth 1 -name 'lint-results*.txt' -exec cp {} "$OUT/" \; 2>/dev/null

# The tool that signs APK files, taken from the Android SDK of this machine.
SDK="${ANDROID_HOME:-/usr/local/lib/android/sdk}"
BT="$(ls -d "$SDK"/build-tools/* 2>/dev/null | sort -V | tail -1)"
[ -n "$BT" ] && cp "$BT/lib/apksigner.jar" "$OUT/apksigner.jar" 2>/dev/null

if [ -f "$OUT/build-full.log" ]; then
  grep -nE "error:|warning:|FAILED|What went wrong|Could not|Unresolved|cannot find symbol|Execution failed|BUILD " \
    "$OUT/build-full.log" | head -300 > "$OUT/build-problems.txt"
  tail -250 "$OUT/build-full.log" > "$OUT/build-tail.log"
  gzip -9 -f "$OUT/build-full.log"
fi

if [ -f "$OUT/fletch-test.apk" ] && [ -f "$OUT/fletch-release-unsigned.aab" ]; then
  echo "android=ok" >> "$OUT/STATUS.txt"
else
  echo "android=failed" >> "$OUT/STATUS.txt"
fi
ls -la "$OUT"
exit 0
