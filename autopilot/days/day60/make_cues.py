#!/usr/bin/env python3
"""Repères sonores du jour 60, calés sur les segments. Usage : make_cues.py <timeline.json>"""
import json
import os
import sys

SFX = '/home/claude/studio/sfx/'
DB = {'impact': -12, 'ui_pop': -15, 'whoosh': -17}


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
        ('s03', 0.35), ('s04', 0.05), ('s04', 0.22), ('s09', 0.04), ('s09', 0.2), ('s10', 0.08), ('s10', 0.28),
        ('s12', 0.03), ('s12', 0.22), ('s14', 0.45), ('s15', 0.6),
    ]]
    # mots forts (tampons)
    plan += [('impact', f(*x)) for x in [
        ('s02', 0.35), ('s06', 0.65), ('s07', 0.55), ('s09', 0.45), ('s11', 0.3), ('s12', 0.45), ('s13', 0.3),
    ]]
    # carte CE SOIR (followCTA : t0 + 0,25 s)
    plan.append(('ui_pop', f('s16') + 0.25))

    cues = sorted(({'file': f'{SFX}{name}.wav', 't': round(t, 3), 'db': DB[name]} for name, t in plan), key=lambda c: c['t'])
    out = os.path.join(os.path.dirname(os.path.abspath(path)), 'cues.json')
    with open(out, 'w', encoding='utf-8') as fh:
        json.dump(cues, fh, indent=1)
    print(out, len(cues))


if __name__ == '__main__':
    main()
