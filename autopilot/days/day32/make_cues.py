#!/usr/bin/env python3
"""Repères sonores de la vidéo 32. Usage : make_cues.py <timeline.json> ; écrit cues.json à côté de la timeline."""
import json
import os
import sys

SFX = '/home/claude/studio/sfx/'
path = sys.argv[1]
segs = {s['id']: s for s in json.load(open(path, encoding='utf-8'))['segments']}


def at(sid, x=0.0):
    s = segs[sid]
    return round(s['start'] + (s['end'] - s['start']) * x, 3)


IMPACT, POP, WHOOSH = (SFX + 'impact.wav', -15), (SFX + 'ui_pop.wav', -12), (SFX + 'whoosh.wav', -17)
cues = [
    (IMPACT, 0.02),
    (POP, at('s01', 0.5)),           # vexée
    (POP, at('s02')),                # collègue
    (POP, at('s03', 0.42)),          # propre
    (POP, at('s03', 0.8)),           # paie
    (WHOOSH, at('s04')),
    (POP, at('s04', 0.05)),
    (POP, at('s04', 0.58)),          # pièces
    (POP, at('s04', 0.64)),
    (POP, at('s04', 0.7)),
    (IMPACT, at('s04', 0.72)),       # en francs
    (WHOOSH, at('s05')),
    (POP, at('s05', 0.1)),           # germes
    (IMPACT, at('s05', 0.42)),       # pas stérile
    (POP, at('s05', 0.6)),           # Karl Perron
    (WHOOSH, at('s06')),
    (POP, at('s06', 0.15)),          # RTS
    (POP, at('s06', 0.42)),          # maladie
    (POP, at('s06', 0.68)),          # immunité
    (WHOOSH, at('s07')),
    (POP, at('s07', 0.12)),          # Les Numériques
    (IMPACT, at('s07', 0.8)),        # 60 °C gagne
    (POP, at('s07', 0.86)),
    (WHOOSH, at('s08')),
    (POP, at('s08', 0.02)),          # bravo
    (IMPACT, at('s08', 0.55)),       # 2,7 ×
    (WHOOSH, at('s09')),
    (POP, at('s09', 0.05)),
    (POP, at('s09', 0.3)),           # tarif
    (IMPACT, at('s09', 0.66)),       # 22 ct
    (POP, at('s09', 0.88)),          # 7 ct
    (WHOOSH, at('s10')),
    (POP, at('s10', 0.25)),
    (IMPACT, at('s10', 0.65)),       # 22,60 fr.
    (POP, at('s10', 0.75)),
    (WHOOSH, at('s11')),
    (POP, at('s11', 0.02)),          # surprise
    (IMPACT, at('s11', 0.72)),       # + 50 min
    (WHOOSH, at('s12')),
    (IMPACT, at('s12', 0.22)),       # − 38 %
    (POP, at('s12', 0.6)),
    (WHOOSH, at('s13')),
    (POP, at('s13', 0.25)),
    (POP, at('s13', 0.45)),
    (POP, at('s13', 0.55)),
    (WHOOSH, at('s14')),
    (POP, at('s14', 0.2)),           # bulle
    (POP, at('s14', 0.6)),
    (WHOOSH, at('s15')),
    (IMPACT, at('s15', 0.55)),       # ça dépend du linge
    (WHOOSH, at('s16')),
    (POP, at('s16', 0.05)),          # carton de fin
]
out = [{'file': c[0][0], 't': c[1], 'db': c[0][1]} for c in cues]
dest = os.path.join(os.path.dirname(os.path.abspath(path)), 'cues.json')
json.dump(out, open(dest, 'w', encoding='utf-8'), indent=1)
print(len(out), 'repères ->', dest)
