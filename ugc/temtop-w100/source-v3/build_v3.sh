#!/usr/bin/env bash
# Rebuilds the v3 ad from its sources. Needs python3 (numpy, scipy, opencv-python, onnxruntime),
# node 18+ with playwright-core, ffmpeg, curl, and the v2 product clips (../source-v2/clips).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p clips stock work models

# 1. stock footage (Pexels) and depth model
while read -r name url; do
  [[ -z "$name" || "$name" == \#* ]] && continue
  [ -s "stock/$name.mp4" ] || curl -fsSL "$url" -o "stock/$name.mp4"
done < stock.txt
[ -s models/depth_anything_v2_vits.onnx ] || curl -fsSL -o models/depth_anything_v2_vits.onnx \
  https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx

# 2. exact W100 screens: render the UI replica pages, then put them on the product shots
cd screen/ui
for p in "aq good" "aq cook" "aq co2" "chart cook" "forecast good"; do set -- $p; node render_ui.js $1 $2 4.0 24 frames_${1}_$2; done
NOTOUCH=1 node render_ui.js alerts good 4.0 24 frames_alerts_good
NOTOUCH=1 node render_ui.js home morning 1 1 frames_home_morning 0 && mv frames_home_morning/s_0.00.png frames_home_morning/f_0000.png
cd ../..
V2=../source-v2/clips
ffmpeg -v error -y -i $V2/K04_omni.mp4 -vf "scale=1080:1920:flags=lanczos" clips/K04_omni_1080.mp4
ffmpeg -v error -y -i clips/K04_omni_1080.mp4 -vf "crop=636:1130:242:550,scale=1080:1920:flags=lanczos" clips/k04_z1.7.mp4
ffmpeg -v error -y -i clips/K04_omni_1080.mp4 -vf "crop=490:872:315:679,scale=1080:1920:flags=lanczos" clips/k04_z2.2.mp4
R=screen/screen_replace.py; U=screen/ui
python3 $R clips/K04_omni_1080.mp4 $U/frames_aq_cook clips/K04_aq_cook.mp4
python3 $R clips/K04_omni_1080.mp4 $U/frames_home_morning clips/K04_home.mp4
python3 $R clips/k04_z1.7.mp4 $U/frames_home_morning clips/K04z_home.mp4
python3 $R clips/k04_z1.7.mp4 $U/frames_aq_good clips/K04z_aq_good.mp4
python3 $R clips/k04_z2.2.mp4 $U/frames_aq_good clips/K04zz_aq_good.mp4
python3 $R clips/k04_z2.2.mp4 $U/frames_aq_co2 clips/K04z_aq_co2.mp4
python3 $R clips/k04_z2.2.mp4 $U/frames_chart_cook clips/K04z_chart.mp4
python3 $R clips/k04_z1.7.mp4 $U/frames_forecast_good clips/K04z_fc.mp4
python3 $R clips/k04_z2.2.mp4 $U/frames_alerts_good clips/K04z_alerts.mp4
python3 $R clips/k04_z2.2.mp4 $U/frames_aq_cook clips/K04z_aq_cook.mp4
python3 screen/screen_replace_occ.py $V2/K07_par.mp4 $U/frames_home_morning clips/K07_home.mp4
cp $V2/K03_par.mp4 $V2/K05_omni.mp4 clips/
python3 ../source-v2/parallax.py ../source-v2/kf/K03.jpg clips/K03_par4.mp4 4.0 30 orbit

# 3. presenter: exact screen + blinks + handheld 2.5D camera
python3 screen/presenter.py kf/m_kf01.png kf/m_kf01_quad.npy $U/frames_home_morning/f_0000.png clips/P_hook.mp4 3.0 30 1.05 '[[222,492,31,11,11],[362,505,31,11,11]]' 0.07
python3 screen/presenter.py kf/m_kf02_cta.png kf/m_kf02_cta_quad.npy $U/frames_home_morning/f_0000.png clips/P_cta.mp4 3.6 30 1.55 '[[228,491,33,13,13],[370,504,30,12,12]]' 0.06

# 4. edit, motion graphics, sound, final picture
python3 build_base_v3.py
python3 -c "import json;d=json.load(open('timeline_v3.json'));ws=[{**w,'t':round(w['t']+0.25,3),'e':round(w['e']+0.25,3)} for w in d['words']];open('timeline_v3.js','w').write('window.TL=%s;\n'%json.dumps({'words':ws},ensure_ascii=False))"
node render_ov.js frames overlay/index.html work/oframes 30 0 1620
ffmpeg -v error -y -i ../source-v2/audio/music_el.mp3 -ar 48000 -ac 2 audio/music_el.wav
ffmpeg -v error -y -i audio/vo_v3.mp3 -ar 48000 -ac 1 audio/vo_v3.wav
for f in audio/sfx_*.mp3; do ffmpeg -v error -y -i "$f" -ar 48000 -ac 2 "${f%.mp3}.wav"; done
ffmpeg -v error -y -ss 0.25 -t 2.75 -i clips/K05_omni.mp4 -vn -ar 48000 -ac 2 audio/k05.wav
ffmpeg -v error -y -ss 1.0 -t 1.4 -i stock/pan.mp4 -vn -ar 48000 -ac 2 audio/pan.wav
python3 audio_v3.py
bash master.sh work/mix_pre.wav work/mix_master.wav
python3 composite_v3.py ../temtop-w100-ugc-v3-9x16.mp4
