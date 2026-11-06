#!/usr/bin/env python3
"""Repères sonores génériques : whoosh à chaque segment (sauf le 1er), pop à 40 % des segments, impact aux segments choisis.
Usage : make_cues_auto.py <timeline.json> [s04 s09 ...]  (impacts à 45 % du segment) ; carte de fin : pop 0,25 s après le dernier segment."""
import json, os, sys
SFX = '/home/claude/studio/sfx/'; DB = {'impact': -12, 'ui_pop': -15, 'whoosh': -17}
path = sys.argv[1]; hits = sys.argv[2:]
segs = json.load(open(path, encoding='utf-8'))['segments']
plan = [('impact', 0.02)]
for i, s in enumerate(segs):
    d = s['end'] - s['start']
    if i: plan.append(('whoosh', s['start']))
    plan.append(('ui_pop', s['start'] + 0.4 * d))
    if s['id'] in hits: plan.append(('impact', s['start'] + 0.45 * d))
plan.append(('ui_pop', segs[-1]['start'] + 0.25))
cues = sorted(({'file': f'{SFX}{n}.wav', 't': round(t, 3), 'db': DB[n]} for n, t in plan), key=lambda c: c['t'])
out = os.path.join(os.path.dirname(os.path.abspath(path)), 'cues.json')
json.dump(cues, open(out, 'w', encoding='utf-8'), indent=1); print(out, len(cues))
