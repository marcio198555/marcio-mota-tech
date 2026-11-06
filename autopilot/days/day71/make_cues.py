#!/usr/bin/env python3
"""Repères sonores de la vidéo 71. Usage : make_cues.py <timeline.json> ; écrit cues.json à côté de la timeline."""
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
    (IMPACT, 0.02),                  # duel
    (POP, at('s02', 0.1)),           # compteur « ? CHF »
    (WHOOSH, at('s03')),
    (POP, at('s03', 0.55)),          # source ElCom
    (IMPACT, at('s03', 0.72)),       # 27,7
    (POP, at('s04', 0.1)),           # + TVA
    (IMPACT, at('s04', 0.7)),        # 29,9
    (WHOOSH, at('s05')),
    (POP, at('s05', 0.3)),
    (IMPACT, at('s05', 0.65)),       # 20,01
    (WHOOSH, at('s06')),
    (POP, at('s06', 0.45)),          # pièce retournée
    (WHOOSH, at('s07')),
    (IMPACT, at('s07', 0.62)),       # tampon
    (WHOOSH, at('s08')),
    (POP, at('s08', 0.3)),           # lettre A
    (IMPACT, at('s08', 0.6)),        # 47
    (WHOOSH, at('s09')),
    (POP, at('s09', 0.65)),          # 103 kWh
    (WHOOSH, at('s10')),
    (IMPACT, at('s10', 0.72)),       # 12 CHF
    (WHOOSH, at('s11')),
    (IMPACT, at('s11', 0.02)),       # attention
    (POP, at('s11', 0.25)),
    (POP, at('s11', 0.6)),
    (WHOOSH, at('s12')),
    (POP, at('s12', 0.1)),           # abonnement
    (IMPACT, at('s12', 0.75)),       # 7,7
    (WHOOSH, at('s13')),
    (POP, at('s13', 0.1)),
    (POP, at('s13', 0.55)),
    (WHOOSH, at('s14')),
    (POP, at('s14', 0.4)),
    (WHOOSH, at('s15')),
    (IMPACT, at('s15', 0.45)),       # 12 CHF
    (POP, at('s15', 0.72)),          # 8 CHF
    (WHOOSH, at('s16')),
]
cta = segs['s16']['start'] + 0.25    # la carte CE SOIR arrive 0,25 s après le début de la phrase
cues.append((POP, round(cta, 3)))
out = [{'file': c[0][0], 't': c[1], 'db': c[0][1]} for c in sorted(cues, key=lambda c: c[1])]
dest = os.path.join(os.path.dirname(os.path.abspath(path)), 'cues.json')
json.dump(out, open(dest, 'w', encoding='utf-8'), indent=1)
print(len(out), 'repères ->', dest)
