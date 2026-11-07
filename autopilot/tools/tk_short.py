"""tk_short.py NN seg,seg,... : version TikTok courte de la vidéo du jour NN (analyse du 07.11.2026).
Retire des phrases entières (indices des segments de days/dayNN/studio/timeline.json), coupe au milieu des
blancs entre phrases, fondu son de 40 ms à chaque raccord. Sortie : media/dayNN_<nom>_tk.mp4 + tk_cuts.json."""
import json, pathlib, subprocess, sys
R = pathlib.Path(__file__).resolve().parents[2]
NN, drop = sys.argv[1], {int(x) for x in sys.argv[2].split(',')}
src = sorted(p for p in (R / 'media').glob(f'day{NN}_*.mp4') if not p.stem.endswith('_tk'))[0]
segs = json.loads((R / f'autopilot/days/day{NN}/studio/timeline.json').read_text())['segments']
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(src)]))
bounds = []
for i, s in enumerate(segs):
    a = 0.0 if i == 0 else (segs[i-1]['end'] + s['start']) / 2
    b = dur if i == len(segs) - 1 else (s['end'] + segs[i+1]['start']) / 2
    bounds.append((round(a, 3), round(b, 3)))
keep, cur = [], None
for i, (a, b) in enumerate(bounds):
    if i in drop:
        cur = None; continue
    if cur and abs(cur[1] - a) < 1e-6: cur[1] = b
    else:
        cur = [a, b]; keep.append(cur)
f, n = [], len(keep)
for k, (a, b) in enumerate(keep):
    d = b - a
    f.append(f"[{k}:v]setpts=PTS-STARTPTS[v{k}]")
    f.append(f"[{k}:a]asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st={d-0.04:.3f}:d=0.04[a{k}]")
f.append(''.join(f'[v{k}][a{k}]' for k in range(n)) + f'concat=n={n}:v=1:a=1[v][a]')
out = src.with_name(src.stem + '_tk.mp4')
ins = sum((['-ss', str(a), '-to', str(b), '-i', str(src)] for a, b in keep), [])
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *ins, '-filter_complex', ';'.join(f), '-map', '[v]', '-map', '[a]',
                '-c:v', 'libx264', '-preset', 'medium', '-threads', '2', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)], check=True)
total = sum(b - a for a, b in keep)
info = {'source': src.name, 'sortie': out.name, 'retires': sorted(drop), 'gardes': keep, 'duree_s': round(total, 2),
        'texte': ' '.join(s['text'] for i, s in enumerate(segs) if i not in drop)}
(R / f'autopilot/days/day{NN}/tk_cuts.json').write_text(json.dumps(info, ensure_ascii=False, indent=1))
print(out.name, round(total, 2), 's ; raccords à', [round(sum(b - a for a, b in keep[:k+1]), 2) for k in range(n - 1)])
