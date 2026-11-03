"""Recale les bruitages (cues.json) d'une ancienne voix sur une nouvelle voix du même texte.

  python3 autopilot/tools/retime_cues.py <ancien timeline_words.json> <nouveau timeline_words.json> <cues.json> <sortie.json>

Les deux timelines doivent avoir les mêmes segments (mêmes id, même texte). Chaque instant est transposé par
interpolation linéaire entre des repères : début et fin de chaque segment, et début et fin de chaque mot quand
les deux versions ont le même nombre de mots dans le segment. Un bruitage placé un peu avant un mot reste donc
un peu avant ce mot.
"""
import json
import sys


def anchors(old, new):
    pts = [(0.0, 0.0)]
    so = {s["id"]: s for s in old["segments"]}
    for sn in new["segments"]:
        sg = so.get(sn["id"])
        if not sg:
            continue
        pts += [(sg["start"], sn["start"]), (sg["end"], sn["end"])]
        wo, wn = sg.get("words") or [], sn.get("words") or []
        if len(wo) == len(wn):
            for a, b in zip(wo, wn):
                pts += [(a[0], b[0]), (a[1], b[1])]
    pts.append((old.get("duration", pts[-1][0]), new.get("duration", pts[-1][1])))
    pts = sorted(set(pts))
    clean = []
    for x, y in pts:  # garder une correspondance croissante
        if not clean or (x > clean[-1][0] and y >= clean[-1][1]):
            clean.append((x, y))
    return clean


def remap(t, pts):
    if t <= pts[0][0]:
        return pts[0][1] + (t - pts[0][0])
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x0 <= t <= x1:
            return y0 + (t - x0) * (y1 - y0) / (x1 - x0)
    return pts[-1][1] + (t - pts[-1][0])


old =json.load(open(sys.argv[1], encoding="utf-8"))
new = json.load(open(sys.argv[2], encoding="utf-8"))
cues = json.load(open(sys.argv[3], encoding="utf-8"))
pts = anchors(old, new)
for c in cues:
    c["t"] = round(max(0.0, remap(c["t"], pts)), 3)
json.dump(cues, open(sys.argv[4], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(cues), "bruitages recalés,", len(pts), "repères")
