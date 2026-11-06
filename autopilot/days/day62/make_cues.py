#!/usr/bin/env python3
"""Repères sonores de la vidéo 62 : make_cues.py <timeline_words.json> écrit cues.json à côté de la timeline."""
import json, os, sys
SFX = "/home/claude/studio/sfx/"
K = {"i": ("impact.wav", -12), "p": ("ui_pop.wav", -15), "w": ("whoosh.wav", -17)}
PLAN = {
    "s01": [(0.5, "p"), (0.75, "p")],
    "s02": [(0.0, "w"), (0.15, "p"), (0.4, "p"), (0.55, "p")],
    "s03": [(0.0, "w"), (0.03, "i"), (0.18, "p"), (0.42, "p"), (0.68, "p"), (0.86, "p")],
    "s04": [(0.0, "w"), (0.2, "p"), (0.5, "p"), (0.72, "p"), (0.8, "i")],
    "s05": [(0.0, "w"), (0.15, "p"), (0.42, "p"), (0.6, "p"), (0.78, "p")],
    "s06": [(0.0, "w"), (0.2, "p"), (0.38, "p"), (0.6, "i"), (0.7, "p"), (0.85, "p")],
    "s07": [(0.0, "w"), (0.05, "p"), (0.35, "i"), (0.45, "p"), (0.75, "i")],
    "s08": [(0.0, "w"), (0.05, "p"), (0.8, "p"), (0.85, "i")],
    "s09": [(0.02, "p"), (0.12, "i"), (0.38, "p"), (0.6, "p")],
    "s10": [(0.0, "w"), (0.3, "p"), (0.72, "i"), (0.8, "p")],
    "s11": [(0.0, "w"), (0.15, "p"), (0.063, "i"), (0.62, "p"), (0.75, "p"), (0.85, "p")],
    "s12": [(0.0, "w"), (0.5, "p"), (0.7, "p"), (0.85, "p")],
    "s13": [(0.0, "w"), (0.2, "i"), (0.32, "p"), (0.42, "p"), (0.55, "p"), (0.72, "i"), (0.85, "p")],
    "s14": [(0.0, "w"), (0.25, "p"), (0.5, "p")],
    "s15": [(0.0, "i"), (0.55, "p")],
    "s16": [(0.0, "w"), (0.05, "p")],
}
tl_path = sys.argv[1]
segs = {s["id"]: s for s in json.load(open(tl_path, encoding="utf-8"))["segments"]}
cues = []
for sid, items in PLAN.items():
    a, b = segs[sid]["start"], segs[sid]["end"]
    for u, k in items:
        name, db = K[k]
        cues.append({"file": SFX + name, "t": round(a + (b - a) * u, 3), "db": db})
cues.sort(key=lambda c: c["t"])
out = os.path.join(os.path.dirname(os.path.abspath(tl_path)), "cues.json")
json.dump(cues, open(out, "w", encoding="utf-8"), indent=1)
print(len(cues), "repères ->", out)
