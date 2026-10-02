# Soundtrack of the v2 (real-footage) ad: voiceover + ElevenLabs music bed (drop on the product
# reveal, beat-matched jump to the song's real ending) + SFX + foley/ambience that matches each shot.
# Reads <work>/timeline.json, vo_tight.wav, music_el.wav, K05_omni.wav; writes <work>/mix_pre.wav (stereo 48 kHz).
# Mastering to -14 LUFS is done afterwards by master.sh.
import json, wave, sys
import numpy as np
from scipy import signal

D = sys.argv[1] if len(sys.argv) > 1 else '.'
SR = 48000
DUR = 29.2
N = int(SR * DUR)
rng = np.random.default_rng(42)
TL = json.load(open(f'{D}/timeline.json'))
W, P = TL['words'], TL['phrases']
wt = lambda p, i: next(w['t'] for w in W if w['p'] == p and w['i'] == i)
tm = np.arange(N) / SR


def read_wav(p, mono=False):
    w = wave.open(p)
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    x = x.reshape(-1, w.getnchannels())
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    return x.mean(axis=1) if mono else x


def tt(sec):
    return np.arange(int(SR * sec)) / SR


def place(buf, x, t0, gain=1.0, pan=0.0):
    i0 = int(round(t0 * SR))
    if i0 >= len(buf):
        return
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.414, x * r * 1.414], axis=1)
    if i0 < 0:
        x, i0 = x[-i0:], 0
    n = min(len(x), len(buf) - i0)
    buf[i0:i0 + n] += x[:n] * gain


def sos(kind, f, order=2):
    return signal.butter(order, f, btype=kind, fs=SR, output='sos')


def filt(x, kind, f, order=2):
    return signal.sosfilt(sos(kind, f, order), x, axis=0)


def fade(n, a, b):  # trapezoid window over n samples, a/b = fade in/out seconds
    w = np.ones(n)
    ia, ib = int(a * SR), int(b * SR)
    if ia: w[:ia] = np.linspace(0, 1, ia)
    if ib: w[-ib:] = np.minimum(w[-ib:], np.linspace(1, 0, ib))
    return w


# ---------------------------------------------------------------- music
mus = read_wav(f'{D}/music_el.wav')
OFF1 = 16.275 - 2.0          # drop of the song lands on the product reveal (t = 2.0 s)
OFF2 = 62.535 - 28.515       # song's last hit lands on a beat of the timeline (28.515 s)
SPLICE, XF = 27.49, 0.03     # both sides are on a kick here -> seamless jump to the real ending
seg = lambda off, t0, t1: mus[int((t0 + off) * SR):int((t0 + off) * SR) + int((t1 - t0) * SR)]
music = np.zeros((N, 2))
a = seg(OFF1, 0, SPLICE + XF)
b = seg(OFF2, SPLICE, DUR)
music[:len(a)] += a * np.r_[np.ones(len(a) - int(XF * SR)), np.linspace(1, 0, int(XF * SR))][:, None]
i0 = int(SPLICE * SR)
xb = np.r_[np.linspace(0, 1, int(XF * SR)), np.ones(len(b) - int(XF * SR))]
music[i0:i0 + len(b)] += (b * xb[:, None])[:N - i0]
music *= np.clip(tm / 0.35, 0, 1)[:, None]                         # soft start under the hook
music *= np.clip((DUR - tm) / 0.25, 0, 1)[:, None]                 # tail out
# tension in the alert: low-pass the bed
ALERT = (21.09, 23.62)
lp = filt(music, 'lowpass', 600)
k = np.clip((tm - ALERT[0]) / 0.25, 0, 1) * np.clip((ALERT[1] + 0.05 - tm) / 0.2, 0, 1)
music = music * (1 - k[:, None]) + lp * k[:, None] * 1.3

# ---------------------------------------------------------------- SFX (synth)
def whoosh(dur=0.5, f0=300, f1=3800, seed=0):
    r = np.random.default_rng(seed)
    t = tt(dur)
    x = r.standard_normal(len(t))
    out = np.zeros_like(x)
    blk, zi = 240, None
    for bb in range(0, len(x), blk):
        u = bb / len(x)
        fc = f0 * (f1 / f0) ** (np.sin(np.pi * u) ** 0.8)
        s_ = sos('bandpass', [fc * 0.6, min(fc * 1.6, 20000)])
        if zi is None:
            zi = signal.sosfilt_zi(s_) * 0
        out[bb:bb + blk], zi = signal.sosfilt(s_, x[bb:bb + blk], zi=zi)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    return np.stack([out * env * np.linspace(1.2, 0.6, len(t)), out * env * np.linspace(0.6, 1.2, len(t))], axis=1) * 0.5


