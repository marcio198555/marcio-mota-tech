# Builds the footage track of the v2 ad (real clips only, no text): every shot is decoded at 30 fps,
# cover-cropped to 1080x1920, given a zoom/punch-in move, and written in order to one H.264 file.
import os, subprocess, numpy as np, cv2

S = os.path.dirname(os.path.abspath(__file__))
os.makedirs(S + '/work', exist_ok=True)
W, H, FPS, DUR = 1080, 1920, 30, 29.2
ST, CL = S + '/stock/', S + '/clips/'

# (t0, t1, source, in_point, zoom_from, zoom_to, center_x, center_y, punch)
SHOTS = [
    (0.00, 1.30, ST + 'dustB.mp4', 0.40, 1.00, 1.10, 0.55, 0.55, False),
    (1.30, 2.00, ST + 'waking.mp4', 16.20, 1.45, 1.52, 0.52, 0.52, True),
    (2.00, 4.26, CL + 'K04_omni.mp4', 0.00, 1.00, 1.04, 0.50, 0.60, True),
    (4.26, 5.50, CL + 'K03_par.mp4', 0.30, 1.00, 1.03, 0.50, 0.45, True),
    (5.50, 7.20, CL + 'K04_omni.mp4', 2.30, 1.30, 1.40, 0.60, 0.60, True),
    (7.20, 8.50, 'SPLIT', 0.00, 1.00, 1.00, 0.50, 0.50, True),
    (8.50, 10.70, CL + 'K05_omni.mp4', 0.40, 1.00, 1.06, 0.50, 0.40, True),
    (10.70, 12.43, ST + 'sun.mp4', 3.80, 1.00, 1.08, 0.50, 0.50, True),
    (12.43, 13.60, ST + 'gasstove.mp4', 0.90, 1.10, 1.16, 0.40, 0.70, True),
    (13.60, 15.80, ST + 'stove.mp4', 0.00, 1.00, 1.06, 0.45, 0.55, True),
    (15.80, 17.24, CL + 'K04_omni.mp4', 1.00, 1.70, 1.85, 0.62, 0.59, True),
    (17.24, 19.60, CL + 'K07_par.mp4', 0.30, 1.00, 1.00, 0.50, 0.50, True),
    (19.60, 21.09, ST + 'sun.mp4', 0.20, 1.05, 1.12, 0.50, 0.55, True),
    (21.09, 22.80, ST + 'smoke.mp4', 2.00, 1.00, 1.10, 0.50, 0.55, True),
    (22.80, 23.62, ST + 'window.mp4', 5.30, 1.05, 1.10, 0.50, 0.50, True),
    (23.62, 26.27, ST + 'hikers.mp4', 3.00, 1.00, 1.06, 0.45, 0.55, True),
    (26.27, 29.20, 'BLUR:' + CL + 'K04_omni.mp4', 0.60, 1.10, 1.20, 0.50, 0.55, False),  # end-card background
]


def decode(src, t_in, n, w=W, h=H):
    """n frames at 30fps from src starting at t_in, cover-scaled to w x h."""
    vf = f'fps={FPS},scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h},setsar=1'
    p = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t_in:.3f}', '-i', src, '-frames:v', str(n), '-vf', vf,
                        '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
    fr = np.frombuffer(p.stdout, np.uint8).reshape(-1, h, w, 3)
    if len(fr) < n:  # hold last frame if the source is short
        fr = np.concatenate([fr, np.repeat(fr[-1:], n - len(fr), axis=0)])
    return fr


def zoomed(img, z, cx, cy):
    if abs(z - 1) < 1e-4 and abs(cx - .5) < 1e-4 and abs(cy - .5) < 1e-4:
        return img
    # keep the zoom window inside the frame
    hw, hh = W / (2 * z), H / (2 * z)
    px = min(max(cx * W, hw), W - hw)
    py = min(max(cy * H, hh), H - hh)
    M = np.float32([[z, 0, W / 2 - z * px], [0, z, H / 2 - z * py]])
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)


enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', S + '/work/base_v2.mp4'], stdin=subprocess.PIPE)
total = 0
for (t0, t1, src, tin, z0, z1, cx, cy, punch) in SHOTS:
    n = int(round(t1 * FPS)) - int(round(t0 * FPS))
    if src == 'BLACK':
        frames = np.zeros((n, H, W, 3), np.uint8)
    elif src == 'SPLIT':
        top = decode(CL + 'K05_omni.mp4', 1.0, n)
        bot = decode(CL + 'K07_par.mp4', 0.0, n)
        frames = np.empty((n, H, W, 3), np.uint8)
        frames[:, :H // 2] = top[:, 380:380 + H // 2]
        frames[:, H // 2:] = bot[:, 640:640 + H // 2]
    elif src.startswith('BLUR:'):
        frames = decode(src[5:], tin, n)
    else:
        frames = decode(src, tin, n)
    for i in range(n):
        u = i / max(1, n - 1)
        z = z0 + (z1 - z0) * u
        if punch:  # quick 0.2 s punch-in at the cut, classic UGC edit
            k = i / FPS
            z *= 1 + 0.07 * max(0.0, 1 - k / 0.2) ** 2
        f = zoomed(frames[i], z, cx, cy) if src not in ('BLACK',) else frames[i]
        if src.startswith('BLUR:'):  # soft, moving backdrop behind the end card
            f = cv2.GaussianBlur(f, (0, 0), 22)
        enc.stdin.write(np.ascontiguousarray(f).tobytes())
    total += n
    print(f'{t0:6.2f}-{t1:6.2f} {n:3d}f  {src.split("/")[-1]}', flush=True)
enc.stdin.close(); enc.wait()
print('frames', total, 'expected', int(round(DUR * FPS)))
