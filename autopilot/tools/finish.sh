#!/bin/bash
# finish.sh NN [V|A] [args assemble] : voix -> timeline + display -> repères -> rendu -> mixage
set -e
D=$1; F=${2:-V}; R=/home/claude/marcio-mota-tech/autopilot; ST=/home/claude/studio/day$D; mkdir -p $ST
SRC=${SRC:-$R/tts/out/day$D}
python3 $R/assemble_vo.py $SRC $ST/vo.wav $ST/timeline.json --lead 0.12 --gap 0.1 | tail -1
T=$(python3 -c "import json;d=json.load(open('$ST/timeline.json'))['duration'];print(round(d/68.6,3) if d>69 else '')")
if [ -n "$T" ]; then python3 $R/assemble_vo.py $SRC $ST/vo.wav $ST/timeline.json --lead 0.12 --gap 0.1 --tempo $T | tail -1; echo tempo $T; fi
python3 - "$R/days/day$D/draft.json" "$ST/timeline.json" <<'P'
import json,sys
d=json.load(open(sys.argv[1]))['display'];p=sys.argv[2];t=json.load(open(p))
for s in t['segments']:
    s['display']=d.get(s['id'],s['text'])
json.dump(t,open(p,'w'),ensure_ascii=False,indent=1)
print('durée',t['duration'])
P
python3 $R/days/day$D/make_cues.py $ST/timeline.json
if [ "$F" = A ]; then bash $R/tools/produce_anime.sh $D; else bash $R/tools/produce.sh $D; fi
mkdir -p $R/days/day$D/studio; cp $ST/timeline.json $ST/cues.json $R/days/day$D/studio/
ffprobe -v error -show_entries format=duration -of csv=p=0 $ST/day${D}_final.mp4
