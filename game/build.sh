#!/usr/bin/env bash
# Builds the game into one self-contained file: dist/index.html
set -euo pipefail
cd "$(dirname "$0")"
BIN="$PWD/node_modules/.bin"
if [ ! -x "$BIN/esbuild" ]; then
  echo "Build tools missing: run 'npm ci' in the game folder first." >&2
  exit 1
fi
# Address of the public privacy policy page; empty hides the link in Settings.
PRIVACY_URL="${PRIVACY_URL:-}"
"$BIN/tsc" -p .
"$BIN/esbuild" src/main.ts --bundle --minify --format=iife --target=es2019 \
  --define:__PRIVACY_URL__="\"$PRIVACY_URL\"" --outfile=dist/app.js --log-level=warning
node - <<'JS'
const fs = require('fs');
const css = fs.readFileSync('src/style.css', 'utf8');
const js = fs.readFileSync('dist/app.js', 'utf8');
if (js.includes('</script')) throw new Error('script would close early');
let html = fs.readFileSync('index.template.html', 'utf8');
html = html.replace('/*__CSS__*/', () => css).replace('/*__JS__*/', () => js);
fs.writeFileSync('dist/index.html', html);
console.log('dist/index.html', (html.length / 1024).toFixed(1) + ' kB');
JS
