#!/usr/bin/env bash
# Gathers what the build produced into the $OUT folder.
set -u
B=android/app/build
mkdir -p "$OUT"
cp "$B/outputs/apk/debug/app-debug.apk" "$OUT/fletch-test.apk" 2>/dev/null
cp "$B/outputs/apk/release/app-release-unsigned.apk" "$OUT/fletch-release-unsigned.apk" 2>/dev/null
cp "$B/outputs/apk/release/app-release.apk" "$OUT/fletch-release-signed-by-ci.apk" 2>/dev/null
cp "$B/outputs/bundle/release/app-release.aab" "$OUT/fletch-release-unsigned.aab" 2>/dev/null
cp "$B/reports/lint.txt" "$OUT/lint.txt" 2>/dev/null
find "$B/reports" -maxdepth 1 -name 'lint-results*.txt' -exec cp {} "$OUT/" \; 2>/dev/null

# The tool that signs APK files, taken from the Android SDK of this machine.
SDK="${ANDROID_HOME:-/usr/local/lib/android/sdk}"
BT="$(ls -d "$SDK"/build-tools/* 2>/dev/null | sort -V | tail -1)"
[ -n "$BT" ] && cp "$BT/lib/apksigner.jar" "$OUT/apksigner.jar" 2>/dev/null

# A copy of the release build signed with a throw-away key made on the spot,
# only to try it on the emulator. Neither the key nor the copy is published.
if [ -f "$OUT/fletch-release-unsigned.apk" ] && [ -n "$BT" ]; then
  K="$RUNNER_TEMP/throwaway.jks"
  rm -f "$K"
  keytool -genkeypair -keystore "$K" -storetype PKCS12 -storepass android -keypass android -alias ci \
    -keyalg RSA -keysize 2048 -validity 30 -dname "CN=Emulator test only" >/dev/null 2>&1
  if java -jar "$BT/lib/apksigner.jar" sign --ks "$K" --ks-pass pass:android --ks-key-alias ci \
    --out "$RUNNER_TEMP/fletch-release-ci.apk" "$OUT/fletch-release-unsigned.apk"; then
    echo "release build signed for the emulator"
  else
    echo "release build could NOT be signed for the emulator"
  fi
fi

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
