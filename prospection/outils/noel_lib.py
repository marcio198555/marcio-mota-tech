# Outils de la campagne « Reel rémunéré / guide de cadeaux de Noël » (sans donnée personnelle).
import json, os, re
P = os.environ.get("PROSPECTION_BASE") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "travail")
ENV = os.path.join(P, "envoi"); PAID = os.path.join(P, "paid")
os.makedirs(PAID, exist_ok=True)
def rd(p):
    return [json.loads(l) for l in open(p) if l.strip()] if os.path.exists(p) else []
def stem(d):
    d = (d or "").lower().strip().replace("https://", "").replace("http://", "").split("/")[0]
    d = re.sub(r"^www\.", "", d)
    parts = d.split(".")
    return parts[-2] if len(parts) >= 2 else d
def known():
    S = set(); E = set()
    for r in rd(os.path.join(ENV, "sent_log.jsonl")) + rd(os.path.join(ENV, "queue_zz_excluded.jsonl")):
        to = (r.get("to") or "").lower(); E.add(to)
        if "@" in to: S.add(stem(to.split("@")[1]))
        if r.get("domain"): S.add(stem(r["domain"]))
    for r in rd(os.path.join(PAID, "cands.jsonl")):
        S.add(stem(r.get("domain"))); E.add((r.get("email") or "").lower())
        if "@" in (r.get("email") or ""): S.add(stem(r["email"].split("@")[1]))
    S.discard(""); return S, E
FREE = re.compile(r"@(gmail|googlemail|outlook|hotmail|live|yahoo|icloud|me|gmx|web|bluewin|sunrise|orange|wanadoo|free|laposte|sfr|aol|protonmail|proton|hispeed|swissonline|bluemail)\.", re.I)
