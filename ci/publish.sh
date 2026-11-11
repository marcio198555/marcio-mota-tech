#!/usr/bin/env bash
# Pushes the content of a folder as the one and only commit of the
# "fletch-builds" branch (the previous content is replaced).
set -euo pipefail
SRC="$1"
MSG="${2:-build}"
[ -d "$SRC" ] || { echo "nothing to publish"; exit 0; }
echo "published=$(date -u +%FT%TZ)" >> "$SRC/STATUS.txt"
TMP="$(mktemp -d)"
cp -r "$SRC"/. "$TMP"/
cd "$TMP"
git init -q -b fletch-builds
git config user.name "github-actions[bot]"
git config user.email "41898283+github-actions[bot]@users.noreply.github.com"
git add -A
git commit -q -m "$MSG"
git push -q -f "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" fletch-builds
echo "published to fletch-builds: $MSG"
