// Format A « Les objets balancent » : l'objet du sujet devient un personnage qui parle (yeux, bouche synchronisée
// sur la voix), dans un décor de salon, avec des personnes et réactions en images 3D libres (Fluent Emoji, MIT).
// Chargé après engine.js ; tout est dans window.CHR. Voir ENGINE.md § « Format A ».
(function () {
  const { W, H, C, F, clamp, lerp, ease, prog, text, roundRect, TL } = ENG;
  const ASSET = 'file:///home/claude/marcio-mota-tech/autopilot/assets/';
  const IMG = {};

  // ---------- images 3D (autopilot/assets/emoji3d/<nom>.png, 256 px) ----------
  function load(names) {
    return Promise.all(names.map(n => new Promise(res => {
      const im = new Image();
      im.onload = () => { IMG[n] = im; res(); };
      im.onerror = () => { console.error('image manquante : ' + n); res(); };
      im.src = ASSET + 'emoji3d/' + n + '.png';
    })));
  }
  // image qui « pop » à t0 (rebond), flotte légèrement ensuite ; size = hauteur en px (≤ 380 pour rester net)
  function emo(ctx, name, x, y, size, t, t0, o = {}) {
    const im = IMG[name]; if (!im) return;
    const k = t0 === undefined ? 1 : ease.back(prog(t, t0, 0.38));
    if (k <= 0.001) return;
    const bob = Math.sin((t - (t0 || 0)) * 2.2 + (o.phase || 0)) * 6;
    ctx.save(); ctx.translate(x, y + bob); ctx.rotate((o.rot || 0) + Math.sin((t + (o.phase || 0)) * 1.7) * 0.04);
    ctx.scale(k * (o.flip ? -1 : 1), k); ctx.globalAlpha *= clamp(k * 1.5) * (o.alpha ?? 1);
    ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12;
    ctx.drawImage(im, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  // ---------- bouche : enveloppe de la voix (TL.mouth = {fps, v[]}, tools/mouth.py) ----------
  function mouthAt(t) {
    const m = TL.mouth; if (!m || !m.v) return 0;
    const f = t * m.fps, i = Math.floor(f);
    if (i < 0 || i >= m.v.length - 1) return 0;
    return lerp(m.v[i], m.v[i + 1], f - i);
  }
  function blinkAt(t, seed) {
    const period = 3.1 + (seed % 3) * 0.37, ph = (t + seed * 0.71) % period;
    return ph < 0.07 ? ph / 0.07 : ph < 0.15 ? 1 - (ph - 0.07) / 0.08 : 0;
  }

  // ---------- visage dessiné (yeux ronds, sourcils, bouche qui parle) ----------
  // o.mood : 'neutre' | 'malin' | 'surpris' | 'fache' | 'content' ; o.look : [dx, dy] (-1..1) ; o.talk (défaut true)
  function face(ctx, x, y, s, t, o = {}) {
    const mood = o.mood || 'neutre', look = o.look || [0, 0];
    const b = blinkAt(t, o.seed || 1);
    const open = o.open !== undefined ? o.open : (o.talk === false ? 0 : mouthAt(t));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const lw = 7;
    [-1, 1].forEach(side => {
      const ex = side * 74, ey = -18;
      const sur = mood === 'surpris' ? 1.15 : 1;
      ctx.beginPath(); ctx.ellipse(ex, ey, 46 * sur, 56 * sur, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = '#1b1f2a'; ctx.stroke();
      const px = ex + look[0] * 16, py = ey + look[1] * 14 + 4;
      ctx.beginPath(); ctx.arc(px, py, 23, 0, Math.PI * 2); ctx.fillStyle = '#1b1f2a'; ctx.fill();
      ctx.beginPath(); ctx.arc(px - 8, py - 9, 7, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
      // paupière (clignement + regard « malin » à moitié fermé)
      const lid = Math.max(b, mood === 'malin' ? 0.32 : mood === 'fache' ? 0.22 : 0);
      if (lid > 0.01) {
        ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, 46 * sur, 56 * sur, 0, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = o.lid || '#c9ced8'; ctx.fillRect(ex - 60, ey - 60, 120, 120 * lid); ctx.restore();
        ctx.beginPath(); ctx.ellipse(ex, ey, 46 * sur, 56 * sur, 0, 0, Math.PI * 2); ctx.lineWidth = lw; ctx.strokeStyle = '#1b1f2a'; ctx.stroke();
      }
      // sourcils
      let a = 0, dy = -78;
      if (mood === 'fache') { a = side * 0.32; dy = -70; }
      if (mood === 'surpris') { dy = -98; }
      if (mood === 'malin') { a = side === 1 ? -0.22 : 0.1; dy = side === 1 ? -90 : -74; }
      if (mood === 'content') { dy = -86; a = -side * 0.08; }
      ctx.save(); ctx.translate(ex, ey + dy); ctx.rotate(a);
      ctx.lineCap = 'round'; ctx.lineWidth = 13; ctx.strokeStyle = '#1b1f2a';
      ctx.beginPath(); ctx.moveTo(-30, 4); ctx.quadraticCurveTo(0, -8, 30, 4); ctx.stroke(); ctx.restore();
    });
    // bouche
    const my = 78;
    if (open < 0.06) {
      ctx.lineCap = 'round'; ctx.lineWidth = 10; ctx.strokeStyle = '#1b1f2a'; ctx.beginPath();
      if (mood === 'malin') { ctx.moveTo(-40, my + 4); ctx.quadraticCurveTo(10, my + 14, 46, my - 10); }
      else if (mood === 'fache') { ctx.moveTo(-40, my + 10); ctx.quadraticCurveTo(0, my - 8, 40, my + 10); }
      else { ctx.moveTo(-42, my); ctx.quadraticCurveTo(0, my + 26, 42, my); }
      ctx.stroke();
    } else {
      const mw = 50 + 26 * open, mh = 12 + 62 * open;
      ctx.beginPath(); ctx.moveTo(-mw, my - 6);
      ctx.quadraticCurveTo(0, my - 14 - (mood === 'content' ? -6 : 0), mw, my - 6);
      ctx.quadraticCurveTo(mw * 0.9, my + mh, 0, my + mh); ctx.quadraticCurveTo(-mw * 0.9, my + mh, -mw, my - 6);
      ctx.closePath(); ctx.fillStyle = '#3a0d14'; ctx.fill();
      ctx.save(); ctx.clip();
      if (open > 0.3) { ctx.fillStyle = '#fff'; ctx.fillRect(-mw, my - 16, mw * 2, 14); }
      ctx.beginPath(); ctx.ellipse(0, my + mh - 4, mw * 0.55, mh * 0.42, 0, 0, Math.PI * 2); ctx.fillStyle = '#e8556a'; ctx.fill();
      ctx.restore();
      ctx.lineWidth = 8; ctx.strokeStyle = '#1b1f2a'; ctx.stroke();
    }
    ctx.restore();
  }

  // ---------- décor : salon chaleureux (mis en cache, flou de profondeur, parallaxe) ----------
  let roomCache = null;
  function buildRoom() {
    const cv = document.createElement('canvas'); cv.width = 1240; cv.height = 2120;
    const g = cv.getContext('2d'); const ox = 80, oy = 100;
    let gr = g.createLinearGradient(0, 0, 0, 1100); gr.addColorStop(0, '#f6e3c4'); gr.addColorStop(1, '#ecd0a6');
    g.fillStyle = gr; g.fillRect(0, 0, 1240, 1110);
    // fenêtre et lumière
    g.save(); g.translate(ox + 90, oy + 120);
    const sky = g.createLinearGradient(0, 0, 0, 640); sky.addColorStop(0, '#9fd3f2'); sky.addColorStop(1, '#e6f4fb');
    g.fillStyle = sky; g.fillRect(0, 0, 420, 640);
    g.fillStyle = '#7fbf7a'; g.beginPath(); g.ellipse(120, 640, 220, 120, 0, Math.PI, 0); g.fill();
    g.strokeStyle = '#ffffff'; g.lineWidth = 26; g.strokeRect(0, 0, 420, 640);
    g.lineWidth = 14; g.beginPath(); g.moveTo(210, 0); g.lineTo(210, 640); g.moveTo(0, 320); g.lineTo(420, 320); g.stroke();
    g.restore();
    const rays = g.createLinearGradient(ox + 100, oy + 300, ox + 700, oy + 1300); rays.addColorStop(0, 'rgba(255,248,225,0.55)'); rays.addColorStop(1, 'rgba(255,248,225,0)');
    g.fillStyle = rays; g.beginPath(); g.moveTo(ox + 90, oy + 120); g.lineTo(ox + 510, oy + 120); g.lineTo(ox + 1100, oy + 1500); g.lineTo(ox + 300, oy + 1500); g.closePath(); g.fill();
    // cadre au mur
    g.fillStyle = '#c8553d'; roundRect(g, ox + 700, oy + 200, 300, 220, 10); g.fill();
    g.fillStyle = '#f2c14e'; g.beginPath(); g.arc(ox + 850, oy + 310, 60, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#3b2f2a'; g.lineWidth = 16; roundRect(g, ox + 700, oy + 200, 300, 220, 10); g.stroke();
    // canapé
    g.fillStyle = '#2f7f86'; roundRect(g, ox + 560, oy + 640, 560, 300, 60); g.fill();
    g.fillStyle = '#286d73'; roundRect(g, ox + 520, oy + 780, 640, 230, 50); g.fill();
    g.fillStyle = '#f2c14e'; roundRect(g, ox + 640, oy + 700, 150, 120, 30); g.fill();
    // plante
    g.fillStyle = '#b5653f'; roundRect(g, ox - 20, oy + 840, 150, 170, 20); g.fill();
    g.fillStyle = '#3f8f4f'; for (let i = 0; i < 7; i++) { g.save(); g.translate(ox + 55, oy + 850); g.rotate(-1.2 + i * 0.4); g.beginPath(); g.ellipse(0, -130, 38, 130, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    // plinthe et sol en parquet
    g.fillStyle = '#fff6ea'; g.fillRect(0, 1095, 1240, 30);
    gr = g.createLinearGradient(0, 1125, 0, 2120); gr.addColorStop(0, '#b77c48'); gr.addColorStop(1, '#8e5a30');
    g.fillStyle = gr; g.fillRect(0, 1125, 1240, 995);
    g.strokeStyle = 'rgba(60,30,10,0.35)'; g.lineWidth = 4;
    for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(620 + i * 60, 1125); g.lineTo(620 + i * 230, 2120); g.stroke(); }
    for (let r = 0; r < 10; r++) { const yy = 1125 + Math.pow(r / 9, 1.7) * 995; g.beginPath(); g.moveTo(0, yy); g.lineTo(1240, yy); g.stroke(); }
    // tapis
    g.fillStyle = '#c96a55'; g.beginPath(); g.ellipse(620, 1290, 560, 200, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#f3e1c0'; g.lineWidth = 14; g.beginPath(); g.ellipse(620, 1290, 500, 165, 0, 0, Math.PI * 2); g.stroke();
    // flou de profondeur sur le fond
    const cv2 = document.createElement('canvas'); cv2.width = cv.width; cv2.height = cv.height;
    const g2 = cv2.getContext('2d'); g2.filter = 'blur(3px)'; g2.drawImage(cv, 0, 0);
    return cv2;
  }
  function room(ctx, t, o = {}) {
    if (!roomCache) roomCache = buildRoom();
    const px = (o.px || 0) + Math.sin(t * 0.35) * 14, py = (o.py || 0) + Math.cos(t * 0.27) * 8;
    ctx.drawImage(roomCache, -80 + px, -100 + py);
    if (o.dim) { ctx.fillStyle = `rgba(3,4,8,${o.dim})`; ctx.fillRect(0, 0, W, H); }
  }

  // ---------- caméra : zooms « punch » sur les mots forts + léger tremblé ----------
  // punches : [[t, force], ...] ; à appeler avant de dessiner la scène, puis ctx.restore()
  function camera(ctx, t, punches = [], o = {}) {
    let z = 1 + (o.base || 0);
    punches.forEach(([tp, a]) => { const d = t - tp; if (d >= 0 && d < 0.9) z += a * Math.exp(-d * 5) * Math.min(1, d * 12); });
    const sx = Math.sin(t * 9.1) * 2.2 + Math.sin(t * 3.7) * 1.6, sy = Math.cos(t * 7.3) * 2 + Math.sin(t * 2.9) * 1.4;
    const cx = o.cx || 540, cy = o.cy || 1000;
    ctx.save(); ctx.translate(cx + sx, cy + sy); ctx.scale(z, z); ctx.translate(-cx, -cy);
  }

  // ---------- objets dessinés ----------
  // Robot aspirateur vu de 3/4, brosse latérale qui tourne, lidar ; o.face = options du visage
  const SIDE_BRUSH = [-150, 172];
  function robotVacuum(ctx, x, y, s, t, o = {}) {
    const rx = 270, ry = 100, h = 74;
    const sq = o.squash || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + sq), s * (1 - sq));
    // ombre
    ctx.save(); ctx.filter = 'blur(14px)'; ctx.fillStyle = 'rgba(40,20,10,0.45)'; ctx.beginPath(); ctx.ellipse(10, h + 26, rx * 1.02, ry * 0.75, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // flanc
    let gr = ctx.createLinearGradient(-rx, 0, rx, 0); gr.addColorStop(0, '#9aa3b2'); gr.addColorStop(0.45, '#e9edf3'); gr.addColorStop(1, '#8a93a3');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI); ctx.lineTo(-rx, h); ctx.ellipse(0, h, rx, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
    // pare-chocs sombre
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, h, rx, ry, 0, 0, Math.PI); ctx.lineTo(-rx, h - 34); ctx.ellipse(0, h - 34, rx, ry, 0, Math.PI, 0, true); ctx.closePath();
    gr = ctx.createLinearGradient(-rx, 0, rx, 0); gr.addColorStop(0, '#2a2f3a'); gr.addColorStop(0.5, '#4a5262'); gr.addColorStop(1, '#232733');
    ctx.fillStyle = gr; ctx.fill(); ctx.restore();
    // dessus
    gr = ctx.createRadialGradient(-80, -40, 20, 0, 0, rx); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.7, '#e7ebf1'); gr.addColorStop(1, '#c8ced8');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(40,46,60,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, rx * 0.86, ry * 0.82, 0, 0, Math.PI * 2); ctx.stroke();
    // reflet
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(-30, -10, rx * 0.8, ry * 0.7, 0, Math.PI * 1.08, Math.PI * 1.42); ctx.stroke();
    // lidar
    ctx.save(); ctx.translate(120, -36);
    ctx.fillStyle = '#2a2f3a'; ctx.beginPath(); ctx.ellipse(0, 0, 58, 22, 0, 0, Math.PI); ctx.lineTo(-58, -30); ctx.ellipse(0, -30, 58, 22, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3a4152'; ctx.beginPath(); ctx.ellipse(0, -30, 58, 22, 0, 0, Math.PI * 2); ctx.fill();
    const la = t * 6; ctx.fillStyle = '#5fe1ff'; ctx.beginPath(); ctx.arc(Math.cos(la) * 44, -14 + Math.sin(la) * 9, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // voyant
    ctx.fillStyle = '#3fd27a'; ctx.beginPath(); ctx.arc(-150, -30, 7, 0, Math.PI * 2); ctx.fill();
    // brosse latérale (avant gauche), devant le pare-chocs pour qu'on la voie : CHR.SIDE_BRUSH = sa position (repère du robot)
    ctx.save(); ctx.translate(SIDE_BRUSH[0], SIDE_BRUSH[1]); ctx.scale(1, 0.4);
    for (let i = 0; i < 3; i++) { const a = t * 11 + i * Math.PI * 2 / 3; ctx.strokeStyle = '#3a3f4b'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 100, Math.sin(a) * 100); ctx.stroke(); }
    ctx.fillStyle = '#2a2f3a'; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.restore();
    if (o.face !== false) face(ctx, x - 40 * s, y - 6 * s, 0.82 * s, t, { lid: '#dfe4ea', ...(o.face || {}) });
  }

  // Carton de produit vu de 3/4 avec une étiquette (texte de l'étiquette = label, sous-titre = sub)
  function box(ctx, x, y, s, label, sub, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    const w = 330, h = 380, d = 110;
    ctx.save(); ctx.filter = 'blur(12px)'; ctx.fillStyle = 'rgba(40,20,10,0.4)'; ctx.beginPath(); ctx.ellipse(40, h / 2 + 20, w * 0.75, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#b8864f'; ctx.beginPath(); ctx.moveTo(w / 2, -h / 2); ctx.lineTo(w / 2 + d, -h / 2 - d * 0.5); ctx.lineTo(w / 2 + d, h / 2 - d * 0.5); ctx.lineTo(w / 2, h / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e2b47a'; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(-w / 2 + d, -h / 2 - d * 0.5); ctx.lineTo(w / 2 + d, -h / 2 - d * 0.5); ctx.lineTo(w / 2, -h / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d29c5e'; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-24, -h / 2, 48, h);
    ctx.fillStyle = '#ffffff'; roundRect(ctx, -w / 2 + 26, -70, w - 52, 200, 18); ctx.fill();
    if (sub) text(ctx, sub, 0, -30, { size: o.subSize || 30, family: F.mono, weight: 700, color: '#5a6170', maxWidth: w - 60 });
    text(ctx, label, 0, 55, { size: 92, weight: 900, color: '#c82030', maxWidth: w - 70 });
    ctx.restore();
  }

  // Bulle de dialogue (x, y = pointe de la queue) ; o.side : 'gauche' | 'droite' (côté de la queue)
  function bubble(ctx, x, y, lines, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.32)); if (k <= 0.001) return;
    const size = o.size || 44, lh = size * 1.22, pad = 28;
    ctx.save(); ctx.font = `800 ${size}px "${F.display}", "${F.emoji}", sans-serif`;
    const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + pad * 2, h = lines.length * lh + pad * 1.4;
    const bx = o.side === 'droite' ? x - w + 60 : x - 60, by = y - h - 34;
    ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
    ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
    ctx.fillStyle = o.bg || '#ffffff'; roundRect(ctx, bx, by, w, h, 34); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 24, by + h - 2); ctx.lineTo(x, y); ctx.lineTo(x + 26, by + h - 2); ctx.closePath(); ctx.fill();
    ctx.shadowColor = 'transparent';
    lines.forEach((l, i) => text(ctx, l, bx + w / 2, by + pad * 0.7 + lh * (i + 0.5), { size, weight: 800, color: o.color || '#1b1f2a' }));
    ctx.restore();
  }

  // Bandeau de série en haut (sous le logo)
  function seriesChip(ctx, t, label) {
    ENG.chip(ctx, label || 'LES OBJETS BALANCENT', 540, 360, { color: C.gold2, size: 34, dot: C.red, bg: 'rgba(11,18,32,0.82)' });
  }

  // Manomètre (pression) : v = 0..1
  function gauge(ctx, x, y, r, v, label) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = r * 0.09; ctx.strokeStyle = '#2a2f3a'; ctx.stroke();
    for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.75 + 1.5 * i / 10); ctx.lineWidth = i % 5 ? 5 : 9; ctx.strokeStyle = i > 7 ? '#c82030' : '#2a2f3a';
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78); ctx.lineTo(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9); ctx.stroke(); }
    const a = Math.PI * (0.75 + 1.5 * clamp(v));
    ctx.strokeStyle = '#c82030'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72); ctx.stroke();
    ctx.fillStyle = '#2a2f3a'; ctx.beginPath(); ctx.arc(0, 0, r * 0.1, 0, Math.PI * 2); ctx.fill();
    if (label) text(ctx, label, 0, r * 0.47, { size: Math.max(40, r * 0.3), weight: 900, color: '#2a2f3a' });
    ctx.restore();
  }

  // ---------- images générées par IA (format A, depuis le 03.11.2026) ----------
  // Fichiers : autopilot/assets/ai/<nom>.png (décors 9:16 et personnages détourés, fond transparent).
  // Voir RUNBOOK § 11.6 (outils, licences, crédits). Toute vidéo qui en contient reste marquée « contenu IA ».
  const ART = {}, ARTBLUR = {};
  function loadArt(names) {
    return Promise.all(names.map(n => new Promise(res => {
      const im = new Image();
      im.onload = () => { ART[n] = im; res(); };
      im.onerror = () => { console.error('image IA manquante : ' + n); res(); };
      im.src = ASSET + 'ai/' + n + '.png';
    })));
  }
  function blurred(name, px) {
    const key = name + '|' + px;
    if (!ARTBLUR[key]) {
      const im = ART[name], cv = document.createElement('canvas');
      cv.width = im.width; cv.height = im.height;
      const g = cv.getContext('2d'); g.filter = `blur(${px}px)`; g.drawImage(im, 0, 0);
      ARTBLUR[key] = cv;
    }
    return ARTBLUR[key];
  }
  // Décor plein écran (image 9:16), cadré « cover », zoom lent de z0 à z1 sur dur secondes vers focus [fx, fy] (0..1),
  // légère dérive ; o.blur = flou de profondeur (px, en pixels de l'image source), o.dim = assombrir (0..1).
  function backdrop(ctx, t, name, o = {}) {
    const im = ART[name]; if (!im) return;
    const src = o.blur ? blurred(name, o.blur) : im;
    const k = clamp(t / (o.dur || 30));
    const z = lerp(o.z0 ?? 1.04, o.z1 ?? 1.14, ease.inOut(k));
    const sc = Math.max(W / im.width, H / im.height) * z;
    const [fx, fy] = o.focus || [0.5, 0.62];
    const w = im.width * sc, h = im.height * sc;
    const x = W * fx - w * fx + Math.sin(t * 0.31) * 10 + (o.px || 0);
    const y = H * fy - h * fy + Math.cos(t * 0.23) * 7 + (o.py || 0);
    ctx.drawImage(src, x, y, w, h);
    if (o.dim) { ctx.fillStyle = `rgba(3,4,8,${o.dim})`; ctx.fillRect(0, 0, W, H); }
  }
  // Bouche ouverte dessinée par-dessus une image (centre haut x, y ; largeur mw ; open 0..1).
  // o.skin = couleur de la peau / coque pour masquer la bouche peinte ; o.lip = contour.
  function mouthShape(ctx, x, y, mw, open, o = {}) {
    const hw = mw / 2 * (0.78 + 0.22 * open), mh = mw * (0.1 + 0.42 * open);
    if (o.skin) {
      ctx.fillStyle = o.skin; ctx.beginPath();
      ctx.ellipse(x, y + mh * 0.25, mw * 0.62, mw * 0.16 + mh * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath(); ctx.moveTo(x - hw, y);
    ctx.quadraticCurveTo(x, y - mh * 0.16, x + hw, y);
    ctx.quadraticCurveTo(x + hw * 0.9, y + mh, x, y + mh);
    ctx.quadraticCurveTo(x - hw * 0.9, y + mh, x - hw, y);
    ctx.closePath(); ctx.fillStyle = '#3a0d14'; ctx.fill();
    ctx.save(); ctx.clip();
    if (open > 0.3) { ctx.fillStyle = '#fff'; ctx.fillRect(x - hw, y - mh * 0.06, hw * 2, mh * 0.2); }
    ctx.beginPath(); ctx.ellipse(x, y + mh * 0.95, hw * 0.55, mh * 0.42, 0, 0, Math.PI * 2); ctx.fillStyle = '#e8556a'; ctx.fill();
    ctx.restore();
    ctx.lineWidth = Math.max(2, mw * 0.045); ctx.strokeStyle = o.lip || '#2a2f3a'; ctx.stroke();
  }
  // Personnage ou objet détouré (PNG transparent) posé au sol : (x, y) = milieu de la base, h = hauteur affichée (px).
  // Il vit tout seul : respiration, petit rebond quand la voix parle, ombre au sol.
  // o.t0 = apparition avec rebond ; o.squash = écrasement ponctuel (-0.2..0.2) ; o.rot, o.flip, o.alpha, o.phase ;
  // o.talk = false pour qu'il ne réagisse pas à la voix ;
  // o.mouth = [mx, my, mw] en fraction de l'image (centre haut de la bouche, largeur) : bouche animée sur la voix ;
  // o.eyes = [[ex, ey, rx, ry], …] en fraction de l'image : clignements (paupière couleur o.lid) ;
  // o.skin / o.lip : couleurs pour la bouche (voir mouthShape).
  function art(ctx, name, x, y, h, t, o = {}) {
    const im = ART[name]; if (!im) return;
    const k = o.t0 === undefined ? 1 : ease.back(prog(t, o.t0, 0.4));
    if (k <= 0.001) return;
    const w = h * im.width / im.height;
    const talk = o.talk === false ? 0 : mouthAt(t);
    const breathe = Math.sin(t * 2.4 + (o.phase || 0)) * 0.012;
    const sq = (o.squash || 0) + talk * 0.03;
    ctx.save(); ctx.globalAlpha *= clamp(k * 1.5) * (o.alpha ?? 1);
    if (o.shadow !== false) {
      ctx.save(); ctx.filter = 'blur(18px)'; ctx.fillStyle = 'rgba(30,18,8,0.45)';
      ctx.beginPath(); ctx.ellipse(x, y - h * 0.01, w * 0.44 * k, h * 0.055 * k, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    ctx.translate(x, y); ctx.rotate((o.rot || 0) + Math.sin(t * 1.6 + (o.phase || 0)) * 0.012);
    ctx.scale((1 + sq + breathe) * k * (o.flip ? -1 : 1), (1 - sq - breathe * 0.6) * k);
    ctx.drawImage(im, -w / 2, -h, w, h);
    if (o.eyes) {
      const b = blinkAt(t, o.seed || 2);
      if (b > 0.01) o.eyes.forEach(([ex, ey, rx, ry]) => {
        const cx = (ex - 0.5) * w, cy = (ey - 1) * h, a = rx * w, bb = ry * h;
        ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, a, bb, 0, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = o.lid || '#e9edf2'; ctx.fillRect(cx - a, cy - bb, a * 2, bb * 2 * b); ctx.restore();
      });
    }
    if (o.mouth && talk > 0.06) {
      const [mx, my, mw] = o.mouth;
      mouthShape(ctx, (mx - 0.5) * w, (my - 1) * h, mw * w, talk, o);
    }
    ctx.restore();
  }

  window.CHR = { IMG, load, emo, mouthAt, face, room, camera, robotVacuum, SIDE_BRUSH, box, bubble, seriesChip, gauge,
                 ART, loadArt, backdrop, art, mouthShape };
})();
