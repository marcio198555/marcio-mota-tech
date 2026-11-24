# Footage track of the v3 ad (pictures only, no text): every shot is decoded at 30 fps, cropped to
# 1080x1920 (landscape stock is cropped to a 9:16 window around the subject), given a slow zoom and a
# short punch-in on the cut, and written in order to work/base_v3.mp4.
import os, sys, subprocess, numpy as np, cv2

S = os.path.dirname(os.path.abspath(__file__))
os.makedirs(S + '/work', exist_ok=True)
W, H, FPS, DUR = 1080, 1920, 30, 54.0
C, ST = S + '/clips/', S + '/stock/'

# (t0, t1, source, in_point, zoom_from, zoom_to, center_x, center_y, punch, crop_center_x_for_landscape)
SHOTS = [
    (0.00, 3.55, C + 'P_hook.mp4', 0.00, 1.00, 1.00, .50, .50, False, None),         # presenter talking, selfie
    (3.55, 5.05, C + 'K04_aq_cook.mp4', 2.20, 1.00, 1.05, .50, .55, True, None),     # red reading: "scotché"
    (5.05, 7.10, C + 'K04_home.mp4', 0.00, 1.00, 1.04, .50, .58, True, None),        # reveal, home screen
    (7.10, 8.35, C + 'K03_par.mp4', 0.20, 1.00, 1.03, .50, .45, True, None),         # outdoor sensor
    (8.35, 10.30, C + 'K07_home.mp4', 0.00, 1.00, 1.03, .50, .50, True, None),       # touch screen
    (10.30, 13.00, C + 'K05_omni.mp4', 0.25, 1.00, 1.06, .50, .42, True, None),      # wind, rain
    (13.00, 16.40, ST + 'sun.mp4', 0.50, 1.00, 1.08, .50, .50, True, None),          # UV, light, pressure
    (16.40, 20.15, 'SPLIT', 0.00, 1.00, 1.00, .50, .50, True, None),                 # LoRa link
    (20.15, 24.00, C + 'K04z_aq_good.mp4', 0.00, 1.00, 1.03, .50, .50, True, None),  # indoor air
    (24.00, 27.45, C + 'K04zz_aq_good.mp4', 0.40, 1.00, 1.03, .50, .50, True, None), # CO2, TVOC, AQI
    (27.45, 29.85, C + 'K04z_home.mp4', 0.30, 1.00, 1.03, .50, .50, True, None),     # wind + temperature
    (29.85, 31.40, ST + 'run2.mp4', 4.60, 1.00, 1.02, .50, .50, True, 0.33),         # run by the lake
    (31.40, 32.60, ST + 'pan.mp4', 1.00, 1.00, 1.05, .50, .55, True, None),          # cooking
    (32.60, 33.85, C + 'K04z_aq_cook.mp4', 0.50, 1.00, 1.03, .50, .50, True, None),  # particles climb
    (33.85, 35.25, C + 'K04z_alerts.mp4', 0.65, 1.00, 1.03, .50, .50, True, None),   # threshold set
    (35.25, 35.95, C + 'K04z_aq_cook.mp4', 2.45, 1.08, 1.13, .42, .40, True, None),  # alarm flashing
    (35.95, 37.45, ST + 'window2.mp4', 9.50, 1.00, 1.04, .50, .50, True, (0.60, 0.47)),  # opens the window (crop pans to the pane)
    (37.45, 39.10, ST + 'typing.mp4', 1.00, 1.00, 1.05, .50, .55, True, None),       # home office
    (39.10, 41.25, C + 'K04z_aq_co2.mp4', 0.90, 1.00, 1.03, .50, .50, True, None),   # CO2 climbs
    (41.25, 43.25, C + 'K04z_chart.mp4', 0.00, 1.00, 1.03, .50, .50, True, None),    # history
    (43.25, 45.15, C + 'K04z_fc.mp4', 0.00, 1.00, 1.03, .50, .50, True, None),       # 7-day forecast
    (45.15, 47.95, ST + 'phone.mp4', 0.50, 1.00, 1.05, .50, .50, True, 0.52),        # app
    (47.95, 51.40, C + 'P_cta.mp4', 0.00, 1.00, 1.00, .50, .50, False, None),        # presenter, CTA
    (51.40, 54.00, 'BLUR:' + C + 'K04_home.mp4', 0.30, 1.10, 1.20, .50, .55, False, None),  # end card backdrop
]

