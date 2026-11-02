#!/bin/bash
# reel_cut.sh <jour 2 chiffres> : version Reel d'essai Instagram de la vidéo TikTok du jour NN -> media/reels/dayNN_reel.mp4
#   formats V et A : coupe juste avant le segment qui contient « abonne » (fin propre à TikTok : @, CE SOIR, S'ABONNER),
#   fondu de 0,35 s ; format T (pas de segments) : copie telle quelle.
set -e
D=$1; R=/home/claude/marcio-mota-tech; IN=$(ls $R/media/day${D}_*.mp4 | head -1); OUT=$R/media/reels/day${D}_reel.mp4
mkdir -p $R/media/reels
CUT=$(python3 - "$R/autopilot/days/day$D/studio/timeline.json" <<'PY'
import json, sys, pathlib
p = pathlib.Path(sys.argv[1])
if not p.exists(): print(''); raise SystemExit
segs = json.loads(p.read_text()).get('segments', [])
for i, s in enumerate(segs):
    if 'abonne' in (s.get('text', '') + s.get('display', '')).lower() and i > 0:
        print(round(segs[i - 1]['end'] + 0.05, 2)); break
else: print('')
PY
)
if [ -z "$CUT" ]; then cp "$IN" "$OUT"; echo "reel day$D : copie (pas de fin à couper)"; exit 0; fi
F=$(python3 -c "print(round($CUT-0.35,2))")
ffmpeg -loglevel error -y -i "$IN" -t $CUT -vf "fade=t=out:st=$F:d=0.35" -af "afade=t=out:st=$F:d=0.35" -c:v libx264 -preset veryfast -crf 18 -c:a aac -b:a 192k -movflags +faststart "$OUT"
ffmpeg -loglevel error -y -ss $(python3 -c "print(round($CUT-0.45,2))") -i "$IN" -frames:v 1 /home/claude/studio/reel_cut_day$D.jpg
echo "reel day$D : coupé à $CUT s (image de contrôle /home/claude/studio/reel_cut_day$D.jpg : ni @, ni CE SOIR, ni S'ABONNER)"
