"""Format R « Réel » : une vidéo Instagram de Marcio (ses mains, son produit) devient une vidéo TikTok courte.

  python3 autopilot/tools/ig_cut.py <source.mp4> <sortie.mp4> --seg 3.2-9.8 --seg 21-26.5 \
      --hook "Ce robot vide sa poussière tout seul" [--hook-dur 2.6] [--mute] [--music bed.wav] [--sheet planche.jpg]

- garde seulement les passages choisis (--seg début-fin, en secondes, dans l'ordre voulu), 10 à 20 s au total ;
- format 1080 × 1920 (recadré au centre si la source n'est pas en 9:16) ;
- accroche écrite en gros pendant les premières secondes (--hook), au tiers haut, lisible sans le son ;
- son d'origine gardé (sa voix, le bruit du produit) ; --mute le coupe (musique d'une bibliothèque Instagram, par
  exemple) et --music met à la place une musique libre (audio/synth.py bed) ; volume final -14 LUFS ;
- --sheet écrit une planche de contrôle (une image par seconde) pour vérifier le résultat avant publication.
Avec --scan, écrit seulement une planche de la source (une image par seconde, avec le temps) pour choisir les passages.
"""
import argparse
import json
import pathlib
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
W, H = 1080, 1920


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(r.stderr[-2000:])
    return r.stdout


def probe(src):
    j = json.loads(run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration",
                        "-of", "json", src]))
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    has_a = any(s["codec_type"] == "audio" for s in j["streams"])
    return float(j["format"]["duration"]), v["width"], v["height"], has_a


def sheet(video, out, every=1.0, cols=8, label=True):
    dur = probe(video)[0]
    tmp = pathlib.Path(tempfile.mkdtemp())
    run(["ffmpeg", "-loglevel", "error", "-y", "-i", video, "-vf", f"fps=1/{every},scale=180:-2",
         str(tmp / "f_%04d.jpg")])
    fs = sorted(tmp.glob("f_*.jpg"))
    if not fs:
        raise SystemExit("aucune image")
    w, h = Image.open(fs[0]).size
    rows = (len(fs) + cols - 1) // cols
    sh = Image.new("RGB", (cols * w, rows * h), "white")
    d = ImageDraw.Draw(sh)
    f = ImageFont.truetype(FONT, 22)
    for i, p in enumerate(fs):
        x, y = (i % cols) * w, (i // cols) * h
        sh.paste(Image.open(p), (x, y))
        if label:
            t = f"{i * every:.0f}s"
            d.text((x + 6, y + 4), t, font=f, fill="yellow", stroke_width=3, stroke_fill="black")
    sh.save(out, quality=82)
    print(f"planche {out} : {len(fs)} images, {dur:.1f} s")


def hook_png(text, path, y0=330):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    size = 84
    while True:
        f = ImageFont.truetype(FONT, size)
        words, lines, cur = text.split(), [], ""
        for wd in words:
            t = (cur + " " + wd).strip()
            if d.textlength(t, font=f) <= 920:
                cur = t
            else:
                lines.append(cur)
                cur = wd
        lines.append(cur)
        if len(lines) <= 3 or size <= 56:
            break
        size -= 6
    lh = int(size * 1.18)
    box_h = lh * len(lines) + 56
    d.rounded_rectangle((60, y0 - 28, W - 60, y0 - 28 + box_h), radius=34, fill=(8, 10, 16, 200))
    for i, ln in enumerate(lines):
        tw = d.textlength(ln, font=f)
        d.text(((W - tw) / 2, y0 + i * lh), ln, font=f, fill="white", stroke_width=4, stroke_fill="black")
    im.save(path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out", nargs="?")
    ap.add_argument("--seg", action="append", default=[])
    ap.add_argument("--hook", default="")
    ap.add_argument("--hook-dur", type=float, default=2.6)
    ap.add_argument("--hook-y", type=int, default=330, help="hauteur du haut de l'accroche (330 = tiers haut ; 820 = milieu)")
    ap.add_argument("--speed", type=float, default=1.0, help="accélère l'image (1.25 = 25 %% plus vite)")
    ap.add_argument("--mute", action="store_true")
    ap.add_argument("--music")
    ap.add_argument("--sheet")
    ap.add_argument("--scan", help="planche de la source seulement (chemin de l'image)")
    a = ap.parse_args()

    if a.scan:
        sheet(a.src, a.scan)
        return
    dur, vw, vh, has_a = probe(a.src)
    segs = [tuple(float(x) for x in s.split("-")) for s in a.seg] or [(0.0, min(dur, 15.0))]
    total = sum(e - s for s, e in segs) / a.speed
    tmp = pathlib.Path(tempfile.mkdtemp())
    fc, cat = [], ""
    vf = (f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},setsar=1,fps=30,"
          "format=yuv420p")
    use_src_audio = has_a and not a.mute
    for i, (s, e) in enumerate(segs):
        fc.append(f"[0:v]trim={s}:{e},setpts=(PTS-STARTPTS)/{a.speed},{vf}[v{i}]")
        if use_src_audio:
            fc.append(f"[0:a]atrim={s}:{e},asetpts=PTS-STARTPTS,atempo={a.speed},aresample=48000[a{i}]")
            cat += f"[v{i}][a{i}]"
        else:
            cat += f"[v{i}]"
    n = len(segs)
    if use_src_audio:
        fc.append(f"{cat}concat=n={n}:v=1:a=1[vc][ac]")
    else:
        fc.append(f"{cat}concat=n={n}:v=1:a=0[vc]")
    inputs = ["-i", a.src]
    vlast = "vc"
    if a.hook:
        hp = tmp / "hook.png"
        hook_png(a.hook, hp, a.hook_y)
        inputs += ["-loop", "1", "-t", f"{total:.2f}", "-i", str(hp)]
        fo = max(0.0, a.hook_dur - 0.3)
        fc.append(f"[1:v]format=rgba,fade=t=out:st={fo}:d=0.3:alpha=1[hk]")
        fc.append(f"[vc][hk]overlay=0:0:enable='lte(t,{a.hook_dur})'[vh]")
        vlast = "vh"
    amap = None
    if use_src_audio:
        fc.append(f"[ac]loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={max(0, total - 0.3):.2f}:d=0.3[aout]")
        amap = "[aout]"
    elif a.music:
        k = inputs.count("-i")
        inputs += ["-i", a.music]
        fc.append(f"[{k}:a]atrim=0:{total:.2f},asetpts=PTS-STARTPTS,loudnorm=I=-14:TP=-1.5:LRA=11,"
                  f"afade=t=out:st={max(0, total - 0.6):.2f}:d=0.6[aout]")
        amap = "[aout]"
    out = pathlib.Path(a.out)
    part = out.with_name(out.stem + ".part.mp4")
    cmd = ["ffmpeg", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", f"[{vlast}]"]
    if amap:
        cmd += ["-map", amap, "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
    cmd += ["-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30",
            "-t", f"{total:.2f}", "-movflags", "+faststart", str(part)]
    run(cmd)
    part.rename(out)
    print(f"{out} : {total:.1f} s, {len(segs)} passage(s), son {'source' if use_src_audio else ('musique' if a.music else 'aucun')}")
    if a.sheet:
        sheet(str(out), a.sheet, every=1.0, cols=8)


if __name__ == "__main__":
    main()
