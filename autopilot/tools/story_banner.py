"""Bandeau de la version Story Instagram (PNG transparent 1080×1920) : « PLUS DE VIDÉOS SUR TIKTOK · @marcio.mota8 ».
Placé en bas (y 1545–1675), dans la zone que les vidéos TikTok laissent vide (y > 1540) et au-dessus de la barre
« Envoyer un message » d'Instagram.  python3 story_banner.py sortie.png"""
import sys
from PIL import Image, ImageDraw, ImageFont
W, H = 1080, 1920
im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 34)
f2 = ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Black.otf', 62)
l1, l2 = 'PLUS DE VIDÉOS SUR TIKTOK', '@marcio.mota8'
w1 = d.textlength(l1, font=f1); w2 = d.textlength(l2, font=f2)
pw = max(w1, w2) + 120; x0 = (W - pw) / 2; y0, y1 = 1545, 1675
d.rounded_rectangle([x0, y0, x0 + pw, y1], radius=36, fill=(3, 4, 8, 235), outline=(201, 168, 76, 255), width=4)
d.ellipse([x0 + 34, y0 + 30, x0 + 52, y0 + 48], fill=(200, 32, 48, 255))
d.text(((W - w1) / 2 + 12, y0 + 20), l1, font=f1, fill=(230, 198, 106, 255))
d.text(((W - w2) / 2, y0 + 56), l2, font=f2, fill=(255, 255, 255, 255))
im.save(sys.argv[1]); print('bandeau', sys.argv[1])
