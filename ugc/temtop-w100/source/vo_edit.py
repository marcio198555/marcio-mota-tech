# Tighten long pauses in the ElevenLabs VO and compute caption timings.
import numpy as np, wave, json
w=wave.open('vo_raw.wav'); sr=w.getframerate()
x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768

# (silence_start, silence_end, keep_seconds) for pauses we shorten
cuts=[(1.775,2.415,0.32),(8.675,9.285,0.28),(12.925,13.715,0.30),(18.235,18.935,0.28),
      (22.515,23.145,0.28),(25.385,25.995,0.28),(28.365,28.875,0.28)]
# build list of kept intervals
keep=[];t=0.0;removed=[]
for s,e,k in cuts:
    mid_keep_a=s+k/2; mid_keep_b=e-k/2
    keep.append((t,mid_keep_a)); removed.append((mid_keep_a,mid_keep_b)); t=mid_keep_b
keep.append((t,len(x)/sr))
fade=int(sr*0.006)
parts=[]
for a,b in keep:
    seg=x[int(a*sr):int(b*sr)].copy()
    if len(seg)>2*fade:
        seg[:fade]*=np.linspace(0,1,fade); seg[-fade:]*=np.linspace(1,0,fade)
    parts.append(seg)
y=np.concatenate(parts)
# trim trailing silence after last word (keep 0.25s)
LEAD=0.0
out=wave.open('vo_tight.wav','wb'); out.setnchannels(1); out.setsampwidth(2); out.setframerate(sr)
out.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes()); out.close()
def remap(t):
    d=0.0
    for a,b in removed:
        if t>=b: d+=b-a
        elif t>a: d+=t-a
    return t-d
print('new duration %.3f'%(len(y)/sr))

# phrases: (start,end) in original time, words with syllable weights
P=[
 (0.095,1.775,[("Tu",1),("sais",1),("vraiment",2),("ce",1),("que",1),("tu",1),("respires",2),("chez",1),("toi ?",1)]),
 (2.415,3.025,[("Regarde",2),("ça :",1)]),
 (3.175,4.465,[("la",1),("Temtop",2),("W100 !",4)]),
 (4.705,5.685,[("Une",1),("station",2),("météo",3)]),
 (5.865,7.435,[("ET",1),("un",1),("moniteur",3),("de",1),("qualité",3),("de",1),("l'air,",1)]),
 (7.575,8.675,[("dans",1),("un",1),("seul",1),("appareil.",3)]),
 (9.285,10.615,[("Dehors,",2),("elle",1),("mesure",2),("le",1),("vent,",1)]),
 (10.745,11.245,[("la",1),("pluie,",1)]),
 (11.395,11.925,[("les",1),("UV",2)]),
 (12.035,12.925,[("et",1),("la",1),("luminosité.",5)]),
 (13.715,14.115,[("Dedans,",2)]),
 (14.225,15.415,[("elle",1),("surveille",2),("le",1),("CO₂,",3)]),
 (15.565,16.535,[("les",1),("particules",4),("fines,",1)]),
 (16.685,17.345,[("et",1),("les",1),("COV,",3)]),
 (17.535,18.235,[("en",1),("temps",1),("réel.",2)]),
 (18.935,21.155,[("Tout",1),("s'affiche",2),("sur",1),("un",1),("écran",2),("tactile",2),("de",1),("7",1),("pouces,",1)]),
 (21.275,22.515,[("avec",2),("les",1),("prévisions",3),("météo.",3)]),
 (23.145,24.395,[("Si",1),("l'air",1),("devient",2),("trop",1),("chargé…",2)]),
 (24.735,25.385,[("elle",1),("t'alerte.",3)]),
 (25.995,27.285,[("Et",1),("tu",1),("suis",1),("tout",1),("depuis",2),("l'appli,",2)]),
 (27.475,28.365,[("même",1),("quand",1),("t'es",1),("pas",1),("là.",1)]),
 (28.875,30.200,[("Je",1),("te",1),("mets",1),("le",1),("lien",1),("juste",1),("en",1),("dessous !",2)]),
]
phrases=[];words=[]
for i,(s,e,ws) in enumerate(P):
    s2,e2=remap(s),remap(e)
    tot=sum(wt+0.35 for _,wt in ws)
    t=s2
    for txt,wt in ws:
        d=(e2-s2)*(wt+0.35)/tot
        words.append({"t":round(t,3),"e":round(t+d,3),"w":txt,"p":i,"i":len([w for w in words if w["p"]==i])})
        t+=d
    phrases.append({"s":round(s2,3),"e":round(e2,3),"text":" ".join(w for w,_ in ws)})
# chunk words into caption groups (<=3 words, <=16 chars), never across phrases
chunks=[];cur=[]
def flush():
    global cur
    if cur: chunks.append(cur); cur=[]
for wd in words:
    if cur and (cur[-1]["p"]!=wd["p"] or len(cur)>=3 or len(" ".join(c["w"] for c in cur+[wd]))>16):
        flush()
    cur.append(wd)
flush()
caps=[]
for k,c in enumerate(chunks):
    start=c[0]["t"]; end=c[-1]["e"]
    nxt=chunks[k+1][0]["t"] if k+1<len(chunks) else end+1.2
    caps.append({"s":start,"e":round(min(nxt,end+0.35),3),"words":[{"w":w["w"],"t":w["t"]} for w in c]})
json.dump({"vo_duration":round(len(y)/sr,3),"phrases":phrases,"words":words,"captions":caps},open('timeline.json','w'),ensure_ascii=False,indent=1)
for p in phrases: print('%6.2f-%6.2f  %s'%(p['s'],p['e'],p['text']))
print(len(caps),'caption chunks')
