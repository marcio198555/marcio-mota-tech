"""Construit la page « Autopilot TikTok Marcio » à partir des données du dépôt."""
import json, pathlib

REPO = pathlib.Path('/home/claude/marcio-mota-tech/autopilot')
OUT = pathlib.Path('/tmp/claude-0/-home-claude/d5c551c1-d86a-5946-8395-e58e191f42ac/scratchpad/studio/autopilot.html')
ASSETS = json.loads(pathlib.Path('/home/claude/studio/assets.json').read_text()) if pathlib.Path('/home/claude/studio/assets.json').exists() else {}
SCHED = json.loads(pathlib.Path('/home/claude/studio/scheduled.json').read_text()) if pathlib.Path('/home/claude/studio/scheduled.json').exists() else {}

plan = json.loads((REPO / 'plan.json').read_text())
caps = json.loads((REPO / 'days/captions.json').read_text())
week = []
for d in range(1, 6):
    job = json.loads((REPO / f'tts/jobs/day{d:02d}.json').read_text())
    vo = [s['text'] for s in job['segments']]
    if d == 1:
        vo[2] = "Sur les fiches techniques, la pente est souvent en pour cent."
    cta = REPO / f'tts/jobs/day{d:02d}cta.json'
    if cta.exists():
        vo[-1] = json.loads(cta.read_text())['segments'][0]['text']
    p = plan['jours'][d - 1]
    week.append({
        'day': d, 'date': p['date'], 'title': caps[str(d)]['title'], 'mechanic': p['mecanique'], 'refs': p['refs'],
        'hook': p['accroche'], 'money': p['argent'], 'vo': vo, 'caption': caps[str(d)]['text'], 'sources': caps[str(d)]['sources'],
        'video': ASSETS.get(str(d), ''), 'status': SCHED.get(str(d), {}).get('status', 'produite'),
        'when': SCHED.get(str(d), {}).get('when', p.get('heure', '10:00')),
    })
LEARN = (REPO / 'learnings.md').read_text()
data = {'refs': plan['references_virales'], 'days': plan['jours'], 'week': week, 'learn': LEARN}

