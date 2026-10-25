"""Musiques et bruitages libres de droits, générés par synthèse (numpy + scipy).

python3 synth.py bed  <out.wav> --duration 38 --bpm 104 [--seed 1] [--style pulse|chill]
python3 synth.py sfx  <dossier>          (whoosh, whoosh_up, impact, ui_pop, tick, counter, success, riser)
Sortie : WAV 48 kHz stéréo 16 bits.
"""
import argparse
import pathlib
import wave

import numpy as np
from scipy import signal

SR = 48000


def write(path, x):
    x = np.asarray(x, dtype=np.float32)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * 0.89  # ~ -1 dBFS
    with wave.open(str(path), "w") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def sos(kind, f, order=4):
    return signal.butter(order, f, btype=kind, fs=SR, output="sos")


def env_adsr(n, a=0.005, d=0.1, s=0.6, r=0.1):
    t = np.arange(n) / SR
    e = np.ones(n) * s
    ai, di, ri = int(a * SR), int(d * SR), int(r * SR)
    e[:ai] = np.linspace(0, 1, max(ai, 1))[:len(e[:ai])]
    e[ai:ai + di] = np.linspace(1, s, max(di, 1))[:len(e[ai:ai + di])]
    if ri > 0:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e


def saw(f, n, harm_max=3500.0, phase=0.0):
    t = np.arange(n) / SR
    k_max = max(1, int(harm_max / f))
    x = np.zeros(n)
    for k in range(1, k_max + 1):
        x += np.sin(2 * np.pi * k * f * t + phase * k) / k
    return x * (2 / np.pi)


def tri(f, n):
    t = np.arange(n) / SR
    return signal.sawtooth(2 * np.pi * f * t, 0.5)


def note_freq(name):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    p, o = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[p] + 12 * (o + 1) - 69) / 12)


def reverb_ir(seconds=1.2, seed=3):
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t * 5.5)[:, None]
    ir = signal.sosfilt(sos("lowpass", 6000, 2), ir, axis=0)
    return ir / np.sqrt(np.sum(ir ** 2))


