#!/usr/bin/env python3
"""Repères sonores du jour 56. Usage : make_cues.py <timeline.json> ; écrit cues.json à côté de la timeline."""
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
    (IMPACT, at('s02', 0.1)),        # débranchée
    (POP, at('s02', 0.45)),          # CLAC
    (WHOOSH, at('s03')),
    (POP, at('s03', 0.2)),
    (WHOOSH, at('s04')),
    (POP, at('s04', 0.05)),
    (POP, at('s04', 0.5)),
    (WHOOSH, at('s05')),
    (POP, at('s05', 0.42)),
    (POP, at('s05', 0.52)),
    (POP, at('s05', 0.62)),
    (IMPACT, at('s05', 0.68)),       # sans transfert
    (WHOOSH, at('s06')),
    (POP, at('s06', 0.25)),
    (POP, at('s06', 0.38)),
    (POP, at('s06', 0.51)),
    (POP, at('s06', 0.62)),
    (WHOOSH, at('s07')),
    (IMPACT, at('s07', 0.8)),        # 9,63 CHF par an
    (WHOOSH, at('s08')),
    (POP, at('s08', 0.05)),
    (POP, at('s08', 0.55)),
    (POP, at('s08', 0.7)),
    (WHOOSH, at('s09')),
    (POP, at('s09', 0.2)),
    (POP, at('s09', 0.36)),
    (POP, at('s09', 0.5)),
    (IMPACT, at('s09', 0.62)),       # OFF
    (WHOOSH, at('s10')),
    (IMPACT, at('s10', 0.42)),       # croix
    (WHOOSH, at('s11')),
    (POP, at('s11', 0.55)),          # interrupteur
    (WHOOSH, at('s12')),
    (POP, at('s12', 0.22)),
    (IMPACT, at('s12', 0.8)),        # 0,3 W
    (WHOOSH, at('s13')),
    (IMPACT, at('s13', 0.2)),
    (IMPACT, at('s13', 0.7)),
    (WHOOSH, at('s14')),
    (POP, at('s14', 0.3)),
    (POP, at('s14', 0.5)),
    (POP, at('s14', 0.7)),
    (WHOOSH, at('s15')),
    (IMPACT, at('s15', 0.1)),        # + 9,63 CHF
    (POP, at('s15', 0.5)),
    (WHOOSH, at('s16')),
    (POP, round(at('s16') + 0.25, 3)),  # carte CE SOIR
]
out = [{'file': f, 't': t, 'db': db} for (f, db), t in cues]
dst = os.path.join(os.path.dirname(os.path.abspath(path)), 'cues.json')
json.dump(out, open(dst, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(out), 'repères ->', dst)
