# Soundtrack of the v3 ad: voice-over (ElevenLabs, voice "Kevin"), ElevenLabs music bed whose drop
# lands on the product reveal and whose real final hit lands on the end card, plus foley/ambience
# matched to every shot (ElevenLabs SFX, the stock clips' own sound, and light synthesis).
# Writes work/mix_pre.wav (stereo 48 kHz); mastering to -14 LUFS is done by master.sh.
import json, wave, os
import numpy as np
from scipy import signal

S = os.path.dirname(os.path.abspath(__file__))
A = S + '/audio/'
SR, DUR = 48000, 54.0
N = int(SR * DUR)
VO_OFFSET = 0.25
rng = np.random.default_rng(42)
TL = json.load(open(S + '/timeline_v3.json'))['words']
wt = lambda p, i: next(w['t'] for w in TL if w['p'] == p and w['i'] == i) + VO_OFFSET
tm = np.arange(N) / SR


def read_wav(p, mono=False):
    w = wave.open(p)
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    x = x.reshape(-1, w.getnchannels())
    if x.shape[1] == 1: x = np.repeat(x, 2, axis=1)
    return x.mean(axis=1) if mono else x


def tt(sec): return np.arange(int(SR * sec)) / SR


def place(buf, x, t0, gain=1.0, pan=0.0):
    i0 = int(round(t0 * SR))
    if i0 >= len(buf): return
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.414, x * r * 1.414], axis=1)
    if i0 < 0: x, i0 = x[-i0:], 0
    n = min(len(x), len(buf) - i0)
    buf[i0:i0 + n] += x[:n] * gain


def filt(x, kind, f, order=2): return signal.sosfilt(signal.butter(order, f, btype=kind, fs=SR, output='sos'), x, axis=0)


def fade(n, a, b):
    w = np.ones(n); ia, ib = int(a * SR), int(b * SR)
    if ia: w[:ia] = np.linspace(0, 1, ia)
    if ib: w[-ib:] = np.minimum(w[-ib:], np.linspace(1, 0, ib))
    return w


# ---------------------------------------------------------------- music
mus = read_wav(A + 'music_el.wav')
DROP_SONG, DROP_VIDEO = 16.275, 5.08          # the song's drop lands on the cut to the product reveal
OFF = DROP_SONG - DROP_VIDEO                  # -> its real final hit (62.535 s) lands at 51.34 s, on the end card
music = np.zeros((N, 2))
seg = mus[int(OFF * SR):int(OFF * SR) + N]
music[:len(seg)] = seg
music *= np.clip(tm / 0.30, 0, 1)[:, None]
music *= np.clip((DUR - tm) / 0.6, 0, 1)[:, None]
# tension while the display beeps: low-pass the bed
k = np.clip((tm - 35.20) / 0.12, 0, 1) * np.clip((36.00 - tm) / 0.15, 0, 1)
music = music * (1 - k[:, None]) + filt(music, 'lowpass', 700) * k[:, None] * 1.25

# ---------------------------------------------------------------- synth helpers (from v2)
def whoosh(dur=0.5, f0=300, f1=3800, seed=0):
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


def crash():
    t = tt(2.2); return filt(rng.standard_normal(len(t)), 'highpass', 4500) * np.exp(-t * 2.2) * 0.32


def tap():
    t = tt(0.06)
    return (np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 120) + filt(rng.standard_normal(len(t)), 'highpass', 3000) * np.exp(-t * 400) * 0.6) * 0.5


def blip(f=1900, dur=0.07):
    t = tt(dur); return np.sin(2 * np.pi * f * t) * np.exp(-t * 55) * np.minimum(1, t / 0.003) * 0.25


def riser(dur):
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


def loop(x, dur, xf=0.12):
    """repeat a short stereo clip with crossfades up to dur seconds"""
    n, k = int(dur * SR), int(xf * SR); out = np.zeros((n, 2)); i = 0
    w = np.r_[np.linspace(0, 1, k), np.ones(len(x) - 2 * k), np.linspace(1, 0, k)][:, None]
    while i < n:
        m = min(len(x), n - i); out[i:i + m] += (x * w)[:m]; i += len(x) - k
    return out


amb = np.zeros((N, 2))
def bed(x, t0, t1, gain, fi=0.1, fo=0.1):
    n = int((t1 - t0) * SR); x = x[:n]
    if x.ndim == 1: x = np.stack([x, x], axis=1)
    place(amb, x * fade(len(x), fi, fo)[:, None], t0, gain)

# ---------------------------------------------------------------- ambience / foley per shot
bed(noise_bed(3.6, 120, 900, 50, 0.2) * 0.02, 0.0, 3.55, 1.0, 0.05, 0.1)                  # quiet living room
bed(wind(1.3, 11), 7.10, 8.35, 0.05, 0.12, 0.1)                                           # alpine sensor
bed(read_wav(A + 'k05.wav'), 10.30, 13.00, 2.2, 0.05, 0.25)                               # real rain + wind of the K05 shot
bed(wind(3.5, 12), 13.00, 16.40, 0.06, 0.2, 0.2)                                          # above the clouds
bed(wind(3.8, 13) * 0.6, 16.40, 20.15, 0.05, 0.2, 0.2)                                    # LoRa split
bed(birds(2.4, 31, 2.0) * 0.05, 27.45, 29.85, 1.0, 0.2, 0.1)                              # morning, window ajar
run = loop(read_wav(A + 'sfx_run.wav'), 1.6)
bed(run, 29.85, 31.40, 1.6, 0.06, 0.12)                                                   # footsteps by the lake
bed(birds(1.6, 33, 3.0) * 0.06 + wind(1.6, 14) * 0.03, 29.85, 31.40, 1.0, 0.06, 0.12)
bed(read_wav(A + 'pan.wav'), 31.40, 32.60, 2.4, 0.04, 0.08)                               # the wok's own sizzle
bed(sizzle(3.4, 4), 32.55, 35.95, 0.07, 0.1, 0.3)                                         # kitchen keeps sizzling
bed(read_wav(A + 'sfx_window.wav'), 35.95, 37.45, 1.6, 0.02, 0.25)                        # handle, window opens, outside
bed(birds(1.5, 35, 2.6) * 0.04, 35.95, 37.45, 1.0, 0.3, 0.2)
typ = read_wav(A + 'sfx_typing.wav')[int(0.4 * SR):]
bed(typ, 37.45, 39.10, 0.55, 0.04, 0.2)                                                   # keyboard

