#!/bin/bash
# story.sh <jour 2 chiffres> : version Story Instagram de la vidéo TikTok du jour NN
#   = la même vidéo + le bandeau « PLUS DE VIDÉOS SUR TIKTOK · @marcio.mota8 » (tools/story_banner.py)
#   + 2 s de fin « NOUVELLE VIDÉO SUR TIKTOK » (tools/story_endcard.py, depuis le 05.11.2026)
#   -> media/stories/dayNN_story.mp4 (à committer, puis Cloudinary + Buffer : RUNBOOK § 8.6)
# Une Story Instagram publiée par l'API (Buffer) dure 60 s au plus : si la vidéo dépasse 58 s (recette du 05.11 :
# 50 à 70 s), la Story s'arrête à la fin de la dernière phrase finie avant 57,5 s (days/dayNN/studio/timeline.json),
# avec un fondu de 0,3 s, puis l'image de fin de 2 s : 59,5 s au plus.
set -e
D=$1; R=/home/claude/marcio-mota-tech; IN=$(ls $R/media/day${D}_*.mp4 | head -1); OUT=$R/media/stories/day${D}_story.mp4
mkdir -p $R/media/stories
[ -f /home/claude/studio/story_banner.png ] || python3 $R/autopilot/tools/story_banner.py /home/claude/studio/story_banner.png > /dev/null
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
CUT=""
if python3 -c "import sys; sys.exit(0 if float('$DUR') > 58 else 1)"; then
  CUT=$(python3 - "$R/autopilot/days/day$D/studio/timeline.json" <<'PY'
import json, sys, pathlib
p = pathlib.Path(sys.argv[1])
segs = json.loads(p.read_text()).get('segments', []) if p.exists() else []
ends = [s['end'] for s in segs if s['end'] <= 57.5]
print(round(max(ends) + 0.1, 2) if ends else 57.5)
PY
)
fi
if [ -n "$CUT" ]; then
  F=$(python3 -c "print(round($CUT-0.3,2))")
  ffmpeg -loglevel error -y -i "$IN" -i /home/claude/studio/story_banner.png -t $CUT \
    -filter_complex "[0:v][1:v]overlay=0:0,fade=t=out:st=$F:d=0.3[v];[0:a]afade=t=out:st=$F:d=0.3[a]" -map "[v]" -map "[a]" \
    -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart "$OUT"
  echo "story day$D : vidéo de $DUR s coupée à $CUT s (limite de 60 s des Stories)"
else
  ffmpeg -loglevel error -y -i "$IN" -i /home/claude/studio/story_banner.png -filter_complex "[0:v][1:v]overlay=0:0" \
    -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -r 30 -c:a copy -movflags +faststart "$OUT"
fi
# image de fin « NOUVELLE VIDÉO SUR TIKTOK · @marcio.mota8 » (2 s, accord de Marcio du 05.11.2026)
python3 $R/autopilot/tools/story_endcard.py "$OUT" "${OUT%.mp4}_fin.mp4" && mv "${OUT%.mp4}_fin.mp4" "$OUT"
echo "story day$D -> $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT) s)"
