# Like screen_replace.py, but keeps whatever is in front of the screen (a finger touching it).
# The occluder is found per frame as the part of the screen that does not match the official
# home-screen capture warped onto it, grown from the screen border where the hand enters.
# usage: python3 screen_replace_occ.py in.mp4 ui_frames_dir out.mp4 [mask_debug.png]
import sys, glob, subprocess, numpy as np, cv2
from scipy.signal import savgol_filter

V3 = __import__('os').path.dirname(__import__('os').path.abspath(__file__))
src, uidir, out = sys.argv[1], sys.argv[2], sys.argv[3]
dbg = sys.argv[4] if len(sys.argv) > 4 else None
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS)
frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
H_, W_ = frames[0].shape[:2]
flat_c3 = cv2.imread(V3 + '/refs/flat_home.png')
flat = cv2.cvtColor(flat_c3, cv2.COLOR_BGR2GRAY)
FX0, FY0, FX1, FY1 = 3, 2, 959, 557
sift = cv2.SIFT_create(6000); k1, d1 = sift.detectAndCompute(flat, None); bf = cv2.BFMatcher()
flat_c = np.float32([[FX0, FY0], [FX1, FY0], [FX1, FY1], [FX0, FY1]]).reshape(-1, 1, 2)
Hs, corners, prev = [], [], None
for f in frames:
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY); k2, d2 = sift.detectAndCompute(g, None)
    good = [a for a, b in bf.knnMatch(d1, d2, k=2) if a.distance < 0.75 * b.distance]
    H = None
    if len(good) >= 12:
        s = np.float32([k1[a.queryIdx].pt for a in good]); d = np.float32([k2[a.trainIdx].pt for a in good])
        H, m = cv2.findHomography(s, d, cv2.RANSAC, 4.0)
        if H is not None and m.sum() < 15: H = None
    if H is None: H = prev
    Hs.append(H); prev = H
    corners.append(cv2.perspectiveTransform(flat_c, H).reshape(-1, 2))
C = savgol_filter(np.array(corners), 9, 2, axis=0) if len(corners) >= 9 else np.array(corners)

ui = sorted(glob.glob(uidir + '/f_*.png')); uh, uw = cv2.imread(ui[0]).shape[:2]
ui_c = np.float32([[0, 0], [uw, 0], [uw, uh], [0, uh]])
white = np.full((uh, uw), 255, np.uint8)
yy, xx = np.mgrid[0:uh, 0:uw].astype(np.float32)
sheen = (np.clip(1.0 - (xx / uw * 0.8 + yy / uh * 0.6), 0, 1) ** 2 * 18).astype(np.float32)
fw = np.full(flat.shape, 255, np.uint8)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W_}x{H_}', '-r', str(fps), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
rng = np.random.default_rng(3)
for i, f in enumerate(frames):
    # 1) occluder mask: original frame vs official capture warped with this frame's homography
    ref = cv2.warpPerspective(flat_c3, Hs[i], (W_, H_), flags=cv2.INTER_LINEAR)
    inside = cv2.warpPerspective(fw, Hs[i], (W_, H_)) > 128
    inside = cv2.erode(inside.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    fb = cv2.GaussianBlur(f, (0, 0), 2.0).astype(np.int16); rb = cv2.GaussianBlur(ref, (0, 0), 2.0).astype(np.int16)
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    skin = (hsv[..., 2] > 70) & (hsv[..., 0] < 25) & (hsv[..., 1] > 40) & (hsv[..., 1] < 200)
    diff = np.abs(fb - rb).max(axis=2) > 60
    occ = (skin & diff & inside).astype(np.uint8)
    occ = cv2.morphologyEx(occ, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    occ = cv2.morphologyEx(occ, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(occ)
    keep = np.zeros_like(occ)
    if n > 1:
        big = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); keep[lab == big] = 1
    # the hand continues outside the screen: everything outside the quad stays original anyway
    keep = cv2.dilate(keep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))   # take the finger's soft edge too
    occf = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 2.4)[:, :, None]
    # 2) new UI, as in screen_replace.py
    u = cv2.imread(ui[min(i, len(ui) - 1)]).astype(np.float32) * 0.93 + 7 + sheen[:, :, None]
    M = cv2.getPerspectiveTransform(ui_c, C[i].astype(np.float32))
    wu = cv2.warpPerspective(u, M, (W_, H_), flags=cv2.INTER_AREA)
    wm = cv2.GaussianBlur(cv2.warpPerspective(white, M, (W_, H_)).astype(np.float32) / 255, (0, 0), 0.9)[:, :, None]
    wu = cv2.GaussianBlur(wu, (0, 0), 0.6) + rng.normal(0, 2.0, wu.shape).astype(np.float32)
    o = f.astype(np.float32) * (1 - wm) + wu * wm
    o = o * (1 - occf) + f.astype(np.float32) * occf
    if dbg and i == len(frames) // 2:
        v = f.copy(); v[keep > 0] = (0, 0, 255); cv2.imwrite(dbg, np.hstack([v, np.clip(o, 0, 255).astype(np.uint8)]))
    enc.stdin.write(np.clip(o, 0, 255).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait(); print('ok', out, len(frames))
