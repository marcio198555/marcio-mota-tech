"""Assemble les segments de voix off (Piper) en une piste unique + timeline.

Usage : python3 assemble_vo.py <dossier_out_tts> <sortie.wav> <timeline.json> [--lead 0.15] [--gap 0.12]
            [--gaps s02=0.3,s11=0.2] [--rate 48000] [--tempo 1.0]

- coupe le silence au début et à la fin de chaque segment (seuil -45 dBFS) ;
- place les segments bout à bout avec un petit blanc (gap) ;
- traite la voix (passe-haut, présence, compression douce) et la convertit en 48 kHz ;
- écrit timeline.json : start/end de chaque segment dans la piste finale.
"""
import argparse
import json
import pathlib
import subprocess
import wave

import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out_wav")
ap.add_argument("timeline")
ap.add_argument("--lead", type=float, default=0.15)
ap.add_argument("--gap", type=float, default=0.12)
ap.add_argument("--gaps", default="")
ap.add_argument("--rate", type=int, default=48000)
ap.add_argument("--tempo", type=float, default=1.0)
a = ap.parse_args()

src = pathlib.Path(a.src)
man = json.loads((src / "manifest.json").read_text(encoding="utf-8"))
extra = {}
for item in filter(None, a.gaps.split(",")):
    k, v = item.split("=")
    extra[k.strip()] = float(v)


def read(path):
    with wave.open(str(path)) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
        if w.getnchannels() > 1:
            x = x.reshape(-1, w.getnchannels()).mean(axis=1)
    return sr, x


def trim(x, sr, thr_db=-45.0, pad=0.03):
    win = max(1, int(sr * 0.01))
    env = np.sqrt(np.convolve(x * x, np.ones(win) / win, mode="same") + 1e-12)
    thr = 10 ** (thr_db / 20)
    idx = np.where(env > thr)[0]
    if len(idx) == 0:
        return x
    s = max(0, idx[0] - int(pad * sr))
    e = min(len(x), idx[-1] + int(pad * sr))
    return x[s:e]


parts = []
timeline = []
sr0 = None
t = a.lead
for seg in man["segments"]:
    sr, x = read(src / seg["file"])
    sr0 = sr0 or sr
    x = trim(x, sr)
    # fondu de 8 ms pour éviter tout clic
    f = int(0.008 * sr)
    if len(x) > 2 * f:
        x[:f] *= np.linspace(0, 1, f)
        x[-f:] *= np.linspace(1, 0, f)
    dur = len(x) / sr / a.tempo
    timeline.append({"id": seg["id"], "text": seg["text"], "start": round(t, 3), "end": round(t + dur, 3)})
    parts.append((t, x))
    t += dur + extra.get(seg["id"], a.gap)

total = t + 0.2
buf = np.zeros(int(total * sr0) + sr0, dtype=np.float32)
for start, x in parts:
    i = int(round(start * sr0 * a.tempo))
    buf[i:i + len(x)] += x
buf = buf[: int(total * sr0 * a.tempo)] if a.tempo == 1.0 else buf
raw = pathlib.Path(a.out_wav).with_suffix(".raw.wav")
with wave.open(str(raw), "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr0)
    w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())

flt = "highpass=f=75,equalizer=f=220:t=q:w=1.0:g=-1.5,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3dB"
if a.tempo != 1.0:
    flt = f"atempo={a.tempo}," + flt
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(raw), "-af", flt, "-ar", str(a.rate), "-ac", "1", a.out_wav], check=True)
raw.unlink()
json.dump({"duration": round(total, 3), "segments": timeline}, open(a.timeline, "w"), ensure_ascii=False, indent=1)
print("VO", round(total, 2), "s ->", a.out_wav)
