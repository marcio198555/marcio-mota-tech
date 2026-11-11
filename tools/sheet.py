"""Glues screenshots side by side so several can be reviewed at once."""
import sys, os
from PIL import Image
src = sys.argv[1]; out = sys.argv[2]; names = sys.argv[3:]
ims = [Image.open(os.path.join(src, n + '.png')).convert('RGB') for n in names]
w = 390; h = int(ims[0].height * w / ims[0].width)
sheet = Image.new('RGB', (w * len(ims) + 8 * (len(ims) - 1), h), (40, 40, 40))
for i, im in enumerate(ims):
    sheet.paste(im.resize((w, h), Image.LANCZOS), (i * (w + 8), 0))
sheet.save(out)
print(out, sheet.size)
