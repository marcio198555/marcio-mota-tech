#!/usr/bin/env bash
# Shareable copy of a finished ad that fits the chat's file limit (~30 MB): 2-pass H.264 at the bitrate that
# lands on the target size, AAC 160k, BT.709 tags, faststart. For a 54 s ad the default gives ~3.8 Mb/s, which
# social networks re-encode anyway, so it is the copy to post.
# usage: bash share_copy.sh in.mp4 out.mp4 [target_MiB=25.5]
set -euo pipefail
IN=$1; OUT=$2; TARGET=${3:-25.5}
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
VK=$(python3 -c "print(int($TARGET*8*1048576/$DUR/1000 - 170))")          # video kb/s = total - audio - mux overhead
LOG=$(mktemp -d)/x264
ffmpeg -v error -y -i "$IN" -c:v libx264 -preset slow -b:v ${VK}k -pass 1 -passlogfile "$LOG" -an -f null /dev/null
ffmpeg -v error -y -i "$IN" -c:v libx264 -preset slow -b:v ${VK}k -maxrate $((VK * 16 / 10))k -bufsize $((VK * 2))k -pass 2 -passlogfile "$LOG" \
  -profile:v high -level 4.2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 160k -movflags +faststart "$OUT"
python3 -c "import os;print('$OUT', round(os.path.getsize('$OUT')/1048576,1), 'MiB at ${VK} kb/s video')"
