# 2.5D "camera move" from a single photo: monocular depth (Depth Anything V2) + depth-weighted
# warping, so near objects move more than the background, like a real handheld dolly shot.
# usage: python3 parallax.py in.png out.mp4 duration fps preset   (preset: pushin | orbit)
# model: Depth Anything V2 small ONNX, from
#   https://github.com/fabio-sim/Depth-Anything-ONNX/releases/download/v2.0.0/depth_anything_v2_vits.onnx
MODEL = os.environ.get('DEPTH_MODEL', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'depth_anything_v2_vits.onnx'))
import os, sys, numpy as np, cv2, onnxruntime as ort, subprocess

src, out, dur, fps, preset = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
W, H = 1080, 1920
img = cv2.imread(src, cv2.IMREAD_COLOR)
# upscale/crop to a slightly oversized canvas so the warp never shows borders
OS = 1.12
img = cv2.resize(img, (int(W * OS), int(round(img.shape[0] * W * OS / img.shape[1]))), interpolation=cv2.INTER_LANCZOS4)
ch = int(H * OS)
y0 = max(0, (img.shape[0] - ch) // 2)
img = img[y0:y0 + ch]
if img.shape[0] < ch:
    img = cv2.copyMakeBorder(img, 0, ch - img.shape[0], 0, 0, cv2.BORDER_REPLICATE)
h, w = img.shape[:2]

# depth
sess = ort.InferenceSession(MODEL, providers=['CPUExecutionProvider'])
inp = sess.get_inputs()[0]
sz = 518
x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (sz, sz), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255.0
x = (x - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
x = x.transpose(2, 0, 1)[None].astype(np.float32)
d = sess.run(None, {inp.name: x})[0]
d = np.squeeze(d).astype(np.float32)
d = cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC)
d = (d - np.percentile(d, 2)) / (np.percentile(d, 98) - np.percentile(d, 2) + 1e-6)
d = np.clip(d, 0, 1)  # 1 = near
d = cv2.GaussianBlur(d, (0, 0), 6)  # soften edges to avoid tearing
cv2.imwrite(out.replace('.mp4', '_depth.png'), (d * 255).astype(np.uint8))

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
cx, cy = w / 2, h / 2
n = int(round(dur * fps))

def ease(u):
    return u * u * (3 - 2 * u)

ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                       '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
for i in range(n):
    t = i / fps
    u = ease(i / max(1, n - 1))
    if preset == 'pushin':        # dolly in: near things grow faster than far things
        zoom_far, zoom_near = 1.0 + 0.025 * u, 1.0 + 0.085 * u
        px, py = -18 * u, -10 * u
    elif preset == 'orbit':       # lateral move: near layer slides against background
        zoom_far, zoom_near = 1.0 + 0.01 * u, 1.0 + 0.03 * u
        px, py = 70 * (u - 0.5), -12 * u
    else:
        zoom_far, zoom_near = 1.0, 1.04
        px, py = 0, 0
    # handheld micro-shake
    sx = 2.2 * np.sin(2 * np.pi * 0.9 * t) + 1.1 * np.sin(2 * np.pi * 2.3 * t + 1)
    sy = 1.8 * np.sin(2 * np.pi * 0.7 * t + 2) + 0.9 * np.sin(2 * np.pi * 1.9 * t)
    # backward map: output pixel -> source pixel, depth sampled at the (approximate) source position
    ox = (xx - W / 2)
    oy = (yy - H / 2)
    dd = cv2.remap(d, (ox / zoom_far + cx).astype(np.float32), (oy / zoom_far + cy).astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    zoom = zoom_far + (zoom_near - zoom_far) * dd
    shift = (0.35 + 0.65 * dd)
    mapx = (ox / zoom + cx - (px + sx) * shift).astype(np.float32)
    mapy = (oy / zoom + cy - (py + sy) * shift).astype(np.float32)
    frame = cv2.remap(img, mapx, mapy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    ff.stdin.write(frame.tobytes())
ff.stdin.close()
ff.wait()
print('ok', out, n, 'frames')
