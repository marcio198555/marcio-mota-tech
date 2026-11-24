#!/usr/bin/env bash
# Rebuild the v2 (real-footage) Temtop W100 ad -> ../temtop-w100-ugc-v2-9x16.mp4
# Needs: python3 (numpy, scipy, opencv-python, onnxruntime), node 18+, ffmpeg, curl,
#        a Chromium binary (set CHROME=/path/to/chrome).
set -euo pipefail
cd "$(dirname "$0")"
FPS=30
DUR=29.2
WORKERS=${WORKERS:-4}
mkdir -p stock work models

# 1. Stock footage (Pexels licence, credits in CREDITS.md)
while read -r name url; do
  [ -s "stock/$name.mp4" ] || curl -fsSL "$url" -o "stock/$name.mp4"
done < stock.txt

# 2. 2.5D "camera move" shots from the AI keyframes (only if the clips were deleted)
if [ ! -s clips/K03_par.mp4 ] || [ ! -s clips/K07_par.mp4 ]; then
  [ -s models/depth_anything_v2_vits.onnx ] || curl -fsSL -o models/depth_anything_v2_vits.onnx \
    https://github.com/fabio-sim/Depth-Anything-ONNX/releases/download/v2.0.0/depth_anything_v2_vits.onnx
  python3 parallax.py kf/K07.jpg clips/K07_par.mp4 3.0 "$FPS" pushin
  python3 parallax.py kf/K03.jpg clips/K03_par.mp4 2.5 "$FPS" orbit
fi

# 3. Footage track (cuts, punch-ins, split screen, blurred end-card backdrop) -> work/base_v2.mp4
python3 build_base.py

# 4. Voiceover timing (shared with v1), then soundtrack + loudness master
( cd ../source
  ffmpeg -v error -y -i audio/vo_elevenlabs.mp3 -ac 1 -ar 48000 -c:a pcm_s16le vo_raw.wav
  python3 vo_edit.py )
cp ../source/timeline.json ../source/vo_tight.wav work/
ffmpeg -v error -y -i audio/music_el.mp3 -ac 2 -ar 48000 -c:a pcm_s16le work/music_el.wav
ffmpeg -v error -y -i clips/K05_omni.mp4 -vn -ac 2 -ar 48000 -c:a pcm_s16le work/K05_omni.wav
python3 audio_v2.py work
bash master.sh work/mix_pre.wav work/mix_master.wav

# 5. Transparent motion-graphics layer (headless Chromium), parallel workers
npm install --silent
N=$(python3 -c "print(round($DUR*$FPS))")
STEP=$(( (N + WORKERS - 1) / WORKERS ))
for ((k = 0; k < WORKERS; k++)); do
  A=$((k * STEP)); B=$(( (k + 1) * STEP < N ? (k + 1) * STEP : N ))
  node render_ov.js frames overlay/index.html work/oframes "$FPS" "$A" "$B" &
done
wait

# 6. Composite (footage + grain + overlay) and encode with the master
python3 composite.py work ../temtop-w100-ugc-v2-9x16.mp4
echo "OK -> ../temtop-w100-ugc-v2-9x16.mp4"
