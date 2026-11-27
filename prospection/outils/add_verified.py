# usage : verdicts JSON par ligne {"id","ok","reason"[, "product", "lang", "brand"]} sur stdin
import sys, os, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from noel_lib import rd, PAID
C = {r["id"]: r for r in rd(os.path.join(PAID, "cands.jsonl"))}
V = {r["id"] for r in rd(os.path.join(PAID, "verified.jsonl"))}
ok = ko = 0
for l in sys.stdin:
    if not l.strip(): continue
    v = json.loads(l); c = C.get(v["id"])
    if not c or v["id"] in V: continue
    if v.get("ok"):
        c = dict(c); c.update({k: v[k] for k in ("product", "lang", "brand") if k in v})
        open(os.path.join(PAID, "verified.jsonl"), "a").write(json.dumps(c, ensure_ascii=False) + "\n"); ok += 1
    else:
        open(os.path.join(PAID, "rejected.jsonl"), "a").write(json.dumps({**c, "reason": v.get("reason")}, ensure_ascii=False) + "\n"); ko += 1
print("ok", ok, "rejetés", ko)
