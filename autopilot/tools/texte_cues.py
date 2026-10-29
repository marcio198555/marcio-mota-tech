"""Format T (texte seul) : instants d'apparition, timeline de rendu et repères sonores.

python3 autopilot/tools/texte_cues.py autopilot/days/dayNN/texte.json /home/claude/studio/dayNN
  -> <studio>/timeline.json  (spec + instants, à passer à render.js avec render/scene_texte.js)
  -> <studio>/cues.json      (bruitages : impact à 0, whoosh à chaque ligne, pop à chaque « en petit »)

texte.json : {"chip": "SOURCE : APPLE.COM · IPHONE 17", "title": ["CE QU'APPLE ÉCRIT", "en petit"], "cta": "...",
              "rows": [{"gros": "256 Go", "petit": "ligne 1 | ligne 2"}, ...],
              "step": 2.4, "delay": 0.5, "cta_after": 0.9, "hold": 3.0}
"""
import json
import pathlib
import sys

spec = json.loads(pathlib.Path(sys.argv[1]).read_text())
out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
step, delay = spec.get("step", 2.4), spec.get("delay", 0.5)
rows = [[round(i * step, 3), round(i * step + delay, 3)] for i in range(len(spec["rows"]))]
cta = round(rows[-1][1] + spec.get("cta_after", 0.9), 3)
end = round(cta + spec.get("hold", 3.0), 3)
(out / "timeline.json").write_text(json.dumps(
    {"segments": [], "duration": end, "spec": spec, "times": {"rows": rows, "cta": cta, "end": end}},
    ensure_ascii=False, indent=1))
sfx = "/home/claude/studio/sfx/"
cues = [{"file": sfx + "impact.wav", "t": 0.02, "db": -14}]
for i, (te, tt) in enumerate(rows):
    if i:
        cues.append({"file": sfx + "whoosh.wav", "t": max(0, te - 0.12), "db": -19})
    cues.append({"file": sfx + "ui_pop.wav", "t": tt, "db": -12})
cues.append({"file": sfx + "success.wav", "t": cta, "db": -17})
(out / "cues.json").write_text(json.dumps(cues, indent=1))
ml = max(len(r["petit"].split("|")) for r in spec["rows"])
if (ml > 1 and len(rows) > 4) or len(rows) > 5:
    print("ATTENTION : trop de lignes (4 max si un « en petit » fait 2 lignes, 5 max sinon)")
for r in spec["rows"]:
    for part in r["petit"].split("|"):
        if len(part.strip()) > 34:
            print(f"ATTENTION : ligne longue ({len(part.strip())} car.), vérifier la planche : {part.strip()}")
for i, (te, tt) in enumerate(rows):
    r = spec["rows"][i]
    print(f"ligne {i + 1}: {te:5.2f} s « {r['gros']} » -> {tt:5.2f} s « {r['petit']} »")
print(f"appel à enregistrer {cta} s, fin {end} s")
