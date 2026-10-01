# Royalty-free soundtrack for the Temtop W100 UGC ad: synthesized music bed + SFX,
# ducked under the voiceover, written as a stereo 48 kHz WAV.
import json, wave
import numpy as np
from scipy import signal

SR = 48000
DUR = 29.2
N = int(SR * DUR)
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(42)
TL = json.load(open('timeline.json'))
W, P = TL['words'], TL['phrases']
wt = lambda p, i: next(w['t'] for w in W if w['p'] == p and w['i'] == i)


def tt(sec):
    return np.arange(int(SR * sec)) / SR


def place(buf, x, t0, gain=1.0, pan=0.0):
    """Add mono or stereo clip x into stereo buf at time t0 with constant-power pan."""
    i0 = int(round(t0 * SR))
    if i0 >= len(buf):
        return
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.414, x * r * 1.414], axis=1)
    if i0 < 0:
        x = x[-i0:]
        i0 = 0
    n = min(len(x), len(buf) - i0)
    buf[i0:i0 + n] += x[:n] * gain


def sos(kind, f, order=2):
    return signal.butter(order, f, btype=kind, fs=SR, output='sos')


def filt(x, kind, f, order=2):
    return signal.sosfilt(sos(kind, f, order), x)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- instruments
def kick():
    t = tt(0.5)
    f = 46 + 110 * np.exp(-t * 28)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    x += filt(rng.standard_normal(len(t)), 'highpass', 2500) * np.exp(-t * 350) * 0.25
    return np.tanh(x * 1.6) * 0.8


def clap():
    t = tt(0.35)
    n = rng.standard_normal(len(t))
    e = np.zeros_like(t)
    for d in (0.0, 0.011, 0.022):
        e += (t >= d) * np.exp(-np.clip(t - d, 0, None) * 120) * 0.6
    e += (t >= 0.03) * np.exp(-np.clip(t - 0.03, 0, None) * 16)
    return filt(n, 'bandpass', [900, 4200]) * e * 0.55


def hat(open_=False):
    t = tt(0.32 if open_ else 0.06)
    x = filt(rng.standard_normal(len(t)), 'highpass', 7500, 4)
    return x * np.exp(-t * (11 if open_ else 75)) * (0.22 if open_ else 0.18)


def crash():
    t = tt(2.2)
    x = filt(rng.standard_normal(len(t)), 'highpass', 4500, 2)
    return x * np.exp(-t * 2.2) * 0.32


def saw(freq, t, detune=0.0):
    ph = (freq * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))


def pluck(notes, dur=0.32, bright=3200):
    t = tt(dur)
    x = np.zeros_like(t)
    for k, m in enumerate(notes):
        f = mtof(m)
        x += 0.6 * saw(f, t, 0.0035) + 0.6 * saw(f, t, -0.0035)
    x /= max(1, len(notes))
    # decaying low-pass via block-wise cutoff
    out = np.zeros_like(x)
    blk = 480
    zi = None
    for b in range(0, len(x), blk):
        fc = 350 + bright * np.exp(-(b / SR) * 14)
        s_ = sos('lowpass', min(fc, 16000))
        if zi is None:
            zi = signal.sosfilt_zi(s_) * 0
        out[b:b + blk], zi = signal.sosfilt(s_, x[b:b + blk], zi=zi)
    env = np.minimum(1, t / 0.004) * np.exp(-t * 9)
    return out * env * 0.55


def pad(notes, dur, cutoff=1400):
    t = tt(dur)
    x = np.zeros_like(t)
    for m in notes:
        f = mtof(m)
        for d in (-0.006, 0.0, 0.006):
            x += saw(f, t, d)
    x = filt(x / (3 * len(notes)), 'lowpass', cutoff, 2)
    env = np.minimum(1, t / 0.35) * np.minimum(1, (dur - t) / 0.4).clip(0, 1)
    return x * env * 0.35


