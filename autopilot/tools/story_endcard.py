"""Image de fin des Stories Instagram de l'autopilote (accord de Marcio du 05.11.2026 : « Oui, ajoute-la »).

  python3 autopilot/tools/story_endcard.py <story.mp4> <sortie.mp4> [--dur 2.0]

Ajoute à la fin de la Story 2 secondes : la dernière image floutée et assombrie, avec
« NOUVELLE VIDÉO SUR TIKTOK » et « @marcio.mota8 » (couleurs du design de Marcio : fond #030408, or, rouge).
Même format que la Story (1080 × 1920, 30 i/s, AAC 48 kHz stéréo) ; le son se coupe en douceur avant l'image de fin.
"""
import argparse
import json
import pathlib
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

W, H = 1080, 1920
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
BLACK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(r.stderr[-2000:])
    return r.stdout


def duration(p):
    return float(json.loads(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", p]))
                 ["format"]["duration"])


def card(last_png, out_png):
    bg = Image.open(last_png).convert("RGB").resize((W, H))
    bg = bg.filter(ImageFilter.GaussianBlur(22))
    bg = ImageEnhance.Brightness(bg).enhance(0.45)
    bg = Image.blend(bg, Image.new("RGB", (W, H), (3, 4, 8)), 0.55).convert("RGBA")
    d = ImageDraw.Draw(bg)
    f1 = ImageFont.truetype(MONO, 40)
    f2 = ImageFont.truetype(BLACK, 104)
    f3 = ImageFont.truetype(MONO, 34)
    l1, l2, l3 = "NOUVELLE VIDÉO SUR TIKTOK", "@marcio.mota8", "LA VIDÉO EST EN LIGNE"
    w1, w2, w3 = (d.textlength(t, font=f) for t, f in ((l1, f1), (l2, f2), (l3, f3)))
    pw = max(w1, w2) + 140
    x0, y0 = (W - pw) / 2, 760
    y1 = y0 + 330
    d.rounded_rectangle([x0, y0, x0 + pw, y1], radius=44, fill=(3, 4, 8, 235), outline=(201, 168, 76, 255), width=5)
    d.ellipse([x0 + 42, y0 + 48, x0 + 64, y0 + 70], fill=(224, 65, 79, 255))
    d.text(((W - w1) / 2 + 14, y0 + 38), l1, font=f1, fill=(230, 198, 106, 255))
    d.text(((W - w2) / 2, y0 + 110), l2, font=f2, fill=(255, 255, 255, 255))
    d.text(((W - w3) / 2, y0 + 254), l3, font=f3, fill=(154, 166, 192, 255))
    bg.convert("RGB").save(out_png)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--dur", type=float, default=2.0)
    a = ap.parse_args()
    tmp = pathlib.Path(tempfile.mkdtemp())
    last, cpng = tmp / "last.png", tmp / "card.png"
    run(["ffmpeg", "-loglevel", "error", "-y", "-sseof", "-0.2", "-i", a.src, "-frames:v", "1", "-update", "1", str(last)])
    card(last, cpng)
    d0 = duration(a.src)
    out = pathlib.Path(a.out)
    part = out.with_name(out.stem + ".part.mp4")
    fc = (f"[0:v]fps=30,scale={W}:{H},setsar=1,format=yuv420p[v0];"
          f"[0:a]aresample=48000,aformat=channel_layouts=stereo,afade=t=out:st={max(0, d0 - 0.35):.2f}:d=0.35[a0];"
          f"[1:v]fps=30,scale={W}:{H},setsar=1,format=yuv420p,fade=t=in:st=0:d=0.25[v1];"
          "[v0][a0][v1][2:a]concat=n=2:v=1:a=1[v][a]")
    run(["ffmpeg", "-loglevel", "error", "-y", "-i", a.src,
         "-loop", "1", "-framerate", "30", "-t", f"{a.dur:.2f}", "-i", str(cpng),
         "-f", "lavfi", "-t", f"{a.dur:.2f}", "-i", "anullsrc=r=48000:cl=stereo",
         "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(part)])
    part.rename(out)
    print(f"{out} : {duration(str(out)):.2f} s (Story {d0:.2f} s + fin {a.dur:.1f} s)")


if __name__ == "__main__":
    main()
