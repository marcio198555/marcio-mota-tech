# Talking presenter shot. LeapTalk (a Hugging Face Space) turned a square crop of the keyframe plus the
# voice-over into a lip-synced head at 512x512 / 25 fps. Here that head goes back into the full-resolution
# keyframe:
#   - the device screen shows the exact UI replica and the hand-held device stays rigid;
#   - outside the generated square, the body follows the head motion (optical flow extended with a fall-off),
#     so there is no seam;
#   - frames are re-timed from 25 to 30 fps with flow interpolation;
#   - the same 2.5D handheld selfie camera as the other presenter shots is applied (monocular depth).
# usage: python3 talking.py kf.png quad.npy|- ui.png|- talk.mp4 x,y,size t0 out.mp4 dur fps [device_poly_json|-] [push]
#   quad, ui  screen quad of the device in the keyframe and the UI render to put on it ('-' when no screen is visible)
#   x,y,size  the square of the keyframe that was sent to LeapTalk (keyframe pixels)
#   t0        LeapTalk time at the first output frame (negative: hold the first frame until the voice starts)
#   device    polygon (keyframe pixels) of a device held inside the square: kept static, never taken from LeapTalk
# The depth model is read from $DEPTH_MODEL (default models/depth_anything_v2_vits.onnx).
import os, sys, json, subprocess, numpy as np, cv2, onnxruntime as ort

a = sys.argv[1:]
kf_path, quad_path, ui_path, talk_path = a[:4]
bx, by, bs = [float(v) for v in a[4].split(',')]
t0, out, dur, fps = float(a[5]), a[6], float(a[7]), int(a[8])
dev = np.float32(json.loads(a[9])) if len(a) > 9 and a[9] != '-' else None
push = float(a[10]) if len(a) > 10 else 0.06
W, H, LFPS, OS = 1080, 1920, 25.0, 1.12
raw = cv2.imread(kf_path); kh, kw = raw.shape[:2]


