# Word-level timing for captions, without a speech model. The voice-over is split at its pauses (energy below
# --thresh dBFS for >= --min-pause s); each speech region must hold one line of the script (one line per breath).
# Words get time in proportion to their spoken syllables, then each boundary snaps to the nearest energy dip
# within +-70 ms. A lone ':' '!' '?' joins the previous word.
# usage: python3 align_words.py vo.wav script.txt timeline.json [--js timeline.js --offset 0.25] [--special syl.json]
#   timeline.json  {"regions": [[t0, t1], ...], "words": [{"p": line, "i": index, "w": word, "t": start, "e": end}]}
#                  times in seconds of the raw voice-over
#   timeline.js    window.TL = {...} for the overlay page, with --offset (where the voice starts in the video) added
#   syl.json       {"word": syllables} overrides for brand names, numbers and acronyms ("w100": 4, "co2": 3)
# If the region count does not match the line count, the script prints both: merge or split lines (or tune
# --min-pause) until they match.
import argparse, json, re, subprocess, numpy as np
from scipy.signal import butter, sosfiltfilt

ap = argparse.ArgumentParser()
ap.add_argument('wav'); ap.add_argument('script'); ap.add_argument('out')
ap.add_argument('--js'); ap.add_argument('--offset', type=float, default=0.0)
ap.add_argument('--special'); ap.add_argument('--min-pause', type=float, default=0.17); ap.add_argument('--thresh', type=float, default=-42)
a = ap.parse_args()
LINES = [l.strip() for l in open(a.script, encoding='utf-8') if l.strip()]
SPECIAL = json.load(open(a.special, encoding='utf-8')) if a.special else {}
V = 'aeiouyéèêëàâîïôûùœæáíóúü'


def syl(w):
    k = re.sub(r"[^\w'’-]", '', w.lower())
    if k in SPECIAL: return SPECIAL[k]
    if re.fullmatch(r'\d+', k): return max(1, len(k))                 # rough: one syllable per digit
    k = re.sub(r"^[a-z]['’]", '', k)                                     # elision: l', d', j', qu'...
    k = re.sub(r'(es|e|ent)$', '', k) if len(k) > 3 and not k.endswith(('ée', 'ées')) else k   # silent French endings
    return max(1, len(re.findall(f'[{V}]+', k)))


SR = 16000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.wav, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
hop = int(0.01 * SR); nfr = len(x) // hop
xb = sosfiltfilt(butter(4, [250, 3500], 'bandpass', fs=SR, output='sos'), x)
env = np.array([np.sqrt(np.mean(xb[i * hop:(i + 1) * hop] ** 2)) for i in range(nfr)])
db = 20 * np.log10(np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(nfr)]) + 1e-9)
sil = db < a.thresh; gap = int(round(a.min_pause / 0.01))
regions, i = [], 0
while i < nfr:
    if not sil[i]:
        j = i
        while j < nfr:
            if sil[j]:
                k = j
                while k < nfr and sil[k]: k += 1
                if (k - j) >= gap or k >= nfr: break
                j = k
            else: j += 1
        regions.append((i * 0.01, j * 0.01)); i = j
    else: i += 1
regions = [r for r in regions if r[1] - r[0] > 0.15]
if len(regions) != len(LINES):
    print('regions', len(regions), [tuple(round(v, 2) for v in r) for r in regions])
    print('lines  ', len(LINES)); raise SystemExit('region/line mismatch: adjust the script lines or --min-pause')
envs = np.convolve(env, np.ones(5) / 5, 'same'); words = []
for p, ((r0, r1), line) in enumerate(zip(regions, LINES)):
    ws = []
    for tok in line.split():
        if ws and not re.search(r'\w', tok): ws[-1] += ' ' + tok
        else: ws.append(tok)
    wts = np.array([syl(w) + 0.35 for w in ws], float)
    edges = r0 + np.concatenate([[0], np.cumsum(wts)]) / wts.sum() * (r1 - r0)
    for k in range(1, len(edges) - 1):
        c = int(round(edges[k] / 0.01)); lo, hi = max(c - 7, 0), min(c + 8, nfr)
        edges[k] = (lo + int(np.argmin(envs[lo:hi]))) * 0.01
    edges = np.maximum.accumulate(edges)
    for i2, w in enumerate(ws):
        words.append({'p': p, 'i': i2, 'w': w, 't': round(float(edges[i2]), 3), 'e': round(float(edges[i2 + 1]), 3)})
json.dump({'regions': regions, 'words': words}, open(a.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
if a.js:
    ws = [{**w, 't': round(w['t'] + a.offset, 3), 'e': round(w['e'] + a.offset, 3)} for w in words]
    open(a.js, 'w', encoding='utf-8').write('window.TL=%s;\n' % json.dumps({'words': ws}, ensure_ascii=False))
print(len(words), 'words in', len(regions), 'lines ->', a.out)
