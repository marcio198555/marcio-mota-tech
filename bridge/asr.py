import json, sys
from faster_whisper import WhisperModel
import subprocess, numpy as np
def load(f):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0
m = WhisperModel('medium', device='cpu', compute_type='int8')
res = {}
for f, lang in [('out/voix_off_v2.mp3', 'fr'), ('out/voix_off.mp3', 'fr'), ('out/music_el.mp3', None)]:
    segs, info = m.transcribe(load(f), language=lang, word_timestamps=True, vad_filter=(lang is None))
    words = []
    text = []
    for s in segs:
        text.append(s.text)
        for w in (s.words or []):
            words.append([round(w.start, 3), round(w.end, 3), w.word, round(w.probability, 3)])
    res[f] = {'lang': info.language, 'lang_prob': round(info.language_probability, 3), 'text': ' '.join(text), 'words': words}
    print(f, info.language, ' '.join(text)[:300], flush=True)
json.dump(res, open('out/asr.json', 'w'), ensure_ascii=False, indent=0)
