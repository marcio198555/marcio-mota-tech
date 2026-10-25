"""Remplace un ou plusieurs segments de voix d'un jour déjà monté, en gardant les blancs et les sous-titres.
python3 replace_segs.py <NN> <job> ['{"s02": "display…"}']
Le studio /home/claude/studio/dayNN doit contenir timeline.json, vo.wav et tts_merged/ (sinon il est créé depuis tts/out/dayNN)."""
import json, pathlib, shutil, subprocess, sys
NN, JOB = sys.argv[1], sys.argv[2]
DISP = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
R = pathlib.Path(__file__).resolve().parents[1]
ST = pathlib.Path(f'/home/claude/studio/day{NN}')
cur = json.load(open(ST / 'timeline.json'))
segs = cur['segments']
gaps = {segs[i]['id']: round(segs[i + 1]['start'] - segs[i]['end'], 3) for i in range(len(segs) - 1)}
disp = {s['id']: s['display'] for s in segs if 'display' in s}
md = ST / 'tts_merged'
if not (md / 'manifest.json').exists():
    md.mkdir(exist_ok=True)
    src = R / 'tts/out' / f'day{NN}'
    for f in src.iterdir():
        shutil.copy(f, md / f.name)
man = json.load(open(md / 'manifest.json'))
new = {s['id']: s for s in json.load(open(R / 'tts/out' / JOB / 'manifest.json'))['segments']}
out = []
for s in man['segments']:
    if s['id'] in new:
        fn = f"{s['id']}_{JOB}.wav"
        shutil.copy(R / 'tts/out' / JOB / new[s['id']]['file'], md / fn)
        out.append({**new[s['id']], 'file': fn})
    else:
        out.append(s)
json.dump({**man, 'segments': out}, open(md / 'manifest.json', 'w'), ensure_ascii=False, indent=1)
shutil.copy(ST / 'timeline.json', ST / f'timeline_before_{JOB}.json')
subprocess.run(['python3', str(R / 'assemble_vo.py'), str(md), str(ST / 'vo.wav'), str(ST / 'timeline.json'), '--lead', str(segs[0]['start']),
                '--gap', '0.1', '--gaps', ','.join(f'{k}={v}' for k, v in gaps.items())], check=True)
tl = json.load(open(ST / 'timeline.json'))
for s in tl['segments']:
    if s['id'] in DISP:
        s['display'] = DISP[s['id']]
    elif s['id'] in disp and s['id'] not in new:
        s['display'] = disp[s['id']]
json.dump(tl, open(ST / 'timeline.json', 'w'), ensure_ascii=False, indent=1)
print(NN, JOB, 'durée', cur['duration'], '->', tl['duration'])
