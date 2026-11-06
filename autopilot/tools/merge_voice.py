import json,shutil,sys,pathlib
d=sys.argv[1];R=pathlib.Path('/home/claude/marcio-mota-tech/autopilot/tts/out')
md=pathlib.Path(f'/home/claude/studio/day{d}/tts_final');md.mkdir(parents=True,exist_ok=True)
m=json.load(open(R/f'day{d}/manifest.json'));seg=m['segments'] if isinstance(m,dict) else m
for f in (R/f'day{d}').glob('*.wav'): shutil.copy(f,md/f.name)
for suf in sys.argv[2:]:
    b=json.load(open(R/f'day{d}{suf}/manifest.json'));bs=b['segments'] if isinstance(b,dict) else b
    for s in bs:
        for i,x in enumerate(seg):
            if x['id']==s['id']: seg[i]=s
        shutil.copy(R/f'day{d}{suf}'/pathlib.Path(s.get('file',s['id']+'.wav')).name,md/f"{s['id']}.wav")
json.dump(m,open(md/'manifest.json','w'),ensure_ascii=False,indent=1)
print(md)
