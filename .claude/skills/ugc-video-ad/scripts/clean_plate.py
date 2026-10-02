# Removes an object from a keyframe by filling its polygon from the surrounding out-of-focus background: a
# membrane (Laplace) fill that matches the background exactly at the border of the hole, then grain matched to
# the neighbourhood. Used for the CTA frame, where the W100 floated in mid-air under the pointing finger: the
# finger now points at the "link below" button instead.
# usage: python3 clean_plate.py in.png out.png remove_poly_json [no_source_poly_json ...]
#   remove_poly      polygon to fill (keyframe pixels)
#   no_source_poly   areas the fill must neither touch nor sample (e.g. the sweater next to the object)
import sys, json, numpy as np, cv2
from scipy.sparse import coo_matrix
from scipy.sparse.linalg import spsolve

src, out, rem = sys.argv[1], sys.argv[2], np.int32(json.loads(sys.argv[3]))
img = cv2.imread(src).astype(np.float32); h, w = img.shape[:2]
hole = np.zeros((h, w), np.uint8); cv2.fillPoly(hole, [rem], 255)
hole = cv2.dilate(hole, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
keep_out = np.zeros((h, w), np.uint8)
for p in sys.argv[4:]:
    cv2.fillPoly(keep_out, [np.int32(json.loads(p))], 255)
hole[keep_out > 0] = 0

# Laplace equation inside the hole; known pixels are fixed values, no-source pixels and the frame edge act as
# insulating (zero-gradient) borders so nothing bleeds in from them
ys, xs = np.nonzero(hole); idx = -np.ones((h, w), np.int64); idx[ys, xs] = np.arange(len(ys))
rows, cols, vals = [], [], []; b = np.zeros((len(ys), 3)); diag = np.zeros(len(ys))
for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
    ny, nx = ys + dy, xs + dx
    ok = (ny >= 0) & (ny < h) & (nx >= 0) & (nx < w)
    ny_, nx_ = np.clip(ny, 0, h - 1), np.clip(nx, 0, w - 1)
    ok &= keep_out[ny_, nx_] == 0
    inside = ok & (hole[ny_, nx_] > 0); fixed = ok & (hole[ny_, nx_] == 0)
    diag += ok
    rows.append(np.nonzero(inside)[0]); cols.append(idx[ny_[inside], nx_[inside]]); vals.append(-np.ones(inside.sum()))
    b[fixed] += img[ny_[fixed], nx_[fixed]]
A = coo_matrix((np.concatenate([diag] + vals), (np.concatenate([np.arange(len(ys))] + rows), np.concatenate([np.arange(len(ys))] + cols))),
               shape=(len(ys), len(ys))).tocsc()
fill = img.copy()
for c in range(3):
    fill[ys, xs, c] = spsolve(A, b[:, c])

# grain: the hole gets noise with the same strength as the background around it
ring = (cv2.dilate(hole, np.ones((41, 41), np.uint8)) > 0) & (hole == 0) & (keep_out == 0)
hp = (img - cv2.GaussianBlur(img, (0, 0), 2.0))[ring]
sd = 1.4826 * np.median(np.abs(hp - np.median(hp, 0)), 0)                # robust: ignores the edges in the ring
noise = cv2.GaussianBlur(np.random.default_rng(3).normal(0, 1, img.shape).astype(np.float32), (0, 0), 0.7)
noise *= sd / max(noise.std(), 1e-6)
a = cv2.GaussianBlur(hole.astype(np.float32) / 255, (0, 0), 1.5)[:, :, None]
res = fill + noise * a                                # fill == img outside the hole; grain fades in at its border
# soften the new contact between the fill and a no-source area (an out-of-focus edge, like the rest of the frame)
k3 = np.ones((7, 7), np.uint8)
band = cv2.GaussianBlur(((cv2.dilate(hole, k3) > 0) & (cv2.dilate(keep_out, k3) > 0)).astype(np.float32), (0, 0), 1.5)[:, :, None]
res = res * (1 - band) + cv2.GaussianBlur(res, (0, 0), 1.6) * band
cv2.imwrite(out, np.clip(res, 0, 255).astype(np.uint8))
print('filled', len(ys), 'px; grain', np.round(sd, 2).tolist())
