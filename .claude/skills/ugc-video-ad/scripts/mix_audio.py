# Soundtrack of a UGC ad from a JSON spec: voice-over, a music bed whose drop lands on a chosen
# moment and that ducks under the voice, sound effects (files or synthesised), and ambience beds
# (files or synthesised, looped to length). Writes a stereo 48 kHz WAV peaking at -1 dBFS; master it
# afterwards with master.sh (-14 LUFS).
# usage: python3 mix_audio.py mix.json out.wav
#
# mix.json (times in video seconds):
# {"duration": 54, "vo": {"file": "vo.wav", "offset": 0.25},
#  "music": {"file": "music.wav", "song_drop": 16.275, "video_drop": 5.08, "under_vo_db": -6.5, "duck": 0.5,
#            "swell_at": 51.1, "lowpass": [[35.2, 36.0, 700]]},
#  "sfx":  [{"synth": "riser", "t": 3.58, "dur": 1.5}, {"synth": "impact", "t": 5.08, "gain": 0.8},
#           {"synth": "whoosh", "t": 6.88}, {"synth": "pop", "t": 7.2, "pan": 0.2}, {"file": "beep.wav", "t": 35.28, "gain": 0.55}],
#  "beds": [{"synth": "room", "t0": 0, "t1": 3.55, "gain": 0.02}, {"file": "rain.wav", "t0": 10.3, "t1": 13.0, "gain": 2.2, "loop": true},
#           {"synth": "wind", "t0": 13.0, "t1": 16.4, "gain": 0.06}, {"synth": "birds", "t0": 27.45, "t1": 29.85, "gain": 0.05}]}
# synth sfx: whoosh, pop, impact, crash, tap, blip, riser, sparkle; synth beds: room, wind, birds, sizzle
import json, sys, subprocess
import numpy as np
from scipy import signal

SR = 48000
spec = json.load(open(sys.argv[1])); OUT = sys.argv[2]
DUR = float(spec['duration']); N = int(SR * DUR); tm = np.arange(N) / SR
rng = np.random.default_rng(42)


def load(p):
    """any audio file -> float32 stereo at 48 kHz (decoded with ffmpeg)"""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32).reshape(-1, 2) / 32768


def tt(sec): return np.arange(int(SR * sec)) / SR
def filt(x, kind, f, order=2): return signal.sosfilt(signal.butter(order, f, btype=kind, fs=SR, output='sos'), x, axis=0)


def stereo(x, pan=0.0):
    if x.ndim == 2: return x
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l * 1.414, x * r * 1.414], axis=1)


def place(buf, x, t0, gain=1.0, pan=0.0):
    x = stereo(x, pan); i0 = int(round(t0 * SR))
    if i0 < 0: x, i0 = x[-i0:], 0
    n = min(len(x), len(buf) - i0)
    if n > 0: buf[i0:i0 + n] += x[:n] * gain


def fade(n, a, b):
    w = np.ones(n); ia, ib = min(int(a * SR), n), min(int(b * SR), n)
    if ia: w[:ia] = np.linspace(0, 1, ia)
    if ib: w[-ib:] = np.minimum(w[-ib:], np.linspace(1, 0, ib))
    return w


def loop(x, dur, xf=0.12):
    n, k = int(dur * SR), int(xf * SR); out = np.zeros((n, 2)); i = 0
    if len(x) <= 2 * k: return np.resize(x, (n, 2))
    w = np.r_[np.linspace(0, 1, k), np.ones(len(x) - 2 * k), np.linspace(1, 0, k)][:, None]
    while i < n:
        m = min(len(x), n - i); out[i:i + m] += (x * w)[:m]; i += len(x) - k
    return out


# ---------------- synthesised effects
def whoosh(dur=0.42, f0=300, f1=3800, seed=0):
    r = np.random.default_rng(seed); t = tt(dur); x = r.standard_normal(len(t)); out = np.zeros_like(x); zi = None
    for bb in range(0, len(x), 240):
        u = bb / len(x); fc = f0 * (f1 / f0) ** (np.sin(np.pi * u) ** 0.8)
        s_ = signal.butter(2, [fc * 0.6, min(fc * 1.6, 20000)], btype='bandpass', fs=SR, output='sos')
        if zi is None: zi = signal.sosfilt_zi(s_) * 0
        out[bb:bb + 240], zi = signal.sosfilt(s_, x[bb:bb + 240], zi=zi)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    return np.stack([out * env * np.linspace(1.2, 0.6, len(t)), out * env * np.linspace(0.6, 1.2, len(t))], axis=1) * 0.5