def pop(f0=420, f1=980, dur=0.09):
    t = tt(dur)
    f = f0 + (f1 - f0) * (1 - np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38) * 0.42


def impact():
    t = tt(1.4)
    f = 42 + 70 * np.exp(-t * 14)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    nz = filt(rng.standard_normal(len(t)), 'lowpass', 900) * np.exp(-t * 9) * 0.6
    return np.tanh((boom + nz) * 1.8) * 0.75


def crash():
    t = tt(2.2)
    return filt(rng.standard_normal(len(t)), 'highpass', 4500) * np.exp(-t * 2.2) * 0.32


def tap():
    t = tt(0.06)
    return (np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 120) + filt(rng.standard_normal(len(t)), 'highpass', 3000) * np.exp(-t * 400) * 0.6) * 0.5


def alarm():
    out = []
    for kk in range(4):
        f = 990 if kk % 2 == 0 else 740
        t = tt(0.13)
        sq = np.sign(np.sin(2 * np.pi * f * t))
        out.append(filt(sq, 'lowpass', 3200) * np.minimum(1, t / 0.005) * np.minimum(1, (0.13 - t) / 0.01))
        out.append(np.zeros(int(SR * 0.035)))
    return np.concatenate(out) * 0.22


def ding():  # phone notification, two soft bell partials
    def bell(f, dur=1.2):
        t = tt(dur)
        return sum(a_ * np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) for m, a_, d in ((1, 1, 4), (2.0, .35, 7), (3.01, .18, 10), (4.2, .08, 14)))
    out = np.zeros(int(SR * 1.45))
    x1, x2 = bell(1318.5), bell(1975.5)
    out[:len(x1)] += x1
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
    for kk in range(7):
        f = 2400 + r.random() * 3200
        t = tt(0.35)
        x = np.sin(2 * np.pi * f * t) * np.exp(-t * 14)
        i = int(kk * 0.07 * SR)
        out[i:i + len(x)] += x * (0.6 - kk * 0.05)
    return out * 0.08


def scribble(dur=0.32):  # marker drawing the arrow
    t = tt(dur)
    n = filt(rng.standard_normal(len(t)), 'bandpass', [1800, 6500])
    am = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 13 * t + 2 * np.sin(2 * np.pi * 3 * t)))
    return n * am * np.sin(np.pi * t / dur) ** 0.6 * 0.10


# ---------------------------------------------------------------- foley / ambience
def noise_bed(dur, lo, hi, seed, mod=0.4, rate=0.35):
    r = np.random.default_rng(seed)
    t = tt(dur)
    x = filt(r.standard_normal(len(t)), 'bandpass', [lo, hi])
    am = 1 + mod * np.sin(2 * np.pi * rate * t + r.random() * 6) * np.sin(2 * np.pi * rate * 0.37 * t + 1)
    return x * am


def wind(dur, seed=1):
    return np.stack([noise_bed(dur, 80, 700, seed) * 0.5 + noise_bed(dur, 2500, 6000, seed + 7, 0.6) * 0.05,
                     noise_bed(dur, 80, 700, seed + 1) * 0.5 + noise_bed(dur, 2500, 6000, seed + 8, 0.6) * 0.05], axis=1)


def birds(dur, seed=3, density=2.2):
    r = np.random.default_rng(seed)
    out = np.zeros((int(dur * SR), 2))
    t0 = 0.1
    while t0 < dur - 0.4:
        f0 = 2600 + r.random() * 2400
        nch = 1 + int(r.random() * 4)
        pan = r.uniform(-0.8, 0.8)
        for c in range(nch):
            d = 0.05 + r.random() * 0.07
            t = tt(d)
            f = f0 * (1 + 0.35 * np.sin(np.pi * t / d)) * (1 - 0.25 * t / d)
            x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2
            place(out, x * (0.5 + 0.5 * r.random()), t0 + c * (d + 0.03), 1.0, pan)
        t0 += r.exponential(1 / density) + 0.12
    return out


