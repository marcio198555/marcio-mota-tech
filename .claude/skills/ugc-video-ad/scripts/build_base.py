# Picture track of a vertical ad from a JSON shot list. Every shot is decoded at the target fps, cover-cropped to
# the frame (landscape stock gets a 9:16 window, optionally panning), given a slow zoom and an optional quick
# punch-in on the cut, and written in order to one H.264 file (CRF 14, an intermediate for composite.py).
# usage: python3 build_base.py shots.json out.mp4
#
# shots.json:
# {"fps": 30, "w": 1080, "h": 1920, "shots": [
#   {"t0": 0.00, "t1": 3.55, "src": "clips/presenter.mp4"},
#   {"t0": 3.55, "t1": 5.05, "src": "clips/product.mp4", "in": 2.2, "zoom": [1.0, 1.05], "center": [0.5, 0.55], "punch": true},
#   {"t0": 29.85, "t1": 31.4, "src": "stock/run.mp4", "in": 4.6, "crop_x": 0.33},          # 9:16 window of a landscape clip
#   {"t0": 35.95, "t1": 37.45, "src": "stock/window.mp4", "in": 9.5, "crop_x": [0.60, 0.47]}, # window pans across the shot
#   {"t0": 16.4, "t1": 20.15, "split": [{"src": "clips/sensor.mp4", "rows": 300}, {"src": "clips/display.mp4", "rows": 620}]},
#   {"t0": 51.4, "t1": 54.0, "src": "clips/product.mp4", "in": 0.3, "zoom": [1.1, 1.2], "blur": 22}]}   # end-card backdrop
# Shots must be contiguous; a source that is too short holds its last frame.
import json, sys, subprocess, numpy as np, cv2

spec = json.load(open(sys.argv[1])); OUT = sys.argv[2]
FPS, W, H = spec.get('fps', 30), spec.get('w', 1080), spec.get('h', 1920)


def decode(src, t_in, n, crop_x=None):
    """n frames from src starting at t_in, as WxH. crop_x: centre of a 9:16 window (fraction of the width)
    for landscape sources, or [from, to] to pan the window during the shot."""
    if isinstance(crop_x, list):
        c0, c1 = crop_x; cx = f'({c0}+({c1 - c0})*min(1,t/{n / FPS:.3f}))'
    else:
        cx = crop_x
    pre = f"crop='ih*9/16':ih:'max(0,min(iw-ow,iw*{cx}-ow/2))':0," if crop_x is not None else ''
    vf = pre + f'fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},setsar=1'
    p = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t_in:.3f}', '-i', src, '-frames:v', str(n), '-vf', vf,
                        '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
    fr = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
    if len(fr) == 0: raise SystemExit(f'no frames decoded from {src} at {t_in}s')
    if len(fr) < n: fr = np.concatenate([fr, np.repeat(fr[-1:], n - len(fr), axis=0)])
    return fr


def zoomed(img, z, cx, cy):
    if abs(z - 1) < 1e-4 and abs(cx - .5) < 1e-4 and abs(cy - .5) < 1e-4: return img
    hw, hh = W / (2 * z), H / (2 * z)
    px = min(max(cx * W, hw), W - hw); py = min(max(cy * H, hh), H - hh)
    M = np.float32([[z, 0, W / 2 - z * px], [0, z, H / 2 - z * py]])
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)


enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
total, prev_end = 0, 0.0
for s in spec['shots']:
    t0, t1 = s['t0'], s['t1']
    if abs(t0 - prev_end) > 1e-6: raise SystemExit(f'gap or overlap before the shot at {t0}s')
    prev_end = t1
    n = int(round(t1 * FPS)) - int(round(t0 * FPS))
    if 'split' in s:              # two pictures stacked: top half and bottom half of the frame
        a, b = s['split']
        top, bot = decode(a['src'], a.get('in', 0.0), n), decode(b['src'], b.get('in', 0.0), n)
        frames = np.empty((n, H, W, 3), np.uint8)
        frames[:, :H // 2] = top[:, a.get('rows', 0):a.get('rows', 0) + H // 2]
        frames[:, H // 2:] = bot[:, b.get('rows', 0):b.get('rows', 0) + H // 2]
    else:
        frames = decode(s['src'], s.get('in', 0.0), n, s.get('crop_x'))
    z0, z1 = s.get('zoom', [1.0, 1.0]); cx, cy = s.get('center', [0.5, 0.5])
    for i in range(n):
        u = i / max(1, n - 1); z = z0 + (z1 - z0) * u
        if s.get('punch'): z *= 1 + 0.05 * max(0.0, 1 - (i / FPS) / 0.2) ** 2      # short UGC punch-in on the cut
        f = zoomed(frames[i], z, cx, cy)
        if s.get('blur'): f = cv2.GaussianBlur(f, (0, 0), s['blur'])
        enc.stdin.write(np.ascontiguousarray(f).tobytes())
    total += n
    print(f'{t0:6.2f}-{t1:6.2f} {n:3d}f  {s.get("src", "split")}', flush=True)
enc.stdin.close(); enc.wait()
print('frames', total, '->', OUT)
