#!/bin/bash
# story.sh <jour 2 chiffres> : version Story Instagram de la vidéo TikTok du jour NN
#   = la même vidéo + le bandeau « PLUS DE VIDÉOS SUR TIKTOK · @marcio.mota8 » (tools/story_banner.py)
#   -> media/stories/dayNN_story.mp4 (à committer, puis Cloudinary + Metricool : RUNBOOK § 8.6)
set -e
D=$1; R=/home/claude/marcio-mota-tech; IN=$(ls $R/media/day${D}_*.mp4 | head -1); OUT=$R/media/stories/day${D}_story.mp4
mkdir -p $R/media/stories
[ -f /home/claude/studio/story_banner.png ] || python3 $R/autopilot/tools/story_banner.py /home/claude/studio/story_banner.png > /dev/null
ffmpeg -loglevel error -y -i "$IN" -i /home/claude/studio/story_banner.png -filter_complex "[0:v][1:v]overlay=0:0" \
  -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -r 30 -c:a copy -movflags +faststart "$OUT"
echo "story day$D -> $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT) s)"
