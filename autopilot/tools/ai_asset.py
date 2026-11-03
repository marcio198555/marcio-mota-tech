"""Range une image IA dans la bibliothèque du moteur : autopilot/assets/ai/<nom>.png

  python3 autopilot/tools/ai_asset.py <image.png> <nom> [--pad 8] [--max 1400]

- Image détourée (fond transparent) : coupe les bords vides pour que la base du personnage soit le bas de
  l'image (CHR.art pose le bas de l'image sur le sol), puis garde une petite marge.
- Image sans transparence (décor) : copiée telle quelle.
- Réduit l'image si son plus grand côté dépasse --max.
Affiche la taille finale ; ajouter ensuite une ligne dans autopilot/assets/ai/SOURCES.md.
"""
import argparse
import pathlib

from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("name")
ap.add_argument("--pad", type=int, default=8)
ap.add_argument("--max", type=int, default=1400)
a = ap.parse_args()

im = Image.open(a.src)
out = pathlib.Path(__file__).resolve().parents[1] / "assets" / "ai" / f"{a.name}.png"
out.parent.mkdir(parents=True, exist_ok=True)
if im.mode in ("RGBA", "LA") or "transparency" in im.info:
    im = im.convert("RGBA")
    alpha = im.getchannel("A").point(lambda v: 255 if v > 24 else 0)
    box = alpha.getbbox()
    if box:
        l, t, r, b = box
        p = a.pad
        im = im.crop((max(0, l - p), max(0, t - p), min(im.width, r + p), min(im.height, b + 2)))
else:
    im = im.convert("RGB")
if max(im.size) > a.max:
    k = a.max / max(im.size)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
im.save(out, optimize=True)
print(out, im.size)
