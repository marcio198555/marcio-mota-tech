#!/bin/bash
# Recrée le dossier de travail local (non versionné) à partir des journaux du dépôt.
P=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$P/travail/envoi" "$P/travail/recherche"
cat "$P"/../prospection_envoyes_*.jsonl | grep -v '^\s*$' > "$P/travail/envoi/sent_log.jsonl"
cp "$P/exclusions.jsonl" "$P/travail/envoi/queue_zz_excluded.jsonl"
cp "$P/outils/log_sent_any.py" "$P/travail/envoi/"
echo "sent_log : $(wc -l < "$P/travail/envoi/sent_log.jsonl") envois ; exclusions : $(wc -l < "$P/exclusions.jsonl")"
[ -f "$P/travail/signature_privee.txt" ] || echo "À FAIRE : créer travail/signature_privee.txt (voir REPRISE.md)"
