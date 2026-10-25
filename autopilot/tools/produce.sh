#!/bin/bash
# produce.sh <jour 2 chiffres> : rendu + musique + mixage -> /home/claude/studio/dayNN/dayNN_final.mp4
set -e
D=$1; ST=/home/claude/studio/day$D; R=/home/claude/marcio-mota-tech/autopilot
python3 $R/captime.py --timeline $ST/timeline.json --vo $ST/vo.wav --out $ST/timeline_words.json > $ST/captime.log
cd $R/render
node render.js --scene ../days/day$D/scene.js --timeline $ST/timeline_words.json --out $ST/silent.mp4 > $ST/render.log 2>&1
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $ST/silent.mp4)
[ -f $ST/bed.wav ] || python3 $R/audio/synth.py bed $ST/bed.wav --duration $(python3 -c "print(round($DUR+0.4,2))") --bpm 104 --seed 1$D > /dev/null
python3 $R/mix.py --video $ST/silent.mp4 --vo $ST/vo.wav --music $ST/bed.wav --music-db -17 --duck-db 9 --sfx $ST/cues.json --out $ST/day${D}_final.mp4
ffmpeg -hide_banner -nostats -i $ST/day${D}_final.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E "I:|Peak:" | tr -s ' ' | tr '\n' ' '
echo " -> day$D ok"
