"""Voix de personnage (format A) : monte la voix d'un facteur (hauteur ET débit, effet « dessin animé »)
et met à l'échelle les temps de timeline.json en conséquence.
python3 autopilot/tools/voice_fx.py <studio>/vo.wav <studio>/timeline.json [--factor 1.12]
(à lancer une seule fois, après assemble_vo.py et avant captime.py ; garde vo_neutre.wav)"""
import argparse, json, pathlib, shutil, subprocess
ap = argparse.ArgumentParser(); ap.add_argument('vo'); ap.add_argument('timeline'); ap.add_argument('--factor', type=float, default=1.12)
a = ap.parse_args(); vo = pathlib.Path(a.vo); keep = vo.with_name('vo_neutre.wav')
tl = json.loads(pathlib.Path(a.timeline).read_text())
if tl.get('voice_fx'):   # déjà appliqué sur cette prise : ne pas monter deux fois
    raise SystemExit(f"voix déjà montée (x{tl['voice_fx']}) : relancer assemble_vo.py d'abord pour une nouvelle prise")
shutil.copy(vo, keep)    # toujours la prise qui sort d'assemble_vo.py (une ancienne vo_neutre.wav serait périmée)
sr = int(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=sample_rate', '-of', 'csv=p=0', str(keep)], capture_output=True, text=True).stdout.strip())
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(keep), '-af', f'asetrate={int(sr * a.factor)},aresample={sr}', str(vo)], check=True)
f = a.factor; tl['voice_fx'] = f
for s in tl['segments']:
    s['start'] = round(s['start'] / f, 3); s['end'] = round(s['end'] / f, 3)
tl['duration'] = round(tl['duration'] / f, 3)
pathlib.Path(a.timeline).write_text(json.dumps(tl, ensure_ascii=False, indent=1))
print('voix x', f, '-> durée', tl['duration'], 's')
