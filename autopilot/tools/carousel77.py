# Carrousel photo TikTok du jour 77 (purificateur « 50 m² » : combien de renouvellements d'air) : fond sombre uni, dessin simple, texte écrit par le script.
# Chiffres : autopilot/days/day77/facts.md. Usage : python3 carousel77.py <dossier_sortie>
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
def block(d,y,txt,font,fill,maxw=880,gap=12):
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
def purifier(d,cx,cy,s):
    d.rounded_rectangle((cx-130*s,cy-220*s,cx+130*s,cy+220*s),radius=int(60*s),fill=(230,233,239),outline=(154,163,181),width=6)
    d.ellipse((cx-110*s,cy-227*s,cx+110*s,cy-183*s),fill=(47,58,80))
    for i in range(9): d.rectangle((cx-100*s,cy+(-120+i*34)*s,cx+100*s,cy+(-108+i*34)*s),fill=(185,192,205))
    d.ellipse((cx-14*s,cy+156*s,cx+14*s,cy+184*s),fill=GRN)
def save(im,i): im.save(f'{out}/slide{i}.jpg',quality=92)

# 1 : objet + question
im=bg(); d=ImageDraw.Draw(im); head(d,1)
purifier(d,W//2,560,1.0)
y=block(d,840,'Ton purificateur « 50 m² » :',f('InterDisplay-Bold.otf',66),WH)
y=block(d,y+20,'AVEC COMBIEN DE RENOUVELLEMENTS D\'AIR ?',f('InterDisplay-Black.otf',92),ACC,gap=6)
block(d,y+30,'Notice Levoit · livre blanc AHAM',f('InterDisplay-Bold.otf',36),GR)
swipe(d); save(im,1)

def slide(i,top,big,bigcol,sub,note):
    im=bg(); d=ImageDraw.Draw(im); head(d,i); card(d,330,1380)
    y=block(d,400,top,f('InterDisplay-Bold.otf',64),WH)
    y=block(d,y+50,big,f('InterDisplay-Black.otf',150),bigcol,gap=4)
    if sub: y=block(d,y+40,sub,f('InterDisplay-Black.otf',72),WH)
    block(d,max(y+60,1150),note,f('InterDisplay-Bold.otf',36),GR,maxw=820)
    swipe(d); save(im,i)
slide(2,'Levoit Core 300S : débit d\'air propre (CADR)','240 m³/h',ACC,'surface de la boîte : 50 m²','Notice utilisateur Levoit Core 300S.')
slide(3,'Petite ligne de la notice : la surface est calculée pour','2',RED,'renouvellements par heure','« Ideal Room Size is based on 2 air changes per hour », plafond de 2,4 m.')
slide(4,'Le calcul : CADR ÷ hauteur ÷ renouvellements','50 m²',ACC,'240 ÷ 2,4 ÷ 2','Formule générale : renouvellements = débit ÷ volume de la pièce.')
slide(5,'L\'AHAM (fabricants d\'électroménager, USA) vise 4,8 renouvellements','≈ 21 m²',GRN,'240 ÷ 2,4 ÷ 4,8','Livre blanc AHAM 2025 : « 4.8 eACH » dans la surface conseillée. Calcul refait : 20,8 m².')
slide(6,'Surprise : l\'AHAM ne recommande pas de descendre sous','2,2',RED,'renouvellements','Livre blanc AHAM 2025. Les 50 m² de la boîte sont calculés à 2, en dessous.')
# 7 verdict
im=bg(); d=ImageDraw.Draw(im); head(d,7); card(d,330,1380)
y=block(d,400,'VERDICT',f('InterDisplay-Black.otf',64),ACC)
y=block(d,y+30,'« 50 m² » à 2 renouvellements, c\'est environ 21 m² à 4,8.',f('InterDisplay-Black.otf',70),WH,gap=10)
y=block(d,y+50,'Avant d\'acheter : regarde le CADR en m³/h, pas les m².',f('InterDisplay-Bold.otf',54),GRN)
block(d,y+40,'Ta surface ≈ CADR ÷ hauteur du plafond ÷ 4,8. Levoit précise que l\'appareil marche dans une pièce plus grande, mais plus lentement.',f('InterDisplay-Bold.otf',34),GR,maxw=820)
swipe(d); save(im,7)
# 8 commentaires
im=bg(); d=ImageDraw.Draw(im); head(d,8)
purifier(d,W//2,520,0.8)
y=block(d,780,'Ta pièce fait combien de m², et ton purificateur affiche quel CADR ?',f('InterDisplay-Black.otf',72),WH,gap=10)
y=block(d,y+30,'Écris-le en commentaire',f('InterDisplay-Bold.otf',56),ACC)
block(d,y+60,'Abonne-toi : un chiffre vérifié chaque jour sur les objets de ta maison.',f('InterDisplay-Bold.otf',44),GR)
save(im,8)
