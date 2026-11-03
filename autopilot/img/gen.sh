#!/usr/bin/env bash
# Images open source pour l'Autopilot (exécuté par bridge/job.sh dans GitHub Actions, CPU, gratuit).
# Modèle : Z-Image-Turbo (Tongyi-MAI, licence Apache 2.0, usage commercial permis) en GGUF,
# moteur : stable-diffusion.cpp (licence MIT). Détourage optionnel : rembg (licence MIT).
#
# Une image = un fichier autopilot/img/jobs/<nom>.json :
#   {"prompt": "...", "w": 576, "h": 1024, "steps": 8, "seed": 42, "cut": false}
# Sortie : bridge/out/img/<nom>.png (+ <nom>_cut.png si "cut": true, fond transparent).
# Une image déjà présente n'est jamais refaite : pour une nouvelle version, nouveau nom.
set -u
OUT=bridge/out/img
mkdir -p "$OUT"
pending=()
# déjà fait ici, ou déjà poussé par un autre passage du pont (deux passages peuvent se suivre) ?
done_remote() { git fetch -q origin tiktok-autopilot 2>/dev/null; git cat-file -e "origin/tiktok-autopilot:$OUT/$1.png" 2>/dev/null; }
for j in autopilot/img/jobs/*.json; do
  [ -f "$j" ] || continue
  n=$(basename "$j" .json)
  [ -s "$OUT/$n.png" ] && continue
  done_remote "$n" && { echo "img $n : déjà fait par un autre passage"; continue; }
  pending+=("$j")
done
if [ ${#pending[@]} -eq 0 ]; then echo "img : rien à faire"; exit 0; fi
echo "img : ${#pending[@]} image(s) à faire"

M="$HOME/sdmodels"; B=/tmp/sdbin
mkdir -p "$M" "$B"
dl() { [ -s "$2" ] || curl -fL --retry 3 -sS -o "$2" "$1"; ls -la "$2"; }
QUANT="${ZIMG_QUANT:-Q6_K}"
dl "https://huggingface.co/leejet/Z-Image-Turbo-GGUF/resolve/main/z_image_turbo-$QUANT.gguf" "$M/zimage.gguf" &
dl "https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507-GGUF/resolve/main/Qwen3-4B-Instruct-2507-Q4_K_M.gguf" "$M/qwen3-4b.gguf" &
dl "https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors" "$M/ae.safetensors" &

# Binaire stable-diffusion.cpp : version publiée pour Linux (CPU) sinon compilation.
SD=""
python3 - > /tmp/sd_assets.txt <<'PY'
import json, urllib.request
r = json.load(urllib.request.urlopen("https://api.github.com/repos/leejet/stable-diffusion.cpp/releases/latest"))
print("TAG", r.get("tag_name"))
for a in r.get("assets", []):
    print(a["name"], a["browser_download_url"])
PY
cat /tmp/sd_assets.txt
url=$(grep -i 'linux' /tmp/sd_assets.txt | grep -iv -e vulkan -e cuda -e rocm -e hip -e sycl -e arm -e aarch64 | grep -i -e x64 -e x86_64 -e amd64 -e ubuntu | head -1 | awk '{print $2}')
if [ -n "$url" ]; then
  curl -fL --retry 3 -sS -o /tmp/sd.zip "$url" && (cd "$B" && unzip -oq /tmp/sd.zip)
  SD=$(find "$B" -type f \( -name sd-cli -o -name sd \) | head -1)
  [ -n "$SD" ] && chmod +x "$SD"
  if [ -n "$SD" ]; then
    export LD_LIBRARY_PATH="$(dirname "$SD"):${LD_LIBRARY_PATH:-}"
    "$SD" --help >/dev/null 2>&1 || { echo "binaire publié inutilisable"; SD=""; }
  fi
fi
if [ -z "$SD" ]; then
  echo "compilation de stable-diffusion.cpp"
  git clone -q --depth 1 --recursive https://github.com/leejet/stable-diffusion.cpp /tmp/sdsrc
  cmake -S /tmp/sdsrc -B /tmp/sdsrc/build -DCMAKE_BUILD_TYPE=Release -DGGML_NATIVE=ON >/dev/null
  cmake --build /tmp/sdsrc/build -j"$(nproc)" >/dev/null 2>&1 || cmake --build /tmp/sdsrc/build -j"$(nproc)" 2>&1 | tail -20
  SD=$(find /tmp/sdsrc/build -type f \( -name sd-cli -o -name sd \) -perm -u+x | head -1)
fi
echo "binaire : $SD"
wait
[ -n "$SD" ] || { echo "ÉCHEC : pas de binaire stable-diffusion.cpp"; exit 1; }

need_cut=0
for j in "${pending[@]}"; do
  n=$(basename "$j" .json)
  done_remote "$n" && { echo "img $n : déjà fait par un autre passage"; continue; }
  eval "$(python3 - "$j" <<'PY'
import json, shlex, sys
s = json.load(open(sys.argv[1], encoding="utf-8"))
def q(v): return shlex.quote(str(v))
print("P=" + q(s["prompt"]))
print("W=" + q(s.get("w", 576)), "H=" + q(s.get("h", 1024)))
print("ST=" + q(s.get("steps", 8)), "SEED=" + q(s.get("seed", 42)))
print("CUT=" + ("1" if s.get("cut") else "0"))
PY
)"
  t0=$(date +%s)
  "$SD" --diffusion-model "$M/zimage.gguf" --vae "$M/ae.safetensors" --llm "$M/qwen3-4b.gguf" \
    -p "$P" --cfg-scale 1.0 --steps "$ST" -W "$W" -H "$H" -s "$SEED" -t "$(nproc)" \
    -o "$OUT/$n.png" 2>&1 | grep -v -e '^\s*$' | tail -15
  echo "img $n : $(( $(date +%s) - t0 )) s"
  [ "$CUT" = 1 ] && [ -s "$OUT/$n.png" ] && need_cut=1
done

if [ "$need_cut" = 1 ]; then
  python3 -m pip install -q "rembg[cpu,cli]" 2>&1 | tail -1
  for j in "${pending[@]}"; do
    n=$(basename "$j" .json)
    grep -q '"cut": *true' "$j" || continue
    [ -s "$OUT/$n.png" ] || continue
    rembg i -m birefnet-general "$OUT/$n.png" "$OUT/${n}_cut.png" 2>&1 | tail -2 \
      || rembg i "$OUT/$n.png" "$OUT/${n}_cut.png" 2>&1 | tail -2
    ls -la "$OUT/${n}_cut.png"
  done
fi
ls -la "$OUT"
