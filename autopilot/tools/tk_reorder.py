"""tk_reorder.py NN ordre [sortie_suffixe] : version TikTok « réponse d'abord » (analyse du 09.11.2026).
ordre = indices des segments de days/dayNN/studio/timeline.json dans l'ordre voulu, ex. 0,1,14,4,5 ; un indice peut
porter une fin forcée en secondes absolues : 15@64.9 (coupe le segment 15 à 64,9 s, ex. garder seulement « Abonne-toi »).
Chaque phrase est prise entre les milieux des blancs qui l'entourent ; image arrêtée à la fin de la voix et figée
jusqu'au raccord + 0,15 s (méthode du 07.11), fondu son 40 ms. Sortie : media/dayNN_<nom>_tk.mp4 + days/dayNN/tk_cuts.json."""
import json, pathlib, subprocess, sys
R = pathlib.Path(__file__).resolve().parents[2]
NN = sys.argv[1]
order = []
for x in sys.argv[2].split(','):
    i, _, f = x.partition('@'); order.append((int(i), float(f) if f else None))
src = sorted(p for p in (R / 'media').glob(f'day{NN}_*.mp4') if not p.stem.endswith('_tk'))[0]
segs = json.loads((R / f'autopilot/days/day{NN}/studio/timeline.json').read_text())['segments']
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(src)]))
clips = []
for i, force in order:
    s = segs[i]
    a = 0.0 if i == 0 else (segs[i-1]['end'] + s['start']) / 2
    b = dur if i == len(segs) - 1 else (s['end'] + segs[i+1]['start']) / 2
    e = s['end']
    if force: e = force; b = min(b, force + 0.35)
    clips.append([round(a, 3), round(b, 3), round(e, 3), i])
f, n = [], len(clips)
for k, (a, b, e, i) in enumerate(clips):
    d = b - a
    # 09.11 : chaque morceau d'image dure exactement d (sinon concat ajoute un blanc au son et décale tout le son)
    s0 = 0.15 if k > 0 else 0.0
    vend = (e - a + 0.02) if k < n - 1 else d
    # début : 0,15 s figées sur l'image a+0,15 (le fondu de la phrase d'avant ne passe pas), puis l'image reste calée sur le son
    parts = [f'trim=start={s0:.3f}:end={vend:.3f}', 'setpts=PTS-STARTPTS', f'tpad=start_mode=clone:start_duration={s0:.3f}:stop_mode=clone:stop_duration={d - vend + 0.001:.3f}', f'trim=end={d:.3f}']
    if k == n - 1 and clips[k][2] < segs[i]['end']:
        # fin coupée (« Abonne-toi » seul) : image figée du début de la carte de fin (avant l'annonce), sous-titre masqué
        # par un morceau de fond vide, « Abonne-toi ! » écrit par-dessus, fondu de sortie
        fb = '/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'
        f.append(f"[{k}:v]trim=start=0.15:end=0.22,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={d:.3f},trim=end={d:.3f},split[e{k}][p{k}]")
        f.append(f"[p{k}]crop=1080:260:0:1560[q{k}]")
        f.append(f"[e{k}][q{k}]overlay=0:1220,drawtext=fontfile={fb}:text='Abonne-toi !':fontcolor=0xc9a84c:fontsize=84:x=(w-text_w)/2:y=1290[v{k}]")
    else:
        f.append(f"[{k}:v]{','.join(parts)}[v{k}]")
    af = f"asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st={d-0.04:.3f}:d=0.04"
    f.append(f"[{k}:a]{af}[a{k}]")
f.append(''.join(f'[v{k}][a{k}]' for k in range(n)) + f'concat=n={n}:v=1:a=1[v][a]')
out = src.with_name(src.stem + '_tk.mp4')
ins = sum((['-ss', str(a), '-to', str(b), '-i', str(src)] for a, b, e, i in clips), [])
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *ins, '-filter_complex', ';'.join(f), '-map', '[v]', '-map', '[a]',
                '-c:v', 'libx264', '-preset', 'medium', '-threads', '2', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)], check=True)
total = sum(c[1] - c[0] for c in clips)
info = {'source': src.name, 'sortie': out.name, 'methode': 'réponse d\'abord (analyse du 09.11)', 'ordre': [c[3] for c in clips], 'clips': clips,
        'duree_s': round(total, 2), 'texte': ' '.join((segs[c[3]]['text'].split(':')[0] + ' !') if (c is clips[-1] and c[2] < segs[c[3]]['end']) else segs[c[3]]['text'] for c in clips)}
(R / f'autopilot/days/day{NN}/tk_cuts.json').write_text(json.dumps(info, ensure_ascii=False, indent=1))
acc, rac = 0, []
for c in clips[:-1]: acc += c[1] - c[0]; rac.append(round(acc, 2))
print(out.name, round(total, 2), 's ; raccords à', rac)
