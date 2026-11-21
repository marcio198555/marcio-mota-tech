# usage : python3 -I build_noel.py LOT N   -> travail/envoi/queue_LOT.jsonl + queue_LOT_gq.txt
import sys, os, json, re; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from noel_lib import rd, PAID, ENV, P, stem
lot, N = sys.argv[1], int(sys.argv[2])
T = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates_noel.json")))
SIG = json.load(open(os.path.join(P, "signature_privee.json")))
built = set(l.strip() for l in open(os.path.join(PAID, "built_ids.txt"))) if os.path.exists(os.path.join(PAID, "built_ids.txt")) else set()
sent = rd(os.path.join(ENV, "sent_log.jsonl"))
SE = {r["to"].lower() for r in sent}; SS = {stem(r.get("domain")) for r in sent} | {stem(r["to"].split("@")[1]) for r in sent if "@" in r["to"]}
def clean(s):
    s = re.sub(r"\s*\([^)]*\)", "", s or "")
    s = re.sub(r"[«»\"“”]", "", s).replace(" ", " ")
    s = re.sub(r"\s+", " ", s).strip(" -–,;")
    return s
Q = []; skip = []
for r in rd(os.path.join(PAID, "verified.jsonl")):
    if r["id"] in built: continue
    if len(Q) >= N: break
    em = r["email"].lower()
    if em in SE or stem(r["domain"]) in SS or stem(em.split("@")[1]) in SS: skip.append(r["id"]); continue
    lang = r.get("lang") if r.get("lang") in T else ("fr" if r.get("country") == "FR" else "de")
    t = T[lang]; name = clean(r["brand"]); prod = clean(r["product"])
    if not prod or len(prod) > 70: skip.append(r["id"]); continue
    key = {"fr": "addr_fr", "en": "addr_en", "de": "addr_de"}[lang]
    cust = "" if r.get("country") == "CH" else t["customs"]
    f = dict(name=name, product=prod, addr=SIG[key], phone=SIG["phone"], customs=cust)
    Q.append({"id": f"{lot}-{len(Q)+1:03d}", "src": r["id"], "brand": name, "domain": r["domain"], "to": em,
              "lang": lang, "subject": t["subject"].format(**f), "body": t["body"].format(**f)})
    SE.add(em); SS.add(stem(r["domain"]))
out = os.path.join(ENV, f"queue_{lot}.jsonl")
open(out, "w").write("".join(json.dumps(q, ensure_ascii=False) + "\n" for q in Q))
gq = ["in:anywhere -category:promotions -category:social (" + " OR ".join('"%s"' % d for d in sorted({q['domain'] for q in Q[i:i+8]} | {q['to'].split('@')[1] for q in Q[i:i+8]})) + ")" for i in range(0, len(Q), 8)]
open(os.path.join(ENV, f"queue_{lot}_gq.txt"), "w").write("\n".join(gq) + "\n")
with open(os.path.join(PAID, "built_ids.txt"), "a") as f:
    for q in Q: f.write(q["src"] + "\n")
    for s in skip: f.write(s + "\n")
print(f"lot {lot}: {len(Q)} e-mails, écartés {skip}")
