# Word-level timing for the captions, without a speech model: the voice-over is split at its
# pauses (energy below -42 dBFS for >= 0.17 s); each region holds a known line of the script; words
# get time in proportion to their spoken syllables, then each boundary snaps to the nearest energy
# dip within +-70 ms. Output: timeline_v3.json (seconds in the raw voice-over).
import json, re, sys, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfiltfilt

wav = sys.argv[1] if len(sys.argv) > 1 else 'audio/vo_v3_raw.wav'
LINES = [
    "Je pensais acheter une simple station météo…",
    "et en fait, c'est l'air de mon appart qui m'a scotché.",
    "Voici la Temtop W100 :",
    "un capteur pour l'extérieur, et un écran tactile pour l'intérieur.",
    "Dehors, le capteur mesure le vent et sa direction, la pluie,",
    "les UV, la luminosité et la pression.",
    "Et il envoie tout à l'écran sans fil, jusqu'à mille mètres en terrain dégagé.",
    "Dedans, l'écran de sept pouces suit en temps réel les particules fines,",
    "le CO2, les COV et l'indice de qualité de l'air.",
    "Le matin, je jette un œil au vent et à la température avant d'aller courir.",
    "Quand je cuisine, les particules grimpent :",
    "j'ai réglé un seuil, l'écran bipe…",
    "et j'ouvre la fenêtre.",
    "En télétravail, quand le CO2 monte, je sais qu'il est temps d'aérer.",
    "Il garde l'historique jour par jour, affiche la météo des sept prochains jours…",
    "et en Wi-Fi, je vois tout dans l'appli Temtop.",
    "Arrête de deviner ce que tu respires.",
    "Le lien est juste en dessous !",
]
SPECIAL = {'w100': 4, 'co2': 3, 'cov': 3, 'uv': 2, 'temtop': 2, 'wi-fi': 2, 'mille': 1, 'sept': 1, 'œil': 1,
           'appli': 2, "l'appli": 2, "jusqu'à": 2, "qu'il": 1, "c'est": 1, "l'air": 1, "m'a": 1, "j'ai": 1, "j'ouvre": 1,
           'seuil': 1, 'dehors': 2, 'dedans': 2, 'fenêtre': 2, 'monte': 1, 'grimpent': 1, 'fines': 1, 'pluie': 1}
V = 'aeiouyéèêëàâîïôûùœ'
def syl(w):
    k = re.sub(r"[^\w'’-]", '', w.lower())
    if k in SPECIAL: return SPECIAL[k]
    k = re.sub(r"^[a-z]['’]", '', k)                     # elision: l', d', j', qu'...
    k = re.sub(r'(es|e|ent)$', '', k) if len(k) > 3 and not k.endswith(('ée', 'ées')) else k
    n = len(re.findall(f'[{V}]+', k))
    return max(1, n)

sr, x = wavfile.read(wav); x = x.astype(np.float32) / 32768
if x.ndim > 1: x = x.mean(1)
hop = int(0.01 * sr)
sos = butter(4, [250, 3500], 'bandpass', fs=sr, output='sos'); xb = sosfiltfilt(sos, x)
nfr = len(x) // hop
env = np.array([np.sqrt(np.mean(xb[i * hop:(i + 1) * hop] ** 2)) for i in range(nfr)])
db = 20 * np.log10(np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(nfr)]) + 1e-9)
sil = db < -42
regions, i = [], 0
while i < nfr:                                       # speech regions separated by >= 0.17 s of silence
    if not sil[i]:
        j = i
        while j < nfr:
            if sil[j]:
                k = j
                while k < nfr and sil[k]: k += 1
                if (k - j) >= 17 or k >= nfr: break
                j = k
            else: j += 1
        regions.append((i * 0.01, j * 0.01)); i = j
    else: i += 1
regions = [r for r in regions if r[1] - r[0] > 0.15]
print('regions', len(regions), [tuple(round(v, 2) for v in r) for r in regions])
assert len(regions) == len(LINES), 'region/line mismatch'
envs = np.convolve(env, np.ones(5) / 5, 'same')
words = []
for p, ((a, b), line) in enumerate(zip(regions, LINES)):
    ws = []
    for tok in line.split():                         # a lone ':' or '!' belongs to the previous word
        if ws and not re.search(r'\w', tok): ws[-1] += '\u00a0' + tok
        else: ws.append(tok)
    wts = np.array([syl(w) + 0.35 for w in ws], float)
    edges = a + np.concatenate([[0], np.cumsum(wts)]) / wts.sum() * (b - a)
    for k in range(1, len(edges) - 1):              # snap inner boundaries to an energy dip
        c = int(round(edges[k] / 0.01)); lo, hi = max(c - 7, 0), min(c + 8, nfr)
        edges[k] = (lo + int(np.argmin(envs[lo:hi]))) * 0.01
    edges = np.maximum.accumulate(edges)
    for i2, w in enumerate(ws):
        words.append({'p': p, 'i': i2, 'w': w, 't': round(float(edges[i2]), 3), 'e': round(float(edges[i2 + 1]), 3)})
json.dump({'regions': regions, 'words': words}, open('timeline_v3.json', 'w'), ensure_ascii=False, indent=0)
print(len(words), 'words'); print(' '.join(f"{w['w']}@{w['t']:.2f}" for w in words[:20]))
