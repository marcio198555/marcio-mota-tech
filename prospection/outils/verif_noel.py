# usage : python3 -I verif_noel.py TAG1 TAG2 ...  -> contrôles gratuits (skill email-verification) sur les candidats non vérifiés
# Affiche une ligne compacte par candidat, avec les alertes ; n'écrit rien.
import sys, os, re, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from noel_lib import rd, PAID, stem, FREE
tags = tuple(t + "-" for t in sys.argv[1:])
V = {r["id"] for r in rd(os.path.join(PAID, "verified.jsonl"))} | {r["id"] for r in rd(os.path.join(PAID, "rejected.jsonl"))}
BADLOC = re.compile(r"^(orders?|order|privacy|legal|dpo|gdpr|returns?|sav|jobs?|careers?|invoices?|billing|accounting|noreply|no-reply|webmaster|abuse|postmaster|unsubscribe|impressum)@")
BADCAT = re.compile(r"\b(bag|handbag|purse|wallet|jewel|necklace|bracelet|earring|ring|watch(es)?|soap|perfume|fragrance|cosmetic|skincare|serum|lotion|tea blend|coffee beans|chocolate|wine|beer|gin|whisky|supplement|cbd|knife set combat|dagger|sword|t-shirt|hoodie|sock|apparel|clothing|dress|shirt|cap|hat)\b", re.I)
seen = {}
for r in rd(os.path.join(PAID, "cands.jsonl")):
    if not r["id"].startswith(tags) or r["id"] in V: continue
    em = r.get("email", ""); dom = r.get("domain", ""); a = []
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[A-Za-z]{2,}", em): a.append("syntaxe")
    if FREE.search(em): a.append("gratuit")
    if BADLOC.search(em): a.append("adresse interdite")
    ed = em.split("@")[-1]
    if stem(ed) != stem(dom) and stem(dom) not in ed and stem(ed) not in dom: a.append("domaine e-mail différent")
    if em in seen: a.append("doublon de " + seen[em])
    seen[em] = r["id"]
    p = r.get("product", "")
    if not p or len(p) > 45: a.append("produit vide ou long")
    if BADCAT.search(p + " " + r.get("category", "")): a.append("catégorie exclue ?")
    ev = r.get("email_evidence")
    if ev is not None and em.split("@")[0].lower() not in ev.lower().replace(" [at] ", "@"): a.append("preuve sans l'adresse")
    print(f'{r["id"]}|{r.get("country")}|{r.get("lang")}|{r.get("brand")}|{dom}|{em}|{p}|{r.get("price")}|{r.get("category")}|{" ; ".join(a)}')
