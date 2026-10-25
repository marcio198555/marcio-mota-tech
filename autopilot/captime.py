"""Calage des sous-titres mot à mot, sans reconnaissance vocale.

Principe : on repère dans la voix off les îlots de parole (les silences sont sautés), puis on répartit
les mots de chaque phrase sur la parole selon leur nombre de syllabes prononcées (« 20 000 mAh » compte
comme « vingt mille milliampères-heure »). Les changements de carton (« | » dans le texte affiché, ou
ajoutés automatiquement quand une phrase ferait plus de 2 lignes) sont calés sur une vraie pause.
Les unités restent collées à leur nombre, la ponctuation à son mot, et quelques expressions
(« je mesure tout », « Black Friday »…) ne sont jamais coupées.

python3 captime.py --timeline timeline.json --vo vo.wav --out timeline_words.json [--size 64 --maxw 800]
"""
import argparse
import json
import re
import wave

import numpy as np
from PIL import ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("--timeline", required=True)
ap.add_argument("--vo", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--size", type=int, default=64)
ap.add_argument("--maxw", type=float, default=800)
ap.add_argument("--maxlines", type=int, default=2)
ap.add_argument("--font", default="/usr/share/fonts/opentype/inter/InterDisplay-Black.otf")
a = ap.parse_args()

NNBSP, NBSP = " ", " "
FONT = ImageFont.truetype(a.font, a.size)
SPACE_W = FONT.getlength(" ")

# ---------- nombres et unités prononcés ----------
U = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze",
     "treize", "quatorze", "quinze", "seize"]