def pop(f0=420, f1=980, dur=0.09):
    t = tt(dur); f = f0 + (f1 - f0) * (1 - np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38) * 0.42


def impact():
    t = tt(1.4); f = 42 + 70 * np.exp(-t * 14)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    nz = filt(rng.standard_normal(len(t)), 'lowpass', 900) * np.exp(-t * 9) * 0.6
    return np.tanh((boom + nz) * 1.8) * 0.75


def crash(): t = tt(2.2); return filt(rng.standard_normal(len(t)), 'highpass', 4500) * np.exp(-t * 2.2) * 0.32
def tap():
    t = tt(0.06)
    return (np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 120) + filt(rng.standard_normal(len(t)), 'highpass', 3000) * np.exp(-t * 400) * 0.6) * 0.5
def blip(f=1900, dur=0.07): t = tt(dur); return np.sin(2 * np.pi * f * t) * np.exp(-t * 55) * np.minimum(1, t / 0.003) * 0.25


def riser(dur=1.5):
    st = whoosh(dur, 250, 7000, seed=9); t = tt(dur)
    st = st / (np.sin(np.pi * np.clip(t / dur, 1e-3, 1)) ** 1.6 + 1e-3)[:, None]
    return st * ((t / dur) ** 2.2)[:, None] * 0.12


def sparkle():
    out = np.zeros(int(SR * 0.9)); r = np.random.default_rng(5)
    for kk in range(7):
        f = 2400 + r.random() * 3200; t = tt(0.35); x = np.sin(2 * np.pi * f * t) * np.exp(-t * 14)
        i = int(kk * 0.07 * SR); out[i:i + len(x)] += x * (0.6 - kk * 0.05)
    return out * 0.08


def noise_bed(dur, lo, hi, seed, mod=0.4, rate=0.35):
    r = np.random.default_rng(seed); t = tt(dur)
    x = filt(r.standard_normal(len(t)), 'bandpass', [lo, hi])
    return x * (1 + mod * np.sin(2 * np.pi * rate * t + r.random() * 6) * np.sin(2 * np.pi * rate * 0.37 * t + 1))


def wind(dur, seed=1):
    return np.stack([noise_bed(dur, 80, 700, seed) * 0.5 + noise_bed(dur, 2500, 6000, seed + 7, 0.6) * 0.05,
                     noise_bed(dur, 80, 700, seed + 1) * 0.5 + noise_bed(dur, 2500, 6000, seed + 8, 0.6) * 0.05], axis=1)


def birds(dur, seed=3, density=2.2):
    r = np.random.default_rng(seed); out = np.zeros((int(dur * SR), 2)); t0 = 0.1
    while t0 < dur - 0.4:
        f0 = 2600 + r.random() * 2400; nch = 1 + int(r.random() * 4); pan = r.uniform(-0.8, 0.8)
        for c in range(nch):
            d = 0.05 + r.random() * 0.07; t = tt(d)
            f = f0 * (1 + 0.35 * np.sin(np.pi * t / d)) * (1 - 0.25 * t / d)
            place(out, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2 * (0.5 + 0.5 * r.random()), t0 + c * (d + 0.03), 1.0, pan)
        t0 += r.exponential(1 / density) + 0.12
    return out


def sizzle(dur, seed=4, crackle=60):
    r = np.random.default_rng(seed); t = tt(dur)
    cr = np.zeros(len(t)); idx = r.integers(0, len(t), int(crackle * dur)); cr[idx] = r.uniform(-1, 1, len(idx)) * 6
    cr = filt(cr, 'bandpass', [1500, 9000])
    return np.stack([filt(r.standard_normal(len(t)), 'highpass', 2600) * 0.5 + cr * 0.35,
                     filt(r.standard_normal(len(t)), 'highpass', 2600) * 0.5 + cr * 0.35], axis=1)


