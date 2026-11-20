#!/usr/bin/env python3
"""publish_meta.py NN video_url story_url reel_url [tk_buffer_id] [story_buffer_id] [--carousel]
Remplit days/dayNN/post.json, ajoute le Reel d'essai à reels_queue.json (1 h après la vidéo) et met à jour plan.json.
Sans ids Buffer : statut « prête » (la tâche de 7 h 13 programmera)."""
import json, sys, subprocess
R = '/home/claude/marcio-mota-tech/autopilot'
a = [x for x in sys.argv[1:] if not x.startswith('--')]; car = '--carousel' in sys.argv
n = int(a[0]); vurl, surl, rurl = a[1:4]; tk = a[4] if len(a) > 4 else None; sb = a[5] if len(a) > 5 else None
plan = json.load(open(f'{R}/plan.json')); e = next(j for j in plan['jours'] if j['jour'] == n)
d = json.load(open(f'{R}/days/day{n:02d}/draft.json'))
st = json.load(open(f'/home/claude/studio/day{n}/timeline.json'))
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'/home/claude/studio/day{n}/day{n}_final.mp4']).decode().strip())
h = e['heure']; hh = int(h[:2]); date = e['date']
cta = 'abonnement' if int(date[-2:]) % 2 else 'envoi'
prevu = f"{date}T{hh+1:02d}:00"
post = {"day": n, "title": d['title'], "format": "V", "recette": "S4", "video_url": vurl, "story_url": surl, "heure": h, "date": date,
        "aigc": True, "branded": False, "cover_ms": 1200, "statut": "programmée" if tk else "prête", "tiktok_title": d['title'],
        "caption": d['caption'], "duree_s": round(dur, 1),
        "story_instagram": {"video_url": surl, "buffer_id": sb, "programme_le": f"{date}T{hh:02d}:05:00+01:00" if sb else None},
        "reel_instagram": {"prevu": prevu, "video_url": rurl, "caption": d['reel_caption'], "statut": "en attente", "cta": cta},
        "buffer_id": tk, "programme_le": f"{date}T{h}:00+01:00" if tk else None}
if car:
    post['tiktok'] = 'carrousel (test du 19.11)'; post['carousel_caption'] = d.get('carousel_caption'); post['carousel_title'] = d.get('carousel_title')
json.dump(post, open(f'{R}/days/day{n:02d}/post.json', 'w'), ensure_ascii=False, indent=1)
q = json.load(open(f'{R}/reels_queue.json'))
if not any(r['id'] == f'day{n}' for r in q['reels']):
    q['reels'].append({"id": f"day{n}", "prevu": prevu, "source": f"autopilot jour {n}", "video_url": rurl, "isAiGenerated": True,
                       "caption": d['reel_caption'], "statut": "en attente", "cta": cta})
json.dump(q, open(f'{R}/reels_queue.json', 'w'), ensure_ascii=False, indent=1)
e['statut'] = post['statut']; e['titre'] = d['title']; e['video_url'] = vurl; e['buffer_id'] = tk
e['story_instagram'] = {"buffer_id": sb, "video_url": surl}; e['reel_instagram'] = {"statut": "en attente", "video_url": rurl, "prevu": prevu}
json.dump(plan, open(f'{R}/plan.json', 'w'), ensure_ascii=False, indent=1)
print('ok', n, post['statut'], cta, prevu)
