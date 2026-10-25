set -x
# Voix off : Piper (synthese vocale libre, hors ligne) + voix francaises.
P="$HOME/.cache/piper"
mkdir -p "$P/voices"
if [ ! -x "$P/piper/piper" ]; then
  curl -fsSL -o /tmp/piper.tgz https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz
  tar -xzf /tmp/piper.tgz -C "$P"
fi
for v in fr/fr_FR/tom/medium/fr_FR-tom-medium fr/fr_FR/upmc/medium/fr_FR-upmc-medium fr/fr_FR/mls/medium/fr_FR-mls-medium; do
  n=$(basename "$v")
  [ -s "$P/voices/$n.onnx" ] || curl -fsSL -o "$P/voices/$n.onnx" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$v.onnx"
  [ -s "$P/voices/$n.onnx.json" ] || curl -fsSL -o "$P/voices/$n.onnx.json" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$v.onnx.json"
done
ls -la "$P/voices"
python3 autopilot/tts/synth.py --piper "$P/piper/piper" --voices "$P/voices"
ls -laR autopilot/tts/out | head -80
