set -x
sudo apt-get update -qq >/dev/null 2>&1; sudo apt-get install -y -qq ffmpeg >/dev/null 2>&1; ffmpeg -version | head -1
python3 -m pip install -q faster-whisper 2>&1 | tail -2
timeout 1500 python3 bridge/asr.py
python3 -m pip install -q torch --index-url https://download.pytorch.org/whl/cpu 2>&1 | tail -2
python3 -m pip install -q spandrel opencv-python-headless 2>&1 | tail -2
curl -fsSL -o RealESRGAN_x2plus.pth https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth
nproc
timeout 2400 python3 bridge/upscale.py
ls -la out
