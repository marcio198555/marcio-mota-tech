"""Construit la page « Autopilot TikTok Marcio » à partir des données du dépôt.

python3 autopilot/tools/build_page.py /home/claude/studio/autopilot.html
Lit : strategy.json (stratégie du mois, semaine en cours), plan.json (créneaux et idées), days/captions.json,
days/dayNN/post.json, days/dayNN/studio/timeline.json ou texte.json (contenu), tools/assets.json (vidéos
téléversées sur la page : /_blob/<id>), tools/scheduled.json (statut et heure par jour), learnings.md.
"""
import json, pathlib, sys

REPO = pathlib.Path('/home/claude/marcio-mota-tech/autopilot')
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/home/claude/studio/autopilot.html')
OUT.parent.mkdir(parents=True, exist_ok=True)
rd = lambda p, d=None: json.loads((REPO / p).read_text()) if (REPO / p).exists() else d
ASSETS, SCHED = rd('tools/assets.json', {}), rd('tools/scheduled.json', {})
plan, caps, strat = rd('plan.json'), rd('days/captions.json', {}), rd('strategy.json', {})


def content(d, fmt):
    """Voix off (format V) ou lignes « en gros → en petit » (format T)."""
    t = rd(f'days/day{d:02d}/texte.json')
    if fmt == 'T' and t:
        return [f"« {r['gros']} » → {r['petit'].replace(' | ', ' ').replace('|', ' ')}" for r in t['rows']]
    for p in (f'days/day{d:02d}/studio/timeline.json', f'days/day{d:02d}/timeline_words.json'):
        tl = rd(p)
        if tl:
            return [s.get('text') or s.get('display', '').replace('| ', '') for s in tl['segments']]
    job = rd(f'tts/jobs/day{d:02d}.json')
    return [s['text'] for s in job['segments']] if job else []


def card(p):
    d = p['jour']; fmt = p.get('format', 'V'); cap = caps.get(str(d), {})
    post = rd(f'days/day{d:02d}/post.json', {})
    st = SCHED.get(str(d), {})
    return {'day': d, 'date': p.get('date'), 'when': st.get('when') or p.get('heure') or '10:00', 'format': fmt,
            'title': cap.get('title') or p['sujet'], 'hook': p.get('accroche', ''), 'mechanic': p.get('mecanique', ''),
            'status': st.get('status') or p.get('statut', ''), 'video': ASSETS.get(str(d), ''), 'url': post.get('url', ''),
            'caption': cap.get('text', ''), 'sources': cap.get('sources', []), 'content': content(d, fmt),
            'verify': p.get('a_verifier', [])}


weeks = strat.get('semaines', [])
cur = next((w for w in weeks if w.get('statut') == 'en cours'), weeks[0] if weeks else None)
slots = sorted([p for p in plan['jours'] if cur and p.get('semaine') == cur['id']],
               key=lambda p: (p.get('date') or '', p.get('heure') or ''))
before = [p for p in plan['jours'] if p['jour'] <= 9 or (p.get('semaine') and cur and p['semaine'] < cur['id'])]
before = sorted([p for p in before if p not in slots], key=lambda p: (p.get('date') or '', p.get('heure') or ''), reverse=True)
ideas = [p for p in plan['jours'] if p.get('statut') == 'idée']
data = {'strat': strat, 'cur': cur['id'] if cur else '', 'slots': [card(p) for p in slots],
        'before': [card(p) for p in before], 'ideas': ideas, 'refs': plan['references_virales'],
        'learn': (REPO / 'learnings.md').read_text()}

