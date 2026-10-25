"""Remplace le dernier segment de voix d'un jour par une nouvelle prise, en gardant les blancs et les sous-titres affichés.
python3 swap_end.py <NN> <job_cta> [display_nouveau_segment]"""
import json, pathlib, shutil, subprocess, sys
NN, CTA = sys.argv[1], sys.argv[2]
NEWDISP = sys.argv[3] if len(sys.argv) > 3 else None
R = pathlib.Path('/home/claude/marcio-mota-tech/autopilot'); ST = pathlib.Path(f'/home/claude/studio/day{NN}')
old = json.load(open(ST / 'timeline.json'))
if not (ST / 'timeline_old.json').exists():
    shutil.copy(ST / 'timeline.json', ST / 'timeline_old.json'); shutil.copy(ST / 'vo.wav', ST / 'vo_old.wav')
    old = json.load(open(ST / 'timeline_old.json'))
segs = old['segments']
gaps = {segs[i]['id']: round(segs[i + 1]['start'] - segs[i]['end'], 3) for i in range(len(segs) - 1)}
disp = {s['id']: s['display'] for s in segs if 'display' in s}
src = R / 'tts/out' / f'day{NN}'; cta = R / 'tts/out' / CTA
man = json.load(open(src / 'manifest.json')); cman = json.load(open(cta / 'manifest.json'))
md = ST / 'tts_merged'; md.mkdir(exist_ok=True)
newseg = cman['segments'][0]
out = []
for s in man['segments']:
    if s['id'] == newseg['id']:
        shutil.copy(cta / newseg['file'], md / (s['id'] + '_cta.wav'))
        out.append({**newseg, 'file': s['id'] + '_cta.wav'})
    else:
        shutil.copy(src / s['file'], md / s['file']); out.append(s)
json.dump({**man, 'segments': out}, open(md / 'manifest.json', 'w'), ensure_ascii=False, indent=1)
g = ','.join(f'{k}={v}' for k, v in gaps.items())
subprocess.run(['python3', str(R / 'assemble_vo.py'), str(md), str(ST / 'vo.wav'), str(ST / 'timeline.json'),
                '--lead', str(segs[0]['start']), '--gap', '0.1', '--gaps', g], check=True)
tl = json.load(open(ST / 'timeline.json'))
for s in tl['segments']:
    if s['id'] == newseg['id']:
        if NEWDISP: s['display'] = NEWDISP
    elif s['id'] in disp:
        s['display'] = disp[s['id']]
json.dump(tl, open(ST / 'timeline.json', 'w'), ensure_ascii=False, indent=1)
print(NN, 'durée', old['duration'], '->', tl['duration'])
