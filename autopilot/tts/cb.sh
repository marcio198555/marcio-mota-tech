#!/usr/bin/env bash
# Installe Chatterbox (CPU) dans un environnement séparé et lance autopilot/tts/cb.py.
set -u
pending=0
for j in autopilot/tts/cb_jobs/*.json; do
  [ -f "$j" ] || continue
  [ -f "autopilot/tts/out/$(basename "$j" .json)/manifest.json" ] || pending=1
done
[ "$pending" = 1 ] || { echo "chatterbox : rien à faire"; exit 0; }
python3 -m pip install -q uv 2>&1 | tail -1
uv venv -q -p 3.11 /tmp/cbenv
# torch CPU d'abord (évite les 3 Go de bibliothèques CUDA), puis Chatterbox.
uv pip install -q -p /tmp/cbenv/bin/python --index-url https://download.pytorch.org/whl/cpu torch==2.6.0 torchaudio==2.6.0
# setuptools < 81 : le filigrane Perth importe pkg_resources (absent des environnements uv)
uv pip install -q -p /tmp/cbenv/bin/python chatterbox-tts "setuptools<81" 2>&1 | tail -3
/tmp/cbenv/bin/python -c "import chatterbox, torch, perth; print('chatterbox ok, torch', torch.__version__, 'filigrane', perth.PerthImplicitWatermarker)"
/tmp/cbenv/bin/python autopilot/tts/cb.py