html = r'''<title>Autopilot TikTok Marcio</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;800&family=Space+Mono:wght@400;700&display=swap">
<style>
/* Salle de contrôle sombre : bandeau d'état, semaine 1 en cartes vidéo, calendrier, puis la mécanique et l'argent. */
:root{
  --bg:#030408; --surface:#0b1220; --surface-2:#111b2e; --line:#1d2a44;
  --fg:#e9edf5; --muted:#8e9ab3; --red:#c82030; --red-2:#ff5a6a; --gold:#c9a84c; --gold-2:#e6c66a; --ok:#3fb47a; --info:#7fb3ff;
  --font-body:"Outfit",system-ui,-apple-system,"Segoe UI",sans-serif;
  --font-data:"Space Mono",ui-monospace,"SFMono-Regular",Menlo,monospace;
  color-scheme:dark;
}
html,body{background:var(--bg);color:var(--fg)}
body{font-family:var(--font-body);font-size:16px;line-height:1.55;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px 72px}
.wrap{max-width:1040px;margin:0 auto;display:flex;flex-direction:column;gap:48px}
a{color:var(--gold-2)} a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.eyebrow{font-family:var(--font-data);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}
h1{font-size:clamp(34px,7vw,58px);line-height:1.02;font-weight:800;margin:6px 0 0;text-wrap:balance}
h1 em{font-style:normal;color:var(--red)}
h2{font-size:24px;font-weight:600;margin:0;text-wrap:balance}
h3{font-size:18px;line-height:1.25;margin:0;text-wrap:balance}
.lede{color:var(--muted);max-width:64ch;margin:12px 0 0}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chip{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 12px;font-size:13px}
.dot{width:8px;height:8px;border-radius:50%;background:var(--muted);flex:none}
.dot.ok{background:var(--ok)} .dot.live{background:var(--red)} .dot.gold{background:var(--gold)} .dot.info{background:var(--info)}
.mono{font-family:var(--font-data);font-variant-numeric:tabular-nums}
.head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:10px}
.head .count{font-family:var(--font-data);font-size:13px;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-top:16px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.card video{display:block;width:100%;aspect-ratio:9/16;background:#000;max-width:100%}
.poster{aspect-ratio:9/16;max-width:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;background:linear-gradient(180deg,var(--surface-2),var(--bg));color:var(--muted);text-align:center;padding:20px}
.poster .big{font-family:var(--font-data);font-size:44px;color:var(--gold)}
.body{padding:14px;display:flex;flex-direction:column;gap:10px;min-width:0}
.meta{display:flex;justify-content:space-between;align-items:center;gap:8px;font-family:var(--font-data);font-size:12px;color:var(--muted)}
.status{font-family:var(--font-data);font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:6px;border:1px solid var(--line);white-space:nowrap}
.status.prod{color:var(--gold);border-color:#4a3d1c}.status.sched{color:var(--info);border-color:#1f3b66}.status.pub{color:var(--ok);border-color:#1d4a34}.status.todo{color:var(--muted)}
.hook{font-family:var(--font-data);font-size:13px;color:var(--gold-2)}
.mech{font-size:13px;color:var(--muted)}
details{border-top:1px solid var(--line);padding-top:8px}
summary{cursor:pointer;font-size:14px;color:var(--fg);font-weight:600}
.vo{margin:8px 0 0;padding-left:20px;font-size:14px;color:var(--fg)}
.vo li{margin:2px 0}
.caption{font-size:14px;color:var(--muted);white-space:pre-wrap;overflow-wrap:anywhere;margin-top:8px}
.src{font-size:12px;overflow-wrap:anywhere;margin-top:6px;color:var(--muted)}
button.copy{align-self:flex-start;font:inherit;font-size:13px;color:var(--fg);background:var(--surface-2);border:1px solid var(--line);border-radius:8px;padding:6px 10px;cursor:pointer;margin-top:8px}
.table-wrap{overflow-x:auto;margin-top:16px;border:1px solid var(--line);border-radius:14px}
table{border-collapse:collapse;width:100%;min-width:760px;font-size:14px}
th,td{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid var(--line)}
th{font-family:var(--font-data);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);background:var(--surface);position:sticky;top:0}
td.n{font-family:var(--font-data);color:var(--gold);white-space:nowrap}
td .ref{font-size:12px;color:var(--muted)}
tr.done td{background:rgba(63,180,122,0.05)}
.refs{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:16px}
.ref-card{border:1px solid var(--line);border-radius:12px;padding:12px;background:var(--surface);min-width:0}
.ref-card b{font-family:var(--font-data);color:var(--gold)}
.ref-card .v{font-family:var(--font-data);color:var(--fg);font-size:14px;margin-top:4px}
.ref-card p{margin:4px 0 0;font-size:14px;color:var(--muted)}
.flow{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:16px;counter-reset:s}
.step{border-top:2px solid var(--gold);padding-top:10px;min-width:0}
.step b{display:block;font-weight:600}
.step span{color:var(--muted);font-size:14px}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:16px}
.note{border:1px solid var(--line);border-radius:12px;padding:14px;background:var(--surface);min-width:0}
.note h3{margin-bottom:6px}
.note p,.note li{color:var(--muted);font-size:15px}
.note ul{margin:6px 0 0;padding-left:18px}
.big-num{font-family:var(--font-data);font-size:28px;color:var(--gold-2)}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">TikTok · @marcio.mota8</div>
    <h1>Autopilot <em>TikTok</em></h1>
    <p class="lede">Une vidéo originale par jour sur ton TikTok, programmée via Metricool. Chaque vendredi : bilan des chiffres de la semaine, puis les 7 vidéos suivantes, ajustées pour gagner plus d'abonnés et de vues. Chaque vidéo reprend la mécanique d'un format viral, appliquée à un sujet neuf, avec des chiffres sourcés : ta méthode « je mesure tout ».</p>
    <div class="chips" id="chips"></div>
  </header>

  <section aria-labelledby="h-week">
    <div class="head"><h2 id="h-week">Cette semaine : 25 au 29 octobre</h2><span class="count" id="week-count"></span></div>
    <div class="grid" id="week"></div>
  </section>

  <section aria-labelledby="h-grow">
    <div class="head"><h2 id="h-grow">Pour gagner des abonnés</h2><span class="count">appliqué dès le 26.10</span></div>
    <div class="cols">
      <div class="note"><h3>Une raison de s'abonner</h3><p>Chaque vidéo finit par l'annonce de celle du lendemain (« Abonne-toi : demain, le piège des batteries externes »), à la voix, à l'écran et dans la description.</p></div>
      <div class="note"><h3>Rétention</h3><p>Chiffre choc dès la 1re seconde, sous-titres calés sur la voix, cartons de 2 lignes au maximum, vidéos de 31 à 40 s.</p></div>
      <div class="note"><h3>Tests mesurés</h3><p>Mercredi 28.10 à 18 h au lieu de 10 h. Vendredi, on compare les vues, le temps regardé et les abonnés gagnés, puis on garde ce qui marche.</p></div>
      <div class="note"><h3>Ta bio TikTok (à coller depuis ton téléphone)</h3><p class="mono" id="bio">Je mesure tout avant que tu achètes 📏 Tech &amp; maison, chiffres vérifiés 🇨🇭</p><p>Nom affiché conseillé : <span class="mono">Marcio · Je mesure tout</span></p><div id="bio-copy"></div></div>
    </div>
  </section>

  <section aria-labelledby="h-learn">
    <div class="head"><h2 id="h-learn">Bilans et enseignements</h2><span class="count">mis à jour chaque vendredi</span></div>
    <div class="note" style="margin-top:16px"><div class="caption" id="learn" style="margin-top:0"></div></div>
  </section>

  <section aria-labelledby="h-cal">
    <div class="head"><h2 id="h-cal">Plan et réserve d'idées</h2><span class="count">les idées sont revues chaque vendredi selon les chiffres</span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Jour</th><th>Date</th><th>Sujet (notre version)</th><th>Mécanique virale d'origine</th><th>Accroche 0–3 s</th><th>Objectif argent</th><th>Statut</th></tr></thead>
      <tbody id="cal"></tbody>
    </table></div>
  </section>

  <section aria-labelledby="h-refs">
    <div class="head"><h2 id="h-refs">Les vidéos virales dont on reprend la mécanique</h2></div>
    <p class="lede">On copie la recette (l'accroche, le rythme, la révélation), jamais les images, le texte ou la musique : TikTok pénalise le contenu repris tel quel.</p>
    <div class="refs" id="refs"></div>
  </section>

  <section aria-labelledby="h-flow">
    <div class="head"><h2 id="h-flow">Comment ça tourne tout seul</h2></div>
    <div class="flow">
      <div class="step"><b>1 · Sujet et faits</b><span>Idées revues chaque semaine, faits vérifiés sur les sources officielles.</span></div>
      <div class="step"><b>2 · Voix off</b><span>Voix française Piper (libre et gratuite), générée sur GitHub Actions.</span></div>
      <div class="step"><b>3 · Montage</b><span>Motion design 1080×1920, sous-titres mot à mot, musique et bruitages maison.</span></div>
      <div class="step"><b>4 · Contrôle</b><span>Agent qualité indépendant : calculs, lisibilité, zones sûres TikTok, son.</span></div>
      <div class="step"><b>5 · Publication</b><span>Hébergement Cloudinary, programmation Metricool → TikTok, mention IA activée.</span></div>
      <div class="step"><b>6 · Chaque vendredi</b><span>Bilan des chiffres, enseignements, puis production et programmation des 7 vidéos de la semaine.</span></div>
    </div>
    <div class="cols">
      <div class="note"><h3>Outils, tous gratuits</h3><ul>
        <li>Metricool (gratuit) : publication TikTok</li>
        <li>GitHub Actions : voix off et transcription</li>
        <li>Cloudinary (gratuit) : hébergement des vidéos</li>
        <li>Moteur de rendu maison (Chromium + ffmpeg)</li>
      </ul></div>
      <div class="note"><h3>Le code</h3><p>Tout est dans ton dépôt GitHub, branche <span class="mono">tiktok-autopilot</span> : moteur de rendu, scènes, voix, mixage, procédure hebdomadaire (<span class="mono">RUNBOOK.md</span>).</p>
        <p><a href="https://github.com/marcio198555/marcio-mota-tech/tree/tiktok-autopilot/autopilot" rel="noopener">Ouvrir le dépôt</a></p></div>
    </div>
  </section>

  <section aria-labelledby="h-money">
    <div class="head"><h2 id="h-money">L'argent, sans illusion</h2></div>
    <div class="cols">
      <div class="note"><h3>Les vues ne paient pas en Suisse</h3><p>La Suisse n'apparaît pas dans les pays du programme Creator Rewards. Ailleurs, il faut 10 000 abonnés, 100 000 vues sur 30 jours et des vidéos de plus d'une minute, pour environ 0,40 à 1,50 $ les 1 000 vues.</p></div>
      <div class="note"><h3>Ce qui paie vraiment</h3><ul>
        <li>Les marques : un TikTok qui grandit, plus tes 34 000 abonnés Instagram, rend ton media kit plus fort.</li>
        <li>L'affiliation : liens en bio vers les produits des vidéos (batteries, câbles, prises), à activer.</li>
        <li>Le Black Friday (27 novembre) : 6 vidéos du mois le préparent.</li>
      </ul></div>
      <div class="note"><h3>L'objectif</h3><p><span class="big-num">7</span> vidéos par semaine, une par jour.</p><p>Chaque vendredi : vues, temps regardé, partages et abonnés gagnés relevés, puis la semaine suivante ajustée.</p></div>
    </div>
  </section>
</div>

<script>
const DATA = __DATA__;
const STATUS = {"programmée":["sched","Programmée"],"produite":["prod","Produite"],"publiée":["pub","Publiée"],"à produire":["todo","À produire"],"à programmer":["prod","À programmer"],"produite (fin à refaire)":["prod","Prête · vendredi"],"idée":["todo","Idée"]};
function el(tag, cls, text){ const e=document.createElement(tag); if(cls) e.className=cls; if(text!==undefined) e.textContent=text; return e; }
function fmtDate(iso){ const d=new Date(iso+'T12:00:00'); return d.toLocaleDateString('fr-CH',{weekday:'short',day:'2-digit',month:'2-digit'}); }
function copyBtn(label, getText, target){
  const b=el('button','copy',label); b.type='button';
  b.addEventListener('click',()=>{ navigator.clipboard.writeText(getText()).then(()=>{ b.textContent='Copié'; setTimeout(()=>b.textContent=label,1500); }).catch(()=>{ const r=document.createRange(); r.selectNodeContents(target); const s=getSelection(); s.removeAllRanges(); s.addRange(r); }); });
  return b;
}
function render(){
  const chips=document.getElementById('chips');
  const sched=DATA.week.filter(w=>w.status==='programmée').length;
  [['ok','TikTok connecté à Metricool'],['live',sched+' vidéo'+(sched>1?'s':'')+' programmée'+(sched>1?'s':'')],['gold','1 vidéo par jour'],['info','Prochain lot : vendredi 30.10']].forEach(([d,t])=>{ const s=el('span','chip'); s.append(el('span','dot '+d), el('span','',t)); chips.append(s); });
  const wk=document.getElementById('week'); document.getElementById('week-count').textContent=DATA.week.length+' vidéos';
  DATA.week.forEach(w=>{
    const card=el('article','card');
    if(w.video){ const v=document.createElement('video'); v.src=w.video; v.controls=true; v.playsInline=true; v.preload='metadata'; card.append(v); }
    else { const p=el('div','poster'); p.append(el('div','big','J'+w.day), el('div','','Vidéo en préparation')); card.append(p); }
    const b=el('div','body');
    const m=el('div','meta'); m.append(el('span','', 'Jour '+w.day+' · '+fmtDate(w.date)+' · '+w.when));
    const st=STATUS[w.status]||['todo',w.status]; m.append(el('span','status '+st[0], st[1])); b.append(m);
    b.append(el('h3','',w.title), el('div','hook','Accroche : '+w.hook), el('div','mech','Mécanique : '+w.mechanic+' · '+w.money));
    const d1=document.createElement('details'); d1.append(el('summary','','Voix off, mot pour mot')); const ol=el('ol','vo'); w.vo.forEach(l=>ol.append(el('li','',l))); d1.append(ol); b.append(d1);
    const d2=document.createElement('details'); d2.append(el('summary','','Description TikTok')); const cap=el('div','caption',w.caption); d2.append(cap, copyBtn('Copier la description',()=>w.caption,cap)); b.append(d2);
    const d3=document.createElement('details'); d3.append(el('summary','','Sources'));
    w.sources.forEach(s=>{ const div=el('div','src'); if(s.startsWith('http')){ const a=el('a','',s); a.href=s; a.rel='noopener'; div.append(a);} else div.textContent=s; d3.append(div); }); b.append(d3);
    card.append(b); wk.append(card);
  });
  document.getElementById('learn').textContent=DATA.learn.replace(/^# .*\n+/,'');
  const bio=document.getElementById('bio'); document.getElementById('bio-copy').append(copyBtn('Copier la bio',()=>bio.textContent,bio));
  const cal=document.getElementById('cal');
  DATA.days.forEach(d=>{
    const tr=document.createElement('tr'); if(d.statut==='programmée'||d.statut==='publiée') tr.className='done';
    tr.append(el('td','n','J'+d.jour), el('td','mono',fmtDate(d.date)));
    const s=el('td'); s.append(el('div','',d.sujet)); tr.append(s);
    const mc=el('td'); mc.append(el('div','',d.mecanique)); const refs=el('div','ref', d.refs.map(r=>DATA.refs[r]?(r+' · '+DATA.refs[r].vues):r).join(' — ')); mc.append(refs); tr.append(mc);
    tr.append(el('td','',d.accroche), el('td','',d.argent));
    const st=STATUS[d.statut]||['todo',d.statut]; const tdS=el('td'); tdS.append(el('span','status '+st[0],st[1])); tr.append(tdS);
    cal.append(tr);
  });
  const refs=document.getElementById('refs');
  Object.entries(DATA.refs).forEach(([k,r])=>{ const c=el('div','ref-card'); c.append(el('b','',k), el('div','v',r.vues)); c.append(el('p','',r.titre+' — '+r.createur)); const a=el('a','','Source'); a.href=r.source; a.rel='noopener'; const p=el('p'); p.append(a); c.append(p); refs.append(c); });
}
render();
</script>
'''
OUT.write_text(html.replace('__DATA__', json.dumps(data, ensure_ascii=False)))
print('page', OUT, len(html) // 1024, 'Ko')
