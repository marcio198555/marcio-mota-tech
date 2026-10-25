"""Synthese des voix off de l'Autopilot TikTok avec Piper.

Pour chaque job autopilot/tts/jobs/<id>.json sans manifest dans autopilot/tts/out/<id>/,
genere un WAV par segment et un manifest.json (texte, fichier, duree).

Format d'un job :
{
  "voice": "fr_FR-tom-medium",      # modele Piper
  "speaker": 0,                      # optionnel (voix multi-locuteurs)
  "length_scale": 0.9,               # < 1 = debit plus rapide
  "noise_scale": 0.667, "noise_w": 0.8,
  "segments": [{"id": "s01", "text": "..."}, ...]
}
"""
import argparse
import json
import pathlib
import subprocess
import wave

ap = argparse.ArgumentParser()
ap.add_argument("--piper", required=True)
ap.add_argument("--voices", required=True)
ap.add_argument("--force", action="store_true")
a = ap.parse_args()

root = pathlib.Path(__file__).resolve().parent
for job in sorted((root / "jobs").glob("*.json")):
    out = root / "out" / job.stem
    if (out / "manifest.json").exists() and not a.force:
        print("skip", job.stem)
        continue
    spec = json.loads(job.read_text(encoding="utf-8"))
    voice = spec.get("voice", "fr_FR-tom-medium")
    model = pathlib.Path(a.voices) / f"{voice}.onnx"
    out.mkdir(parents=True, exist_ok=True)
    segs = []
    for s in spec["segments"]:
        wav = out / f"{s['id']}.wav"
        args = [
            a.piper, "--model", str(model), "--output_file", str(wav),
            "--length_scale", str(s.get("length_scale", spec.get("length_scale", 1.0))),
            "--noise_scale", str(spec.get("noise_scale", 0.667)),
            "--noise_w", str(spec.get("noise_w", 0.8)),
            "--sentence_silence", str(spec.get("sentence_silence", 0.12)),
        ]
        if "speaker" in spec:
            args += ["--speaker", str(spec["speaker"])]
        text = " ".join(s["text"].split())
        subprocess.run(args, input=(text + "\n").encode("utf-8"), check=True)
        with wave.open(str(wav)) as w:
            dur = w.getnframes() / float(w.getframerate())
            rate = w.getframerate()
        segs.append({"id": s["id"], "text": text, "file": wav.name, "duration": round(dur, 3), "rate": rate})
        print(job.stem, s["id"], round(dur, 2), "s")
    manifest = {"job": job.stem, "voice": voice, "segments": segs,
                "total": round(sum(x["duration"] for x in segs), 3)}
    (out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print("done", job.stem, manifest["total"], "s")
