# Two timing checks for talking shots.
#
# 1) sync: does the mouth move with the voice? Correlates mouth-region motion in the video with changes in the
#    voice-over envelope over a time window and reports the best lag. Lag > 0 = picture leads the sound.
#    Aim for -1..+1 frame. Viewers notice sound arriving first sooner than picture arriving first.
#    python3 lipsync_check.py sync video.mp4 vo.wav --vo-offset 0.25 --t0 47.95 --t1 51.35 --mouth 300,830,520,990
#    (--mouth x0,y0,x1,y1 in video pixels: a box around the lips; check it on a frame first)
#
# 2) offset: where does a trimmed clip (e.g. the audio a talking-head model returned, or a Cloudinary so_/eo_
#    trim) sit inside the full voice-over? Spectrogram correlation, robust to re-encoding.
#    python3 lipsync_check.py offset clip.mp4 vo.wav --near 47.70 [--span 1.0]
#    -> the clip's time 0 is at <reported> s of the voice-over; use it to time the talking frames.
import argparse, subprocess, numpy as np
from scipy.signal import stft

ap = argparse.ArgumentParser()
ap.add_argument('mode', choices=['sync', 'offset'])
ap.add_argument('media'); ap.add_argument('vo')
ap.add_argument('--vo-offset', type=float, default=0.0)
ap.add_argument('--t0', type=float, default=0.0); ap.add_argument('--t1', type=float, default=None)
ap.add_argument('--mouth', default=None)
ap.add_argument('--near', type=float, default=0.0); ap.add_argument('--span', type=float, default=1.0)
a = ap.parse_args()
SR = 16000


def audio(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32)


vo = audio(a.vo)
if a.mode == 'offset':
    clip = audio(a.media)
    spec = lambda x: np.log(np.abs(stft(x, SR, nperseg=512, noverlap=512 - 160)[2])[:200] + 1e-3)
    A = spec(clip); best = []
    for lag in np.arange(-a.span, a.span, 0.005):
        st = int((a.near + lag) * SR)
        if st < 0: continue
        seg = vo[st:st + len(clip)]
        if len(seg) < len(clip): seg = np.pad(seg, (0, len(clip) - len(seg)))
        B = spec(seg); n = min(A.shape[1], B.shape[1])
        x = A[:, :n].ravel() - A[:, :n].mean(); y = B[:, :n].ravel() - B[:, :n].mean()
        best.append((float(x @ y / np.sqrt((x @ x) * (y @ y))), a.near + lag))
    best.sort(reverse=True)
    print('clip t=0 is at %.3f s of the voice-over (match %.3f)' % (best[0][1], best[0][0]))
else:
    x0, y0, x1, y1 = map(int, a.mouth.split(','))
    probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate',
                            '-of', 'csv=p=0', a.media], capture_output=True, text=True, check=True).stdout.strip().split(',')
    W, H = int(probe[0]), int(probe[1]); num, den = map(int, probe[2].split('/')); fps = num / den
    dur = (a.t1 - a.t0) if a.t1 else 4.0
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a.t0), '-t', str(dur), '-i', a.media, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                         capture_output=True, check=True).stdout
    F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)[:, y0:y1, x0:x1]
    mot = np.r_[0, np.abs(np.diff(F, axis=0)).mean((1, 2))]
    tt = a.t0 + np.arange(len(F)) / fps; hop = int(SR / fps)
    env = np.array([np.sqrt(np.mean(vo[max(0, int((t - a.vo_offset) * SR)):max(0, int((t - a.vo_offset) * SR)) + hop] ** 2) + 1e-9) if t >= a.vo_offset else 0
                    for t in tt])
    denv = np.abs(np.diff(np.r_[0, env])); m = 8
    res = sorted([(float(np.corrcoef(np.roll(mot, l)[m:-m], denv[m:-m])[0, 1]), l) for l in range(-6, 7)], reverse=True)
    print('best lag %+d frames (%+.0f ms), corr %.2f  [lag>0: picture leads]; runners-up %s' %
          (res[0][1], res[0][1] * 1000 / fps, res[0][0], [(l, round(c, 2)) for c, l in res[1:3]]))
