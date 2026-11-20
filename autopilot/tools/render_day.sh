#!/bin/bash
# render_day.sh NN : contrôle des durées de prises, finish.sh, puis Whisper par le pont (commit sans [skip-bridge]).
set -e
D=$1; R=/home/claude/marcio-mota-tech; cd $R/autopilot
python3 - $D <<'P'
import json,wave,glob,os,sys
n=sys.argv[1];job={s['id']:s['text'] for s in json.load(open(f'tts/cb_jobs/day{n}.json'))['segments']}
for f in sorted(glob.glob(f'tts/out/day{n}/*.wav')):
    w=wave.open(f);d=w.getnframes()/w.getframerate();sid=os.path.basename(f)[:-4];k=len(job.get(sid,'').split())
    if d/max(k,1)>0.7: print('SUSPECT',sid,round(d,1),k)
P
bash tools/finish.sh $D V 2>&1 | tail -2
cd $R && cp /home/claude/studio/day$D/vo.wav autopilot/vo/day${D}_vo.wav && echo autopilot/vo/day${D}_vo.wav >> autopilot/asr/todo.txt
git add autopilot/vo/day${D}_vo.wav autopilot/asr/todo.txt autopilot/days/day$D && git commit -qm "Whisper : voix du jour $D" && git pull -q --rebase origin tiktok-autopilot && git push -q origin tiktok-autopilot && echo "pushed $D"