def sizzle(dur, seed=4, crackle=60):
    r = np.random.default_rng(seed)
    t = tt(dur)
    base = filt(r.standard_normal(len(t)), 'highpass', 2600) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.7 * t))
    cr = np.zeros(len(t))
    idx = r.integers(0, len(t), int(crackle * dur))
    cr[idx] = r.uniform(-1, 1, len(idx)) * 6
    cr = filt(cr, 'bandpass', [1500, 9000])
    x = base * 0.5 + cr * 0.35
    y = filt(r.standard_normal(len(t)), 'highpass', 2600) * 0.5 + cr * 0.35  # decorrelated, mono-safe
    return np.stack([x, y], axis=1)


def roar(dur, seed=6):
    r = np.random.default_rng(seed)
    t = tt(dur)
    am = 1 + 0.5 * np.abs(np.sin(2 * np.pi * 2.3 * t))
    return np.stack([filt(r.standard_normal(len(t)), 'lowpass', 520) * am, filt(r.standard_normal(len(t)), 'lowpass', 520) * am], axis=1)


def igniter():
    t = tt(0.02)
    return filt(rng.standard_normal(len(t)), 'bandpass', [2000, 7000]) * np.exp(-t * 500) * 0.8


def whoomp():
    t = tt(0.6)
    x = filt(rng.standard_normal(len(t)), 'lowpass', 900) * np.minimum(1, t / 0.03) * np.exp(-t * 6)
    return x * 0.9


def latch():
    t = tt(0.09)
    x = filt(rng.standard_normal(len(t)), 'bandpass', [900, 5000]) * np.exp(-t * 90)
    x[int(0.04 * SR):] += filt(rng.standard_normal(len(t) - int(0.04 * SR)), 'bandpass', [600, 3000]) * np.exp(-tt(0.05) * 120) * 0.7
    return x * 0.7


amb = np.zeros((N, 2))


def bed(x, t0, t1, gain, fi=0.12, fo=0.12):
    n = int((t1 - t0) * SR)
    x = x[:n]
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    place(amb, x * fade(len(x), fi, fo)[:, None], t0, gain)


# real rain/wind recorded with the AI rain shot (K05), synced to the in-points used in the edit
k05 = read_wav(f'{D}/K05_omni.wav')
bed(k05[int(1.0 * SR):], 7.20, 8.50, 1.6, 0.05, 0.1)
bed(k05[int(0.40 * SR):], 8.50, 10.70, 2.6, 0.04, 0.25)
# mountains / sky shots: wind
bed(wind(1.4, 11), 4.26, 5.50, 0.05, 0.1, 0.15)
bed(wind(1.9, 12), 10.70, 12.43, 0.06, 0.15, 0.15)
bed(wind(1.6, 13), 19.60, 21.09, 0.05, 0.15, 0.15)
# kitchen: igniter clicks + gas, then flambé sizzle and roar, smoke keeps sizzling
for kk, tc in enumerate((12.52, 12.66, 12.80)):
    place(amb, igniter(), tc, 0.5, pan=-0.3)
place(amb, whoomp(), 12.86, 0.22, pan=-0.2)
bed(noise_bed(0.8, 900, 4500, 21, 0.1) * 0.25, 12.86, 13.60, 0.25, 0.15, 0.05)
bed(sizzle(2.3, 4), 13.60, 15.80, 0.16, 0.03, 0.1)
r_ = roar(2.3, 6) * np.linspace(0.4, 1.0, int(2.3 * SR))[:, None]
bed(r_, 13.60, 15.80, 0.28, 0.05, 0.1)
bed(sizzle(1.8, 8, 30), 21.09, 22.80, 0.10, 0.08, 0.2)
bed(roar(1.8, 9) * 0.5, 21.09, 22.80, 0.18, 0.1, 0.2)
# window opens -> outside air comes in; outdoor app scene keeps the birds
place(amb, latch(), 22.84, 0.6, pan=0.2)
bed(birds(1.0, 31, 3.0) * 0.06 + wind(1.0, 14) * 0.03, 22.80, 23.62, 1.0, 0.25, 0.05)
bed(birds(2.8, 32, 2.4) * 0.06 + wind(2.8, 15) * 0.035, 23.62, 26.27, 1.0, 0.05, 0.3)

