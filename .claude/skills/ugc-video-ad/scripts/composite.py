# Final picture: footage track + light animated film grain + RGBA motion-graphics frames (o_00000.png...),
# muxed with the mastered soundtrack -> H.264 High (CRF 19) / AAC 192k, BT.709-tagged, faststart.
# usage: python3 composite.py base.mp4 overlay_frames_dir mix_master.wav out.mp4 [grain=2.0]
import subprocess, sys, os, numpy as np, cv2

base_mp4, odir, mix, OUT = sys.argv[1:5]
grain = float(sys.argv[5]) if len(sys.argv) > 5 else 2.0
probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,nb_frames',
                        '-of', 'csv=p=0', base_mp4], capture_output=True, text=True, check=True).stdout.strip().split(',')
W, H = int(probe[0]), int(probe[1]); num, den = map(int, probe[2].split('/')); FPS = num / den
NF = len([f for f in os.listdir(odir) if f.startswith('o_') and f.endswith('.png')])
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', base_mp4, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', f'{FPS:g}', '-i', '-',
                        '-i', mix, '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-profile:v', 'high', '-level', '4.2',
                        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
rng = np.random.default_rng(1)
for i in range(NF):
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    base = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    g = cv2.resize(rng.standard_normal((H // 2, W // 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    base += (g * grain)[:, :, None]
    ov = cv2.imread(f'{odir}/o_{i:05d}.png', cv2.IMREAD_UNCHANGED).astype(np.float32)
    a = ov[:, :, 3:4] * (1 / 255.0)
    enc.stdin.write(np.clip(ov[:, :, :3] * a + base * (1 - a) + 0.5, 0, 255).astype(np.uint8).tobytes())
    if i % 300 == 0: print('frame', i, flush=True)
enc.stdin.close(); enc.wait(); dec.terminate()
print('done', OUT)
