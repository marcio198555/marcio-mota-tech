import datetime, json, sys
outbox, ids = sys.argv[1], sys.argv[2].split(",")
O = {json.loads(l)["id"]: json.loads(l) for l in open(outbox) if l.strip()}
with open("sent_log.jsonl", "a") as f:
    for i in ids:
        r = O[i]
        f.write(json.dumps({"id": i, "brand": r["brand"], "domain": r["domain"], "to": r["to"],
                            "ts": datetime.datetime.utcnow().isoformat()}) + "\n")
print(len(ids), "logged")
