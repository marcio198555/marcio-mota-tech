# Carrousel photo TikTok du jour 84 (guirlande LED de Noël : combien en francs pour tout décembre) : fond sombre uni, dessin simple, texte écrit par le script.
# Chiffres : autopilot/days/day84/facts.md. Usage : python3 carousel77.py <dossier_sortie>
from PIL import Image, ImageDraw, ImageFont
import os, sys
W,H=1080,1920; N=8
F='/usr/share/fonts/opentype/inter/'
def f(n,s): return ImageFont.truetype(F+n,s)
BG=(14,17,24); ACC=(255,196,0); RED=(255,77,77); WH=(245,246,250); GR=(150,158,175); GRN=(80,220,140)
out=sys.argv[1]; os.makedirs(out,exist_ok=True)
def bg(): return Image.new('RGB',(W,H),BG)
def wrap(d,txt,font,maxw):
    words=txt.split(' '); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t,font=font)<=maxw: cur=t
        else: lines.append(cur); cur=w
    lines.append(cur); return lines
def block(d,y,txt,font,fill,maxw=800,gap=12):
    txt=txt.replace('« ','«\u00a0').replace(' »','\u00a0»')
    for ln in wrap(d,txt,font,maxw):
        w=d.textlength(ln,font=font); d.text(((W-w)/2,y),ln,font=font,fill=fill); y+=font.size+gap
    return y
def head(d,n):
    d.text((90,240),'JE MESURE TOUT',font=f('InterDisplay-Black.otf',38),fill=ACC)
    t=f'{n}/{N}'; fo=f('InterDisplay-Bold.otf',38); d.text((990-d.textlength(t,font=fo),240),t,font=fo,fill=GR)
def card(d,y0,y1): d.rounded_rectangle((80,y0,1000,y1),radius=36,fill=(24,28,38),outline=(60,66,82),width=3)
def swipe(d):
    fo=f('InterDisplay-Bold.otf',40); t='glisse →'; d.text(((W-d.textlength(t,font=fo))/2,1420),t,font=fo,fill=GR)

import math
def save(im,i): im.save(f'{out}/slide{i}.jpg',quality=92)
def garland(d,x0,x1,y,sag,n,style):
    pts=[(x0+(x1-x0)*i/40, y+sag*4*(i/40)*(1-i/40)) for i in range(41)]
    d.line(pts,fill=(31,107,69),width=6)
    cols=[(255,90,79),(255,211,90),(82,214,255),(125,255,138),(255,139,216)]
    for i in range(n):
        u=(i+0.5)/n; x=x0+(x1-x0)*u; yy=y+sag*4*u*(1-u)
        if style=='inc':
            c=cols[i%5]; d.ellipse((x-26,yy+2,x+26,yy+70),fill=tuple(int(v*0.35) for v in c)); d.ellipse((x-16,yy+10,x+16,yy+60),fill=c); d.rectangle((x-9,yy-4,x+9,yy+10),fill=(42,58,46))
        else:
            d.ellipse((x-16,yy-4,x+16,yy+28),fill=(90,70,30)); d.ellipse((x-9,yy+3,x+9,yy+21),fill=(255,241,201))

# 1 : objet + question
im=bg(); d=ImageDraw.Draw(im); head(d,1)
garland(d,120,520,380,160,6,'inc'); garland(d,560,960,380,160,12,'led')
y=block(d,700,'Ta guirlande allumée tout décembre',f('InterDisplay-Bold.otf',66),WH)
y=block(d,y+20,'ÇA COÛTE COMBIEN EN FRANCS ?',f('InterDisplay-Black.otf',84),ACC,gap=6)
block(d,y+30,'LED contre ancienne guirlande à ampoules',f('InterDisplay-Bold.otf',40),GR)
swipe(d); save(im,1)

def slide(i,top,big,bigcol,sub,note):
    im=bg(); d=ImageDraw.Draw(im); head(d,i); card(d,330,1380)
    y=block(d,400,top,f('InterDisplay-Bold.otf',64),WH)
    y=block(d,y+50,big,f('InterDisplay-Black.otf',150),bigcol,gap=4)
    if sub: y=block(d,y+40,sub,f('InterDisplay-Black.otf',72),WH)
    block(d,max(y+60,1150),note,f('InterDisplay-Bold.otf',36),GR,maxw=800)
    swipe(d); save(im,i)
slide(2,'Guirlande LED de 100 diodes','3 W',ACC,'sur la fiche du fabricant','Fiche Konstsmide 6304-100 : 3 kWh pour 1000 h (étiquette énergie).')
slide(3,'Ancienne guirlande miniature à incandescence','42 W',RED,'en moyenne','Département américain de l\'énergie, rapport d\'octobre 2008 (guirlandes 120 V). Soit 14 fois cette LED.')
slide(4,'Allumée jour et nuit, tout décembre','744 h',ACC,'31 jours × 24 h','Scénario « jour et nuit », pas une mesure.')
slide(5,'La guirlande LED, tout décembre','0,62 CHF',GRN,'3 W × 744 h = 2,23 kWh','Tarif médian ElCom 2026 : 27,7 ct./kWh hors TVA (ménage H4).')
slide(6,'L\'ancienne, le même mois','8,66 CHF',RED,'42 W × 744 h = 31,2 kWh','Même tarif : 27,7 ct./kWh hors TVA.')
# 7 verdict
im=bg(); d=ImageDraw.Draw(im); head(d,7); card(d,330,1380)
y=block(d,400,'VERDICT',f('InterDisplay-Black.otf',64),ACC)
y=block(d,y+30,'Ici, la LED coûte 14 fois moins que l\'ancienne. Avec une minuterie, encore moins.',f('InterDisplay-Black.otf',66),WH,gap=10)
y=block(d,y+50,'Exemple : 6 h par soir, facture ÷ 4 → LED 0,15\u00a0CHF, ancienne 2,16\u00a0CHF pour tout décembre.',f('InterDisplay-Bold.otf',52),GRN)
block(d,y+40,'SuisseEnergie conseille une minuterie. 6 h par soir est une valeur d\'exemple ; montants hors TVA.',f('InterDisplay-Bold.otf',36),GR,maxw=800)
swipe(d); save(im,7)
# 8 commentaires
im=bg(); d=ImageDraw.Draw(im); head(d,8)
garland(d,200,880,380,140,10,'led')
y=block(d,700,'Ta guirlande reste allumée combien d\'heures par soir ?',f('InterDisplay-Black.otf',72),WH,gap=10)
y=block(d,y+30,'Écris-le en commentaire',f('InterDisplay-Bold.otf',56),ACC)
block(d,y+60,'Abonne-toi : un chiffre vérifié chaque jour sur les objets de ta maison.',f('InterDisplay-Bold.otf',44),GR)
save(im,8)
