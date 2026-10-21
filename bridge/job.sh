set -x
python3 -m pip install -q gradio_client 2>&1 | tail -2
timeout 1500 python3 bridge/wan.py
ls -la out
