import sys, os, glob, subprocess, time
import numpy as np, torch, cv2
from spandrel import ModelLoader
torch.set_num_threads(os.cpu_count())
model = ModelLoader().load_from_file('RealESRGAN_x2plus.pth').eval()
print('model', model.architecture.name, model.scale)
for src in sorted(glob.glob('out/wan_*.mp4')):
    name = os.path.basename(src)[:-4]
    dst = f'out/up_{name}.mp4'
    if os.path.exists(dst):
        continue
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frames = []
    while True:
        ok, f = cap.read()
        if not ok: break
        frames.append(f)
    h, w = frames[0].shape[:2]
    enc = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{w*2}x{h*2}', '-r', str(fps), '-i', '-',
                            '-c:v', 'libx264', '-preset', 'slow', '-crf', '10', '-pix_fmt', 'yuv444p', dst], stdin=subprocess.PIPE)
    t = time.time()
    for i, f in enumerate(frames):
        x = torch.from_numpy(f[..., ::-1].copy()).permute(2, 0, 1).float().unsqueeze(0) / 255.0
        with torch.inference_mode():
            y = model(x)
        out = (y.squeeze(0).permute(1, 2, 0).clamp(0, 1).numpy()[..., ::-1] * 255).round().astype(np.uint8)
        enc.stdin.write(out.tobytes())
        if i % 10 == 0:
            print(name, i, len(frames), round(time.time() - t, 1), flush=True)
    enc.stdin.close(); enc.wait()
    print('done', dst, round(time.time() - t, 1))