html = r'''<title>Autopilot TikTok Marcio</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;800&family=Space+Mono:wght@400;700&display=swap">
<style>
/* Salle de contrôle sombre : stratégie du mois en tête (4 semaines, note, règles), puis les vidéos de la semaine. */
:root{
  --bg:#030408; --surface:#0b1220; --surface-2:#111b2e; --line:#1d2a44;
  --fg:#e9edf5; --muted:#8e9ab3; --red:#c82030; --red-2:#ff5a6a; --gold:#c9a84c; --gold-2:#e6c66a; --ok:#3fb47a; --info:#7fb3ff; --warn:#e8a23a;
  --font-body:"Outfit",system-ui,-apple-system,"Segoe UI",sans-serif;
  --font-data:"Space Mono",ui-monospace,"SFMono-Regular",Menlo,monospace;
  color-scheme:dark;
}
html,body{background:var(--bg);color:var(--fg)}
body{font-family:var(--font-body);font-size:16px;line-height:1.55;margin:0;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px 72px}
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
/* semaines du mois */
.weeks{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:16px}
.wk{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:10px;min-width:0}
.wk.cur{border-color:var(--gold);box-shadow:0 0 0 1px rgba(201,168,76,.25) inset}
.wk .top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.wk .id{font-family:var(--font-data);font-size:20px;color:var(--gold-2)}
.wk .dates{font-family:var(--font-data);font-size:12px;color:var(--muted)}
.verdict{font-family:var(--font-data);font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:6px;border:1px solid var(--line);white-space:nowrap;color:var(--muted)}
.verdict.VERT{color:var(--ok);border-color:#1d4a34}.verdict.ORANGE{color:var(--warn);border-color:#5a3d12}.verdict.ROUGE{color:var(--red-2);border-color:#5a1820}.verdict.live{color:var(--gold-2);border-color:#4a3d1c}
.kpi{display:grid;grid-template-columns:1fr auto;gap:2px 10px;font-size:14px;align-items:center}
.kpi .lab{color:var(--muted)} .kpi .val{font-family:var(--font-data);text-align:right}
.bar{grid-column:1/-1;height:6px;border-radius:3px;background:var(--surface-2);overflow:hidden;margin-bottom:6px}
.bar i{display:block;height:100%;background:var(--gold)}
.wk .exp{font-size:13px;color:var(--muted)}
.wk .dec{font-size:13px;color:var(--fg);border-top:1px solid var(--line);padding-top:8px}
/* A/B */
.ab{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:16px}
.fmt{border:1px solid var(--line);border-radius:14px;padding:16px;background:var(--surface);min-width:0}
.fmt .tag{font-family:var(--font-data);font-size:13px;color:var(--bg);background:var(--gold);border-radius:6px;padding:2px 8px;display:inline-block;margin-bottom:8px}
.fmt.t .tag{background:var(--info)}
.fmt p{margin:6px 0 0;color:var(--muted);font-size:15px}
.rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:16px}
.rule{border-left:3px solid var(--gold);padding:4px 0 4px 12px;min-width:0}
.rule b{display:block;font-weight:600}
.rule span{color:var(--muted);font-size:14px}
.ladder{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:16px}
.rung{border:1px solid var(--line);border-radius:12px;padding:12px;background:var(--surface);min-width:0}
.rung .l{font-family:var(--font-data);font-size:22px;color:var(--gold-2)}
.rung .q{font-size:12px;font-family:var(--font-data);color:var(--info);margin-top:4px}
.rung p{margin:6px 0 0;font-size:14px;color:var(--muted)}
.rung.on{border-color:var(--gold)}
/* toi */
.todo{display:grid;gap:10px;margin-top:16px}
.todo label{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:start;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px;cursor:pointer}
.todo input{width:20px;height:20px;margin-top:2px;accent-color:var(--gold)}
.todo .why{display:block;color:var(--muted);font-size:14px}
.todo .t{font-family:var(--font-data);font-size:12px;color:var(--gold);white-space:nowrap}
.todo label:has(input:checked) b{text-decoration:line-through;color:var(--muted)}
/* vidéos */
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.filters button{font:inherit;font-size:13px;color:var(--fg);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:6px 12px;cursor:pointer}
.filters button[aria-pressed="true"]{border-color:var(--gold);color:var(--gold-2)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-top:16px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.card video{display:block;width:100%;aspect-ratio:9/16;background:#000;max-width:100%}
.poster{aspect-ratio:9/16;max-height:340px;max-width:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;background:linear-gradient(180deg,var(--surface-2),var(--bg));color:var(--muted);text-align:center;padding:20px}
.poster.small{aspect-ratio:auto;max-height:none;min-height:150px}
.poster .big{font-family:var(--font-data);font-size:40px;color:var(--gold)}
.poster .hk{font-family:var(--font-data);font-size:14px;color:var(--gold-2)}
.body{padding:14px;display:flex;flex-direction:column;gap:10px;min-width:0}
.meta{display:flex;justify-content:space-between;align-items:center;gap:8px;font-family:var(--font-data);font-size:12px;color:var(--muted);flex-wrap:wrap}
.status,.ft{font-family:var(--font-data);font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:6px;border:1px solid var(--line);white-space:nowrap}
.ft{color:var(--gold-2);border-color:#4a3d1c}.ft.T{color:var(--info);border-color:#1f3b66}
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
table{border-collapse:collapse;width:100%;min-width:640px;font-size:14px}
th,td{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid var(--line)}
th{font-family:var(--font-data);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);background:var(--surface);position:sticky;top:0}
td.n{font-family:var(--font-data);color:var(--gold);white-space:nowrap}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:16px}
.note{border:1px solid var(--line);border-radius:12px;padding:14px;background:var(--surface);min-width:0}
.note h3{margin-bottom:6px}
.note p,.note li{color:var(--muted);font-size:15px}
.note ul{margin:6px 0 0;padding-left:18px}
.refs{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:16px}
.ref-card{border:1px solid var(--line);border-radius:12px;padding:12px;background:var(--surface);min-width:0}
.ref-card b{font-family:var(--font-data);color:var(--gold)}
.ref-card .v{font-family:var(--font-data);color:var(--fg);font-size:14px;margin-top:4px}
.ref-card p{margin:4px 0 0;font-size:14px;color:var(--muted)}
.start{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-top:16px}
.stat{border:1px solid var(--line);border-radius:12px;padding:12px;background:var(--surface)}
.stat .v{font-family:var(--font-data);font-size:26px;color:var(--gold-2)}
.stat .k{font-size:13px;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">TikTok · @marcio.mota8</div>
    <h1>Autopilot <em>TikTok</em></h1>
    <p class="lede">2 vidéos originales par jour (10 h et 18 h), programmées via Metricool. Pendant un mois, chaque vendredi : on mesure, on note la semaine et, si ça ne marche pas, on change de stratégie.</p>
    <div class="chips" id="chips"></div>
  </header>

  <section aria-labelledby="h-month">
    <div class="head"><h2 id="h-month">La stratégie du mois</h2><span class="count" id="month-range"></span></div>
    <p class="lede" id="start-text"></p>
    <div class="start" id="start"></div>
    <div class="weeks" id="weeks"></div>
    <p class="lede">Les objectifs sont des cibles à atteindre, pas des résultats : les chiffres réels s'affichent après chaque bilan du vendredi.</p>
  </section>

  <section aria-labelledby="h-ab">
    <div class="head"><h2 id="h-ab">Le test de la semaine 1</h2><span class="count">7 vidéos chacun, en alternance 10 h / 18 h</span></div>
    <div class="ab" id="ab"></div>
  </section>

  <section aria-labelledby="h-rules">
    <div class="head"><h2 id="h-rules">Comment je décide chaque vendredi</h2></div>
    <div class="rules" id="rules"></div>
    <h3 style="margin-top:28px">Si ça ne marche pas : la stratégie suivante</h3>
    <div class="ladder" id="ladder"></div>
  </section>

  <section aria-labelledby="h-you">
    <div class="head"><h2 id="h-you">Ce que toi tu peux faire (2 minutes)</h2><span class="count">facultatif, mais c'est ce qui accélère le plus</span></div>
    <div class="todo" id="todo"></div>
    <div class="note" style="margin-top:12px"><h3>Ta bio TikTok (à coller depuis ton téléphone)</h3><p class="mono" id="bio">Je mesure tout avant que tu achètes 📏 Tech &amp; maison, chiffres vérifiés 🇨🇭</p><p>Nom affiché conseillé : <span class="mono">Marcio · Je mesure tout</span></p><div id="bio-copy"></div></div>
  </section>

  <section aria-labelledby="h-week">
    <div class="head"><h2 id="h-week">Vidéos de la semaine en cours</h2><span class="count" id="week-count"></span></div>
    <div class="filters" id="filters" role="group" aria-label="Filtrer par format"></div>
    <div class="grid" id="week"></div>
  </section>

  <section aria-labelledby="h-before">
    <div class="head"><h2 id="h-before">Déjà publiées</h2><span class="count" id="before-count"></span></div>
    <div class="grid" id="before"></div>
  </section>

  <section aria-labelledby="h-learn">
    <div class="head"><h2 id="h-learn">Bilans et enseignements</h2><span class="count">mis à jour chaque vendredi</span></div>
    <details class="note" style="margin-top:16px" open><summary>Journal complet</summary><div class="caption" id="learn"></div></details>
  </section>

  <section aria-labelledby="h-ideas">
    <div class="head"><h2 id="h-ideas">Réserve d'idées</h2><span class="count" id="ideas-count"></span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>N°</th><th>Sujet</th><th>Mécanique</th><th>Accroche</th></tr></thead>
      <tbody id="ideas"></tbody>
    </table></div>
  </section>

  <section aria-labelledby="h-refs">
    <div class="head"><h2 id="h-refs">Les vidéos virales dont on reprend la mécanique</h2></div>
    <p class="lede">On copie la recette (l'accroche, le rythme, la révélation), jamais les images, le texte ou la musique.</p>
    <div class="refs" id="refs"></div>
    <h3 style="margin-top:24px">Sources de la stratégie</h3>
    <div id="ssrc"></div>
  </section>

  <section aria-labelledby="h-money">
    <div class="head"><h2 id="h-money">L'argent, sans illusion</h2></div>
    <div class="cols">
      <div class="note"><h3>Les vues ne paient pas en Suisse</h3><p>La Suisse n'apparaît pas dans les pays du programme Creator Rewards. Ailleurs, il faut 10 000 abonnés, 100 000 vues sur 30 jours et des vidéos de plus d'une minute.</p></div>
      <div class="note"><h3>Ce qui paie vraiment</h3><ul>
        <li>Les marques : un TikTok qui grandit, plus tes abonnés Instagram, rend ton media kit plus fort.</li>
        <li>L'affiliation : liens vers les produits des vidéos, à activer quand le compte a des abonnés.</li>
        <li>Le Black Friday (27 novembre) : la semaine 4 lui est consacrée.</li>
      </ul></div>
      <div class="note"><h3>Les outils, tous gratuits</h3><ul>
        <li>Metricool : publication TikTok et statistiques</li>
        <li>GitHub Actions : voix off Piper</li>
        <li>Cloudinary : hébergement des vidéos</li>
        <li>Moteur de rendu maison (Chromium + ffmpeg)</li>
      </ul><p><a href="https://github.com/marcio198555/marcio-mota-tech/tree/tiktok-autopilot/autopilot" rel="noopener">Le code et la procédure (RUNBOOK)</a></p></div>
    </div>
  </section>
</div>

<script>
const DATA = __DATA__;
const S = DATA.strat;
const STATUS = {"programmée":["sched","Programmée"],"produite":["prod","Produite"],"publiée":["pub","Publiée"],"à produire":["todo","À produire"],"à programmer":["prod","À programmer"],"idée":["todo","Idée"]};
function el(tag, cls, text){ const e=document.createElement(tag); if(cls) e.className=cls; if(text!==undefined) e.textContent=text; return e; }
function fmtDate(iso){ if(!iso) return ''; const d=new Date(iso+'T12:00:00'); const p=n=>String(n).padStart(2,'0'); return ['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'][d.getDay()]+' '+p(d.getDate())+'.'+p(d.getMonth()+1); }
const nf = n => (n===null||n===undefined) ? '—' : Number(n).toLocaleString('fr-CH');
function copyBtn(label, getText, target){
  const b=el('button','copy',label); b.type='button';
  b.addEventListener('click',()=>{ navigator.clipboard.writeText(getText()).then(()=>{ b.textContent='Copié'; setTimeout(()=>b.textContent=label,1500); }).catch(()=>{ const r=document.createRange(); r.selectNodeContents(target); const s=getSelection(); s.removeAllRanges(); s.addRange(r); }); });
  return b;
}
function store(k,v){ try{ if(v===undefined) return localStorage.getItem(k); localStorage.setItem(k,v); }catch(e){ return null; } }

function header(){
  const chips=document.getElementById('chips');
  const cur=(S.semaines||[]).find(w=>w.id===DATA.cur)||{};
  const pub=DATA.before.filter(w=>w.status==='publiée').length, sched=[...DATA.slots,...DATA.before].filter(w=>w.status==='programmée').length;
  [['ok','TikTok connecté à Metricool'],['live',pub+' publiées · '+sched+' programmées'],['gold','2 vidéos par jour · 10 h et 18 h'],['info',(cur.id||'')+' en cours · bilan '+fmtDate(cur.bilan)]].forEach(([d,t])=>{ const s=el('span','chip'); s.append(el('span','dot '+d), el('span','',t)); chips.append(s); });
}

function month(){
  const W=S.semaines||[]; document.getElementById('month-range').textContent=W.length?(fmtDate(W[0].du)+' → '+fmtDate(W[W.length-1].au)+' · bilan final '+fmtDate((S.bilan_final||{}).date)):'';
  const d=S.depart||{}; document.getElementById('start-text').textContent='Point de départ ('+(d.periode||'')+') : '+(d.constat||'');
  const st=document.getElementById('start');
  [[nf(d.vues_mediane),'vues (médiane par vidéo)'],[(d.retention_pct??'—')+' %','de chaque vidéo regardé en moyenne'],[nf(d.abonnes),'abonnés'],['+'+nf(d.abonnes_gagnes),'abonnés en 4 jours'],[nf(d.partages),'partages']].forEach(([v,k])=>{ const c=el('div','stat'); c.append(el('div','v',v), el('div','k',k)); st.append(c); });
  const box=document.getElementById('weeks');
  W.forEach(w=>{
    const c=el('article','wk'+(w.id===DATA.cur?' cur':''));
    const top=el('div','top'); const l=el('div'); l.append(el('div','id',w.id), el('div','dates',fmtDate(w.du)+' → '+fmtDate(w.au)));
    const v=w.verdict?el('span','verdict '+w.verdict,w.verdict):el('span','verdict'+(w.statut==='en cours'?' live':''), w.statut==='en cours'?'En cours':'À venir');
    top.append(l,v); c.append(top);
    const k=el('div','kpi'); const o=w.objectifs||{}, r=w.resultat||{};
    [['Vues (médiane)','vues_mediane',''],['Regardé','retention_pct',' %'],['Nouveaux abonnés','abonnes_gagnes','']].forEach(([lab,key,u])=>{
      const has=r[key]!==undefined&&r[key]!==null;
      k.append(el('span','lab',lab), el('span','val',(has?nf(r[key])+u+' / ':'objectif ')+nf(o[key])+u));
      const b=el('div','bar'); const i=el('i'); i.style.width=(has?Math.min(100,100*r[key]/o[key]):0)+'%'; b.append(i); k.append(b);
    });
    c.append(k, el('div','exp',w.experience||''));
    if(w.decision) c.append(el('div','dec','Décision : '+w.decision));
    else c.append(el('div','exp','Bilan le '+fmtDate(w.bilan)));
    box.append(c);
  });
  const ab=document.getElementById('ab'); const F=S.formats||{};
  [['V','fmt'],['T','fmt t']].forEach(([key,cls])=>{ const f=F[key]; if(!f) return; const c=el('div',cls); c.append(el('span','tag','Format '+key+' · '+f.nom)); c.append(el('p','',f.description)); const n=DATA.slots.filter(s=>s.format===key).length; c.append(el('p','mono',n+' créneaux cette semaine')); ab.append(c); });
  const ru=document.getElementById('rules'); (S.regles||[]).forEach(r=>{ const c=el('div','rule'); c.append(el('b','',r.id+' · '+r.nom), el('span','',r.simple||r.texte)); ru.append(c); });
  const curPlan=((S.semaines||[]).find(w=>w.id===DATA.cur)||{}).plan;
  const la=document.getElementById('ladder'); (S.plans||[]).forEach(p=>{ const c=el('div','rung'+(p.id===curPlan?' on':'')); c.append(el('div','l','Plan '+p.id+(p.id===curPlan?' · actuel':'')), el('b','',p.nom), el('div','q','Quand : '+p.quand), el('p','',p.texte)); la.append(c); });
  const td=document.getElementById('todo'); (S.marcio||[]).forEach((m,i)=>{ const lb=el('label'); const cb=el('input'); cb.type='checkbox'; const key='todo-'+i; cb.checked=store(key)==='1'; cb.addEventListener('change',()=>store(key,cb.checked?'1':'0')); const tx=el('span'); tx.append(el('b','',m.action), el('span','why',m.pourquoi)); lb.append(cb,tx,el('span','t',m.temps)); td.append(lb); });
  const ss=document.getElementById('ssrc'); (S.sources||[]).forEach(s=>{ const p=el('p','src'); const a=el('a','',s.titre); a.href=s.url; a.rel='noopener'; a.target='_blank'; p.append(a, document.createTextNode(' — '+s.apport)); ss.append(p); });
}

function videoCard(w){
  const card=el('article','card'); card.dataset.format=w.format;
  if(w.video){ const v=document.createElement('video'); v.src=w.video; v.controls=true; v.playsInline=true; v.preload='metadata'; if(w.format==='T') v.loop=true; card.append(v); }
  else { const p=el('div','poster small'); p.append(el('div','big','J'+w.day), el('div','hk',w.hook), el('div','', w.status==='à produire'?'Produite vendredi, vérifiée avant publication':'Vidéo en préparation')); card.append(p); }
  const b=el('div','body');
  const m=el('div','meta'); m.append(el('span','', 'Jour '+w.day+' · '+fmtDate(w.date)+' · '+w.when));
  const right=el('span'); right.style.display='flex'; right.style.gap='6px'; right.style.alignItems='center';
  right.append(el('span','ft '+w.format, w.format==='T'?'Texte seul':'Voix'));
  const st=STATUS[w.status]||['todo',w.status]; right.append(el('span','status '+st[0], st[1])); m.append(right); b.append(m);
  b.append(el('h3','',w.title), el('div','hook','Accroche : '+w.hook));
  if(w.url){ const a=el('a','', 'Voir sur TikTok'); a.href=w.url; a.rel='noopener'; a.target='_blank'; b.append(a); }
  if(w.content.length){ const d1=document.createElement('details'); d1.append(el('summary','', w.format==='T'?'Lignes à l\'écran':'Voix off, mot pour mot')); const ol=el('ol','vo'); w.content.forEach(l=>ol.append(el('li','',l))); d1.append(ol); b.append(d1); }
  else if(w.verify.length){ const d1=document.createElement('details'); d1.append(el('summary','','Faits à vérifier vendredi')); const ol=el('ul','vo'); w.verify.forEach(l=>ol.append(el('li','',l))); d1.append(ol); b.append(d1); }
  if(w.caption){ const d2=document.createElement('details'); d2.append(el('summary','','Description TikTok')); const cap=el('div','caption',w.caption); d2.append(cap, copyBtn('Copier la description',()=>w.caption,cap)); b.append(d2); }
  if(w.sources.length){ const d3=document.createElement('details'); d3.append(el('summary','','Sources'));
    w.sources.forEach(s=>{ const div=el('div','src'); if(s.startsWith('http')){ const a=el('a','',s); a.href=s; a.rel='noopener'; a.target='_blank'; div.append(a);} else div.textContent=s; d3.append(div); }); b.append(d3); }
  card.append(b); return card;
}

function videos(){
  const wk=document.getElementById('week'); document.getElementById('week-count').textContent=DATA.slots.length+' créneaux';
  DATA.slots.forEach(w=>wk.append(videoCard(w)));
  const fl=document.getElementById('filters'); let cur=store('filtre')||'all';
  const apply=()=>{ [...wk.children].forEach(c=>c.hidden=!(cur==='all'||c.dataset.format===cur)); [...fl.children].forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.f===cur))); };
  [['all','Toutes'],['V','Voix'],['T','Texte seul']].forEach(([f,t])=>{ const b=el('button','',t); b.type='button'; b.dataset.f=f; b.addEventListener('click',()=>{ cur=f; store('filtre',f); apply(); }); fl.append(b); });
  apply();
  const bf=document.getElementById('before'); document.getElementById('before-count').textContent=DATA.before.length+' vidéos';
  DATA.before.forEach(w=>bf.append(videoCard(w)));
  document.getElementById('learn').textContent=DATA.learn.replace(/^# .*\n+/,'');
  const bio=document.getElementById('bio'); document.getElementById('bio-copy').append(copyBtn('Copier la bio',()=>bio.textContent,bio));
  const ti=document.getElementById('ideas'); document.getElementById('ideas-count').textContent=DATA.ideas.length+' idées';
  DATA.ideas.forEach(d=>{ const tr=document.createElement('tr'); tr.append(el('td','n',String(d.jour)), el('td','',d.sujet), el('td','',d.mecanique||''), el('td','',d.accroche||'')); ti.append(tr); });
  const refs=document.getElementById('refs');
  Object.entries(DATA.refs).forEach(([k,r])=>{ const c=el('div','ref-card'); c.append(el('b','',k), el('div','v',r.vues)); c.append(el('p','',r.titre+' — '+r.createur)); const a=el('a','','Source'); a.href=r.source; a.rel='noopener'; a.target='_blank'; const p=el('p'); p.append(a); c.append(p); refs.append(c); });
}
header(); month(); videos();
</script>
'''
OUT.write_text(html.replace('__DATA__', json.dumps(data, ensure_ascii=False)))
print('page', OUT, len(OUT.read_text()) // 1024, 'Ko ;', len(data['slots']), 'créneaux,', len(data['before']), 'publiées')