def bass(m, dur):
    t = tt(dur)
    f = mtof(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * filt(saw(f, t), 'lowpass', 420)
    env = np.minimum(1, t / 0.006) * np.minimum(1, (dur - t) / 0.02).clip(0, 1)
    return np.tanh(x * env * 1.4) * 0.42


# ---------------------------------------------------------------- arrangement
music = np.zeros((N, 2))
CHORDS = [  # (bass midi, chord midi) – Am F C G
    (45, [57, 60, 64, 67]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]
ALERT = (21.09, 23.62)

# intro (0–2 s): filtered pad + clock ticks
place(music, pad([57, 60, 64], 2.2, 900), 0.0, 0.9)
for k in range(8):
    place(music, hat() * 0.8, k * BEAT / 2, 0.7, pan=0.3 if k % 2 else -0.3)

# groove from the drop (2.0 s) to the final hit (28.0 s)
start_bar, end_t = 1, 28.0
kick_times = []
bar = start_bar
while bar * BAR < end_t - 1e-6:
    t0 = bar * BAR
    bm, ch = CHORDS[(bar - start_bar) % 4]
    for b in range(4):
        tb = t0 + b * BEAT
        place(music, kick(), tb, 0.95)
        kick_times.append(tb)
        if b in (1, 3):
            place(music, clap(), tb, 0.8, pan=0.05)
        place(music, hat(open_=True), tb + BEAT / 2, 0.5, pan=0.25)
        for s16 in (1, 3):
            place(music, hat(), tb + s16 * BEAT / 4, 0.32, pan=-0.35)
        # off-beat chord stabs
        place(music, pluck(ch), tb + BEAT / 2, 0.75, pan=-0.15 if b % 2 else 0.15)
        # bass in eighths with octave jump
        for e in range(2):
            place(music, bass(bm + (12 if (b == 3 and e == 1) else 0), BEAT / 2 - 0.01), tb + e * BEAT / 2, 0.9)
    place(music, pad(ch, BAR + 0.3, 1100), t0, 0.45)
    bar += 1

# final hit + tail
bm, ch = CHORDS[0]
place(music, kick(), 28.0, 1.0)
place(music, crash(), 28.0, 0.9)
place(music, pad(ch, 1.4, 1600), 28.0, 0.8)
place(music, pluck([c + 12 for c in ch], 0.9, 4200), 28.0, 0.8)
place(music, bass(bm, 0.9), 28.0, 1.0)

# side-chain pump on the musical bed (not on drums – approximated by global pump, gentle)
pump = np.ones(N)
for kt in kick_times:
    i0 = int(kt * SR)
    t = tt(BEAT)
    g = 1 - 0.35 * np.exp(-t * 9)
    n = min(len(g), N - i0)
    pump[i0:i0 + n] = np.minimum(pump[i0:i0 + n], g[:n])
music *= pump[:, None]

# alert section: low-pass the bed (tension) with smooth in/out
lp = np.stack([filt(music[:, c], 'lowpass', 520, 2) for c in range(2)], axis=1)
tm = np.arange(N) / SR
mix_lp = np.clip((tm - ALERT[0]) / 0.25, 0, 1) * np.clip((ALERT[1] + 0.05 - tm) / 0.2, 0, 1)
music = music * (1 - mix_lp[:, None]) + lp * mix_lp[:, None] * 1.25

# simple stereo reverb (decaying noise IR) for space
def ir(sec=1.6, seed=0):
    r = np.random.default_rng(seed)
    t = tt(sec)
    return r.standard_normal(len(t)) * np.exp(-t * 4.2) * 0.012
wet = np.stack([signal.fftconvolve(music[:, 0], ir(seed=1))[:N], signal.fftconvolve(music[:, 1], ir(seed=2))[:N]], axis=1)
music = music + filt(wet.T, 'highpass', 300).T * 0.9
music = np.stack([filt(music[:, c], 'lowpass', 11000, 2) for c in range(2)], axis=1)
fade = np.clip((DUR - tm) / 0.6, 0, 1)
music *= fade[:, None]

# ---------------------------------------------------------------- SFX
sfx = np.zeros((N, 2))


def whoosh(dur=0.5, f0=300, f1=3800, seed=0):
    r = np.random.default_rng(seed)
    t = tt(dur)
    x = r.standard_normal(len(t))
    out = np.zeros_like(x)
    blk = 240
    zi = None
    for b in range(0, len(x), blk):
        u = b / len(x)
        fc = f0 * (f1 / f0) ** (np.sin(np.pi * u) ** 0.8)
        s_ = sos('bandpass', [fc * 0.6, min(fc * 1.6, 20000)])
        if zi is None:
            zi = signal.sosfilt_zi(s_) * 0
        out[b:b + blk], zi = signal.sosfilt(s_, x[b:b + blk], zi=zi)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    st = np.stack([out * env * np.linspace(1.2, 0.6, len(t)), out * env * np.linspace(0.6, 1.2, len(t))], axis=1)
    return st * 0.5


def pop(f0=420, f1=980, dur=0.09):
    t = tt(dur)
    f = f0 + (f1 - f0) * (1 - np.exp(-t * 60))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38)
    return x * 0.42


def impact():
    t = tt(1.4)
    f = 42 + 70 * np.exp(-t * 14)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    nz = filt(rng.standard_normal(len(t)), 'lowpass', 900) * np.exp(-t * 9) * 0.6
    return np.tanh((boom + nz) * 1.8) * 0.75


def tap():
    t = tt(0.06)
    return (np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 120) + filt(rng.standard_normal(len(t)), 'highpass', 3000) * np.exp(-t * 400) * 0.6) * 0.5


