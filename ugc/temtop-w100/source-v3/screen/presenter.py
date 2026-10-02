# "Living photo" for the presenter keyframes: the W100 screen is replaced by the exact UI replica,
# the eyes blink, and a 2.5D handheld selfie camera (monocular depth) moves the scene.
# usage: python3 presenter.py kf.png quad.npy ui.png out.mp4 dur fps blink_times eyes_json [push]
import sys, json, subprocess, numpy as np, cv2, onnxruntime as ort

src, quadf, uif, out = sys.argv[1:5]
dur, fps = float(sys.argv[5]), int(sys.argv[6])
blinks = [float(x) for x in sys.argv[7].split(',') if x]
eyes = json.loads(sys.argv[8])                  # [[cx, cy, a, b_up, b_low], ...] in keyframe pixels
push = float(sys.argv[9]) if len(sys.argv) > 9 else 0.06
W, H = 1080, 1920
kf = cv2.imread(src)

# 1) exact screen: warp the UI render onto the screen quad (supersampled), camera-matched
quad = np.load(quadf).astype(np.float32)
ui = cv2.imread(uif).astype(np.float32); uh, uw = ui.shape[:2]
yy, xx = np.mgrid[0:uh, 0:uw].astype(np.float32)
sheen = (np.clip(1.0 - (xx / uw * 0.8 + yy / uh * 0.6), 0, 1) ** 2 * 16)[:, :, None]
ui = ui * 0.9 + 9 + sheen
SS = 3
big = cv2.resize(kf, None, fx=SS, fy=SS, interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [uw, 0], [uw, uh], [0, uh]]), quad * SS)
wu = cv2.warpPerspective(ui, M, (big.shape[1], big.shape[0]), flags=cv2.INTER_AREA)
wm = cv2.warpPerspective(np.full((uh, uw), 255, np.uint8), M, (big.shape[1], big.shape[0])).astype(np.float32) / 255
wm = cv2.GaussianBlur(wm, (0, 0), 1.2)[:, :, None]
# keep the glass reflections of the original screen (high-pass of its luminance)
g0 = cv2.cvtColor(big.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
refl = np.clip(g0 - cv2.GaussianBlur(g0, (0, 0), 25), 0, None)[:, :, None] * 0.0 + np.clip(cv2.GaussianBlur(g0, (0, 0), 25) - 40, 0, None)[:, :, None] * 0.25
big = big * (1 - wm) + (wu + refl) * wm
kf = cv2.resize(big, (kf.shape[1], kf.shape[0]), interpolation=cv2.INTER_AREA)
kf = np.clip(kf + np.random.default_rng(1).normal(0, 1.6, kf.shape) * wm[::SS, ::SS][:kf.shape[0], :kf.shape[1]] if False else kf, 0, 255).astype(np.uint8)

# 2) canvas: upscale to an oversized 9:16 canvas so the camera motion never shows borders
OS = 1.12
s = W * OS / kf.shape[1]
img = cv2.resize(kf, (int(round(W * OS)), int(round(kf.shape[0] * s))), interpolation=cv2.INTER_LANCZOS4)
blur = cv2.GaussianBlur(img, (0, 0), 1.2); img = cv2.addWeighted(img, 1.35, blur, -0.35, 0)   # gentle sharpening
ch = int(H * OS); y0 = max(0, (img.shape[0] - ch) // 2); img = img[y0:y0 + ch]
if img.shape[0] < ch: img = cv2.copyMakeBorder(img, 0, ch - img.shape[0], 0, 0, cv2.BORDER_REPLICATE)
h, w = img.shape[:2]
E = [[e[0] * s, e[1] * s - y0, e[2] * s, e[3] * s, e[4] * s] for e in eyes]

def blink(im, p):
    if p <= 0: return im
    o = im.copy()
    for cx, cy, a, bu, bl in E:
        x0, x1 = int(cx - a - 2), int(cx + a + 3); ytop0 = int(cy - 3.4 * bu - 4); ybot = int(cy + bl + 4)
        roi = im[ytop0:ybot, x0:x1].astype(np.float32); rh, rw = roi.shape[:2]
        X = np.arange(rw, dtype=np.float32) + x0; t = np.clip((X - cx) / a, -1, 1); wv = np.sqrt(np.clip(1 - t * t, 0, 1))
        yu = cy - bu * wv; ycl = cy + 0.8 * bl * wv; ylid = yu + p * (ycl - yu); ytop = yu - 2.2 * bu * wv - 3
        Y = np.arange(rh, dtype=np.float32)[:, None] + ytop0
        sy = np.where(Y <= ylid[None, :], ytop[None, :] + (Y - ytop[None, :]) * (yu - ytop)[None, :] / np.maximum(ylid - ytop, 1e-3)[None, :], Y)
        sy = np.where(Y < ytop[None, :], Y, sy)
        mapx = np.repeat((X - x0)[None, :], rh, 0).astype(np.float32); mapy = (sy - ytop0).astype(np.float32)
        warped = cv2.remap(roi, mapx, mapy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        # closed lid gets a touch darker along the lash line
        lash = np.exp(-((Y - ylid[None, :]) / 1.6) ** 2) * (p ** 2) * 0.22
        warped = warped * (1 - lash[:, :, None])
        wx = np.clip(wv * 2.2, 0, 1)[None, :, None]
        wy = np.clip((Y - (ytop0 + 2)) / 6, 0, 1)[:, :, None] * np.clip((ybot - 1 - Y) / 4, 0, 1)[:, :, None]
        wgt = wx * wy
        o[ytop0:ybot, x0:x1] = np.clip(roi * (1 - wgt) + warped * wgt, 0, 255).astype(np.uint8)
    return o

def blink_p(t):
    for tb in blinks:
        u = (t - tb) / 0.16
        if 0 <= u <= 1: return float(np.interp(u, [0, 0.35, 0.5, 0.75, 1], [0, 0.95, 1.0, 0.5, 0]))
    return 0.0

# 3) depth for the 2.5D move
sess = ort.InferenceSession(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', 'models', 'depth_anything_v2_vits.onnx'), providers=['CPUExecutionProvider'])
x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (518, 518), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255.0
x = ((x - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])).transpose(2, 0, 1)[None].astype(np.float32)
d = cv2.resize(np.squeeze(sess.run(None, {sess.get_inputs()[0].name: x})[0]).astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
d = np.clip((d - np.percentile(d, 2)) / (np.percentile(d, 98) - np.percentile(d, 2) + 1e-6), 0, 1)
d = cv2.GaussianBlur(d, (0, 0), 8)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); cx0, cy0 = w / 2, h / 2
n = int(round(dur * fps)); rng = np.random.default_rng(7)
ph = rng.uniform(0, 6.28, 8)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
for i in range(n):
    t = i / fps; u = i / max(1, n - 1); e = u * u * (3 - 2 * u)
    zf, zn = 1.0 + push * 0.35 * e, 1.0 + push * e
    # selfie at arm's length: slow sway + small fast jitter + a little roll
    sx = 7 * np.sin(2 * np.pi * 0.43 * t + ph[0]) + 2.5 * np.sin(2 * np.pi * 1.7 * t + ph[1]) + 0.8 * np.sin(2 * np.pi * 4.1 * t + ph[2])
    sy = 6 * np.sin(2 * np.pi * 0.37 * t + ph[3]) + 2.2 * np.sin(2 * np.pi * 1.3 * t + ph[4]) + 0.7 * np.sin(2 * np.pi * 3.7 * t + ph[5])
    rot = np.deg2rad(0.35 * np.sin(2 * np.pi * 0.31 * t + ph[6]) + 0.12 * np.sin(2 * np.pi * 1.1 * t + ph[7]))
    ox, oy = xx - W / 2, yy - H / 2
    rx, ry = ox * np.cos(rot) - oy * np.sin(rot), ox * np.sin(rot) + oy * np.cos(rot)
    dd = cv2.remap(d, (rx / zf + cx0).astype(np.float32), (ry / zf + cy0).astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    z = zf + (zn - zf) * dd; sh = 0.3 + 0.7 * dd
    mapx = (rx / z + cx0 - sx * sh).astype(np.float32); mapy = (ry / z + cy0 - sy * sh).astype(np.float32)
    frame = cv2.remap(blink(img, blink_p(t)), mapx, mapy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    grain = rng.normal(0, 2.2, frame.shape).astype(np.float32)
    enc.stdin.write(np.clip(frame.astype(np.float32) + grain, 0, 255).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait(); print('ok', out, n)
