#!/bin/bash
# produce_texte.sh <jour 2 chiffres> : vidéo format T « texte seul » (sans voix, musique seule, en boucle)
#   source : autopilot/days/dayNN/texte.json  ->  /home/claude/studio/dayNN/dayNN_final.mp4
set -e
D=$1; ST=/home/claude/studio/day$D; R=/home/claude/marcio-mota-tech/autopilot
mkdir -p $ST
[ -f /home/claude/studio/sfx/ui_pop.wav ] || python3 $R/audio/synth.py sfx /home/claude/studio/sfx > /dev/null
python3 $R/tools/texte_cues.py $R/days/day$D/texte.json $ST > $ST/texte.log
cd $R/render
node render.js --scene scene_texte.js --timeline $ST/timeline.json --out $ST/silent.mp4 > $ST/render.log 2>&1
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $ST/silent.mp4)
ffmpeg -loglevel error -y -f lavfi -i anullsrc=r=48000:cl=stereo -t $DUR $ST/vo.wav
[ -f $ST/bed.wav ] || python3 $R/audio/synth.py bed $ST/bed.wav --duration $(python3 -c "print(round($DUR+0.3,2))") --bpm 112 --seed 2$D --novoice --fade-out 0.15 > /dev/null
python3 $R/mix.py --video $ST/silent.mp4 --vo $ST/vo.wav --music $ST/bed.wav --music-db -9 --duck-db 0 --fade 0.12 --sfx $ST/cues.json --out $ST/day${D}_final.mp4 > /dev/null
ffmpeg -hide_banner -nostats -i $ST/day${D}_final.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E "I:|Peak:" | tr -s ' ' | tr '\n' ' '
echo " -> day$D ok (texte, $DUR s)"
