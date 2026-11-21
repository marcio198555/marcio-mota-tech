# usage : python3 -I add_cand.py TAG < fichier.jsonl   (une marque par ligne)
import sys, os, json, re; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from noel_lib import known, stem, rd, PAID, FREE
tag = sys.argv[1]; p = os.path.join(PAID, "cands.jsonl")
n = sum(1 for r in rd(p) if r["id"].startswith(tag + "-"))
S, E = known(); ok = []; ko = []
for l in sys.stdin:
    if not l.strip(): continue
    r = json.loads(l); em = (r.get("email") or "").strip().lower()
    why = None
    if not em or "@" not in em: why = "pas d'e-mail"
    elif FREE.search(em): why = "e-mail gratuit"
    elif em in E or stem(r.get("domain")) in S or stem(em.split("@")[1]) in S: why = "déjà connu"
    elif not re.fullmatch(r"[A-Z]{2}", r.get("country") or ""): why = "pays manquant (code à 2 lettres)"
    if why: ko.append((r.get("brand"), why)); continue
    n += 1; r["id"] = f"{tag}-{n:03d}"; r["email"] = em
    with open(p, "a") as f: f.write(json.dumps(r, ensure_ascii=False) + "\n")
    S.add(stem(r.get("domain"))); S.add(stem(em.split("@")[1])); E.add(em); ok.append(r["id"])
print("ajoutés", len(ok), ok, "refusés", ko)
