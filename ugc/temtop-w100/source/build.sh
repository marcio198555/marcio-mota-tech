#!/usr/bin/env bash
# Rebuild the Temtop W100 UGC ad from sources.
# Needs: python3 + numpy + scipy, node 18+, ffmpeg, a Chromium binary (set CHROME=/path/to/chrome).
set -euo pipefail
cd "$(dirname "$0")"
FPS=30
DUR=29.2
WORKERS=${WORKERS:-4}

# 1. Voiceover: tighten pauses + caption timings (-> vo_tight.wav, timeline.json, timeline.js)
ffmpeg -v error -y -i audio/vo_elevenlabs.mp3 -ac 1 -ar 48000 -c:a pcm_s16le vo_raw.wav
python3 vo_edit.py
python3 -c "import json;d=json.load(open('timeline.json'));open('timeline.js','w').write('window.TL='+json.dumps(d,ensure_ascii=False)+';')"

# 2. Music + SFX + mix (-> mix_pre.wav), then master to -14 LUFS / -1.5 dBTP
python3 audio.py
ffmpeg -v error -y -i mix_pre.wav \
  -af "acompressor=threshold=0.1:ratio=2.5:attack=8:release=150:knee=6:makeup=1.4,loudnorm=I=-14:TP=-1.5:LRA=9" \
  -ar 48000 -c:a pcm_s16le mix_master.wav

# 3. Animation frames (headless Chromium), rendered by parallel workers
npm install --silent
N=$(python3 -c "print(round($DUR*$FPS))")
STEP=$(( (N + WORKERS - 1) / WORKERS ))
mkdir -p frames
for ((k = 0; k < WORKERS; k++)); do
  A=$((k * STEP)); B=$(( (k + 1) * STEP < N ? (k + 1) * STEP : N ))
  node render.js frames index.html frames "$FPS" "$A" "$B" &
done
wait

# 4. Encode + mux for Reels / TikTok / Shorts
ffmpeg -v error -y -framerate "$FPS" -i frames/f_%05d.png -i mix_master.wav \
  -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.2 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart \
  ../temtop-w100-ugc-9x16.mp4
echo "OK -> ../temtop-w100-ugc-9x16.mp4"