sfx = np.zeros((N, 2))
place(sfx, riser(1.5), 0.5, 1.0)
place(sfx, impact(), 2.0, 0.85)
place(sfx, crash(), 2.0, 0.45)
place(sfx, pop(260, 520, 0.12), wt(0, 6) - 0.03, 0.9)            # RESPIRES
place(sfx, pop(520, 1250), 1.62, 0.7)                            # emoji
place(sfx, scribble(), 2.18, 1.0, pan=-0.2)                      # arrow
for kk, tc in enumerate([4.26, 8.50, 12.43, 17.24, 21.09, 23.62, 26.27]):
    place(sfx, whoosh(0.46, seed=kk + 1), tc - 0.26, 0.5)
pops = [wt(2, 1) - 0.06, wt(3, 1) - 0.05, wt(4, 4) - 0.05,
        P[6]['s'] - 0.05, wt(6, 4) - 0.06, wt(7, 1) - 0.06, wt(8, 1) - 0.06, wt(9, 2) - 0.06,
        P[10]['s'] - 0.05, wt(11, 3) - 0.06, wt(12, 1) - 0.06, wt(13, 2) - 0.06, wt(14, 0) - 0.04,
        wt(15, 4) - 0.06, wt(16, 2) - 0.06, 19.80, wt(17, 3) - 0.06, P[20]['s'] - 0.05, wt(21, 4) - 0.08]
for kk, tp in enumerate(pops):
    f0 = 380 + (kk % 4) * 60
    place(sfx, pop(f0, f0 * 2.3), tp, 0.55, pan=(-0.2 if kk % 2 else 0.2))
place(sfx, impact(), wt(5, 2) - 0.05, 0.6)                       # 2 EN 1
place(sfx, tap(), wt(15, 5) + 0.05, 0.9)                         # finger on the screen
place(sfx, ding(), 22.86, 1.0)                                   # notification
place(sfx, alarm(), wt(18, 1) - 0.08, 0.9)                       # t'alerte
place(sfx, whoosh(0.4, 400, 5200, seed=21), wt(19, 5) - 0.12, 0.35)  # card out of the phone
place(sfx, sparkle(), 26.97, 1.0)                                # end card shine

# ---------------------------------------------------------------- mix
vo = read_wav(f'{D}/vo_tight.wav', mono=True)
vo_full = np.zeros(N)
vo_full[:min(N, len(vo))] = vo[:N]
vo_full = filt(vo_full, 'highpass', 80)
env = np.convolve(np.abs(vo_full), np.ones(int(SR * 0.03)) / int(SR * 0.03), mode='same')
att, rel = np.exp(-1 / (SR * 0.01)), np.exp(-1 / (SR * 0.28))
sm = np.zeros_like(env)
g = 0.0
for kk in range(0, N, 48):
    v = env[kk]
    g = att * g + (1 - att) * v if v > g else rel * g + (1 - rel) * v
    sm[kk:kk + 48] = g
duck = 1 - 0.5 * np.clip(sm / 0.05, 0, 1)


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-9)


vo_rms = rms_db(vo_full[np.abs(vo_full) > 1e-4])
mus_rms = rms_db(music[int(2.2 * SR):int(26 * SR)])
music_gain = 10 ** ((vo_rms - 6.5 - mus_rms) / 20)
# once the voice is done, the bed swells into the song's final hit on the end card
swell = 1 + 0.9 * np.clip((tm - 27.75) / 0.3, 0, 1)
SFX_GAIN, AMB_GAIN = 0.4, 1.0
vo_st = np.stack([vo_full, vo_full], axis=1)
mix = vo_st + music * music_gain * (duck * swell)[:, None] + sfx * SFX_GAIN + amb * AMB_GAIN * (0.6 + 0.4 * duck[:, None])
peak = np.max(np.abs(mix))
mix = mix / peak * 0.89
print('vo rms %.1f dB, music rms %.1f dB, music gain %.3f, peak %.2f' % (vo_rms, mus_rms, music_gain, peak))
for name, x in (('vo', vo_st), ('music', music * music_gain * duck[:, None]), ('sfx', sfx * SFX_GAIN), ('amb', amb * AMB_GAIN)):
    print('  stem %-5s rms %.1f dB' % (name, rms_db(x[np.abs(x).sum(1) > 1e-5]) if np.any(np.abs(x) > 1e-5) else -99))


def write(p, x):
    x = np.clip(x, -1, 1)
    w = wave.open(p, 'wb')
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes())
    w.close()


write(f'{D}/mix_pre.wav', mix)
print('written mix_pre.wav')
