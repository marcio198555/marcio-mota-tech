# Final picture: footage track (work/base_v3.mp4) + light animated film grain + RGBA motion-graphics
# overlay frames, muxed with the mastered soundtrack -> 1080x1920 H.264/AAC, BT.709-tagged.
import subprocess, sys, os, numpy as np, cv2
S = os.path.dirname(os.path.abspath(__file__)) + '/work'
OUT = sys.argv[1]
SFX = '_noavatar' if sys.argv[2:] == ['noavatar'] else ''        # edit without the AI presenter
W, H, FPS = 1080, 1920, 30
NF = int(round(54.0 * FPS))
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', f'{S}/base_v3{SFX}.mp4', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-i', f'{S}/mix_master{SFX}.wav',
                        '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-profile:v', 'high', '-level', '4.2',
                        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
rng = np.random.default_rng(1)
for i in range(NF):
    base = np.frombuffer(dec.stdout.read(W * H * 3), np.uint8).reshape(H, W, 3).astype(np.float32)
    g = cv2.resize(rng.standard_normal((H // 2, W // 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    base += (g * 2.0)[:, :, None]
    ov = cv2.imread(f'{S}/oframes{SFX}/o_{i:05d}.png', cv2.IMREAD_UNCHANGED).astype(np.float32)
    a = ov[:, :, 3:4] * (1 / 255.0)
    out = ov[:, :, :3] * a + base * (1 - a)
    enc.stdin.write(np.clip(out + 0.5, 0, 255).astype(np.uint8).tobytes())
    if i % 300 == 0: print('frame', i, flush=True)
enc.stdin.close(); enc.wait(); dec.wait()
print('done', OUT)
