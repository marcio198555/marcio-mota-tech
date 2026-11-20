# Carrousel photo TikTok du jour 76 (enceinte « 100 W » : crête ou RMS) : fond sombre uni, dessin simple, texte écrit par le script.
# Chiffres : autopilot/days/day76/facts.md. Usage : python3 carousel76.py <dossier_sortie>
from PIL import Image, ImageDraw, ImageFont
import os, sys
W,H=1080,1920; N=7
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
    for ln in wrap(d,txt,font,maxw):
        w=d.textlength(ln,font=font); d.text(((W-w)/2,y),ln,font=font,fill=fill); y+=font.size+gap
    return y
def head(d,n):
    d.text((90,240),'JE MESURE TOUT',font=f('InterDisplay-Black.otf',38),fill=ACC)
    t=f'{n}/{N}'; fo=f('InterDisplay-Bold.otf',38); d.text((990-d.textlength(t,font=fo),240),t,font=fo,fill=GR)
def card(d,y0,y1): d.rounded_rectangle((70,y0,1010,y1),radius=36,fill=(24,28,38),outline=(60,66,82),width=3)
def swipe(d):
    fo=f('InterDisplay-Bold.otf',40); t='glisse →'; d.text(((W-d.textlength(t,font=fo))/2,1420),t,font=fo,fill=GR)
def speaker(d,cx,cy,s):
    d.rounded_rectangle((cx-230*s,cy-150*s,cx+230*s,cy+150*s),radius=int(90*s),fill=(35,43,59),outline=(70,82,107),width=6)
    for dx in (-110,110):
        x=cx+dx*s
        for r,c in ((92,(21,27,39)),(70,(47,58,80)),(24,ACC)): d.ellipse((x-r*s,cy-r*s,x+r*s,cy+r*s),fill=c)
def save(im,i): im.save(f'{out}/slide{i}.jpg',quality=92)

# 1 : objet + question
im=bg(); d=ImageDraw.Draw(im); head(d,1)
speaker(d,W//2,520,1.25)
y=block(d,780,'Ton enceinte «\u00a0100\u00a0W\u00a0» :',f('InterDisplay-Bold.otf',66),WH)
y=block(d,y+20,'WATTS CRÊTE OU WATTS RMS\u00a0?',f('InterDisplay-Black.otf',104),ACC,gap=6)
block(d,y+30,'Fiches officielles JBL',f('InterDisplay-Bold.otf',36),GR)
swipe(d); save(im,1)

def slide(i,top,big,bigcol,sub,note):
    im=bg(); d=ImageDraw.Draw(im); head(d,i); card(d,330,1380)
    y=block(d,400,top,f('InterDisplay-Bold.otf',64),WH)
    y=block(d,y+50,big,f('InterDisplay-Black.otf',150),bigcol,gap=4)
    if sub: y=block(d,y+40,sub,f('InterDisplay-Black.otf',72),WH)
    block(d,max(y+60,1150),note,f('InterDisplay-Bold.otf',36),GR,maxw=800)
    swipe(d); save(im,i)
slide(2,'Enceinte de sono JBL EON710 : puissance crête','1 300 W',RED,'un pic très bref','Fiche JBL (support Harman). Crête : « quelques millisecondes », selon le fabricant audio Cerwin-Vega.')
slide(3,'La même, en puissance continue','650 W',GRN,'pile la moitié','Fiche JBL EON710 : Power Rating Continuous 650 W, Peak 1 300 W.')
slide(4,'Pire : un ampli annoncé «\u00a01\u00a0000\u00a0W\u00a0crête\u00a0»','250 W',RED,'RMS, peut-être','Exemple donné par le fabricant audio Cerwin-Vega (blog, 15.09.2025). Le rapport crête / RMS n\'est pas fixe.')
slide(5,'JBL Boombox 3 sur secteur : 80 + 2 × 40 + 2 × 10 W RMS','180 W',GRN,'sur batterie : 136 W','Fiche JBL : 60 + 2 × 30 + 2 × 8 W RMS en mode batterie. Même enceinte, moins de watts.')
# 6 verdict
im=bg(); d=ImageDraw.Draw(im); head(d,6); card(d,330,1380)
y=block(d,400,'VERDICT',f('InterDisplay-Black.otf',64),ACC)
y=block(d,y+30,'«\u00a0100\u00a0W\u00a0» tout seul ne dit rien. Compare les watts RMS (continus), pas les watts crête.',f('InterDisplay-Black.otf',70),WH,gap=10)
y=block(d,y+50,'Avant d\'acheter : cherche «\u00a0RMS\u00a0» ou «\u00a0continu\u00a0» sur la fiche.',f('InterDisplay-Bold.otf',54),GRN)
block(d,y+40,'La norme IEC 60268-5 (2003, haut-parleurs passifs) distingue 4 puissances différentes.',f('InterDisplay-Bold.otf',36),GR,maxw=800)
swipe(d); save(im,6)
# 7 commentaires
im=bg(); d=ImageDraw.Draw(im); head(d,7)
speaker(d,W//2,500,1.0)
y=block(d,760,'Ta boîte d\'enceinte écrit «\u00a0RMS\u00a0», «\u00a0crête\u00a0»… ou rien du tout ?',f('InterDisplay-Black.otf',74),WH,gap=10)
y=block(d,y+30,'Écris-le en commentaire',f('InterDisplay-Bold.otf',56),ACC)
block(d,y+60,'Abonne-toi : un chiffre vérifié chaque jour sur les objets de ta maison.',f('InterDisplay-Bold.otf',44),GR)
save(im,7)
