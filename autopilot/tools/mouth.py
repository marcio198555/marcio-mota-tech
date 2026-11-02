"""Enveloppe de la voix pour la bouche des personnages (format A) : ajoute TL.mouth = {fps, v[0..1]} à la timeline.
python3 autopilot/tools/mouth.py <studio>/vo.wav <studio>/timeline_words.json"""
import json, pathlib, subprocess, sys
import numpy as np
vo, tlp = sys.argv[1], pathlib.Path(sys.argv[2]); FPS = 30; SR = 16000
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', vo, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
hop = SR // FPS; n = len(x) // hop
rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
db = 20 * np.log10(rms + 1e-9); top = np.percentile(db, 95)
v = np.clip((db - (top - 16)) / 16, 0, 1) ** 1.2          # 16 dB de dynamique : la bouche se ferme entre les syllabes
v[db < top - 24] = 0
sm = np.copy(v)                                            # attaque rapide, relâchement doux
for i in range(1, n): sm[i] = v[i] if v[i] > sm[i - 1] else sm[i - 1] * 0.35 + v[i] * 0.65
tl = json.loads(tlp.read_text()); tl['mouth'] = {'fps': FPS, 'v': [round(float(q), 3) for q in sm]}
tlp.write_text(json.dumps(tl, ensure_ascii=False)); print('bouche', n, 'images, ouverte', round(float((sm > 0.1).mean()) * 100), '% du temps')
