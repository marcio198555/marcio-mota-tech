#!/usr/bin/env python3
"""Repères sonores du jour 37, calés sur les segments. Usage : make_cues.py <timeline.json>"""
import json
import os
import sys

SFX = '/home/claude/studio/sfx/'
DB = {'impact': -15, 'ui_pop': -12, 'whoosh': -17}


def main():
    path = sys.argv[1]
    segs = {s['id']: s for s in json.load(open(path, encoding='utf-8'))['segments']}

    def f(sid, a=0.0):
        s = segs[sid]
        return s['start'] + a * (s['end'] - s['start'])

    plan = [('impact', 0.02)]
    # un whoosh à chaque changement de bloc (mêmes débuts que scene.js)
    for sid in ('s03', 's04', 's05', 's06', 's07', 's08', 's09', 's10', 's11', 's12', 's13', 's14', 's15', 's16'):
        plan.append(('whoosh', f(sid)))
    # cartes qui apparaissent
    plan += [('ui_pop', f(*x)) for x in [
        ('s03', 0.48), ('s04', 0.3), ('s08', 0.35), ('s09', 0.08), ('s12', 0.2), ('s13', 0.18), ('s13', 0.28),
        ('s13', 0.38), ('s14', 0.05),
    ]]
    # mots forts (tampons, résultats)
    plan += [('impact', f(*x)) for x in [
        ('s02', 0.2), ('s05', 0.82), ('s06', 0.85), ('s07', 0.62), ('s08', 0.75), ('s09', 0.62), ('s10', 0.65),
        ('s11', 0.7), ('s15', 0.12), ('s15', 0.55),
    ]]
    # carte CE SOIR (followCTA : t0 + 0,25 s)
    plan.append(('ui_pop', f('s16') + 0.25))

    cues = [{'file': SFX + name + '.wav', 't': round(t, 3), 'db': DB[name]} for name, t in sorted(plan, key=lambda x: x[1])]
    out = os.path.join(os.path.dirname(os.path.abspath(path)), 'cues.json')
    json.dump(cues, open(out, 'w', encoding='utf-8'), indent=1)
    print(out, len(cues))


if __name__ == '__main__':
    main()