TENS = {2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante", 8: "quatre-vingt"}


def below100(n):
    if n < 17:
        return U[n]
    if n < 20:
        return "dix-" + U[n - 10]
    t, u = divmod(n, 10)
    if t in (7, 9):
        base = "soixante" if t == 7 else "quatre-vingt"
        return base + ("-et-" if (t == 7 and u == 1) else "-") + below100(10 + u)
    if u == 0:
        return TENS[t] + ("s" if t == 8 else "")
    return TENS[t] + ("-et-un" if (u == 1 and t != 8) else "-" + U[u])


def below1000(n):
    h, r = divmod(n, 100)
    s = "" if h == 0 else ("cent" if h == 1 else U[h] + " cent")
    if r:
        s += " " + below100(r)
    return s.strip() or "zéro"


def spell(n):
    if n >= 1_000_000:
        m, r = divmod(n, 1_000_000)
        return below1000(m) + " million " + (spell(r) if r else "")
    if n >= 1000:
        th, r = divmod(n, 1000)
        return ("mille" if th == 1 else below1000(th) + " mille") + (" " + below1000(r) if r else "")
    return below1000(n)


UNITS = {"mah": "milliampères-heure", "wh": "wattheures", "kwh": "kilowattheure", "v": "volts", "w": "watts",
         "a": "ampères", "%": "pour cent", "°c": "degrés", "°": "degrés", "cm": "centimètres", "mm": "millimètres",
         "m": "mètres", "km": "kilomètres", "mbit/s": "mégabits par seconde", "gbit/s": "gigabits par seconde",
         "go": "gigaoctets", "mo": "mégaoctets", "chf": "francs", "ct": "centimes", "h": "heures", "min": "minutes",
         "s": "secondes", "kg": "kilos", "g": "grammes", "l": "litres", "db": "décibels", "lux": "lux"}
SYMBOLS = {"÷": "divisé par", "×": "fois", "≈": "environ", "=": "égale", "≠": "différent de", "+": "plus",
           "−": "moins", "-": "moins", "→": "donne", "&": "et", "/": "sur", "~": "environ"}
PUNCT_ONLY = re.compile(r"^[\s:;?!…»«.,)(\"'’]+$")
UNIT_RE = re.compile(r"^(mAh|Wh|kWh|V|W|A|%|°C|°|cm|mm|m|km|Mbit/s|Gbit/s|Go|Mo|CHF|ct|h|min|s|kg|g|l|dB)"
                     r"[\s.,:;!?…)]*$")
FUNC = set("le la les l' un une des du de d' à au aux en et ou pour par sur sous dans avec sans son sa ses ton ta tes mon ma mes "
           "notre votre leur leurs ce cet cette ces qui que qu' chaque combien très plus moins".split())
PHRASES = ["je mesure tout", "Black Friday", "Hive Systems", "code PIN", "USB 2", "L'Office fédéral", "santé publique",
           "mot de passe", "double authentification", "quasi instantané", "change tout", "en trop", "par jour", "en hiver"]


def spoken(tok):
    """Forme prononcée approximative d'un jeton affiché."""
    t = tok.replace(NNBSP, " ").replace(NBSP, " ")
    out = []
    for part in re.findall(r"\d[\d ]*(?:,\d+)?|[A-Za-zÀ-ÿ'’/°%-]+|[÷×≈=≠+−→&~]", t):
        if part[0].isdigit():
            num = part.replace(" ", "")
            if "," in num:
                i, d = num.split(",", 1)
                out.append(spell(int(i)) + " virgule " + " ".join(spell(int(c)) for c in d))
            else:
                out.append(spell(int(num)))
        elif part in SYMBOLS:
            out.append(SYMBOLS[part])
        elif part.lower().strip(".,") in UNITS and (out or len(part) <= 3):
            out.append(UNITS[part.lower().strip(".,")])
        else:
            out.append(part)
    return " ".join(out)


def syllables(s):
    n = 0
    for w in re.split(r"[\s\-’']+", s.lower()):
        if not w:
            continue
        g = re.findall(r"[aeiouyàâäéèêëîïôöùûü]+", w)
        k = len(g)
        if k > 1 and re.search(r"(e|es|ent)$", w) and not re.search(r"(é|ée|ées|és)$", w):
            k -= 1  # e muet final
        n += max(1, k) if re.search(r"[a-zà-ÿ0-9]", w) else 0
    return n


# ---------- jetons ----------
def tokens_of(display):
    raw = [x for x in display.split(" ") if x]
    toks = []
    for x in raw:
        if x == "|":
            toks.append(x)
        elif toks and toks[-1] != "|" and PUNCT_ONLY.match(x):
            toks[-1] += NNBSP + x  # « mot : » -> jamais de ligne qui commence par « : »
        elif toks and toks[-1] != "|" and UNIT_RE.match(x) and re.search(r"\d$", toks[-1].replace(NNBSP, "")):
            toks[-1] += NNBSP + x  # « 4 000 mAh » reste d'un bloc
        else:
            toks.append(x)
    # expressions insécables
    for ph in PHRASES:
        words = ph.split(" ")
        i = 0
        while i <= len(toks) - len(words):
            seg = toks[i:i + len(words)]
            if all(s.rstrip(".,:;!?…").replace(NNBSP, "").lower() == w.lower() for s, w in zip(seg, words)):
                toks[i:i + len(words)] = [NBSP.join(seg)]
            i += 1
    return toks


def lines_needed(toks):
    widths = [FONT.getlength(t) for t in toks]
    n, gw = 1, 0.0
    for w in widths:
        if gw > 0 and gw + SPACE_W + w > a.maxw:
            n += 1
            gw = w
        else:
            gw += (SPACE_W if gw > 0 else 0) + w
    return n


# ---------- parole ----------
w = wave.open(a.vo)
sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
if w.getnchannels() > 1:
    x = x.reshape(-1, w.getnchannels()).mean(axis=1)
hop = int(0.01 * sr)
nf = len(x) // hop
rms = np.sqrt(np.mean(x[: nf * hop].reshape(nf, hop) ** 2, axis=1) + 1e-12)
db = 20 * np.log10(rms)
thr = max(-48.0, float(np.percentile(db, 95)) - 34.0)
speech = db > thr


def islands(t0, t1, min_gap=0.10, min_len=0.04):
    i0, i1 = max(0, int(t0 / 0.01)), min(nf, int(np.ceil(t1 / 0.01)))
    out, cur = [], None
    for i in range(i0, i1):
        if speech[i]:
            if cur is None:
                cur = [i, i + 1]
            else:
                cur[1] = i + 1
        elif cur is not None:
            out.append(cur)
            cur = None
    if cur is not None:
        out.append(cur)
    merged = []
    for s, e in out:
        if merged and (s - merged[-1][1]) * 0.01 < min_gap:
            merged[-1][1] = e
        else:
            merged.append([s, e])
    res = [(s * 0.01, e * 0.01) for s, e in merged if (e - s) * 0.01 >= min_len]
    return res or [(t0, t1)]


tl = json.load(open(a.timeline))
report = []
for seg in tl["segments"]:
    disp = seg.get("display") or seg["text"]
    toks = tokens_of(disp)
    isl = islands(seg["start"] - 0.03, seg["end"] + 0.03)
    L = sum(e - s for s, e in isl)
    cum = np.cumsum([0] + [e - s for s, e in isl])  # position parole au début de chaque îlot
    gaps = [(cum[k + 1], isl[k][1], isl[k + 1][0]) for k in range(len(isl) - 1)]  # (pos parole, fin, reprise)

    def weights(ts):
        return [0 if t == "|" else max(0.35, syllables(spoken(t))) if not PUNCT_ONLY.match(t) else 0 for t in ts]

    # cartons automatiques si une phrase dépasse maxlines
    def split_auto(ts):
        if "|" in ts or lines_needed(ts) <= a.maxlines or len(ts) < 2:
            return ts
        wt = weights(ts)
        W = sum(wt) or 1
        best, bi = None, None
        acc = 0
        for b in range(1, len(ts)):
            acc += wt[b - 1]
            left, right = ts[:b], ts[b:]
            frac = acc / W
            pen = abs(frac - 0.5) * 2
            if lines_needed(left) > a.maxlines or lines_needed(right) > a.maxlines:
                pen += 1.5
            if min(frac, 1 - frac) < 0.22 or min(len(left), len(right)) < 2:
                pen += 2.5  # pas de carton d'un seul mot
            prev = ts[b - 1].replace(NNBSP, "")
            if re.search(r"[.:;?!…]$", prev):
                pen -= 1.8
            elif prev.endswith(","):
                pen -= 1.4
            if prev.lower().strip(".,") in FUNC or re.search(r"^(d|l|qu|j|n|s|c)['’]$", prev.lower()):
                pen += 2.5  # jamais couper après un article ou une préposition
            p = frac * L
            if gaps and min(abs(g[0] - p) for g in gaps) < 0.3:
                pen -= 0.8
            if best is None or pen < best:
                best, bi = pen, b
        return split_auto(ts[:bi]) + ["|"] + split_auto(ts[bi:])

    toks = split_auto(toks)
    wt = weights(toks)
    W = sum(wt) or 1
    # ancres : chaque « | » est calé sur une pause, en gardant l'ordre (affectation optimale)
    marks, acc = [], 0.0
    for t, ww in zip(toks, wt):
        if t == "|":
            marks.append(acc)
        acc += ww
    K, J, MISS = len(marks), len(gaps), 0.45
    memo = {}

    def best(k, j):  # marqueurs k.. avec les pauses j..
        if k == K:
            return 0.0, []
        if (k, j) in memo:
            return memo[(k, j)]
        c0, r0 = best(k + 1, j)
        res = (c0 + MISS, [None] + r0)
        for q in range(j, J):
            d = abs(gaps[q][0] - marks[k] / W * L)
            if d < 0.4 * L:
                c1, r1 = best(k + 1, q + 1)
                if c1 + d < res[0]:
                    res = (c1 + d, [q] + r1)
        memo[(k, j)] = res
        return res

    assign = best(0, 0)[1]
    fixed = [(0.0, 0.0)] + [(marks[k], gaps[q][0]) for k, q in enumerate(assign) if q is not None] + [(W, L)]
    anchors = [(0.0, 0.0)]
    for k, q in enumerate(assign):
        if q is not None:
            anchors.append((marks[k], gaps[q][0]))
        else:  # sans pause : proportionnel entre les ancres voisines
            lo = max(f for f in fixed if f[0] <= marks[k] + 1e-9)
            hi = min((f for f in fixed if f[0] >= marks[k] - 1e-9 and f != lo), default=(W, L))
            pos = lo[1] if hi[0] - lo[0] < 1e-9 else lo[1] + (marks[k] - lo[0]) / (hi[0] - lo[0]) * (hi[1] - lo[1])
            anchors.append((marks[k], pos))
    anchors.append((W, L))

    def wpos(wv):  # poids cumulé -> position dans la parole
        for (w0, p0), (w1, p1) in zip(anchors, anchors[1:]):
            if wv <= w1 + 1e-9:
                return p0 if w1 - w0 < 1e-9 else p0 + (wv - w0) / (w1 - w0) * (p1 - p0)
        return L

    def ptime(p, start):  # position parole -> temps réel (début : après la pause ; fin : avant)
        for k, (s, e) in enumerate(isl):
            a0, a1 = cum[k], cum[k + 1]
            if (p < a1 - 1e-6) or (not start and p <= a1 + 1e-6) or k == len(isl) - 1:
                return s + max(0.0, min(p - a0, e - s))
        return isl[-1][1]

    words, acc = [], 0.0
    for t, ww in zip(toks, wt):
        if t == "|":
            words.append([None, None, "|"])
            continue
        s, e = ptime(wpos(acc), True), ptime(wpos(acc + ww), False)
        words.append([round(s, 3), round(max(e, s + 0.05), 3), t])
        acc += ww
    # marqueurs de carton : à l'instant du premier mot du carton suivant
    for i, wd in enumerate(words):
        if wd[2] == "|":
            nxt = next((v for v in words[i + 1:] if v[2] != "|"), None)
            wd[0] = wd[1] = nxt[0] if nxt else seg["end"]
    # fin d'un mot <= début du suivant
    real = [wd for wd in words if wd[2] != "|"]
    for u, v in zip(real, real[1:]):
        u[1] = round(min(u[1], v[0]), 3) if v[0] > u[0] else u[1]
    seg["words"] = words
    pages, cur = [], []
    for wd in words:
        if wd[2] == "|":
            pages.append(cur)
            cur = []
        else:
            cur.append(wd)
    pages.append(cur)
    report.append(f"{seg['id']}  {seg['start']:.2f}-{seg['end']:.2f}  pauses:{len(gaps)}  " + "  |  ".join(
        f"[{p[0][0]:.2f}] " + " ".join(q[2] for q in p) + f" ({lines_needed([q[2] for q in p])}l)" for p in pages if p))

json.dump(tl, open(a.out, "w"), ensure_ascii=False, indent=1)
print("\n".join(r.replace(NNBSP, "~").replace(NBSP, "_") for r in report))
