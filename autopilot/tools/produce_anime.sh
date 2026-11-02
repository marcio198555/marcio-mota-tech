#!/bin/bash
# produce_anime.sh <jour 2 chiffres> : format A « Les objets balancent » (objet qui parle) -> /home/claude/studio/dayNN/dayNN_final.mp4
# Avant : assemble_vo.py, puis tools/voice_fx.py (voix de personnage), puis champs « display » dans timeline.json.
set -e
D=$1; ST=/home/claude/studio/day$D; R=/home/claude/marcio-mota-tech/autopilot
[ -f /home/claude/studio/sfx/ui_pop.wav ] || python3 $R/audio/synth.py sfx /home/claude/studio/sfx > /dev/null
python3 $R/captime.py --timeline $ST/timeline.json --vo $ST/vo.wav --out $ST/timeline_words.json > $ST/captime.log
python3 $R/tools/mouth.py $ST/vo.wav $ST/timeline_words.json
cd $R/render
node render.js --scene ../days/day$D/scene.js --timeline $ST/timeline_words.json --out $ST/silent.mp4 > $ST/render.log 2>&1
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $ST/silent.mp4)
[ -f $ST/bed.wav ] || python3 $R/audio/synth.py bed $ST/bed.wav --duration $(python3 -c "print(round($DUR+0.4,2))") --bpm 112 --seed 3$D --style chill > /dev/null
python3 $R/mix.py --video $ST/silent.mp4 --vo $ST/vo.wav --music $ST/bed.wav --music-db -18 --duck-db 8 --sfx $ST/cues.json --out $ST/day${D}_final.mp4 > /dev/null
ffmpeg -hide_banner -nostats -i $ST/day${D}_final.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E "I:|Peak:" | tr -s ' ' | tr '\n' ' '
echo " -> day$D ok (animé, $DUR s)"
