#!/usr/bin/env python3
"""Timeline d'essai (avant la voix) pour regarder une scène : fake_tl.py NN sortie.json ; durée estimée 2,6 mots/s."""
import json, sys
d = sys.argv[1]; R = '/home/claude/marcio-mota-tech/autopilot'
job = json.load(open(f'{R}/tts/cb_jobs/day{d}.json', encoding='utf-8')); disp = json.load(open(f'{R}/days/day{d}/draft.json', encoding='utf-8'))['display']
t = 0.12; segs = []
for s in job['segments']:
    dur = max(1.2, len(s['text'].split()) / 2.6)
    segs.append({'id': s['id'], 'text': s['text'], 'display': disp[s['id']], 'start': round(t, 3), 'end': round(t + dur, 3)}); t += dur + 0.1
json.dump({'duration': t, 'segments': segs}, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False)
print(round(t, 1), 's')
