#!/usr/bin/env bash
# Détourage (fond transparent) d'images déjà dans le dépôt, avec rembg (licence MIT, modèle BiRefNet).
# autopilot/img/cut_todo.txt : une ligne par image, « chemin/entree.png nom_sortie »
# Sortie : bridge/out/img/<nom_sortie>.png (jamais refaite si elle existe).
set -u
L=autopilot/img/cut_todo.txt
[ -f "$L" ] || exit 0
OUT=bridge/out/img; mkdir -p "$OUT"
todo=$(grep -v -e '^#' -e '^\s*$' "$L" | while read -r src name; do [ -s "$OUT/$name.png" ] || echo "$src $name"; done)
[ -z "$todo" ] && { echo "cut : rien à faire"; exit 0; }
python3 -m pip install -q "rembg[cpu,cli]" 2>&1 | tail -1
echo "$todo" | while read -r src name; do
  rembg i -m birefnet-general "$src" "$OUT/$name.png" 2>&1 | tail -2 || rembg i "$src" "$OUT/$name.png" 2>&1 | tail -2
  ls -la "$OUT/$name.png"
done
