set -x
# Envoi anticipé : pousse tout de suite ce qui est prêt (voix, transcriptions, images), sans attendre la fin du job.
# Le commit final du workflow reste en place pour le reste.
early_push() {
  git config user.name "github-actions[bot]"
  git config user.email "41898283+github-actions[bot]@users.noreply.github.com"
  git add -f bridge/out autopilot/tts/out autopilot/asr/out 2>/dev/null || true
  git diff --cached --quiet && return 0
  git commit -q -m "bridge output ($1) [skip-bridge]" || return 0
  for i in 1 2 3; do
    git pull -q --rebase --autostash -X theirs origin tiktok-autopilot && git push -q origin HEAD:tiktok-autopilot && { echo "envoi anticipé : $1"; return 0; }
    sleep 5
  done
  echo "envoi anticipé impossible ($1), le commit final s'en chargera"
}
export -f early_push
# 1) Voix off : Piper (synthèse vocale libre, hors ligne) + voix françaises.
P="$HOME/.cache/piper"
mkdir -p "$P/voices"
if [ ! -x "$P/piper/piper" ]; then
  curl -fsSL -o /tmp/piper.tgz https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz
  tar -xzf /tmp/piper.tgz -C "$P"
fi
for v in fr/fr_FR/tom/medium/fr_FR-tom-medium fr/fr_FR/upmc/medium/fr_FR-upmc-medium fr/fr_FR/mls/medium/fr_FR-mls-medium fr/fr_FR/siwis/medium/fr_FR-siwis-medium; do
  n=$(basename "$v")
  [ -s "$P/voices/$n.onnx" ] || curl -fsSL -o "$P/voices/$n.onnx" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$v.onnx"
  [ -s "$P/voices/$n.onnx.json" ] || curl -fsSL -o "$P/voices/$n.onnx.json" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$v.onnx.json"
done
python3 autopilot/tts/synth.py --piper "$P/piper/piper" --voices "$P/voices"

# 2) Transcription mot à mot des voix off listées dans autopilot/asr/todo.txt
if [ -f autopilot/asr/todo.txt ]; then
  python3 -m pip install -q faster-whisper 2>&1 | tail -1
  python3 autopilot/asr/asr.py
  early_push transcription
fi
# 3) Voix Chatterbox multilingue (licence MIT) : autopilot/tts/cb_jobs/*.json sans manifest (40 min au plus)
if ls autopilot/tts/cb_jobs/*.json >/dev/null 2>&1; then timeout 40m bash autopilot/tts/cb.sh || echo "chatterbox : arrêt ou échec"; early_push voix; fi

# 4) Images open source Z-Image-Turbo (licence Apache 2.0) : autopilot/img/jobs/*.json sans image (dans le temps qui reste, 52 min au total)
# (budget : le job GitHub s'arrête à 60 min ; on garde 8 min pour la fin et le commit)
left=$(( 52*60 - SECONDS ))
if [ "$left" -gt 600 ] && ls autopilot/img/jobs/*.json >/dev/null 2>&1; then timeout "${left}s" bash autopilot/img/gen.sh || echo "img : arrêt ou échec"; fi
# 5) Détourage : autopilot/img/cut_todo.txt
left=$(( 55*60 - SECONDS ))
[ "$left" -gt 120 ] && { timeout "${left}s" bash autopilot/img/cut.sh || echo "cut : arrêt ou échec"; }

ls -la autopilot/tts/out autopilot/asr/out 2>/dev/null | head -40