sfx = np.zeros((N, 2))
place(sfx, riser(1.5), DROP_VIDEO - 1.5, 1.0)
place(sfx, impact(), DROP_VIDEO, 0.8); place(sfx, crash(), DROP_VIDEO, 0.4)
for kk, tc in enumerate([7.10, 10.30, 16.40, 20.15, 29.85, 31.40, 35.95, 37.45, 45.15, 47.95]):
    place(sfx, whoosh(0.42, seed=kk + 1), tc - 0.22, 0.38)
for kk, tc in enumerate([41.25, 43.25]):                                                  # page swipes on the display
    place(sfx, whoosh(0.3, 600, 5200, seed=30 + kk), tc - 0.12, 0.3)
chips = [wt(3, 1), wt(3, 6), wt(4, 5), wt(4, 8), wt(4, 10), wt(5, 1), wt(5, 3), wt(5, 6), wt(6, 6),
         wt(7, 7), wt(7, 10), wt(8, 1), wt(8, 3), wt(8, 5), wt(9, 7), wt(9, 11), wt(10, 4), wt(11, 3), wt(12, 3),
         wt(13, 5), wt(14, 0), wt(14, 8), wt(15, 2), wt(17, 0)]
for kk, tp in enumerate(chips):
    f0 = 380 + (kk % 4) * 60
    place(sfx, pop(f0, f0 * 2.3), tp - 0.06, 0.42, pan=(-0.2 if kk % 2 else 0.2))
place(sfx, impact() * 0.5, wt(6, 8) - 0.05, 0.6)                                          # 1000 m badge
for kk in range(8):                                                                        # data packets on the LoRa link
    place(sfx, blip(1700 + 220 * (kk % 3)), 16.55 + kk * 0.45, 0.5, pan=0.1)
place(sfx, tap(), 8.62, 0.9)                                                               # finger on the glass
for tc in (33.95, 34.30, 34.42, 35.10):                                                    # typing the threshold, switch on
    place(sfx, tap(), tc, 0.7)
beep = read_wav(A + 'sfx_beep.wav')
place(sfx, beep, 35.28, 0.55)                                                              # the display beeps (PM2.5 alarm)
place(sfx, beep[:int(0.75 * SR)] * fade(int(0.75 * SR), 0.0, 0.2)[:, None], 40.20, 0.3)  # CO2 alarm, softer
place(sfx, sparkle(), 51.55, 1.0)

# ---------------------------------------------------------------- mix
vo = read_wav(A + 'vo_v3.wav', mono=True)
vo_full = np.zeros(N); i0 = int(VO_OFFSET * SR); vo_full[i0:i0 + len(vo)] = vo[:N - i0]
vo_full = filt(vo_full, 'highpass', 80)
env = np.convolve(np.abs(vo_full), np.ones(int(SR * 0.03)) / int(SR * 0.03), mode='same')
att, rel = np.exp(-1 / (SR * 0.01)), np.exp(-1 / (SR * 0.28))
sm = np.zeros_like(env); g = 0.0
for kk in range(0, N, 48):
    v = env[kk]; g = att * g + (1 - att) * v if v > g else rel * g + (1 - rel) * v; sm[kk:kk + 48] = g
duck = 1 - 0.5 * np.clip(sm / 0.05, 0, 1)
rms_db = lambda x: 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-9)
vo_rms = rms_db(vo_full[np.abs(vo_full) > 1e-4])
mus_rms = rms_db(music[int(6 * SR):int(50 * SR)])
music_gain = 10 ** ((vo_rms - 6.5 - mus_rms) / 20)
swell = 1 + 0.9 * np.clip((tm - 51.10) / 0.25, 0, 1)                                       # voice done: the song's ending
SFX_GAIN, AMB_GAIN = 0.4, 1.0
vo_st = np.stack([vo_full, vo_full], axis=1)
mix = vo_st + music * music_gain * (duck * swell)[:, None] + sfx * SFX_GAIN + amb * AMB_GAIN * (0.6 + 0.4 * duck[:, None])
peak = np.max(np.abs(mix)); mix = mix / peak * 0.89
print('vo rms %.1f dB, music rms %.1f dB, music gain %.3f, peak %.2f' % (vo_rms, mus_rms, music_gain, peak))
for name, x in (('vo', vo_st), ('music', music * music_gain * duck[:, None]), ('sfx', sfx * SFX_GAIN), ('amb', amb * AMB_GAIN)):
    xs = x[np.abs(x).sum(1) > 1e-5]
    print('  stem %-5s rms %.1f dB' % (name, rms_db(xs) if len(xs) else -99))
w = wave.open(S + '/work/mix_pre.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
print('written work/mix_pre.wav')
