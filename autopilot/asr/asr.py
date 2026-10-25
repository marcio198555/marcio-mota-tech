"""Transcription mot à mot (faster-whisper) des voix off, pour vérifier la prononciation
et caler les sous-titres. Lit autopilot/asr/todo.txt (un chemin audio par ligne) et écrit
autopilot/asr/out/<nom>.json : texte, mots [début, fin, mot, probabilité]."""
import json
import pathlib
import subprocess

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

model = WhisperModel("medium", device="cpu", compute_type="int8")
for p in pending:
    # faster-whisper décode le fichier lui-même (PyAV), pas besoin de ffmpeg sur le runner
    segs, info = model.transcribe(p, language="fr", word_timestamps=True, beam_size=5)
    words, text = [], []
    for s in segs:
        text.append(s.text.strip())
        for w in (s.words or []):
            words.append([round(w.start, 3), round(w.end, 3), w.word.strip(), round(w.probability, 3)])
    res = {"file": p, "text": " ".join(text), "words": words}
    (out_dir / (pathlib.Path(p).stem + ".json")).write_text(json.dumps(res, ensure_ascii=False, indent=0), encoding="utf-8")
    print("asr", p, "->", res["text"][:400], flush=True)
