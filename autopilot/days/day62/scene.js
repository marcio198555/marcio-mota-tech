// Vidéo 62 — format A « Les objets balancent » : la baignoire balance combien coûtent douche et bain, en francs.
// Tous les chiffres : days/day62/facts.md (exemple : chauffe-eau électrique supposé, bain à 37 °C).
// Baignoire : assets/ai/perso_baignoire.png ; repères dans assets/ai/SOURCES.md. Regard, sourcils, paupières et bouche
// sont redessinés par-dessus l'image (fonction tub), pour que l'humeur change selon la phrase.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, text, roundRect, chip, captions, brand, block, followCTA } = ENG;
  const { emo, camera, bubble } = CHR;
  const END = E('s16') + 0.6;
  const AQUA = '#39c6d8', AQUA2 = '#8ee7ef', GOLD = C.gold2 || '#e6c66a', RED = '#ff5a5f', GREEN = '#58d68d';
  const PANEL = 'rgba(6,20,32,0.88)';
  const f = (id, u) => S(id) + (E(id) - S(id)) * u;
  const IDS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12','s13','s14','s15','s16'];

  const PUNCH = [[f('s01',0.5),0.05],[f('s03',0.1),0.06],[f('s04',0.85),0.07],[f('s05',0.45),0.07],[f('s06',0.7),0.05],[f('s07',0.75),0.06],
    [f('s08',0.85),0.08],[f('s09',0.12),0.1],[f('s10',0.75),0.09],[f('s11',0.6),0.07],[f('s13',0.75),0.07],[f('s14',0.2),0.05],[S('s15'),0.06]];

  // ---------- briques ----------
  function panel(ctx, x, y, w, h, o = {}) {
    roundRect(ctx, x, y, w, h, o.r || 32); ctx.fillStyle = o.bg || PANEL; ctx.fill();
    ctx.lineWidth = o.lw || 4; ctx.strokeStyle = o.border || 'rgba(142,231,239,0.45)'; ctx.stroke();
  }
  function pop(ctx, t, t0, x, y, fn, d = 0.32) {
    const k = ease.back(prog(t, t0, d)); if (k <= 0.001) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha *= clamp(k * 2); fn(); ctx.restore();
  }
  function stamp(ctx, label, x, y, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.32)); if (k <= 0.001) return;
    const size = o.size || 64, col = o.color || RED;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.06); ctx.scale(lerp(1.5, 1, k), lerp(1.5, 1, k)); ctx.globalAlpha *= clamp(k * 2.5);
    ctx.font = `900 ${size}px InterDisplay`; const w = ctx.measureText(label).width + 56, h = size + 34;
    roundRect(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = 'rgba(6,12,20,0.9)'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = col; ctx.stroke();
    text(ctx, label, 0, 2, { size, weight: 900, color: col }); ctx.restore();
  }
  const exChip = (ctx, label, y, o = {}) => chip(ctx, label, o.x || 520, y, { size: 40, color: 'rgba(255,255,255,0.8)', letter: 0, bg: 'rgba(6,20,32,0.92)', alpha: o.alpha });
  const srcChip = (ctx, label, x, y, o = {}) => chip(ctx, label, x, y, { size: 36, color: GOLD, letter: 0, bg: 'rgba(6,20,32,0.92)', border: 'rgba(230,198,106,0.6)', alpha: o.alpha });
  const fr = (v, d = 0) => v.toFixed(d).replace('.', ',');
  // jauge d'eau ; litres sur maxL ; o.line = niveau pointillé
  function tank(ctx, x, yb, w, h, litres, maxL, t, o = {}) {
    const col = o.color || AQUA, u = clamp(litres / maxL), H = u * (h - 16);
    roundRect(ctx, x - w / 2, yb - h, w, h, 24); ctx.fillStyle = PANEL; ctx.fill();
    ctx.save(); roundRect(ctx, x - w / 2 + 8, yb - h + 8, w - 16, h - 16, 18); ctx.clip();
    if (H > 1) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w / 2, yb); ctx.lineTo(x - w / 2, yb - 8 - H);
      for (let i = 0; i <= 12; i++) { const X = x - w / 2 + (w * i) / 12; ctx.lineTo(X, yb - 8 - H + Math.sin(t * 6 + i * 0.9) * 5); }
      ctx.lineTo(x + w / 2, yb); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    roundRect(ctx, x - w / 2, yb - h, w, h, 24); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.stroke();
    if (o.line) {
      const Y = yb - 8 - clamp(o.line / maxL) * (h - 16);
      ctx.save(); ctx.setLineDash([14, 12]); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - w / 2 - 14, Y); ctx.lineTo(x + w / 2 + 14, Y); ctx.stroke(); ctx.restore();
    }
    if (o.label) text(ctx, o.label, x, yb + 34, { size: 38, weight: 800, color: C.white, stroke: 'rgba(6,12,20,0.95)', strokeWidth: 10 });
  }
  function showerHead(ctx, x, y, s, t, flow, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = '#cfd8e2'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-90, -46); ctx.lineTo(0, -46); ctx.lineTo(0, -16); ctx.stroke();
    ctx.fillStyle = '#e8eef4'; ctx.beginPath(); ctx.moveTo(-56, 12); ctx.quadraticCurveTo(0, -36, 56, 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#9fb0c0'; roundRect(ctx, -60, 8, 120, 12, 6); ctx.fill();
    ctx.fillStyle = AQUA2;
    const n = Math.round(flow);
    for (let i = 0; i < n; i++) {
      const col = i % 7, ph = (t * 1.9 + i * 0.37) % 1;
      const sd = i % 2 ? 1 : -1;
      const dx = o.around ? sd * (72 + (i % 3) * 12 + ph * 12) : -46 + col * 15.3 + ph * (col - 3) * 7, dy = 30 + ph * (o.around ? 150 : 190);
      ctx.globalAlpha = 1 - ph * 0.5; ctx.beginPath(); ctx.ellipse(dx, dy, 4.5, 11, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function thermometer(ctx, x, y, h, u, col) {
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -36, -h, 72, h + 20, 36); ctx.fillStyle = PANEL; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 42, 60, 0, Math.PI * 2); ctx.fillStyle = PANEL; ctx.fill(); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 42, 46, 0, Math.PI * 2); ctx.fill();
    const fh = (h - 30) * clamp(u); roundRect(ctx, -19, 10 - fh, 38, fh + 20, 19); ctx.fill();
    ctx.restore();
  }
  function duel(ctx, t, o = {}) {
    panel(ctx, 60, 520, 430, 330, { border: AQUA });
    panel(ctx, 510, 520, 430, 330, { border: GOLD });
    chip(ctx, 'TOI', 275, 560, { color: C.white, size: 40, letter: 1, border: AQUA });
    chip(ctx, 'TON COLLÈGUE', 725, 560, { color: C.white, size: 36, letter: 0, border: GOLD });
    emo(ctx, 'woman_technologist', 275, 705, 165, t, undefined, { phase: 0.3 });
    showerHead(ctx, 275, 625, 0.72, t, 12, { around: true });
    emo(ctx, 'man_technologist', 725, 660, 130, t, undefined, { phase: 1.4 });
    emo(ctx, 'bathtub', 725, 720, 190, t, undefined, { phase: 0.9 });
    const st = { stroke: 'rgba(6,12,20,0.95)', strokeWidth: 10, weight: 900 };
    if (o.values) {
      text(ctx, 'DOUCHE ' + o.values[0], 275, 812, { size: 44, color: AQUA2, maxWidth: 400, ...st });
      text(ctx, 'BAIN ' + o.values[1], 725, 812, { size: 44, color: '#ff9a9d', maxWidth: 400, ...st });
    } else {
      text(ctx, 'DOUCHE', 275, 810, { size: 58, color: AQUA2, ...st });
      text(ctx, 'BAIN', 725, 810, { size: 58, color: GOLD, ...st });
    }
  }

  // ---------- la baignoire (repères en pixels de l'image 595×467) ----------
  const SKIN = '216,212,207', LID = '#e2ded8', SCL = '#ece9e2';
  const EYE = [
    { c: [227, 224], rx: 49, ry: 47, iris: [224, 232], en: ['rgb(180,176,173)', 'rgb(204,200,195)'], sc: 'rgb(226,222,215)', lash: [[172, 208], [205, 197], [240, 205], [268, 236], [275, 270], [165, 270]] },
    { c: [386, 222], rx: 43, ry: 45, iris: [386, 232], en: ['rgb(224,220,213)', 'rgb(232,227,221)'], sc: 'rgb(236,232,225)', lash: [[340, 236], [372, 206], [408, 196], [432, 204], [432, 270], [340, 270]] },
  ];
  const BROW = [
    { c: [222, 151], pts: [[-48, 10], [-22, -7], [12, -6], [43, 11]], in: 1 },
    { c: [394, 155], pts: [[-42, 9], [-12, -5], [18, -8], [43, 7]], in: 0 },
  ];
  const MOOD = {
    neutre:  { up: [0, 0], tilt: 0, lid: 0, smile: 0.55, big: 1 },
    malin:   { up: [10, -3], tilt: 0.1, lid: 0.22, smile: 0.9, big: 1 },
    fache:   { up: [-6, -6], tilt: 0.34, lid: 0.26, smile: -0.8, big: 0.94 },
    vexe:    { up: [4, 4], tilt: -0.2, lid: 0.24, smile: -0.4, big: 1 },
    surpris: { up: [16, 16], tilt: -0.08, lid: 0, smile: 0, big: 1.1 },
    content: { up: [7, 7], tilt: -0.05, lid: 0, smile: 1, big: 1.05 },
  };
  function blinkAt(t) { const p = 3.4, ph = (t + 1.3) % p; return ph < 0.04 ? ph / 0.04 : ph < 0.1 ? 1 - (ph - 0.04) / 0.06 : 0; }
  function softPatch(ctx, x, y, rx, ry) {
    ctx.save(); ctx.translate(x, y); ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, `rgba(${SKIN},1)`); g.addColorStop(0.8, `rgba(${SKIN},1)`); g.addColorStop(1, `rgba(${SKIN},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function talkMouth(ctx, x, y, mw, open) {
    const hw = mw / 2 * (0.78 + 0.22 * open), mh = mw * (0.1 + 0.42 * open);
    const path = () => { ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.quadraticCurveTo(x, y - mh * 0.14, x + hw, y); ctx.quadraticCurveTo(x + hw * 0.9, y + mh, x, y + mh); ctx.quadraticCurveTo(x - hw * 0.9, y + mh, x - hw, y); ctx.closePath(); };
    path(); ctx.fillStyle = '#3a0d14'; ctx.fill();
    ctx.save(); path(); ctx.clip();
    if (open > 0.3) { ctx.fillStyle = '#f5f2ee'; ctx.fillRect(x - hw, y - mh * 0.14, hw * 2, mh * 0.26); }
    ctx.beginPath(); ctx.ellipse(x, y + mh * 0.98, hw * 0.55, mh * 0.42, 0, 0, Math.PI * 2); ctx.fillStyle = '#e8556a'; ctx.fill();
    ctx.restore();
    path(); ctx.lineWidth = 4; ctx.strokeStyle = '#6d2a33'; ctx.stroke();
  }
  function tub(ctx, x, y, h, t, o = {}) {
    const im = CHR.ART.perso_baignoire; if (!im) return;
    const talk = o.talk === false ? 0 : CHR.mouthAt(t), m = MOOD[o.mood || 'neutre'];
    const w = h * im.width / im.height, u = h / im.height;
    const breathe = Math.sin(t * 2.4) * 0.012, sq = (o.squash || 0) + talk * 0.035;
    ctx.save();
    ctx.save(); ctx.filter = 'blur(18px)'; ctx.fillStyle = 'rgba(30,18,8,0.45)'; ctx.beginPath(); ctx.ellipse(x, y - h * 0.01, w * 0.42, h * 0.055, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.translate(x, y); ctx.rotate((o.rot || 0) + Math.sin(t * 1.6) * 0.012); ctx.scale(1 + sq + breathe, 1 - sq - breathe * 0.6);
    ctx.drawImage(im, -w / 2, -h, w, h);
    // repère image : (0,0) = coin haut gauche, en pixels source
    ctx.translate(-w / 2, -h); ctx.scale(u, u);
    const look = o.look || [0, 0], b = blinkAt(t);
    // yeux : blanc, iris, lumière, sous la ligne des cils de l'image
    EYE.forEach((e) => {
      const SZ = 190, ox = e.c[0] - SZ / 2, oy = e.c[1] - SZ / 2;
      if (!e.mask) {
        e.mask = document.createElement('canvas'); e.mask.width = e.mask.height = SZ;
        const mg = e.mask.getContext('2d'); mg.filter = 'blur(8px)'; mg.fillStyle = '#000';
        mg.beginPath(); mg.ellipse(SZ / 2, SZ / 2, e.rx, e.ry, 0, 0, Math.PI * 2); mg.fill();
        e.cv = document.createElement('canvas'); e.cv.width = e.cv.height = SZ;
      }
      const g = e.cv.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, SZ, SZ);
      g.translate(-ox, -oy);
      const lg = g.createLinearGradient(e.c[0] - e.rx, 0, e.c[0] + e.rx, 0); lg.addColorStop(0, e.en[0]); lg.addColorStop(1, e.en[1]);
      g.save();
      g.beginPath(); e.lash.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.clip();
      g.fillStyle = lg; g.fillRect(ox, oy, SZ, SZ);
      const rg = g.createRadialGradient(e.c[0], e.c[1] + 6, 8, e.c[0], e.c[1] + 6, e.rx * 0.82);
      rg.addColorStop(0, e.sc); rg.addColorStop(0.72, e.sc); rg.addColorStop(1, e.sc.replace('rgb(', 'rgba(').replace(')', ',0)'));
      g.fillStyle = rg; g.fillRect(ox, oy, SZ, SZ);
      const ix = e.iris[0] + look[0] * 15, iy = e.iris[1] + look[1] * 7;
      g.beginPath(); g.ellipse(ix, iy, 21 * m.big, 26 * m.big, 0, 0, Math.PI * 2); g.fillStyle = '#1f6f7c'; g.fill();
      g.lineWidth = 3; g.strokeStyle = '#123c46'; g.stroke();
      g.beginPath(); g.ellipse(ix, iy + 6, 15 * m.big, 15 * m.big, 0, 0, Math.PI * 2); g.fillStyle = '#4fa9b4'; g.fill();
      g.beginPath(); g.ellipse(ix, iy, 13 / m.big, 17 / m.big, 0, 0, Math.PI * 2); g.fillStyle = '#050505'; g.fill();
      g.beginPath(); g.arc(ix - 5, iy - 12, 5, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill();
      g.restore();
      // paupière d'humeur et clignement, couleur de l'émail
      const lidU = Math.max(m.lid, b);
      if (lidU > 0.01) {
        const yl = e.c[1] - e.ry + e.ry * 2 * lidU;
        g.fillStyle = lg; g.fillRect(ox, oy, SZ, yl - oy);
        g.strokeStyle = '#2b2622'; g.lineWidth = 4; g.beginPath(); g.moveTo(e.c[0] - e.rx, yl); g.lineTo(e.c[0] + e.rx, yl); g.stroke();
      }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-in'; g.drawImage(e.mask, 0, 0);
      ctx.drawImage(e.cv, ox, oy);
    });
    // sourcils redessinés selon l'humeur
    BROW.forEach((br, i) => {
      ctx.save(); ctx.filter = 'blur(5px)';
      const gb = ctx.createLinearGradient(br.c[0] - 58, 0, br.c[0] + 58, 0);
      gb.addColorStop(0, i === 0 ? 'rgb(165,164,162)' : 'rgb(214,210,205)'); gb.addColorStop(1, i === 0 ? 'rgb(196,192,189)' : 'rgb(225,221,216)');
      ctx.fillStyle = gb; ctx.beginPath(); ctx.ellipse(br.c[0], br.c[1], 58, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(br.c[0], br.c[1] - m.up[i]); ctx.rotate((i === 0 ? 1 : -1) * m.tilt);
      ctx.strokeStyle = '#3a312b'; ctx.lineCap = 'round'; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(br.pts[0][0], br.pts[0][1]); ctx.bezierCurveTo(br.pts[1][0], br.pts[1][1], br.pts[2][0], br.pts[2][1], br.pts[3][0], br.pts[3][1]); ctx.stroke();
      ctx.restore();
    });
    // bouche : l'ancienne est recouverte, la nouvelle suit la voix
    softPatch(ctx, 297, 303, 80, 32);
    if (talk > 0.06) {
      talkMouth(ctx, 297, 292, 100, talk);
    } else if (m.smile === 0) {
      ctx.beginPath(); ctx.ellipse(297, 302, 11, 14, 0, 0, Math.PI * 2); ctx.fillStyle = '#3a0d14'; ctx.fill();
    } else {
      ctx.strokeStyle = '#a25a5e'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(250, 298 - m.smile * 3); ctx.quadraticCurveTo(297, 298 + m.smile * 14, 344, 298 - m.smile * 3); ctx.stroke();
    }
    ctx.restore();
  }
  // mousse qui s'échappe du bord
  function foam(ctx, x, y, t) {
    for (let i = 0; i < 6; i++) {
      const ph = (t * 0.45 + i * 0.19) % 1, dx = Math.sin(i * 2.4 + t) * 18 + (i - 2.5) * 45;
      ctx.save(); ctx.globalAlpha *= (1 - ph) * 0.85; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + dx, y - ph * 130, 6 + (i % 3) * 5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
  function moodAt(t) {
    const P = {
      s01: ['malin', t < f('s01', 0.45) ? [-1, -0.4] : [1, -0.4]], s02: ['malin', [0, 0]], s03: ['vexe', [0.6, -1]],
      s04: ['malin', [-0.7, -1]], s05: ['content', [0.8, -1]], s06: ['neutre', [-0.6, -1]],
      s07: ['vexe', [0, -1]], s08: ['surpris', [0.7, -1]], s09: ['fache', [0, 0]],
      s10: ['surpris', [-0.6, -1]], s11: ['malin', [0.6, -1]], s12: ['neutre', [0.5, -1]],
      s13: ['content', [-0.6, -1]], s14: ['malin', [0, 0.2]], s15: ['content', t < f('s15', 0.5) ? [-1, -0.4] : [1, -0.4]], s16: ['content', [0, -0.8]],
    };
    let cur = 's01'; IDS.forEach(id => { if (t >= S(id) - 0.05) cur = id; });
    return P[cur];
  }
  function tubPos(t) {
    let x = 540 + 72 * Math.sin(t * 0.72), y = 1282, sq = 0;
    const rot = 0.032 * Math.cos(t * 0.72);
    IDS.forEach(id => { const d = t - S(id); if (d >= 0 && d < 0.34) { y -= 26 * Math.sin(Math.PI * d / 0.34); sq -= 0.04 * Math.sin(Math.PI * d / 0.34); } });
    const dh = t - S('s10') - 0.05; if (dh >= 0 && dh < 0.5) y -= 80 * Math.sin(Math.PI * dh / 0.5);
    const df = t - S('s09'); if (df >= 0 && df < E('s09') - S('s09')) x += Math.sin(df * 62) * 7;
    PUNCH.forEach(([tp]) => { const d = t - tp; if (d >= 0 && d < 0.5) sq += 0.05 * Math.sin(d * 18) * Math.exp(-d * 6); });
    return [x, y, rot, sq];
  }

  window.SCENE = {
    duration: END,
    load: () => Promise.all([CHR.loadArt(['decor_salle_de_bain', 'perso_baignoire']), CHR.load(['woman_technologist', 'man_technologist', 'bathtub', 'stopwatch', 'money_with_wings', 'money_bag', 'droplet', 'thermometer', 'high_voltage', 'check_mark_button', 'exploding_head', 'warning', 'thinking_face', 'smirking_face'])]),
    draw(ctx, t) {
      const inEnd = t >= S('s16') - 0.05;
      camera(ctx, t, PUNCH, { cy: 900, base: 0.025 * clamp(t / S('s16')) });
      CHR.backdrop(ctx, t, 'decor_salle_de_bain', { blur: 1.5, z0: 1.04, z1: 1.12, focus: [0.5, 0.75], dur: END, dim: 0.2 });
      const [mood, look] = moodAt(t), [TX, TY, TR, TS] = tubPos(t);

      if (!inEnd) foam(ctx, TX, TY - 400, t);

      // 1. DUEL (complet à l'image 0)
      block(ctx, t, 0, S('s02'), () => {
        const wig = 1 + 0.015 * Math.sin(t * 5);
        ctx.save(); ctx.translate(500, 408); ctx.scale(wig, wig);
        roundRect(ctx, -440, -100, 880, 200, 34); ctx.fillStyle = PANEL; ctx.fill();
        text(ctx, 'QUI PAIE', 0, -46, { size: 100, weight: 900, color: C.white });
        text(ctx, 'LE PLUS ?', 0, 48, { size: 100, weight: 900, color: GOLD });
        ctx.restore();
        duel(ctx, t);
      });

      // 2. Promesse : quand la douche rattrape le bain ?
      block(ctx, t, S('s02'), S('s03'), () => {
        panel(ctx, 110, 310, 820, 500);
        text(ctx, 'TA DOUCHE ME RATTRAPE', 520, 375, { size: 62, weight: 900, color: C.white, maxWidth: 760 });
        pop(ctx, t, f('s02', 0.15), 270, 590, () => emo(ctx, 'stopwatch', 0, 0, 240, t));
        pop(ctx, t, f('s02', 0.4), 640, 540, () => text(ctx, '?? MIN', 0, 0, { size: 118, family: F.mono, weight: 700, color: GOLD }));
        const k = ease.inOut(prog(t, f('s02', 0.3), 1.8));
        pop(ctx, t, f('s02', 0.55), 640, 685, () => {
          roundRect(ctx, -230, -36, 460, 72, 24); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fill();
          roundRect(ctx, -222, -28, 444 * k, 56, 18); ctx.fillStyle = AQUA; ctx.fill();
        });
      });

      // 3. Hypothèses
      block(ctx, t, S('s03'), S('s04'), () => {
        stamp(ctx, 'EXEMPLE', 520, 360, t, S('s03') + 0.05, { size: 72, color: GOLD });
        [[0.18, 'CHAUFFE-EAU ÉLECTRIQUE SUPPOSÉ', '', C.white, 468], [0.42, '27,7 ct/kWh hors TVA', 'médian ElCom', GOLD, 568], [0.68, '3,45 fr./m³', 'eau + traitement, Lausanne', AQUA2, 668]].forEach(([u, a, b, col, y]) => {
          pop(ctx, t, f('s03', u), 520, y, () => {
            panel(ctx, -430, -49, 860, 98, { r: 24 });
            if (b) { text(ctx, a, -405, 0, { size: y === 568 ? 44 : 54, family: F.mono, weight: 700, color: col, align: 'left' }); text(ctx, b, 415, 0, { size: 40, weight: 800, color: C.white, align: 'right', maxWidth: 440 }); }
            else text(ctx, a, 0, 0, { size: 50, weight: 900, color: col, maxWidth: 810 });
          });
        });
        pop(ctx, t, f('s03', 0.86), 520, 765, () => { panel(ctx, -430, -44, 860, 88, { r: 24, border: RED }); text(ctx, 'Le coût dépend du mode de chauffage', 0, 0, { size: 44, weight: 800, color: C.white, maxWidth: 820 }); });
      });

      // 4. Douche : 60 litres
      block(ctx, t, S('s04'), S('s05'), () => {
        const lt = prog(t, f('s04', 0.15), (E('s04') - S('s04')) * 0.65), L = 60 * ease.inOut(lt);
        showerHead(ctx, 250, 370, 1, t, 34);
        tank(ctx, 225, 835, 170, 420, L, 200, t, { color: AQUA });
        panel(ctx, 370, 310, 570, 490);
        pop(ctx, t, f('s04', 0.05), 655, 365, () => text(ctx, `${fr(5 * lt, 1)} min`, 0, 0, { size: 62, family: F.mono, weight: 700, color: C.white }));
        pop(ctx, t, f('s04', 0.2), 655, 515, () => { text(ctx, `${Math.round(L)} L`, 0, 0, { size: 150, family: F.mono, weight: 700, color: AQUA2 }); });
        pop(ctx, t, f('s04', 0.5), 655, 650, () => text(ctx, '5 min × 12 l/min', 0, 0, { size: 54, weight: 900, color: C.white, maxWidth: 530 }));
        pop(ctx, t, f('s04', 0.72), 655, 735, () => srcChip(ctx, 'Eau de Fribourg', 0, 0));
      });

      // 5. Bain : 200 litres
      block(ctx, t, S('s05'), S('s06'), () => {
        const L = 200 * ease.inOut(prog(t, f('s05', 0.08), (E('s05') - S('s05')) * 0.55));
        tank(ctx, 145, 770, 130, 430, 60, 200, t, { color: AQUA, label: 'DOUCHE' });
        tank(ctx, 315, 770, 130, 430, L, 200, t, { color: GOLD, label: 'BAIN' });
        panel(ctx, 410, 310, 530, 505);
        pop(ctx, t, f('s05', 0.15), 675, 410, () => text(ctx, `${Math.round(L)} L`, 0, 0, { size: 124, family: F.mono, weight: 700, color: GOLD }));
        pop(ctx, t, f('s05', 0.42), 675, 535, () => text(ctx, 'bain plein : 200 à 250 l', 0, 0, { size: 44, weight: 900, color: C.white, maxWidth: 490 }));
        pop(ctx, t, f('s05', 0.6), 675, 625, () => { chip(ctx, 'services cantonaux', 0, 0, { size: 36, color: GOLD, letter: 0, bg: 'rgba(6,20,32,0.92)' }); });
        pop(ctx, t, f('s05', 0.78), 675, 725, () => exChip(ctx, 'exemple : 200 l', 0, { x: 1 }));
      });

      // 6. Énergie par litre
      block(ctx, t, S('s06'), S('s07'), () => {
        const k = ease.inOut(prog(t, f('s06', 0.08), 1.5)), T = lerp(12, 37, k);
        panel(ctx, 60, 310, 280, 505);
        thermometer(ctx, 200, 700, 330, (T - 5) / 40, k >= 1 ? RED : AQUA);
        text(ctx, `${Math.round(T)} °C`, 200, 362, { size: 58, family: F.mono, weight: 700, color: k >= 1 ? RED : C.white });
        panel(ctx, 370, 310, 570, 505);
        pop(ctx, t, f('s06', 0.08), 655, 380, () => text(ctx, 'de 12 à 37 °C', 0, 0, { size: 58, weight: 900, color: C.white }));
        pop(ctx, t, f('s06', 0.38), 655, 470, () => text(ctx, '1,16 Wh × 25 °C', 0, 0, { size: 58, family: F.mono, weight: 700, color: AQUA2, maxWidth: 530 }));
        pop(ctx, t, f('s06', 0.6), 655, 590, () => text(ctx, '= 29 Wh/l', 0, 0, { size: 92, family: F.mono, weight: 700, color: GOLD }));
        pop(ctx, t, f('s06', 0.7), 655, 690, () => text(ctx, '12 et 37 °C : SuisseEnergie', 0, 0, { size: 38, weight: 800, color: GOLD, maxWidth: 530 }));
        pop(ctx, t, f('s06', 0.85), 655, 775, () => exChip(ctx, 'bain à 37 °C : exemple', 0, { x: 1 }));
      });

      // 7. Une fois : 0,69 fr. contre 2,30 fr.
      block(ctx, t, S('s07'), S('s08'), () => {
        const card = (x, title, l1, l2, l3, tot, col, u0) => {
          pop(ctx, t, f('s07', u0), x, 570, () => {
            panel(ctx, -212, -260, 424, 510, { border: col });
            text(ctx, title, 0, -210, { size: 50, weight: 900, color: col, maxWidth: 390 });
            text(ctx, l1, 0, -130, { size: 42, weight: 800, color: C.white, maxWidth: 390 });
            text(ctx, l2, 0, -65, { size: 42, weight: 800, color: C.white, maxWidth: 390 });
            text(ctx, l3, 0, 0, { size: 42, weight: 800, color: AQUA2, maxWidth: 390 });
            text(ctx, '27,7 ct/kWh hors TVA', 0, 62, { size: 36, weight: 800, color: 'rgba(255,255,255,0.85)', maxWidth: 390 });
          });
          pop(ctx, t, f('s07', u0 + 0.3), x, 750, () => text(ctx, tot, 0, 0, { size: 84, family: F.mono, weight: 700, color: col, maxWidth: 380 }));
        };
        card(278, 'DOUCHE · 60 L', '1,74 kWh × 27,7 ct', '= 0,48 fr.', 'eau : + 0,21 fr.', '0,69 fr.', AQUA2, 0.05);
        card(728, 'BAIN · 200 L', '5,80 kWh × 27,7 ct', '= 1,61 fr.', 'eau : + 0,69 fr.', '2,30 fr.', GOLD, 0.45);
      });

      // 8. Sur un an
      block(ctx, t, S('s08'), S('s09'), () => {
        panel(ctx, 80, 310, 860, 510);
        const k = ease.inOut(prog(t, f('s08', 0.25), (E('s08') - S('s08')) * 0.6));
        pop(ctx, t, f('s08', 0.05), 510, 362, () => text(ctx, '1 fois par jour × 365', 0, 0, { size: 56, weight: 900, color: C.white, maxWidth: 800 }));
        [[290, 250, AQUA, 'DOUCHE'], [750, 840, RED, 'BAIN']].forEach(([x, v, col, lb]) => {
          const h = (v / 840) * 290 * k;
          roundRect(ctx, x - 90, 770 - Math.max(h, 8), 180, Math.max(h, 8), 14); ctx.fillStyle = col; ctx.fill();
          text(ctx, lb, x, 795, { size: 38, weight: 900, color: C.white });
          text(ctx, `≈ ${Math.round(v * k)} fr.`, x, 770 - Math.max(h, 8) - 40, { size: 62, family: F.mono, weight: 700, color: col === RED ? '#ff9a9d' : AQUA2 });
        });
        emo(ctx, 'money_with_wings', 520, 690, 130, t, f('s08', 0.8));
      });

      // 9. L'écart
      block(ctx, t, S('s09'), S('s10'), () => {
        panel(ctx, 90, 310, 850, 500, { border: RED });
        pop(ctx, t, f('s09', 0.02), 515, 375, () => text(ctx, '840 − 250', 0, 0, { size: 66, family: F.mono, weight: 700, color: C.white }));
        stamp(ctx, '≈ 590 FR.', 520, 505, t, f('s09', 0.12), { size: 124 });
        pop(ctx, t, f('s09', 0.38), 520, 630, () => text(ctx, "d'écart par an", 0, 0, { size: 60, weight: 900, color: C.white }));
        pop(ctx, t, f('s09', 0.6), 520, 725, () => text(ctx, 'sans pertes du chauffe-eau ni taxes fixes', 0, 0, { size: 40, weight: 800, color: 'rgba(255,255,255,0.85)', maxWidth: 800 }));
      });

      // 10. Rattrapage : moins de 17 minutes
      block(ctx, t, S('s10'), S('s11'), () => {
        const k = ease.inOut(prog(t, f('s10', 0.05), (E('s10') - S('s10')) * 0.65)), L = 200 * k;
        tank(ctx, 190, 800, 170, 470, L, 200, t, { color: AQUA, line: 200, label: 'DOUCHE' });
        text(ctx, 'BAIN', 190, 385, { size: 40, weight: 900, color: '#ff9a9d', stroke: 'rgba(6,12,20,0.95)', strokeWidth: 10 });
        panel(ctx, 320, 310, 620, 500);
        text(ctx, `${fr(16.6667 * k, 1)} min`, 630, 410, { size: 104, family: F.mono, weight: 700, color: GOLD, maxWidth: 580 });
        pop(ctx, t, f('s10', 0.3), 630, 520, () => text(ctx, '200 l ÷ 12 l/min', 0, 0, { size: 56, weight: 900, color: C.white, maxWidth: 560 }));
        stamp(ctx, '< 17 MIN', 630, 640, t, f('s10', 0.72), { size: 92 });
        pop(ctx, t, f('s10', 0.8), 630, 755, () => exChip(ctx, 'exemple', 0, { x: 1 }));
      });

      // 11. Pomme ordinaire
      block(ctx, t, S('s11'), S('s12'), () => {
        showerHead(ctx, 215, 360, 1.15, t * 1.8, 60);
        tank(ctx, 190, 815, 170, 400, 215, 240, t, { color: RED, line: 200 });
        text(ctx, 'BAIN', 190, 535, { size: 42, weight: 900, color: C.white, stroke: 'rgba(6,12,20,0.95)', strokeWidth: 10 });
        panel(ctx, 340, 310, 600, 500, { border: RED });
        pop(ctx, t, f('s11', 0.05), 640, 378, () => text(ctx, 'POMME ORDINAIRE', 0, 0, { size: 56, weight: 900, color: C.white, maxWidth: 560 }));
        pop(ctx, t, f('s11', 0.38) - 1.5, 640, 500, () => text(ctx, '10 MIN', 0, 0, { size: 132, family: F.mono, weight: 700, color: GOLD }));
        pop(ctx, t, f('s11', 0.62), 640, 620, () => text(ctx, 'peuvent dépasser un bain', 0, 0, { size: 46, weight: 900, color: '#ff9a9d', maxWidth: 560 }));
        pop(ctx, t, f('s11', 0.75), 640, 695, () => chip(ctx, 'services cantonaux', 0, 0, { size: 36, color: GOLD, letter: 0, bg: 'rgba(6,20,32,0.92)' }));
        pop(ctx, t, f('s11', 0.85), 640, 765, () => exChip(ctx, 'schéma', 0, { x: 1 }));
      });

      // 12. Mesurer son débit
      block(ctx, t, S('s12'), S('s13'), () => {
        const k = prog(t, f('s12', 0.1), (E('s12') - S('s12')) * 0.8);
        panel(ctx, 70, 310, 870, 510);
        text(ctx, 'MESURE TON DÉBIT', 505, 372, { size: 76, weight: 900, color: C.white, maxWidth: 800 });
        showerHead(ctx, 240, 470, 0.75, t, k < 1 ? 26 : 0);
        // récipient gradué
        ctx.save(); ctx.translate(240, 760);
        roundRect(ctx, -90, -165, 180, 195, 12); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill();
        ctx.save(); roundRect(ctx, -84, -159, 168, 183, 8); ctx.clip(); ctx.fillStyle = AQUA; ctx.fillRect(-84, 24 - 170 * k, 168, 170 * k); ctx.restore();
        roundRect(ctx, -90, -165, 180, 195, 12); ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke();
        for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(40, 30 - i * 38); ctx.lineTo(90, 30 - i * 38); ctx.lineWidth = 4; ctx.stroke(); }
        ctx.restore();
        pop(ctx, t, f('s12', 0.5), 660, 500, () => { emo(ctx, 'stopwatch', 0, 0, 170, t); ctx.save(); ctx.rotate(t * 6); ctx.fillStyle = RED; ctx.fillRect(-3, -55, 6, 55); ctx.restore(); });
        pop(ctx, t, f('s12', 0.7), 660, 655, () => text(ctx, 'litres ÷ secondes × 60', 0, 0, { size: 44, family: F.mono, weight: 700, color: GOLD, maxWidth: 480 }));
        pop(ctx, t, f('s12', 0.85), 660, 750, () => chip(ctx, 'services cantonaux', 0, 0, { size: 36, color: GOLD, letter: 0, bg: 'rgba(6,20,32,0.92)' }));
      });

      // 13. Classe A
      block(ctx, t, S('s13'), S('s14'), () => {
        panel(ctx, 60, 310, 880, 510, { border: GREEN });
        const COL = ['#2fb35f', '#7cc242', '#c5d436', '#f4d21f', '#f7a823', '#ef6a2a', '#e0332f'];
        ['A','B','C','D','E','F','G'].forEach((c, i) => {
          const k = ease.out(prog(t, f('s13', 0.02) + i * 0.08, 0.25)), y = 335 + i * 56, w = (110 + i * 34) * k;
          if (k <= 0.01) return;
          const on = i === 0; ctx.save(); ctx.globalAlpha *= on ? 1 : 0.55;
          ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.moveTo(90, y); ctx.lineTo(90 + w, y); ctx.lineTo(90 + w + 22, y + 24); ctx.lineTo(90 + w, y + 48); ctx.lineTo(90, y + 48); ctx.closePath(); ctx.fill();
          text(ctx, c, 124, y + 25, { size: 38, weight: 900, color: '#fff' }); ctx.restore();
        });
        pop(ctx, t, f('s13', 0.05), 665, 375, () => text(ctx, 'CLASSE A', 0, 0, { size: 76, weight: 900, color: GREEN }));
        pop(ctx, t, f('s13', 0.25), 665, 460, () => text(ctx, '4 à 6 l/min', 0, 0, { size: 58, family: F.mono, weight: 700, color: C.white }));
        pop(ctx, t, f('s13', 0.4), 665, 535, () => srcChip(ctx, 'TCS · à 3 bars', 0, 0));
        pop(ctx, t, f('s13', 0.55), 665, 615, () => text(ctx, '60 l → 30 l', 0, 0, { size: 54, family: F.mono, weight: 700, color: AQUA2 }));
        stamp(ctx, '≈ 125 FR./AN', 665, 695, t, f('s13', 0.72), { size: 62, color: GREEN });
        pop(ctx, t, f('s13', 0.85), 520, 775, () => exChip(ctx, 'exemple : 6 au lieu de 12 l/min', 0, { x: 1 }));
      });

      // 14. Question pour les commentaires
      block(ctx, t, S('s14'), S('s15'), () => {
        pop(ctx, t, S('s14') + 0.05, 520, 515, () => {
          panel(ctx, -430, -200, 860, 400, { bg: '#ffffff', border: AQUA, lw: 8 });
          text(ctx, 'TA DOUCHE DURE', 0, -125, { size: 72, weight: 900, color: '#10222e', maxWidth: 800 });
          const blink = Math.floor(t * 3) % 2 === 0;
          text(ctx, blink ? '__ MIN ?' : '?? MIN ?', 0, 5, { size: 118, family: F.mono, weight: 700, color: '#0f7f8f' });
          text(ctx, 'montre en main', 0, 125, { size: 50, weight: 800, color: '#384955' });
        });
        pop(ctx, t, f('s14', 0.25), 890, 690, () => text(ctx, '💬', 0, 0, { size: 96, family: F.emoji, weight: 400 }));
        pop(ctx, t, f('s14', 0.5), 520, 785, () => chip(ctx, 'ÉCRIS-LE EN COMMENTAIRE', 0, 0, { size: 40, color: C.white, letter: 0, bg: 'rgba(6,20,32,0.95)' }));
      });

      // 15. Retour au duel
      block(ctx, t, S('s15'), S('s16'), () => {
        ctx.save(); ctx.translate(500, 408);
        roundRect(ctx, -440, -100, 880, 200, 34); ctx.fillStyle = PANEL; ctx.fill();
        text(ctx, 'TU SAIS', -70, -46, { size: 100, weight: 900, color: C.white });
        text(ctx, 'QUI PAIE.', -70, 48, { size: 100, weight: 900, color: GOLD });
        ctx.restore();
        duel(ctx, t, { values: ['≈ 250 fr.', '≈ 840 fr.'] });
        pop(ctx, t, f('s15', 0.55), 800, 455, () => exChip(ctx, 'exemple', 0, { x: 1 }));
      });

      // la baignoire : présente tout le temps
      if (!inEnd) {
        tub(ctx, TX, TY, 400, t, { mood, look, rot: TR, squash: TS });
      }
      if (t >= S('s03') && t < S('s10')) {
        const ka = clamp((t - S('s03')) * 5) * clamp((S('s10') - t) * 5);
        ctx.save(); ctx.globalAlpha *= ka;
        roundRect(ctx, 66, 824, 868, 62, 31); ctx.fillStyle = 'rgba(6,20,32,0.94)'; ctx.fill();
        text(ctx, 'EXEMPLE · chauffe-eau électrique supposé', 500, 856, { size: 40, weight: 800, color: 'rgba(255,255,255,0.8)', maxWidth: 830 });
        ctx.restore();
      }
      ctx.restore(); // caméra

      if (inEnd) {
        ctx.fillStyle = `rgba(3,4,8,${Math.min(0.82, (t - S('s16') + 0.05) * 3)})`; ctx.fillRect(0, 0, 1080, 1920);
        tub(ctx, 530 + 22 * Math.sin(t * 2), 1290, 215, t, { mood: 'content', look: [0, -0.8], rot: 0.03 * Math.sin(t * 3), squash: TS });
        followCTA(ctx, t, S('s16'), { when: 'CE SOIR', next: ['mode sombre ou clair :', 'qui a encore de la batterie ?'] });
      }
      brand(ctx, t);
      captions(ctx, t, { y: 1385, size: 64, maxWidth: 800, x: 515, fromZero: true });
    }
  };
})();
