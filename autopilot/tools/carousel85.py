# Carrousel photo TikTok du jour 85 (écran « 1 ms » : ce n'est pas le vrai temps de réponse) : fond sombre uni, dessin simple, texte écrit par le script.
# Chiffres : autopilot/days/day85/facts.md. Usage : python3 carousel77.py <dossier_sortie>
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
    for ln in wrap(d,txt,font,maxw):
        w=d.textlength(ln,font=font); d.text(((W-w)/2,y),ln,font=font,fill=fill); y+=font.size+gap
    return y
def head(d,n):
    d.text((90,240),'JE MESURE TOUT',font=f('InterDisplay-Black.otf',38),fill=ACC)
    t=f'{n}/{N}'; fo=f('InterDisplay-Bold.otf',38); d.text((990-d.textlength(t,font=fo),240),t,font=fo,fill=GR)
def card(d,y0,y1): d.rounded_rectangle((80,y0,1000,y1),radius=36,fill=(24,28,38),outline=(60,66,82),width=3)
def swipe(d):
    fo=f('InterDisplay-Bold.otf',40); t='glisse →'; d.text(((W-d.textlength(t,font=fo))/2,1420),t,font=fo,fill=GR)

def save(im,i): im.save(f'{out}/slide{i}.jpg',quality=92)
NEON=(176,108,255); PINK=(255,79,216); SKY=(79,216,255)
def monitor(d,cx,cy,w,col,trail=0):
    h=int(w*0.58)
    d.rectangle((cx-w*0.05,cy+h/2,cx+w*0.05,cy+h/2+w*0.12),fill=(26,31,46)); d.rounded_rectangle((cx-w*0.2,cy+h/2+w*0.11,cx+w*0.2,cy+h/2+w*0.15),radius=8,fill=(26,31,46))
    d.rounded_rectangle((cx-w/2,cy-h/2,cx+w/2,cy+h/2),radius=18,fill=(20,22,48),outline=col,width=7)
    bx=cx-w*0.1; bw=w*0.08
    for k in range(trail):
        a=k/trail; c=tuple(int(20+(v-20)*a*0.7) for v in SKY); x=bx-trail+k
        d.line((x,cy-h*0.3,x,cy+h*0.3),fill=c)
    d.rectangle((bx,cy-h*0.3,bx+bw,cy+h*0.3),fill=SKY)

# 1 : objet + question
im=bg(); d=ImageDraw.Draw(im); head(d,1)
monitor(d,W//2,520,560,NEON,trail=60)
y=block(d,820,'Ton écran affiche « 1 ms » sur la boîte',f('InterDisplay-Bold.otf',64),WH)
y=block(d,y+20,'VRAIMENT UNE MILLISECONDE ?',f('InterDisplay-Black.otf',84),ACC,gap=6)
block(d,y+30,'Guides Dell · VESA ClearMR',f('InterDisplay-Bold.otf',40),GR)
swipe(d); save(im,1)

def slide(i,top,big,bigcol,sub,note):
    im=bg(); d=ImageDraw.Draw(im); head(d,i); card(d,330,1380)
    y=block(d,400,top,f('InterDisplay-Bold.otf',64),WH)
    y=block(d,y+50,big,f('InterDisplay-Black.otf',150),bigcol,gap=4)
    if sub: y=block(d,y+40,sub,f('InterDisplay-Black.otf',72),WH)
    block(d,max(y+60,1150),note,f('InterDisplay-Bold.otf',36),GR,maxw=800)
    swipe(d); save(im,i)
slide(2,'Écran de jeu Dell G2724D, en mode Extreme','1 ms',ACC,'gris à gris','Guide Dell : « 1 ms gray to gray in Extreme mode », avec de légers défauts visibles possibles (« slight and noticeable visual artifacts »).')
slide(3,'Le même écran, en mode Fast','4 ms',PINK,'gris à gris','Même guide : 4 ms en Fast, 2 ms en Super Fast. Seul le réglage change.')
slide(4,'Autre écran Dell (SE2426H)','1 ms',ACC,'MPRT','Guide SE2426H : léger scintillement possible, FreeSync coupé, réservé à 120 Hz ou plus.')
slide(5,'Article diffusé par VESA (2024)','?? ms',SKY,'chacun sa méthode','« manufacturers each have their own method for testing » (ClearMR 1.1, Information Display).')
slide(6,'VESA ClearMR 7000','65–75 ×',GRN,'plus de pixels nets que flous','Communiqué VESA du 22.08.2022 : le CMR compte les pixels nets contre les pixels flous.')
# 7 verdict
im=bg(); d=ImageDraw.Draw(im); head(d,7); card(d,330,1380)
y=block(d,400,'VERDICT',f('InterDisplay-Black.otf',64),ACC)
y=block(d,y+30,'« 1 ms » dépend du mode et de la méthode de mesure.',f('InterDisplay-Black.otf',70),WH,gap=10)
y=block(d,y+50,'Avant d\'acheter : lis le mode écrit à côté, ou cherche le logo VESA ClearMR.',f('InterDisplay-Bold.otf',54),GRN)
block(d,y+40,'Sur le même Dell G2724D : 1 ms en Extreme, 4 ms en Fast.',f('InterDisplay-Bold.otf',36),GR,maxw=800)
swipe(d); save(im,7)
# 8 commentaires
im=bg(); d=ImageDraw.Draw(im); head(d,8)
monitor(d,W//2,520,460,PINK,trail=40)
y=block(d,780,'Ton écran est réglé sur quel mode de temps de réponse ?',f('InterDisplay-Black.otf',72),WH,gap=10)
y=block(d,y+30,'Écris-le en commentaire',f('InterDisplay-Bold.otf',56),ACC)
block(d,y+60,'Abonne-toi : un chiffre vérifié chaque jour sur les objets de ta maison.',f('InterDisplay-Bold.otf',44),GR)
save(im,8)