def alarm():
    out = []
    for k in range(4):
        f = 990 if k % 2 == 0 else 740
        t = tt(0.13)
        sq = np.sign(np.sin(2 * np.pi * f * t))
        x = filt(sq, 'lowpass', 3200) * np.minimum(1, t / 0.005) * np.minimum(1, (0.13 - t) / 0.01)
        out.append(x)
        out.append(np.zeros(int(SR * 0.035)))
    return np.concatenate(out) * 0.22


def ding():
    t = tt(1.3)
    f = 1318.5
    x = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) for m, a, d in ((1, 1, 4), (2.0, .35, 7), (3.01, .18, 10), (4.2, .08, 14)))
    t2 = tt(1.3)
    x2 = sum(a * np.sin(2 * np.pi * 1975.5 * m * t2) * np.exp(-t2 * d) for m, a, d in ((1, 1, 4), (2.0, .3, 7)))
    out = np.zeros(int(SR * 1.45))
    out[:len(x)] += x
    out[int(SR * 0.12):int(SR * 0.12) + len(x2)] += x2 * 0.8
    return out * 0.16


def riser(dur):
    st = whoosh(dur, 250, 7000, seed=9)
    t = tt(dur)
    env = (t / dur) ** 2.2
    st = st / (np.sin(np.pi * np.clip(t / dur, 1e-3, 1)) ** 1.6 + 1e-3)[:, None]
    return st * env[:, None] * 0.12


def sparkle():
    out = np.zeros(int(SR * 0.9))
    r = np.random.default_rng(5)
    for k in range(7):
        t0 = k * 0.07
        f = 2400 + r.random() * 3200
        t = tt(0.35)
        x = np.sin(2 * np.pi * f * t) * np.exp(-t * 14)
        i0 = int(t0 * SR)
        out[i0:i0 + len(x)] += x * (0.6 - k * 0.05)
    return out * 0.08


# riser into the reveal, impact on the drop
place(sfx, riser(1.5), 0.5, 1.0)
place(sfx, impact(), 2.0, 0.85)
place(sfx, crash(), 2.0, 0.5)
# hook: thump on the big word + emoji pop
place(sfx, pop(260, 520, 0.12), wt(0, 6) - 0.03, 0.9)
place(sfx, pop(520, 1250), 1.62, 0.7)
# scene transitions
for k, tcut in enumerate([4.26, 8.50, 12.43, 17.24, 21.09, 23.62, 26.27]):
    place(sfx, whoosh(0.46, seed=k + 1), tcut - 0.26, 0.55)
