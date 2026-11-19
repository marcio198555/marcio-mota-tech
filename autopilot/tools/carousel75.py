# Carrousel photo TikTok du jour 75 (test du 19.11.2026) : texte écrit par le moteur, aucune image IA avec texte.
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, sys
W,H=1080,1920
F='/usr/share/fonts/opentype/inter/'
def f(n,s): return ImageFont.truetype(F+n,s)
BG=(14,17,24); ACC=(255,196,0); RED=(255,77,77); WH=(245,246,250); GR=(150,158,175); GRN=(80,220,140)
base=os.path.dirname(os.path.abspath(__file__))+'/..'
robot=Image.open(base+'/assets/ai/perso_robot.png').convert('RGBA')
salon=Image.open(base+'/assets/ai/decor_salon.png').convert('RGB')
out=sys.argv[1]
def bg(dark=0.25):
    im=salon.resize((W,int(1024*W/576))).crop((0,0,W,H)).filter(ImageFilter.GaussianBlur(14))
    ov=Image.new('RGB',(W,H),BG); return Image.blend(im,ov,1-dark)
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
    t=f'{n}/8'; fo=f('InterDisplay-Bold.otf',38); d.text((990-d.textlength(t,font=fo),240),t,font=fo,fill=GR)
def card(d,y0,y1):
    d.rounded_rectangle((70,y0,1010,y1),radius=36,fill=(24,28,38),outline=(60,66,82),width=3)
def swipe(d):
    fo=f('InterDisplay-Bold.otf',40); t='glisse →'; d.text(((W-d.textlength(t,font=fo))/2,1440),t,font=fo,fill=GR)
def save(im,i): im.save(f'{out}/slide{i}.jpg',quality=92)

# 1
im=bg(0.35); d=ImageDraw.Draw(im); head(d,1)
r=robot.resize((640,int(554*640/760))); im.paste(r,((W-640)//2,330),r)
y=block(d,860,'Ton robot aspirateur passe chaque jour.',f('InterDisplay-Bold.otf',62),WH)
y=block(d,y+20,'COMBIEN EN FRANCS PAR\u00a0AN\u00a0?',f('InterDisplay-Black.otf',100),ACC,gap=6)
block(d,y+24,'Robot fictif, chiffres de vrais modèles',f('InterDisplay-Bold.otf',36),GR)
swipe(d); save(im,1)

def slide(i,top,big,bigcol,sub,note):
    im=bg(); d=ImageDraw.Draw(im); head(d,i); card(d,330,1380)
    y=block(d,400,top,f('InterDisplay-Bold.otf',66),WH)
    y=block(d,y+50,big,f('InterDisplay-Black.otf',150),bigcol,gap=4)
    if sub: y=block(d,y+40,sub,f('InterDisplay-Black.otf',76),WH)
    block(d,max(y+60,1130),note,f('InterDisplay-Bold.otf',36),GR,maxw=820)
    if i<8: swipe(d)
    save(im,i)
slide(2,'Sa batterie, comme sur un Xiaomi S40','≈ 75 Wh',ACC,'14,4 V × 5 200 mAh','Fiche officielle Xiaomi Robot Vacuum S40.')
slide(3,'Un passage qui la vide entièrement','≥ 2 ct',ACC,None,'Tarif médian ElCom 2026 hors TVA : 27,7 ct/kWh. Pertes de charge non comptées.')
slide(4,'Chaque jour, toute l\'année','≥ 7 fr. 50',ACC,'par an','Schéma : batterie vidée à chaque passage, 365 passages, station de charge simple.')
slide(5,'Surprise : il consomme aussi sur sa station, sans rien faire','< 2 W',RED,'jusqu\'à 4 fr. 85 / an','Veille en réseau, notice Ecovacs DEEBOT OZMO T8. Maximum : heures de charge comptées comme veille.')
slide(6,'Et ton aspirateur traîneau ?','≈ 9 fr. 70',ACC,'35 kWh / an','Moyenne estimée par la Commission européenne, usage normalisé de 50 h par an.')
# 7 verdict
im=bg(); d=ImageDraw.Draw(im); head(d,7); card(d,330,1380)
y=block(d,400,'VERDICT',f('InterDisplay-Black.otf',64),ACC)
y=block(d,y+30,'Robot ou traîneau : en ordre de grandeur, une dizaine de francs par an chacun.',f('InterDisplay-Black.otf',72),WH,gap=10)
y=block(d,y+50,'Conseil : programme-le les jours utiles, éteins-le pendant tes vacances.',f('InterDisplay-Bold.otf',54),GRN)
block(d,y+40,'Mode arrêt : moins de 0,5 W (notice Ecovacs). Stations avec vidage ou lavage automatique non comptées.',f('InterDisplay-Bold.otf',34),GR,maxw=820)
swipe(d); save(im,7)
# 8
im=bg(0.35); d=ImageDraw.Draw(im); head(d,8)
r=robot.resize((520,int(554*520/760))); im.paste(r,((W-520)//2,330),r)
y=block(d,780,'Ton robot passe tous les jours, ou seulement certains jours ?',f('InterDisplay-Black.otf',76),WH,gap=10)
y=block(d,y+30,'Écris-le en commentaire',f('InterDisplay-Bold.otf',56),ACC)
block(d,y+70,'Abonne-toi : un chiffre vérifié chaque jour sur les objets de ta maison.',f('InterDisplay-Bold.otf',44),GR)
save(im,8)
