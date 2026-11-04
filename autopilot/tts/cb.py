"""Voix off avec Chatterbox Multilingual (Resemble AI, licence MIT), sur CPU dans GitHub Actions.

Pour chaque job autopilot/tts/cb_jobs/<id>.json sans manifest dans autopilot/tts/out/<id>/,
génère un WAV par segment et un manifest.json au même format que Piper (synth.py) :
assemble_vo.py, voice_fx.py, captime.py et la suite du montage marchent sans changement.

Format d'un job :
{
  "engine": "chatterbox",
  "lang": "fr",
  "ref": "autopilot/tts/refs/<fichier>.wav",   # optionnel : voix de référence (10 s environ)
  "exaggeration": 0.5,                          # expressivité (0.25 à 2 ; 0.5 = neutre)
  "cfg": 0.5,                                   # rythme / fidélité (0.2 à 1)
  "temperature": 0.8,
  "seed": 7,
  "segments": [{"id": "s01", "text": "..."}, ...]
}
Chatterbox marque chaque fichier d'un filigrane audio inaudible (Perth) qui signale une voix de synthèse.
"""
import json
import pathlib
import random
import sys
import time

import torch

_load = torch.load


def _cpu_load(*a, **k):
    k.setdefault("map_location", "cpu")
    return _load(*a, **k)


torch.load = _cpu_load  # les poids publiés ont été sauvegardés sur GPU

import torchaudio as ta  # noqa: E402
from chatterbox.mtl_tts import ChatterboxMultilingualTTS  # noqa: E402

root = pathlib.Path(__file__).resolve().parent
repo = root.parent.parent
import subprocess  # noqa: E402


def done_remote(stem):
    """Voix déjà poussée par un autre passage du pont ?"""
    subprocess.run(["git", "fetch", "-q", "origin", "tiktok-autopilot"], cwd=repo, capture_output=True)
    return subprocess.run(["git", "cat-file", "-e", f"origin/tiktok-autopilot:autopilot/tts/out/{stem}/manifest.json"],
                          cwd=repo, capture_output=True).returncode == 0


jobs = [j for j in sorted((root / "cb_jobs").glob("*.json"))
        if not (root / "out" / j.stem / "manifest.json").exists() and not done_remote(j.stem)]
if not jobs:
    print("chatterbox : rien à faire")
    sys.exit(0)

torch.set_num_threads(max(1, torch.get_num_threads()))
t0 = time.time()
model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
print("modèle chargé en", round(time.time() - t0), "s")

for job in jobs:
    spec = json.loads(job.read_text(encoding="utf-8"))
    out = root / "out" / job.stem
    out.mkdir(parents=True, exist_ok=True)
    ref = spec.get("ref")
    ref = str(repo / ref) if ref else None
    seed = int(spec.get("seed", 7))
    segs = []
    for s in spec["segments"]:
        random.seed(seed)
        torch.manual_seed(seed)
        text = " ".join(s["text"].split())
        t1 = time.time()
        kw = dict(language_id=spec.get("lang", "fr"),
                  exaggeration=float(spec.get("exaggeration", 0.5)),
                  cfg_weight=float(spec.get("cfg", 0.5)),
                  temperature=float(spec.get("temperature", 0.8)))
        if ref:
            kw["audio_prompt_path"] = ref
        wav = model.generate(text, **kw)
        f = out / f"{s['id']}.wav"
        # WAV 16 bits (PCM) : assemble_vo.py et asr.py lisent avec le module wave, qui refuse le WAV flottant
        ta.save(str(f), wav, model.sr, encoding="PCM_S", bits_per_sample=16)
        dur = wav.shape[-1] / model.sr
        segs.append({"id": s["id"], "text": text, "file": f.name, "duration": round(dur, 3), "rate": model.sr})
        print(job.stem, s["id"], round(dur, 2), "s audio en", round(time.time() - t1), "s")
    manifest = {"job": job.stem, "engine": "chatterbox-multilingual", "ref": spec.get("ref"),
                "segments": segs, "total": round(sum(x["duration"] for x in segs), 3)}
    (out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print("done", job.stem, manifest["total"], "s")
    # pousser cette voix tout de suite (fonction early_push fournie par bridge/job.sh), sans attendre les suivantes
    subprocess.run(["bash", "-c", f"type early_push >/dev/null 2>&1 && early_push 'voix {job.stem}'"], cwd=repo)