def bed(duration, bpm=104, seed=1, style="pulse"):
    rng = np.random.default_rng(seed)
    n = int(duration * SR)
    beat = 60.0 / bpm
    bar = 4 * beat
    out = np.zeros((n, 2))
    send = np.zeros((n, 2))
    prog = [("A", ["A3", "C4", "E4"]), ("F", ["F3", "A3", "C4"]), ("C", ["C4", "E4", "G4"]), ("G", ["G3", "B3", "D4"])]
    bass_notes = {"A": "A1", "F": "F1", "C": "C2", "G": "G1"}
    n_beats = int(duration / beat) + 2
    kick_times = [i * beat for i in range(n_beats)]
    # pompe sidechain (gain qui remonte après chaque kick)
    pump = np.ones(n)
    for kt in kick_times:
        i = int(kt * SR)
        L = int(beat * SR)
        if i >= n:
            break
        seg = 1 - 0.55 * np.exp(-np.arange(L) / (0.09 * SR))
        pump[i:i + L] = seg[: max(0, min(L, n - i))]
    # kick
    if style == "pulse":
        kl = int(0.38 * SR)
        tk = np.arange(kl) / SR
        freq = 45 + 110 * np.exp(-tk / 0.035)
        kick = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tk / 0.13)
        kick += 0.25 * np.exp(-tk / 0.004) * rng.standard_normal(kl)
        kick = signal.sosfilt(sos("lowpass", 3000, 2), kick)
        for kt in kick_times[1:]:
            i = int(kt * SR)
            if i >= n:
                break
            j = min(n, i + kl)
            out[i:j] += 0.9 * kick[: j - i, None]
    # charleston sur les croches
    hl = int(0.06 * SR)
    hat = rng.standard_normal(hl) * np.exp(-np.arange(hl) / (0.012 * SR))
    hat = signal.sosfilt(sos("highpass", 8000, 4), hat)
    for i8 in range(1, n_beats * 2, 2):
        tt = i8 * beat / 2
        i = int(tt * SR)
        if i >= n:
            break
        j = min(n, i + hl)
        pan = 0.6 if (i8 // 2) % 2 else 0.4
        vel = 0.18 + 0.06 * rng.random()
        out[i:j, 0] += vel * hat[: j - i] * (1 - pan) * 2
        out[i:j, 1] += vel * hat[: j - i] * pan * 2
    # basse (croches) + nappe + arpège pluck
    n_bars = int(duration / bar) + 1
    for b in range(n_bars):
        chord, tones = prog[b % 4]
        t0 = b * bar
        # basse
        fb = note_freq(bass_notes[chord])
        for e in range(8):
            ts = t0 + e * beat / 2
            i = int(ts * SR)
            if i >= n:
                break
            L = int(beat / 2 * SR * 0.92)
            x = saw(fb * (2 if e % 4 == 3 else 1), L, 900) * env_adsr(L, 0.004, 0.08, 0.55, 0.03)
            x = signal.sosfilt(sos("lowpass", 520, 2), x)
            j = min(n, i + L)
            out[i:j] += 0.42 * x[: j - i, None]
        # nappe
        L = int(bar * SR)
        i = int(t0 * SR)
        if i < n:
            pad = np.zeros(L)
            for nt in tones:
                f = note_freq(nt)
                pad += saw(f * 0.998, L, 2400) + saw(f * 1.003, L, 2400, 0.7)
            pad = signal.sosfilt(sos("lowpass", 1400, 2), pad) * env_adsr(L, 0.35, 0.3, 0.8, 0.4)
            j = min(n, i + L)
            out[i:j, 0] += 0.07 * pad[: j - i]
            out[i:j, 1] += 0.07 * pad[: j - i]
            send[i:j] += 0.06 * pad[: j - i, None]
        # arpège (doubles croches, motif)
        pattern = [0, 1, 2, 1, 0, 2, 1, 2]
        for s16 in range(16):
            if style == "chill" and s16 % 2:
                continue
            ts = t0 + s16 * beat / 4
            i = int(ts * SR)
            if i >= n:
                break
            nt = tones[pattern[s16 % 8]]
            f = note_freq(nt) * 2
            L = int(0.22 * SR)
            x = tri(f, L) * np.exp(-np.arange(L) / (0.05 * SR))
            x = signal.sosfilt(sos("bandpass", [300, 2600], 2), x)
            j = min(n, i + L)
            pan = 0.3 + 0.4 * ((s16 * 5) % 8) / 7
            g = 0.11 if s16 % 4 == 0 else 0.075
            out[i:j, 0] += g * x[: j - i] * (1 - pan) * 2
            out[i:j, 1] += g * x[: j - i] * pan * 2
            send[i:j] += 0.05 * x[: j - i, None]
    # réverbération
    ir = reverb_ir()
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    out = out * pump[:, None] + 0.9 * wet
    # creux de présence pour laisser la place à la voix
    out = signal.sosfilt(signal.butter(2, [1200, 3800], btype="bandstop", fs=SR, output="sos"), out, axis=0) * 0.35 + out * 0.65
    out = signal.sosfilt(sos("highpass", 30, 2), out, axis=0)
    # fondu d'entrée court et de sortie
    fi, fo = int(0.02 * SR), int(1.5 * SR)
    out[:fi] *= np.linspace(0, 1, fi)[:, None]
    out[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return out


def sfx(kind, seed=0):
    rng = np.random.default_rng(seed)
    if kind in ("whoosh", "whoosh_up"):
        L = int(0.5 * SR)
        t = np.arange(L) / SR
        nz = rng.standard_normal((L, 2))
        lo, hi = (300, 5000) if kind == "whoosh" else (500, 9000)
        out = np.zeros((L, 2))
        for k in range(10):
            a, b = k * L // 10, (k + 1) * L // 10
            fc = lo * (hi / lo) ** (k / 9 if kind == "whoosh_up" else np.sin(np.pi * k / 9))
            fc = min(fc, 15000)
            s = sos("bandpass", [fc * 0.6, min(fc * 1.6, 20000)], 2)
            out[a:b] = signal.sosfilt(s, nz[a:b], axis=0)
        envl = np.sin(np.pi * np.clip(t / t[-1], 0, 1)) ** 2
        pan = np.linspace(0.2, 0.8, L)
        out[:, 0] *= envl * (1 - pan) * 2
        out[:, 1] *= envl * pan * 2
        return signal.sosfilt(sos("highpass", 150, 2), out, axis=0)
    if kind == "impact":
        L = int(0.9 * SR)
        t = np.arange(L) / SR
        x = np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-t / 0.05)) / SR) * np.exp(-t / 0.25)
        x += 0.6 * signal.sosfilt(sos("lowpass", 1800, 2), rng.standard_normal(L)) * np.exp(-t / 0.03)
        return x
    if kind == "ui_pop":
        L = int(0.12 * SR)
        t = np.arange(L) / SR
        return np.sin(2 * np.pi * (900 + 600 * t / t[-1]) * t) * np.exp(-t / 0.03)
    if kind == "tick":
        L = int(0.03 * SR)
        t = np.arange(L) / SR
        return np.sin(2 * np.pi * 2300 * t) * np.exp(-t / 0.004)
    if kind == "counter":
        L = int(1.3 * SR)
        x = np.zeros(L)
        tl = int(0.02 * SR)
        tt = np.arange(tl) / SR
        tk = np.sin(2 * np.pi * 1900 * tt) * np.exp(-tt / 0.004)
        for i in range(0, L - tl, int(SR / 17)):
            x[i:i + tl] += tk
        return x * np.linspace(0.6, 1, L)
    if kind == "success":
        L = int(0.9 * SR)
        t = np.arange(L) / SR
        x = np.zeros(L)
        for f, start in ((659.25, 0.0), (987.77, 0.11)):
            i = int(start * SR)
            tt = t[: L - i]
            x[i:] += (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt / 0.25)
        return x
    if kind == "riser":
        L = int(1.2 * SR)
        t = np.arange(L) / SR
        nz = signal.sosfilt(sos("bandpass", [800, 7000], 2), rng.standard_normal(L))
        return nz * (t / t[-1]) ** 2.2
    raise ValueError(kind)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("what", choices=["bed", "sfx"])
    ap.add_argument("out")
    ap.add_argument("--duration", type=float, default=38)
    ap.add_argument("--bpm", type=float, default=104)
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--style", default="pulse")
    a = ap.parse_args()
    if a.what == "bed":
        write(a.out, bed(a.duration, a.bpm, a.seed, a.style))
    else:
        d = pathlib.Path(a.out)
        d.mkdir(parents=True, exist_ok=True)
        for k in ["whoosh", "whoosh_up", "impact", "ui_pop", "tick", "counter", "success", "riser"]:
            write(d / f"{k}.wav", sfx(k))
    print("ok", a.out)
