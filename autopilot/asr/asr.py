"""Transcription mot à mot (faster-whisper) des voix off, pour vérifier la prononciation
et caler les sous-titres. Lit autopilot/asr/todo.txt (un chemin WAV 16 bits par ligne) et écrit
autopilot/asr/out/<nom>.json : texte, mots [début, fin, mot, probabilité].
Le WAV est lu et rééchantillonné à 16 kHz en numpy (aucun ffmpeg ni PyAV requis)."""
import json
import pathlib
import wave

import numpy as np
from faster_whisper import WhisperModel

root = pathlib.Path(__file__).resolve().parent
todo = root / "todo.txt"
out_dir = root / "out"
out_dir.mkdir(exist_ok=True)
items = [l.strip() for l in todo.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")] if todo.exists() else []
pending = [p for p in items if not (out_dir / (pathlib.Path(p).stem + ".json")).exists()]
if not pending:
    print("asr: rien à faire")
    raise SystemExit(0)


def load16k(path):
    with wave.open(path) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    if ch > 1:
        x = x.reshape(-1, ch).mean(axis=1)
    if sr == 16000:
        return x
    # passe-bas (sinc fenêtré) puis interpolation linéaire vers 16 kHz
    cutoff = 7600.0 / sr
    n = np.arange(-64, 65)
    h = 2 * cutoff * np.sinc(2 * cutoff * n) * np.hamming(len(n))
    h /= h.sum()
    y = np.convolve(x, h, mode="same")
    t_new = np.arange(0, len(y) / sr, 1 / 16000.0)
    return np.interp(t_new, np.arange(len(y)) / sr, y).astype(np.float32)


model = WhisperModel("medium", device="cpu", compute_type="int8")
for p in pending:
    audio = load16k(p)
    segs, info = model.transcribe(audio, language="fr", word_timestamps=True, beam_size=5)
    words, text = [], []
    for s in segs:
        text.append(s.text.strip())
        for w in (s.words or []):
            words.append([round(w.start, 3), round(w.end, 3), w.word.strip(), round(w.probability, 3)])
    res = {"file": p, "text": " ".join(text), "words": words}
    (out_dir / (pathlib.Path(p).stem + ".json")).write_text(json.dumps(res, ensure_ascii=False, indent=0), encoding="utf-8")
    print("asr", p, "->", res["text"][:400], flush=True)
