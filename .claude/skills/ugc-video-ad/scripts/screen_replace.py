# Replace a device screen in a video with a faithful UI replica (rendered frames f_0000.png...).
# The screen is located in every frame by SIFT-matching a flat reference capture of what the screen
# shows in the source footage (e.g. the manual's screenshot of that page) against the frame; the corner
# tracks are then smoothed over time, and the replica is warped in with a panel black level and sheen.
# usage: python3 screen_replace.py in.mp4 ui_frames_dir out.mp4 ref.png [x0,y0,x1,y1] [t_in] [dur]
#   ref.png       flat capture of the screen content visible in in.mp4
#   x0,y0,x1,y1   the screen rectangle inside ref.png (default: the whole image minus 2 px)
import sys, glob, subprocess, numpy as np, cv2
from scipy.signal import savgol_filter

src, uidir, out, ref = sys.argv[1:5]
rect = [float(v) for v in sys.argv[5].split(',')] if len(sys.argv) > 5 and sys.argv[5] != '-' else None
t_in = float(sys.argv[6]) if len(sys.argv) > 6 else 0.0
dur = float(sys.argv[7]) if len(sys.argv) > 7 else None

cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS)
cap.set(cv2.CAP_PROP_POS_MSEC, t_in * 1000)
frames = []
while True:
    ok, f = cap.read()
    if not ok or (dur and len(frames) >= round(dur * fps)):
        break
    frames.append(f)
H_, W_ = frames[0].shape[:2]

flat = cv2.cvtColor(cv2.imread(ref), cv2.COLOR_BGR2GRAY)
FX0, FY0, FX1, FY1 = rect or (2, 2, flat.shape[1] - 3, flat.shape[0] - 3)   # screen rectangle inside the capture
sift = cv2.SIFT_create(6000)
k1, d1 = sift.detectAndCompute(flat, None)
bf = cv2.BFMatcher()
flat_c = np.float32([[FX0, FY0], [FX1, FY0], [FX1, FY1], [FX0, FY1]]).reshape(-1, 1, 2)

corners, prev = [], None
for f in frames:
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    k2, d2 = sift.detectAndCompute(g, None)
    m = bf.knnMatch(d1, d2, k=2)
    good = [a for a, b in m if a.distance < 0.75 * b.distance]
    H = None
    if len(good) >= 12:
        s = np.float32([k1[a.queryIdx].pt for a in good]); d = np.float32([k2[a.trainIdx].pt for a in good])
        H, mask = cv2.findHomography(s, d, cv2.RANSAC, 4.0)
        if H is not None and mask.sum() < 15:
            H = None
    c = cv2.perspectiveTransform(flat_c, H).reshape(-1, 2) if H is not None else prev
    corners.append(c if c is not None else np.zeros((4, 2), np.float32))
    prev = c
C = np.array(corners)                           # (n, 4, 2)
if len(C) >= 9:                                 # remove tracking jitter, keep real camera motion
    C = savgol_filter(C, 9 if len(C) >= 9 else len(C) // 2 * 2 + 1, 2, axis=0)

ui = sorted(glob.glob(uidir + '/f_*.png'))
uh, uw = cv2.imread(ui[0]).shape[:2]
ui_c = np.float32([[0, 0], [uw, 0], [uw, uh], [0, uh]])
white = np.full((uh, uw), 255, np.uint8)
yy, xx = np.mgrid[0:uh, 0:uw].astype(np.float32)
sheen = (np.clip(1.0 - (xx / uw * 0.8 + yy / uh * 0.6), 0, 1) ** 2 * 18).astype(np.float32)  # glass reflection

enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W_}x{H_}', '-r', str(fps), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
rng = np.random.default_rng(3)
for i, f in enumerate(frames):
    u = cv2.imread(ui[min(i, len(ui) - 1)]).astype(np.float32)
    u = u * 0.93 + 7 + sheen[:, :, None]          # screens never render pure black on camera
    M = cv2.getPerspectiveTransform(ui_c, C[i].astype(np.float32))
    wu = cv2.warpPerspective(u, M, (W_, H_), flags=cv2.INTER_AREA)
    wm = cv2.warpPerspective(white, M, (W_, H_)).astype(np.float32) / 255
    wm = cv2.GaussianBlur(wm, (0, 0), 0.9)[:, :, None]
    wu = cv2.GaussianBlur(wu, (0, 0), 0.6) + rng.normal(0, 2.0, wu.shape).astype(np.float32)
    o = f.astype(np.float32) * (1 - wm) + wu * wm
    enc.stdin.write(np.clip(o, 0, 255).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait()
print('ok', out, len(frames), 'frames @', fps)
