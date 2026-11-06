#!/usr/bin/env python3
"""Coupe les blancs trop longs des prises Chatterbox d'un dossier de voix (trim_sil.py <dossier>).
Blanc de fin ramené à 0,12 s, blanc de début à 0,03 s, blanc intérieur de plus de 0,45 s ramené à 0,3 s. Manifest non touché.
Découvert le 06.11 : une prise de 10,5 s contenait 6 s de souffle, que Whisper ne signale pas."""
import glob, os, sys, wave
import numpy as np
d = sys.argv[1]
for f in sorted(glob.glob(os.path.join(d, '*.wav'))):
    w = wave.open(f); sr = w.getframerate(); ch = w.getnchannels(); raw = w.readframes(w.getnframes()); w.close()
    x = np.frombuffer(raw, dtype=np.int16).reshape(-1, ch)[:, 0].astype(np.float32)
    hop = int(sr * 0.02); n = len(x) // hop
    rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2) + 1e-6) for i in range(n)])
    th = max(np.percentile(rms, 95) * 0.05, 100)
    v = rms > th
    if not v.any(): print(f, 'silence ?'); continue
    a, b = np.argmax(v), n - np.argmax(v[::-1])
    keep = []; i = a; before = len(x) / sr
    while i < b:
        if v[i]: keep.append((i, i + 1)); i += 1; continue
        j = i
        while j < b and not v[j]: j += 1
        L = j - i
        if L > 22:  # > 0,45 s : on garde 0,15 s de chaque côté
            keep.append((i, i + 8)); keep.append((j - 7, j))
        else: keep.append((i, j))
        i = j
    out = [x[max(0, (a * hop) - int(sr * 0.08)):a * hop]]
    for s, e in keep: out.append(x[s * hop:e * hop])
    out.append(x[b * hop:min(len(x), b * hop + int(sr * 0.12))])
    y = np.concatenate(out).astype(np.int16)
    if abs(len(y) / sr - before) > 0.05:
        print(os.path.basename(f), round(before, 2), '->', round(len(y) / sr, 2))
    w = wave.open(f, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes()); w.close()
