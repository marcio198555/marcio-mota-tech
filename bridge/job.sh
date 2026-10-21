set -x
python3 -m pip install -q gradio_client 2>&1 | tail -2
timeout 900 python3 bridge/wan.py
python3 -m pip install -q torch --index-url https://download.pytorch.org/whl/cpu 2>&1 | tail -2
python3 -m pip install -q spandrel opencv-python-headless 2>&1 | tail -2
curl -fsSL -o RealESRGAN_x2plus.pth https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth
nproc
timeout 2400 python3 bridge/upscale.py
ls -la out