def exact_screen(kf, quad, ui):
    """Warp the UI render onto the screen quad (supersampled) with the panel's black level, a soft sheen and
    the original glass reflection."""
    ui = ui.astype(np.float32); uh, uw = ui.shape[:2]
    yy, xx = np.mgrid[0:uh, 0:uw].astype(np.float32)
    ui = ui * 0.9 + 9 + (np.clip(1.0 - (xx / uw * 0.8 + yy / uh * 0.6), 0, 1) ** 2 * 16)[:, :, None]
    SS = 3
    big = cv2.resize(kf, None, fx=SS, fy=SS, interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [uw, 0], [uw, uh], [0, uh]]), quad * SS)
    wu = cv2.warpPerspective(ui, M, (big.shape[1], big.shape[0]), flags=cv2.INTER_AREA)
    wm = cv2.warpPerspective(np.full((uh, uw), 255, np.uint8), M, (big.shape[1], big.shape[0])).astype(np.float32) / 255
    wm = cv2.GaussianBlur(wm, (0, 0), 1.2)[:, :, None]
    g0 = cv2.cvtColor(big.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
    refl = np.clip(cv2.GaussianBlur(g0, (0, 0), 25) - 40, 0, None)[:, :, None] * 0.25
    big = big * (1 - wm) + (wu + refl) * wm
    return np.clip(cv2.resize(big, (kw, kh), interpolation=cv2.INTER_AREA), 0, 255).astype(np.uint8)


kf = exact_screen(raw, np.load(quad_path).astype(np.float32), cv2.imread(ui_path)) if quad_path != '-' else raw

# oversized 9:16 canvas so the camera motion never shows a border
s = W * OS / kw
cw, chh, ch = int(round(W * OS)), int(round(kh * s)), int(H * OS)
y0 = max(0, (chh - ch) // 2)
canvas = cv2.resize(kf, (cw, chh), interpolation=cv2.INTER_LANCZOS4)[y0:y0 + ch].astype(np.float32)
to_c = lambda p: (np.float32(p) + 0.5) * s - 0.5 - np.float32([0, y0])          # keyframe px -> canvas px

# --- LeapTalk frames, colour-matched to the keyframe ---------------------------------------------------------
cap = cv2.VideoCapture(talk_path); L = []
while True:
    ok, f = cap.read()
    if not ok: break
    L.append(f)
L = np.array(L); n_l = len(L)
ix, iy, isz = int(round(bx)), int(round(by)), int(round(bs))
src = cv2.resize(raw[iy:iy + isz, ix:ix + isz], (512, 512), interpolation=cv2.INTER_AREA)
dev_l = None
if dev is not None:                                   # device polygon in LeapTalk pixels
    dev_l = np.zeros((512, 512), np.uint8)
    cv2.fillPoly(dev_l, [np.round((dev - [bx, by]) * 512 / bs).astype(np.int32)], 255)
still = (L.astype(np.float32).std(0).mean(2) < 2.0) & ((dev_l == 0) if dev_l is not None else True)
gain = []
for c in range(3):                                    # per-channel linear fit on the pixels that do not move
    gain.append(np.polyfit(L[:, :, :, c].astype(np.float32).mean(0)[still], src[:, :, c].astype(np.float32)[still], 1))
L = np.clip(L.astype(np.float32) * np.float32([g[0] for g in gain]) + np.float32([g[1] for g in gain]), 0, 255).astype(np.uint8)
print('colour gain', [(round(float(g[0]), 3), round(float(g[1]), 1)) for g in gain])

# --- optical flow: frame-to-frame (re-timing) and frame-to-keyframe (body follows the head) ---------------------
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
G = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in L]; gs = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
F01 = [dis.calc(G[i], G[i + 1], None) for i in range(n_l - 1)]
F10 = [dis.calc(G[i + 1], G[i], None) for i in range(n_l - 1)]
keep = 1.0 - (cv2.GaussianBlur(dev_l.astype(np.float32) / 255, (0, 0), 6) if dev_l is not None else 0)
D = [cv2.GaussianBlur(dis.calc(g, gs, None), (0, 0), 6) * (keep[:, :, None] if dev_l is not None else 1) for g in G]

yl, xl = np.mgrid[0:512, 0:512].astype(np.float32)
warp = lambda im, fl: cv2.remap(im, xl + fl[:, :, 0], yl + fl[:, :, 1], cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def lt_at(tl):
    """LeapTalk image and its displacement to the keyframe at time tl (flow interpolation, Super-SloMo style)."""
    f = min(max(tl * LFPS, 0.0), n_l - 1.0); i = min(int(f), n_l - 2); u = f - i
    if u < 1e-3: return L[i], D[i]
    if u > 1 - 1e-3: return L[i + 1], D[i + 1]
    ft0 = -(1 - u) * u * F01[i] + u * u * F10[i]
    ft1 = (1 - u) ** 2 * F01[i] - u * (1 - u) * F10[i]
    im = (1 - u) * warp(L[i].astype(np.float32), ft0) + u * warp(L[i + 1].astype(np.float32), ft1)
    return np.clip(im, 0, 255).astype(np.uint8), (1 - u) * D[i] + u * D[i + 1]


# --- placement on the canvas -------------------------------------------------------------------------------------
k = bs / 512 * s                                       # LeapTalk px -> canvas px
ox, oy = to_c([bx - 0.5 + 0.5 * bs / 512, by - 0.5 + 0.5 * bs / 512])
M_lc = np.float32([[k, 0, ox], [0, k, oy]])
sx0, sy0 = int(round(ox)), int(round(oy)); sz = int(round(512 * k))
Yc, Xc = np.mgrid[0:ch, 0:cw].astype(np.float32)
# paste mask: the generated square, feathered on every side that is inside the canvas, minus the device
FE = 36.0
d_in = np.minimum.reduce([Yc - oy if by > 0 else np.full_like(Yc, 1e9), (oy + 512 * k) - Yc,
                          Xc - ox if bx > 0 else np.full_like(Xc, 1e9), (ox + 512 * k) - Xc])
m = np.clip(d_in / FE, 0, 1); m = m * m * (3 - 2 * m)
dev_c = None
if dev is not None:
    dev_c = np.zeros((ch, cw), np.uint8); cv2.fillPoly(dev_c, [np.round(to_c(dev) * 4).astype(np.int32)], 255, cv2.LINE_AA, 2)
    dev_c = cv2.GaussianBlur(cv2.dilate(dev_c, np.ones((7, 7), np.uint8)).astype(np.float32) / 255, (0, 0), 2.0)
    m = m * (1 - dev_c)
m = m[:, :, None]
# fall-off of the head/body motion outside the square
dx = np.maximum(np.maximum(ox - Xc, Xc - (ox + 512 * k)), 0); dy = np.maximum(np.maximum(oy - Yc, Yc - (oy + 512 * k)), 0)
fall = np.exp(-((np.hypot(dx, dy)) / (90 * s)) ** 2)[:, :, None]


def disp_canvas(d):
    """LeapTalk displacement field -> canvas field, replicated outward from the square and faded out."""
    dc = cv2.resize(d * k, (sz, sz), interpolation=cv2.INTER_LINEAR)
    top, left = sy0, sx0
    dc = cv2.copyMakeBorder(dc, max(top, 0), max(ch - top - sz, 0), max(left, 0), max(cw - left - sz, 0), cv2.BORDER_REPLICATE)
    dc = dc[max(-top, 0):max(-top, 0) + ch, max(-left, 0):max(-left, 0) + cw]
    return dc * fall


# --- 2.5D handheld camera (same as the living-photo presenter) ------------------------------------------------
MODEL = os.environ.get('DEPTH_MODEL', 'models/depth_anything_v2_vits.onnx')
if not os.path.exists(MODEL):
    sys.exit(f'missing {MODEL}: curl -L -o {MODEL} https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx')
sess = ort.InferenceSession(MODEL, providers=['CPUExecutionProvider'])
xin = cv2.resize(cv2.cvtColor(canvas.astype(np.uint8), cv2.COLOR_BGR2RGB), (518, 518), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255.0
xin = ((xin - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])).transpose(2, 0, 1)[None].astype(np.float32)
dep = cv2.resize(np.squeeze(sess.run(None, {sess.get_inputs()[0].name: xin})[0]).astype(np.float32), (cw, ch), interpolation=cv2.INTER_CUBIC)
dep = np.clip((dep - np.percentile(dep, 2)) / (np.percentile(dep, 98) - np.percentile(dep, 2) + 1e-6), 0, 1)
dep = cv2.GaussianBlur(dep, (0, 0), 8)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); cx0, cy0 = cw / 2, ch / 2
n = int(round(dur * fps)); rng = np.random.default_rng(7); ph = rng.uniform(0, 6.28, 8)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
for i in range(n):
    t = i / fps
    lt, d = lt_at(t0 + t)
    dc = disp_canvas(d)
    base = cv2.remap(canvas, Xc + dc[:, :, 0], Yc + dc[:, :, 1], cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    head = cv2.warpAffine(lt, M_lc, (cw, ch), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE).astype(np.float32)
    img = base * (1 - m) + head * m
    img = cv2.addWeighted(img, 1.35, cv2.GaussianBlur(img, (0, 0), 1.2), -0.35, 0)       # gentle sharpening
    # selfie at arm's length: slow push-in, sway, small fast jitter and a little roll; near things move more
    u = i / max(1, n - 1); e = u * u * (3 - 2 * u)
    zf, zn = 1.0 + push * 0.35 * e, 1.0 + push * e
    sx = 7 * np.sin(2 * np.pi * 0.43 * t + ph[0]) + 2.5 * np.sin(2 * np.pi * 1.7 * t + ph[1]) + 0.8 * np.sin(2 * np.pi * 4.1 * t + ph[2])
    sy = 6 * np.sin(2 * np.pi * 0.37 * t + ph[3]) + 2.2 * np.sin(2 * np.pi * 1.3 * t + ph[4]) + 0.7 * np.sin(2 * np.pi * 3.7 * t + ph[5])
    rot = np.deg2rad(0.35 * np.sin(2 * np.pi * 0.31 * t + ph[6]) + 0.12 * np.sin(2 * np.pi * 1.1 * t + ph[7]))
    rx0, ry0 = xx - W / 2, yy - H / 2
    rx, ry = rx0 * np.cos(rot) - ry0 * np.sin(rot), rx0 * np.sin(rot) + ry0 * np.cos(rot)
    dd = cv2.remap(dep, (rx / zf + cx0).astype(np.float32), (ry / zf + cy0).astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    z = zf + (zn - zf) * dd; sh = 0.3 + 0.7 * dd
    frame = cv2.remap(img, (rx / z + cx0 - sx * sh).astype(np.float32), (ry / z + cy0 - sy * sh).astype(np.float32), cv2.INTER_CUBIC,
                      borderMode=cv2.BORDER_REFLECT)
    enc.stdin.write(np.clip(frame + rng.normal(0, 2.2, frame.shape).astype(np.float32), 0, 255).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait(); print('ok', out, n)
