#!/usr/bin/env bash
# 2-pass loudness master: gentle bus compression, then linear loudnorm to -14 LUFS / -1.5 dBTP.
set -euo pipefail
IN=${1:-mix_pre.wav}; OUT=${2:-mix_master.wav}
PRE="acompressor=threshold=0.1:ratio=2.5:attack=8:release=150:knee=6:makeup=1.4"
J=$(ffmpeg -hide_banner -nostats -i "$IN" -af "$PRE,loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$IN" -af "$PRE,loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" \
  -ar 48000 -c:a pcm_s16le "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|LRA:|Peak:" | tail -3