SFX = {'whoosh': lambda e, k: whoosh(e.get('dur', 0.42), seed=k + 1), 'pop': lambda e, k: pop(380 + (k % 4) * 60, (380 + (k % 4) * 60) * 2.3),
       'impact': lambda e, k: impact(), 'crash': lambda e, k: crash(), 'tap': lambda e, k: tap(), 'blip': lambda e, k: blip(e.get('f', 1900)),
       'riser': lambda e, k: riser(e.get('dur', 1.5)), 'sparkle': lambda e, k: sparkle()}
BEDS = {'room': lambda d, k: noise_bed(d, 120, 900, 50 + k, 0.2), 'wind': lambda d, k: wind(d, 11 + k),
        'birds': lambda d, k: birds(d, 31 + k), 'sizzle': lambda d, k: sizzle(d, 4 + k)}

# ---------------- voice
vo_spec = spec['vo']; vo = load(vo_spec['file']).mean(1)
vo_full = np.zeros(N); i0 = int(vo_spec.get('offset', 0.0) * SR); n = min(len(vo), N - i0); vo_full[i0:i0 + n] = vo[:n]
vo_full = filt(vo_full, 'highpass', 80)

# ---------------- music, drop aligned, ducked under the voice
music = np.zeros((N, 2))
if spec.get('music'):
    m = spec['music']; mus = load(m['file'])
    off = m.get('song_drop', 0.0) - m.get('video_drop', 0.0)          # song time at video t=0
    if off >= 0: seg = mus[int(off * SR):int(off * SR) + N]; music[:len(seg)] = seg
    else: k0 = int(-off * SR); seg = mus[:max(0, N - k0)]; music[k0:k0 + len(seg)] = seg
    music *= np.clip(tm / 0.30, 0, 1)[:, None] * np.clip((DUR - tm) / 0.6, 0, 1)[:, None]
    for a, b, f in m.get('lowpass', []):                               # tension moments: muffle the bed
        k = np.clip((tm - a) / 0.12, 0, 1) * np.clip((b - tm) / 0.15, 0, 1)
        music = music * (1 - k[:, None]) + filt(music, 'lowpass', f) * k[:, None] * 1.25
env = np.convolve(np.abs(vo_full), np.ones(int(SR * 0.03)) / int(SR * 0.03), mode='same')
att, rel = np.exp(-1 / (SR * 0.01)), np.exp(-1 / (SR * 0.28)); sm = np.zeros_like(env); g = 0.0
for kk in range(0, N, 48):
    v = env[kk]; g = att * g + (1 - att) * v if v > g else rel * g + (1 - rel) * v; sm[kk:kk + 48] = g
m = spec.get('music') or {}
duck = 1 - m.get('duck', 0.5) * np.clip(sm / 0.05, 0, 1)
rms_db = lambda x: 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-9)
vo_rms = rms_db(vo_full[np.abs(vo_full) > 1e-4])
music_gain = 10 ** ((vo_rms + m.get('under_vo_db', -6.5) - rms_db(music[np.abs(music).sum(1) > 1e-5])) / 20) if spec.get('music') else 0
swell = 1 + 0.9 * np.clip((tm - m['swell_at']) / 0.25, 0, 1) if 'swell_at' in m else np.ones(N)

# ---------------- effects and ambience
sfx = np.zeros((N, 2)); amb = np.zeros((N, 2))
for k, e in enumerate(spec.get('sfx', [])):
    x = SFX[e['synth']](e, k) if 'synth' in e else load(e['file'])
    place(sfx, x, e['t'] - (0.22 if e.get('synth') == 'whoosh' else 0.0), e.get('gain', 0.4 if e.get('synth') == 'whoosh' else 1.0), e.get('pan', 0.0))
for k, b in enumerate(spec.get('beds', [])):
    d = b['t1'] - b['t0']
    x = BEDS[b['synth']](d, k) if 'synth' in b else load(b['file'])
    if 'file' in b and b.get('loop'): x = loop(x, d)
    x = stereo(x)[:int(d * SR)]
    place(amb, x * fade(len(x), b.get('fade_in', 0.1), b.get('fade_out', 0.1))[:, None], b['t0'], b.get('gain', 1.0))

mix = np.stack([vo_full, vo_full], 1) + music * music_gain * (duck * swell)[:, None] + sfx * 0.4 + amb * (0.6 + 0.4 * duck[:, None])
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.89
import wave
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
print('written', OUT, '| voice %.1f dB, music gain %.3f' % (vo_rms, music_gain))
