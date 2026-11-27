#!/bin/bash
# usage : bash prospection/outils/journal_jour.sh AAAA-MM-JJ  -> ajoute au dépôt les envois du jour (UTC) et pousse
D=$1; R=$(cd "$(dirname "$0")/../.." && pwd); F="$R/prospection_envoyes_$D.jsonl"
grep "\"ts\": \"$D" "$R/prospection/travail/envoi/sent_log.jsonl" > "$F.tmp"
[ -f "$F" ] && cat "$F" "$F.tmp" | awk '!seen[$0]++' > "$F.new" || mv "$F.tmp" "$F.new"
python3 - "$F.new" "$F" <<'PY'
import json,sys
seen=set();out=[]
for l in open(sys.argv[1]):
    if not l.strip(): continue
    k=json.loads(l)["id"]
    if k in seen: continue
    seen.add(k); out.append(l if l.endswith("\n") else l+"\n")
open(sys.argv[2],"w").write("".join(out)); print("journal="+str(len(out)))
PY
rm -f "$F.tmp" "$F.new"
cd "$R" && git add "prospection_envoyes_$D.jsonl" && git commit -qm "Prospection $D : $(wc -l < "$F") e-mails envoyés" && (git push -q -u origin "$(git branch --show-current)" || (sleep 4; git push -q -u origin "$(git branch --show-current)"))