# chip pops (slightly varied pitch)
pops = [wt(2, 1) - 0.06, wt(3, 1) - 0.05, wt(4, 4) - 0.05,
        P[6]['s'] - 0.05, wt(6, 4) - 0.06, wt(7, 1) - 0.06, wt(8, 1) - 0.06, wt(9, 2) - 0.06,
        P[10]['s'] - 0.05, wt(11, 3) - 0.06, wt(12, 1) - 0.06, wt(13, 2) - 0.06, wt(14, 0) - 0.04,
        wt(15, 4) - 0.06, wt(16, 2) - 0.06, wt(17, 3) - 0.06, P[20]['s'] - 0.05, wt(21, 4) - 0.08]
for k, tp in enumerate(pops):
    f0 = 380 + (k % 4) * 60
    place(sfx, pop(f0, f0 * 2.3), tp, 0.55, pan=(-0.2 if k % 2 else 0.2))
# 2-en-1 stamp
place(sfx, impact(), wt(5, 2) - 0.05, 0.6)
# touchscreen tap
place(sfx, tap(), wt(15, 5) + 0.05, 0.9)
# rain / wind texture in the outdoor scene
t = tt(1.6)
place(sfx, filt(rng.standard_normal(len(t)), 'bandpass', [400, 2400]) * np.sin(np.pi * t / 1.6) ** 2 * 0.05, 8.62, 1.0, pan=-0.3)
t = tt(1.4)
place(sfx, filt(rng.standard_normal(len(t)), 'highpass', 2500) * np.sin(np.pi * t / 1.4) ** 2 * 0.06, 10.05, 1.0, pan=0.3)
# alert
place(sfx, alarm(), wt(18, 1) - 0.08, 1.0)
# app notification
place(sfx, ding(), 23.62 + 0.42, 1.0)
# CTA sparkle
place(sfx, sparkle(), 26.27 + 0.7, 1.0)

# ---------------------------------------------------------------- mix with VO
def read_wav(p):
    w = wave.open(p)
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return x if w.getnchannels() == 1 else x.reshape(-1, w.getnchannels()).mean(axis=1)

vo = read_wav('vo_tight.wav')
VO_START = 0.0
vo_full = np.zeros(N)
i0 = int(VO_START * SR)
vo_full[i0:i0 + len(vo)] = vo[:N - i0]
# light VO polish: high-pass + gentle presence
vo_full = filt(vo_full, 'highpass', 80)
# VO envelope for ducking
env = np.abs(vo_full)
win = int(SR * 0.03)
env = np.convolve(env, np.ones(win) / win, mode='same')
att, rel = np.exp(-1 / (SR * 0.01)), np.exp(-1 / (SR * 0.28))
sm = np.zeros_like(env)
g = 0.0
for k in range(0, N, 48):  # 1 ms steps
    v = env[k]
    g = att * g + (1 - att) * v if v > g else rel * g + (1 - rel) * v
    sm[k:k + 48] = g
duck = 1 - 0.45 * np.clip(sm / 0.05, 0, 1)

def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-9)

music_n = music / (np.max(np.abs(music)) + 1e-9)
sfx_n = sfx
vo_st = np.stack([vo_full, vo_full], axis=1)
# levels: VO reference; music bed ~ 15 dB below VO RMS before ducking
vo_rms = rms_db(vo_full[vo_full != 0])
mus_rms = rms_db(music_n[int(2 * SR):int(26 * SR)])
music_gain = 10 ** ((vo_rms - 6.5 - mus_rms) / 20)
SFX_GAIN = 0.4
mix = vo_st + music_n * music_gain * duck[:, None] + sfx_n * SFX_GAIN
peak = np.max(np.abs(mix))
mix = mix / peak * 0.89
print('vo rms %.1f dB, music gain %.2f, peak before norm %.2f' % (vo_rms, music_gain, peak))

def write(p, x):
    x = np.clip(x, -1, 1)
    w = wave.open(p, 'wb')
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes())
    w.close()

write('mix_pre.wav', mix)
print('written mix_pre.wav (%.2fs)' % (N / SR))
