"""Mixage final : voix off + musique (baissée sous la voix) + bruitages, normalisé pour TikTok
(-14 LUFS intégré, crête vraie <= -1,5 dBTP), puis assemblage avec la vidéo muette.

python3 mix.py --video silent.mp4 --vo vo.wav --out final.mp4 [--music bed.wav --music-db -17]
               [--sfx cues.json] [--duck-db 9]
cues.json : [{"file": "whoosh.wav", "t": 4.87, "db": -8}, ...]
"""
import argparse
import json
import pathlib
import subprocess
import tempfile
import wave

import numpy as np

SR = 48000
ap = argparse.ArgumentParser()
ap.add_argument("--video", required=True)
ap.add_argument("--vo", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--music")
ap.add_argument("--music-db", type=float, default=-17.0)
ap.add_argument("--duck-db", type=float, default=9.0)
ap.add_argument("--sfx")
ap.add_argument("--lufs", type=float, default=-14.0)
a = ap.parse_args()


def load(path):
    """Lit n'importe quel audio en float32 stéréo 48 kHz via ffmpeg."""
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def video_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


dur = video_duration(a.video)
n = int(dur * SR)
mix = np.zeros((n, 2), dtype=np.float32)

vo = load(a.vo)[:n]
mix[: len(vo)] += vo

if a.music:
    mu = load(a.music)
    if len(mu) < n:  # boucle si trop court
        mu = np.tile(mu, (int(np.ceil(n / len(mu))), 1))
    mu = mu[:n] * (10 ** (a.music_db / 20))
    # enveloppe de la voix -> atténuation de la musique (ducking)
    v = np.abs(vo[:, 0]) if len(vo) else np.zeros(1)
    env = np.zeros(n, dtype=np.float32)
    env[: len(v)] = v
    win = int(0.05 * SR)
    env = np.sqrt(np.convolve(env ** 2, np.ones(win) / win, mode="same"))
    active = (env > 0.01).astype(np.float32)
    # attaque 40 ms, relâchement 350 ms
    g = np.zeros(n, dtype=np.float32)
    att, rel = 1 - np.exp(-1 / (0.04 * SR)), 1 - np.exp(-1 / (0.35 * SR))
    state = 0.0
    step = 64  # calcul par blocs pour rester rapide
    for i in range(0, n, step):
        target = active[i]
        k = att if target > state else rel
        state += (target - state) * (1 - (1 - k) ** step)
        g[i:i + step] = state
    gain = 10 ** (-a.duck_db * g / 20)
    fade = np.ones(n, dtype=np.float32)
    fl = int(1.2 * SR)
    fade[-fl:] = np.linspace(1, 0, fl)
    mix += mu * (gain * fade)[:, None]

if a.sfx:
    base = pathlib.Path(a.sfx).parent
    for cue in json.load(open(a.sfx)):
        s = load(base / cue["file"] if not pathlib.Path(cue["file"]).is_absolute() else cue["file"])
        s *= 10 ** (cue.get("db", -8) / 20)
        i = int(cue["t"] * SR)
        if i >= n:
            continue
        j = min(n, i + len(s))
        mix[i:j] += s[: j - i]

peak = np.max(np.abs(mix))
if peak > 0.99:
    mix *= 0.99 / peak
with tempfile.TemporaryDirectory() as td:
    raw = pathlib.Path(td) / "mix.wav"
    with wave.open(str(raw), "w") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    # normalisation en deux passes
    meas = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(raw), "-af",
                           f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                          capture_output=True, text=True).stderr
    js = json.loads(meas[meas.rfind("{"): meas.rfind("}") + 1])
    flt = (f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
           f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
    flt += ",alimiter=limit=0.80:attack=2:release=50:level=false"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", a.video, "-i", str(raw), "-filter:a", flt, "-ar", str(SR),
                    "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
                    "-movflags", "+faststart", a.out], check=True)
print("final", a.out, round(dur, 2), "s")
