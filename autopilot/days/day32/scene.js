// Vidéo 32 — format A « Les objets balancent » : la machine à laver parle. Lave-linge à 30 °C ou 60 °C.
// Tous les chiffres : days/day32/facts.md. 22 ct = 0,788 kWh × 27,7 ct (21,83) ; 7 ct = 0,265 kWh × 27,7 ct (7,34) ;
// 22,60 fr. = 156 × 0,523 kWh × 0,277 fr. ; + 50 min = 3:19 − 2:29 ; − 38 % = (1,45 − 0,90) / 1,45.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, text, roundRect, chip, captions, brand, block, followCTA } = ENG;
  const { load, emo, camera, bubble } = CHR;
  const END = E('s16') + 0.6;
  const HOT = '#ff6b3d', COOL = '#4fd1e8', ECO = '#5fe0a0', GOLD = '#ffd166', RED = '#ff4d5e';
  const NOTE = 'rgba(255,255,255,0.8)';
  const INK = 'rgba(8,12,22,0.93)';
  const FS = ' ';
  const at = (id, f) => S(id) + (E(id) - S(id)) * f;

  // ---------- personnage : l'image reçoit tambour qui tourne, regard et sourcils, puis CHR.art l'anime ----------
  const M = { mouth: [0.519, 0.224, 0.15], eyes: [[0.396, 0.163, 0.1, 0.053], [0.68, 0.161, 0.1, 0.054]], skin: '#ebe7e5', lid: '#e6e2df' };
  const SEGS = ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10', 's11', 's12', 's13', 's14', 's15', 's16'];
  const MOOD = { s01: 'fache', s02: 'malin', s03: 'malin', s04: 'malin', s05: 'neutre', s06: 'neutre', s07: 'surpris', s08: 'fache', s09: 'neutre', s10: 'surpris', s11: 'surpris', s12: 'malin', s13: 'neutre', s14: 'malin', s15: 'neutre', s16: 'malin' };
  const LOOK = { s01: [-1, 0.2], s02: [1, 0.2], s03: [0, -1], s04: [0.2, -1], s05: [-1, -0.7], s06: [1, -0.8], s07: [0, -1], s08: [-1, -0.6], s09: [-0.4, -1], s10: [1, -0.6], s11: [-1, -0.6], s12: [0, -1], s13: [-0.6, -1], s14: [-1, -0.5], s15: [0, 0.2], s16: [0, -0.5] };
  function segAt(t) { let c = 's01'; SEGS.forEach(i => { if (t >= S(i) - 0.05) c = i; }); return c; }
  function lookAt(t) {
    const id = segAt(t), i = SEGS.indexOf(id), a = LOOK[SEGS[Math.max(0, i - 1)]], b = LOOK[id];
    const k = i === 0 ? 1 : ease.inOut(prog(t, S(id) - 0.05, 0.22));
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  }
  let live = null, lg = null;
  function eye(g, cx, cy, lx, ly) {
    g.save(); g.beginPath(); g.ellipse(cx, cy, 45, 27, 0, 0, Math.PI * 2); g.clip();
    const sc = g.createLinearGradient(0, cy - 27, 0, cy + 27); sc.addColorStop(0, '#d9d4d1'); sc.addColorStop(0.35, '#f4f1ef'); sc.addColorStop(1, '#e4dfdc');
    g.fillStyle = sc; g.fillRect(cx - 50, cy - 30, 100, 60);
    const ix = cx + lx * 21, iy = cy - 1 + ly * 5;
    const ir = g.createRadialGradient(ix, iy, 6, ix, iy, 24); ir.addColorStop(0, '#0d6f86'); ir.addColorStop(0.72, '#3fb2c6'); ir.addColorStop(1, '#0f5163');
    g.fillStyle = ir; g.beginPath(); g.arc(ix, iy, 24, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#050505'; g.beginPath(); g.arc(ix, iy, 15, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.arc(ix + 8, iy - 9, 4.5, 0, Math.PI * 2); g.fill();
    g.restore();
    g.strokeStyle = '#2d2724'; g.lineWidth = 6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 45, cy - 14); g.quadraticCurveTo(cx, cy - 36, cx + 46, cy - 12); g.stroke();
  }
  function brow(g, x0, y0, xc, yc, x1, y1) {
    g.strokeStyle = '#4b433e'; g.lineWidth = 13; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(xc, yc, x1, y1); g.stroke();
  }
  function paintMachine(t) {
    const im = CHR.ART.perso_machine; if (!im) return false;
    if (!live) { live = document.createElement('canvas'); live.width = im.width; live.height = im.height; lg = live.getContext('2d'); CHR.ART.m32live = live; }
    const g = lg; g.clearRect(0, 0, live.width, live.height); g.drawImage(im, 0, 0);
    // tambour : plus vite quand la machine consomme
    const spin = t * 1.1 + 2.2 * ease.inOut(prog(t, S('s08'), 3)) + 3 * ease.inOut(prog(t, S('s10'), 3));
    g.save(); g.beginPath(); g.arc(237, 415, 106, 0, Math.PI * 2); g.clip(); g.translate(237, 415); g.rotate(spin); g.drawImage(im, -237, -415); g.restore();
    const [lx, ly] = lookAt(t);
    eye(g, 187, 140, lx, ly); eye(g, 321, 140, lx, ly);
    const mood = MOOD[segAt(t)];
    if (mood !== 'neutre') {
      g.save(); g.filter = 'blur(4px)'; g.fillStyle = '#e8e4e2';
      g.beginPath(); g.ellipse(187, 68, 52, 17, 0, 0, Math.PI * 2); g.ellipse(316, 60, 50, 18, 0, 0, Math.PI * 2); g.fill(); g.restore();
      if (mood === 'fache') { brow(g, 145, 54, 190, 62, 230, 80); brow(g, 360, 54, 318, 60, 278, 78); }
      if (mood === 'malin') { brow(g, 146, 72, 190, 72, 228, 72); brow(g, 280, 54, 320, 34, 358, 58); }
      if (mood === 'surpris') { brow(g, 148, 58, 188, 38, 228, 54); brow(g, 280, 50, 320, 32, 358, 52); }
    }
    return true;
  }
  // position : x, hauteur et base par phrase ; saut à chaque changement de place
  const PLACE = { s01: [515, 560, 1275], s02: [515, 560, 1275], s03: [515, 560, 1275], s04: [515, 700, 1440], s05: [770, 480, 1275], s06: [250, 480, 1275], s07: [515, 380, 1275], s08: [770, 480, 1280], s09: [515, 385, 1280], s10: [250, 450, 1275], s11: [770, 480, 1275], s12: [515, 420, 1275], s13: [515, 720, 1460], s14: [770, 500, 1275], s15: [515, 560, 1275], s16: [515, 240, 1285] };
  const SHAKES = [[at('s01', 0.35), 0.5, 7], [at('s08', 0.55), 1.1, 12], [at('s10', 0.45), 1.0, 12], [at('s12', 0.2), 0.5, 7]];
  function machineState(t) {
    const id = segAt(t), i = SEGS.indexOf(id), a = PLACE[SEGS[Math.max(0, i - 1)]], b = PLACE[id];
    const t0 = S(id) - 0.05, k = i === 0 ? 1 : ease.inOut(prog(t, t0, 0.38));
    const moved = a[0] !== b[0] || a[1] !== b[1];
    const hopH = moved ? 90 : 34, d = t - t0;
    const hop = (i > 0 && d >= 0 && d < 0.38) ? Math.sin(Math.PI * d / 0.38) * hopH : 0;
    let x = lerp(a[0], b[0], k), rot = Math.sin(t * 1.3) * 0.012 + (b[0] - a[0]) * 0.0002 * Math.sin(Math.PI * clamp(d / 0.38));
    SHAKES.forEach(([s, du, am]) => { const e = t - s; if (e >= 0 && e < du) { x += Math.sin(e * 62) * am * (1 - e / du); rot += Math.sin(e * 47) * 0.012 * (1 - e / du); } });
    const sq = (i > 0 && d >= 0.38 && d < 0.75) ? 0.05 * Math.sin((d - 0.38) * 17) * Math.exp(-(d - 0.38) * 5) : 0;
    return { x, h: lerp(a[1], b[1], k), base: lerp(a[2], b[2], k) - hop, rot, sq };
  }
  function drawMachine(ctx, t, st) {
    if (!paintMachine(t)) return;
    CHR.art(ctx, 'm32live', st.x, st.base, st.h, t, { ...M, squash: st.sq, rot: st.rot });
  }

  // ---------- briques propres au sujet ----------
  function card(ctx, x, y, w, h, o = {}) {
    roundRect(ctx, x - w / 2, y - h / 2, w, h, o.r || 30); ctx.fillStyle = o.bg || INK; ctx.fill();
    ctx.lineWidth = o.lw || 4; ctx.strokeStyle = o.border || 'rgba(255,255,255,0.22)'; ctx.stroke();
  }
  function pop(ctx, t, t0, x, y, fn, dur = 0.34) {
    const k = ease.back(prog(t, t0, dur)); if (k <= 0.001) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); fn(); ctx.restore();
  }
  function stamp(ctx, label, x, y, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.3)); if (k <= 0.001) return;
    const size = o.size || 72, col = o.color || RED;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.05); const z = lerp(1.5, 1, k); ctx.scale(z, z); ctx.globalAlpha *= clamp(k * 2.5);
    ctx.font = `900 ${size}px InterDisplay`; const w = ctx.measureText(label).width + 60, h = size + 36;
    roundRect(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = 'rgba(8,12,22,0.93)'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = col; ctx.stroke();
    text(ctx, label, 0, 2, { size, weight: 900, color: col });
    ctx.restore();
  }
  function thermo(ctx, x, y, h, frac, col) {
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -24, -h, 48, h + 12, 24); ctx.fillStyle = '#10151f'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#e9edf5'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 26, 40, 0, Math.PI * 2); ctx.fillStyle = '#10151f'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 26, 29, 0, Math.PI * 2); ctx.fill();
    const fh = (h - 20) * clamp(frac); roundRect(ctx, -12, 8 - fh, 24, fh + 14, 12); ctx.fill();
    ctx.restore();
  }
  function shirt(ctx, x, y, s, t, t0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-70, -120); ctx.lineTo(-170, -70); ctx.lineTo(-125, 0); ctx.lineTo(-88, -24); ctx.lineTo(-88, 140); ctx.lineTo(88, 140); ctx.lineTo(88, -24); ctx.lineTo(125, 0); ctx.lineTo(170, -70); ctx.lineTo(70, -120); ctx.quadraticCurveTo(0, -70, -70, -120); ctx.closePath();
    ctx.fillStyle = '#f5f2ee'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#b9c1cf'; ctx.stroke();
    [[-50, -30], [30, -50], [55, 30], [-30, 55], [10, 100], [-60, 110], [60, 105]].forEach(([gx, gy], i) => {
      const k = ease.back(prog(t, t0 + i * 0.16, 0.25)); if (k <= 0) return;
      const r = 15 * k, wob = Math.sin(t * 5 + i) * 2;
      ctx.fillStyle = i % 2 ? '#3fbf7f' : '#8bd450'; ctx.beginPath(); ctx.arc(gx + wob, gy, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1e7a4c'; ctx.lineWidth = 3; ctx.stroke();
      for (let a = 0; a < 6; a++) { const an = a * 1.05 + t * 1.2; ctx.beginPath(); ctx.moveTo(gx + wob + Math.cos(an) * r, gy + Math.sin(an) * r); ctx.lineTo(gx + wob + Math.cos(an) * (r + 7), gy + Math.sin(an) * (r + 7)); ctx.stroke(); }
    });
    ctx.restore();
  }
  function shield(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(66, -56); ctx.lineTo(66, 8); ctx.quadraticCurveTo(62, 58, 0, 88); ctx.quadraticCurveTo(-62, 58, -66, 8); ctx.lineTo(-66, -56); ctx.closePath();
    ctx.fillStyle = COOL; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#ffffff'; ctx.stroke();
    ctx.strokeStyle = '#10151f'; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(6, -78); ctx.lineTo(-16, -26); ctx.lineTo(14, -2); ctx.lineTo(-10, 38); ctx.stroke();
    ctx.restore();
  }
  function stainRow(ctx, x, y, label, col, fade) {
    text(ctx, label, x - 300, y, { size: 58, family: F.mono, weight: 700, color: col });
    roundRect(ctx, x - 190, y - 62, 560, 124, 22); ctx.fillStyle = '#f5f2ee'; ctx.fill();
    [['#c0392b', -90, 48], ['#6f4518', 90, 42], ['#6d1b4a', 270, 46]].forEach(([c, dx, r], i) => {
      ctx.save(); ctx.globalAlpha *= lerp(1, 0.14, fade); ctx.fillStyle = c; ctx.translate(x + dx, y);
      ctx.beginPath(); for (let a = 0; a <= 12; a++) { const an = a / 12 * Math.PI * 2, rr = r * (0.82 + 0.2 * Math.sin(an * 3 + i * 2)); a ? ctx.lineTo(Math.cos(an) * rr * 1.25, Math.sin(an) * rr) : ctx.moveTo(Math.cos(an) * rr * 1.25, Math.sin(an) * rr); } ctx.closePath(); ctx.fill(); ctx.restore();
    });
  }
  function bar(ctx, x, y, w, h, frac, col) {
    roundRect(ctx, x, y, w, h, h / 2); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill();
    const fw = Math.max(h, w * clamp(frac)); roundRect(ctx, x, y, fw, h, h / 2); ctx.fillStyle = col; ctx.fill();
  }
  function coin(ctx, x, y, r) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#d9b34a'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = r * 0.1; ctx.strokeStyle = '#8a6b1d'; ctx.stroke();
    text(ctx, 'fr.', 0, 2, { size: r * 0.9, weight: 900, color: '#5a4310' });
    ctx.restore();
  }
  function mmss(sec) { const m = Math.floor(sec / 60), s = Math.floor(sec % 60); return `${m}:${String(s).padStart(2, '0')}`; }
  function dec(n, d) { return n.toFixed(d).replace('.', ','); }

  // le duel : image 0 et retour avant le CTA
  function duel(ctx, t, o = {}) {
    [[180, 'TOI', '60°', HOT, 'woman_technologist', 0.92, 0.3], [810, 'COLLÈGUE', '30°', COOL, 'man_technologist', 0.42, 1.4]].forEach(([x, who, deg, col, em, frac, ph]) => {
      card(ctx, x, 900, 260, 740, { border: col, lw: 5 });
      chip(ctx, who, x, 575, { color: C.white, size: 36, border: col, letter: 1, padX: 18 });
      text(ctx, deg, x, 680, { size: 124, weight: 900, color: col, maxWidth: 240 });
      emo(ctx, em, x, 840, 150, t, undefined, { phase: ph });
      const wob = o.hot === x ? Math.sin(t * 16) * 0.03 : 0;
      thermo(ctx, x, 1190, 210, frac + wob, col);
      if (o.labels && o.labels[x]) o.labels[x]();
    });
  }

  const PUNCH = [[0.8, 0.05], [S('s02'), 0.05], [at('s03', 0.42), 0.05], [at('s03', 0.8), 0.06], [at('s04', 0.75), 0.08], [at('s05', 0.42), 0.07], [at('s06', 0.5), 0.04], [at('s07', 0.82), 0.07], [at('s08', 0.55), 0.09], [at('s09', 0.66), 0.06], [at('s10', 0.5), 0.09], [at('s11', 0.72), 0.07], [at('s12', 0.25), 0.09], [at('s13', 0.5), 0.05], [S('s15'), 0.05]];

  window.SCENE = {
    duration: END,
    load: () => Promise.all([CHR.loadArt(['decor_salle_de_bain', 'perso_machine']), load(['man_technologist', 'woman_technologist', 'red_question_mark', 'money_bag', 'stopwatch', 'hourglass_done', 'thermometer', 'bed', 'thinking_face', 'thumbs_up', 'money_with_wings', 'check_mark_button'])]),
    draw(ctx, t) {
      const inEnd = t >= S('s16') - 0.05;
      camera(ctx, t, PUNCH, { cy: 1000, cx: 515 });
      CHR.backdrop(ctx, t, 'decor_salle_de_bain', { blur: 1.6, z0: 1.03, z1: 1.1, focus: [0.5, 0.7], dur: END, dim: 0.28 });
      const st = machineState(t);

      // 1. DUEL (image 0 complète) : 60 °C contre 30 °C, deux questions
      block(ctx, t, 0, S('s04'), () => {
        card(ctx, 515, 415, 930, 210, { border: GOLD });
        const kP = 1 + 0.12 * Math.exp(-Math.max(0, t - at('s03', 0.42)) * 4) * (t > at('s03', 0.42) ? 1 : 0);
        const kQ = 1 + 0.12 * Math.exp(-Math.max(0, t - at('s03', 0.8)) * 4) * (t > at('s03', 0.8) ? 1 : 0);
        ctx.save(); ctx.translate(515, 365); ctx.scale(kP, kP); text(ctx, 'LE LINGE LE PLUS PROPRE ?', 0, 0, { size: 62, weight: 900, color: C.white, maxWidth: 880 }); ctx.restore();
        ctx.save(); ctx.translate(515, 465); ctx.scale(kQ, kQ); text(ctx, 'QUI PAIE LE PLUS ?', 0, 0, { size: 76, weight: 900, color: GOLD, maxWidth: 880 }); ctx.restore();
        duel(ctx, t, { hot: t < S('s02') ? 180 : t < S('s03') ? 810 : 0 });
        emo(ctx, 'red_question_mark', 515, 610, 150, t, undefined, { phase: 0.7 });
        if (t >= S('s01') + 0.5 && t < S('s02')) stamp(ctx, 'VEXÉE', 515, 705, t, S('s01') + 0.5, { size: 44, color: HOT, rot: -0.08 });
      });

      // 2. La réponse, en francs
      block(ctx, t, S('s04'), S('s05'), () => {
        stamp(ctx, 'LA RÉPONSE', 515, 400, t, S('s04') + 0.1, { size: 96, color: C.white, rot: -0.03 });
        stamp(ctx, 'EN FRANCS', 515, 590, t, at('s04', 0.72), { size: 112, color: GOLD, rot: 0.03 });
        [[130, 0.58], [900, 0.64], [230, 0.7], [800, 0.76]].forEach(([x, f], i) => {
          const d = t - at('s04', f); if (d < 0) return;
          const yy = Math.min(720 + i * 22, 300 + d * d * 1500);
          coin(ctx, x, yy, 56);
        });
      });

      // 3. Même à 60 °C : on ne stérilise pas (Karl Perron)
      block(ctx, t, S('s05'), S('s06'), () => {
        card(ctx, 515, 410, 930, 190, { border: HOT });
        text(ctx, `MÊME À 60${FS}°C`, 515, 410, { size: 116, weight: 900, color: HOT, maxWidth: 880 });
        shirt(ctx, 310, 850, 1.3, t, S('s05') + 0.3);
        stamp(ctx, 'PAS STÉRILE', 340, 1130, t, at('s05', 0.42), { size: 72 });
        pop(ctx, t, at('s05', 0.6), 515, 570, () => chip(ctx, 'KARL PERRON · UNIGE', 0, 0, { color: C.white, size: 44, dot: GOLD, letter: 1 }));
      });

      // 4. RTS : quand 60 °C reste nécessaire
      block(ctx, t, S('s06'), S('s07'), () => {
        card(ctx, 515, 400, 930, 170, { border: HOT });
        text(ctx, `60${FS}°C RESTE NÉCESSAIRE`, 515, 400, { size: 72, weight: 900, color: C.white, maxWidth: 880 });
        pop(ctx, t, at('s06', 0.42), 690, 625, () => {
          card(ctx, 0, 0, 480, 240, { border: HOT });
          emo(ctx, 'thermometer', -150, 0, 150, t);
          text(ctx, 'APRÈS UNE', 80, -36, { size: 44, weight: 900, color: C.white });
          text(ctx, 'MALADIE', 80, 26, { size: 56, weight: 900, color: HOT });
        });
        pop(ctx, t, at('s06', 0.68), 690, 880, () => {
          card(ctx, 0, 0, 480, 240, { border: COOL });
          shield(ctx, -150, 0, 1);
          text(ctx, 'IMMUNITÉ', 80, -36, { size: 56, weight: 900, color: COOL });
          text(ctx, 'FRAGILE', 80, 26, { size: 56, weight: 900, color: COOL });
        });
        pop(ctx, t, at('s06', 0.15), 690, 1075, () => chip(ctx, 'SOURCE : RTS', 0, 0, { color: C.white, size: 40, dot: RED }));
      });

      // 5. Taches : test Les Numériques
      block(ctx, t, S('s07'), S('s08'), () => {
        card(ctx, 515, 540, 930, 470, { border: 'rgba(255,255,255,0.3)' });
        text(ctx, 'SUR LES TACHES', 515, 355, { size: 66, weight: 900, color: C.white });
        stainRow(ctx, 515, 460, `30${FS}°C`, COOL, 0.25);
        stainRow(ctx, 515, 600, `60${FS}°C`, HOT, ease.inOut(prog(t, at('s07', 0.35), 1.5)));
        chip(ctx, 'schéma', 170, 715, { size: 40, color: NOTE, letter: 1 });
        pop(ctx, t, at('s07', 0.12), 640, 715, () => chip(ctx, 'TEST : LES NUMÉRIQUES', 0, 0, { color: C.white, size: 36, dot: GOLD, letter: 1 }));
        stamp(ctx, `60${FS}°C GAGNE`, 515, 830, t, at('s07', 0.8), { size: 70, color: HOT, rot: -0.04 });
        emo(ctx, 'check_mark_button', 170, 1020, 170, t, at('s07', 0.86));
      });

      // 6. Bravo, mais 2,7 fois plus
      block(ctx, t, S('s08'), S('s09'), () => {
        stamp(ctx, 'BRAVO…', 300, 385, t, S('s08') + 0.05, { size: 92, color: GOLD, rot: -0.05 });
        emo(ctx, 'thumbs_up', 620, 385, 140, t, S('s08') + 0.25);
        const k = ease.inOut(prog(t, at('s08', 0.42), 1.0));
        const v = lerp(1, 2.7, k);
        card(ctx, 515, 610, 930, 250, { border: HOT });
        text(ctx, `${dec(v, 1)}${FS}×`, 515, 580, { size: 170, weight: 900, color: HOT });
        text(ctx, `l'électricité de 30${FS}°C`, 515, 690, { size: 48, weight: 800, color: C.white, alpha: clamp(prog(t, at('s08', 0.5), 0.3)) });
        // barres verticales au sol
        const yb = 1240, bh = 130;
        [[140, 1, COOL, `30${FS}°C`], [320, v, HOT, `60${FS}°C`]].forEach(([x, val, col, lb]) => {
          roundRect(ctx, x - 62, yb - bh * val, 124, bh * val, 16); ctx.fillStyle = col; ctx.fill();
          text(ctx, lb, x, yb - bh * val - 34, { size: 44, family: F.mono, weight: 700, color: C.white, stroke: 'rgba(8,12,22,0.95)', strokeWidth: 10 });
        });
        pop(ctx, t, at('s08', 0.2), 320, 785, () => chip(ctx, 'DANS CE TEST', 0, 0, { color: C.white, size: 36, dot: GOLD, letter: 1 }));
      });

      // 7. Le prix par machine (exemple Wien Energie, tarif médian ElCom 2026)
      block(ctx, t, S('s09'), S('s10'), () => {
        const kw = ease.inOut(prog(t, at('s09', 0.22), 1.6));
        [[285, `60${FS}°C`, 0.788, '22', HOT, at('s09', 0.66)], [745, `30${FS}°C`, 0.265, '7', COOL, at('s09', 0.88)]].forEach(([x, deg, kwh, ct, col, tc], i) => {
          pop(ctx, t, S('s09') + i * 0.12, x, 525, () => {
            card(ctx, 0, 0, 440, 420, { border: col, lw: 5 });
            text(ctx, deg, 0, -155, { size: 72, weight: 900, color: col });
            text(ctx, `${dec(kwh * kw, 3)}${FS}kWh`, 0, -70, { size: 54, family: F.mono, weight: 700, color: C.white });
            const kc = ease.back(prog(t, tc, 0.3));
            if (kc > 0.001) { ctx.save(); ctx.translate(0, 55); ctx.scale(kc, kc); text(ctx, `${ct}${FS}ct`, 0, 0, { size: 150, weight: 900, color: GOLD }); ctx.restore(); text(ctx, "d'électricité", 0, 165, { size: 40, weight: 800, color: C.white, alpha: clamp(kc) }); }
          });
        });
        pop(ctx, t, at('s09', 0.3), 515, 775, () => chip(ctx, `27,7${FS}ct/kWh · MÉDIANE ELCOM 2026`, 0, 0, { color: GOLD, size: 36, letter: 0 }));
        pop(ctx, t, at('s09', 0.05), 515, 850, () => chip(ctx, 'exemple : Wien Energie', 0, 0, { size: 40, color: NOTE, letter: 1 }));
      });

      // 8. Par an : 22,60 fr.
      block(ctx, t, S('s10'), S('s11'), () => {
        const k = ease.inOut(prog(t, at('s10', 0.35), 1.1));
        text(ctx, `3 × 52 = 156 machines`, 560, 365, { size: 68, weight: 900, color: C.white, stroke: 'rgba(8,12,22,0.95)', strokeWidth: 14, maxWidth: 860 });
        pop(ctx, t, at('s10', 0.25), 560, 450, () => chip(ctx, `156 × 0,523${FS}kWh × 0,277${FS}fr.`, 0, 0, { color: C.white, size: 36, letter: 0 }));
        card(ctx, 560, 615, 840, 240, { border: GOLD, lw: 6 });
        text(ctx, `${dec(22.6 * k, 2)}${FS}fr.`, 560, 585, { size: 150, weight: 900, color: GOLD });
        text(ctx, "d'écart par an", 560, 695, { size: 50, weight: 800, color: C.white, alpha: clamp(prog(t, at('s10', 0.72), 0.3)) });
        chip(ctx, 'exemple : 3 par semaine', 665, 775, { size: 40, color: NOTE, letter: 1 });
        for (let i = 0; i < 5; i++) { const kc = ease.out(prog(t, at('s10', 0.4) + i * 0.16, 0.25)); if (kc > 0) coin(ctx, 640 + (i % 2) * 8, lerp(830, 1230 - i * 34, kc), 62); }
        emo(ctx, 'money_with_wings', 830, 980, 170, t, at('s10', 0.75));
      });

      // 9. Surprise : le programme éco dure 50 min de plus
      block(ctx, t, S('s11'), S('s12'), () => {
        stamp(ctx, 'SURPRISE', 515, 375, t, S('s11') + 0.02, { size: 84, color: GOLD, rot: -0.04 });
        const k = ease.inOut(prog(t, at('s11', 0.3), 1.8));
        [[285, 'COTON 60', 149, HOT], [745, 'ECO 40-60', 199, ECO]].forEach(([x, lb, sec, col]) => {
          card(ctx, x, 570, 440, 220, { border: col, lw: 5 });
          text(ctx, lb, x, 510, { size: 52, weight: 900, color: col });
          text(ctx, mmss(sec * k), x, 610, { size: 96, family: F.mono, weight: 700, color: C.white });
        });
        text(ctx, 'h:min', 515, 712, { size: 38, family: F.mono, weight: 700, color: NOTE, stroke: 'rgba(8,12,22,0.95)', strokeWidth: 8 });
        stamp(ctx, `+ 50${FS}min`, 300, 825, t, at('s11', 0.72), { size: 100, color: ECO, rot: -0.05 });
        emo(ctx, 'stopwatch', 300, 1030, 190, t, at('s11', 0.2));
        pop(ctx, t, at('s11', 0.22), 300, 1210, () => chip(ctx, 'NOTICE MIELE', 0, 0, { color: C.white, size: 36, dot: GOLD, letter: 1 }));
      });

      // 10. − 38 % d'électricité
      block(ctx, t, S('s12'), S('s13'), () => {
        card(ctx, 515, 470, 930, 320, { border: 'rgba(255,255,255,0.3)' });
        const k = ease.inOut(prog(t, S('s12') + 0.1, 0.9));
        const y1 = 375, y2 = 505, x0 = 90, w = 780;
        text(ctx, `COTON 60 · 1,45${FS}kWh`, x0, y1 - 22, { size: 44, weight: 900, color: HOT, align: 'left' });
        bar(ctx, x0, y1 + 12, w, 54, 1, HOT);
        text(ctx, `ECO 40-60 · 0,90${FS}kWh`, x0, y2 - 22, { size: 44, weight: 900, color: ECO, align: 'left' });
        bar(ctx, x0, y2 + 12, w, 54, lerp(1, 0.9 / 1.45, k), ECO);
        stamp(ctx, `− 38${FS}%`, 515, 725, t, at('s12', 0.22), { size: 112, color: ECO, rot: -0.04 });
        pop(ctx, t, at('s12', 0.45), 200, 1060, () => chip(ctx, '9 kg · MIELE', 0, 0, { color: C.white, size: 36, dot: GOLD, letter: 1 }));
        emo(ctx, 'check_mark_button', 830, 1000, 170, t, at('s12', 0.6));
      });

      // 11. SuisseEnergie le conseille
      block(ctx, t, S('s13'), S('s14'), () => {
        card(ctx, 515, 470, 930, 330, { border: ECO });
        text(ctx, 'SUISSEENERGIE LE CONSEILLE', 515, 365, { size: 56, weight: 900, color: C.white, maxWidth: 880 });
        // sélecteur qui tourne jusqu'à ECO
        const a = lerp(-2.3, -0.7, ease.back(prog(t, S('s13') + 0.4, 0.8)));
        ctx.save(); ctx.translate(190, 535);
        ctx.fillStyle = '#e9edf5'; ctx.beginPath(); ctx.arc(0, 0, 76, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = ECO; ctx.stroke();
        ctx.rotate(a); ctx.fillStyle = '#10151f'; roundRect(ctx, -10, -66, 20, 66, 8); ctx.fill(); ctx.restore();
        text(ctx, 'ECO', 300, 470, { size: 48, weight: 900, color: ECO });
        pop(ctx, t, at('s13', 0.45), 620, 510, () => {
          text(ctx, "même s'il dure", 0, -34, { size: 62, weight: 900, color: C.white });
          text(ctx, 'plus longtemps', 0, 36, { size: 62, weight: 900, color: GOLD });
        });
        emo(ctx, 'hourglass_done', 170, 860, 210, t, at('s13', 0.55));
        emo(ctx, 'check_mark_button', 860, 730, 130, t, at('s13', 0.25));
      });

      // 12. Question pour les commentaires
      block(ctx, t, S('s14'), S('s15'), () => {
        card(ctx, 515, 410, 930, 200, { border: GOLD });
        const q = 20 + 40 * (0.5 + 0.5 * Math.sin((t - S('s14')) * 5));
        text(ctx, 'TES DRAPS :', 310, 410, { size: 76, weight: 900, color: C.white });
        text(ctx, `? ${FS}°C`, 730, 410, { size: 120, weight: 900, color: GOLD });
        emo(ctx, 'bed', 310, 690, 300, t, S('s14') + 0.2);
        thermo(ctx, 95, 850, 280, q / 70, q > 40 ? HOT : COOL);
        bubble(ctx, 170, 1120, ['Écris-le', 'en commentaire'], t, at('s14', 0.2), { side: 'gauche', size: 50 });
        emo(ctx, 'thinking_face', 560, 680, 150, t, at('s14', 0.6));
      });

      // 13. Retour au duel : ça dépend du linge
      block(ctx, t, S('s15'), S('s16'), () => {
        card(ctx, 515, 415, 930, 210, { border: GOLD });
        text(ctx, 'TOI OU TON COLLÈGUE ?', 515, 360, { size: 66, weight: 900, color: C.white, maxWidth: 880 });
        stamp(ctx, 'ÇA DÉPEND DU LINGE', 515, 465, t, at('s15', 0.55), { size: 66, color: GOLD, rot: -0.015 });
        duel(ctx, t, {});
        emo(ctx, 'red_question_mark', 515, 610, 150, t, undefined, { phase: 0.7 });
      });

      if (!inEnd) drawMachine(ctx, t, st);
      ctx.restore(); // caméra

      if (inEnd) {
        ctx.fillStyle = `rgba(3,4,8,${Math.min(0.84, (t - S('s16') + 0.05) * 8)})`; ctx.fillRect(0, 0, 1080, 1920);
        followCTA(ctx, t, S('s16'), { when: 'CE SOIR', next: ['même iPhone, Suisse ou France :', 'où est-il le moins cher ?'] });
        drawMachine(ctx, t, { x: 515, h: 220, base: 1290, rot: Math.sin(t * 2) * 0.02, sq: 0 });
      }
      brand(ctx, t);
      captions(ctx, t, { y: 1385, size: 64, maxWidth: 800, x: 515, fromZero: true });
    }
  };
})();