# Same edit without the AI presenter (python3 build_base_v3.py noavatar): product and ambience shots instead.
NOAV = sys.argv[1:] == ['noavatar']
if NOAV:
    SHOTS[0:1] = [(0.00, 2.30, C + 'K04z_home.mp4', 1.60, 1.00, 1.07, .50, .55, False, None),  # the weather screen
                  (2.30, 3.55, ST + 'dustB.mp4', 0.40, 1.00, 1.08, .55, .55, True, None)]       # "l'air de mon appart"
    SHOTS[-2] = (47.95, 51.40, C + 'K04_aq_good.mp4', 0.30, 1.00, 1.08, .50, .58, True, None)  # green air: "arrête de deviner"


def decode(src, t_in, n, crop_cx=None):
    """n frames at 30 fps from src starting at t_in, as 1080x1920. crop_cx: 9:16 window centre (fraction of
    the width) for landscape sources, or (from, to) to pan the window across the shot."""
    if isinstance(crop_cx, tuple):
        c0, c1 = crop_cx; cx = f'({c0}+({c1 - c0})*min(1,t/{n / FPS:.3f}))'
    else:
        cx = crop_cx
    pre = f"crop='ih*9/16':ih:'max(0,min(iw-ow,iw*{cx}-ow/2))':0," if crop_cx is not None else ''
    vf = pre + f'fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},setsar=1'
    p = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t_in:.3f}', '-i', src, '-frames:v', str(n), '-vf', vf,
                        '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
    fr = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
    if len(fr) < n:
        fr = np.concatenate([fr, np.repeat(fr[-1:], n - len(fr), axis=0)])
    return fr


def zoomed(img, z, cx, cy):
    if abs(z - 1) < 1e-4 and abs(cx - .5) < 1e-4 and abs(cy - .5) < 1e-4:
        return img
    hw, hh = W / (2 * z), H / (2 * z)
    px = min(max(cx * W, hw), W - hw); py = min(max(cy * H, hh), H - hh)
    M = np.float32([[z, 0, W / 2 - z * px], [0, z, H / 2 - z * py]])
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)


enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', S + ('/work/base_v3_noavatar.mp4' if NOAV else '/work/base_v3.mp4')], stdin=subprocess.PIPE)
total = 0
for (t0, t1, src, tin, z0, z1, cx, cy, punch, ccx) in SHOTS:
    n = int(round(t1 * FPS)) - int(round(t0 * FPS))
    if src == 'SPLIT':   # outdoor sensor on top, display at the bottom: the radio link between them
        top = decode(C + 'K03_par4.mp4', 0.0, n); bot = decode(C + 'K04_home.mp4', 0.0, n)
        frames = np.empty((n, H, W, 3), np.uint8)
        frames[:, :H // 2] = top[:, 300:300 + H // 2]
        frames[:, H // 2:] = bot[:, 620:620 + H // 2]
    elif src.startswith('BLUR:'):
        frames = decode(src[5:], tin, n)
    else:
        frames = decode(src, tin, n, ccx)
    for i in range(n):
        u = i / max(1, n - 1)
        z = z0 + (z1 - z0) * u
        if punch:            # short punch-in on the cut, UGC style
            z *= 1 + 0.05 * max(0.0, 1 - (i / FPS) / 0.2) ** 2
        f = zoomed(frames[i], z, cx, cy)
        if src.startswith('BLUR:'):
            f = cv2.GaussianBlur(f, (0, 0), 22)
        enc.stdin.write(np.ascontiguousarray(f).tobytes())
    total += n
    print(f'{t0:6.2f}-{t1:6.2f} {n:3d}f  {src.split("/")[-1]}', flush=True)
enc.stdin.close(); enc.wait()
print('frames', total, 'expected', int(round(DUR * FPS)))
