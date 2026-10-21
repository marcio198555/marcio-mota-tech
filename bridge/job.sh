set -x
python3 -m pip install -q faster-whisper 2>&1 | tail -2
timeout 2400 python3 bridge/asr.py
ls -la out
