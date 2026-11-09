// Jour 74 — « Linge au salon + déshumidificateur : combien ? » (partie 2 du jour 37)
// Recette du point 2 bis : duel dès l'image 0, réponse en francs au milieu, 2e surprise (l'eau dans l'air), conseils,
// question, retour au duel. Accent propre au sujet : bleu « eau », orange pour le sèche-linge.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, readout } = ENG;
  const END = E('s16') + 0.6;
  const AQ = '#38c8ef', AQ2 = '#9be6fa', HOT = '#ff8a3d', RED = C.red2, GREEN = '#35c98a', GREY = '#3a4660';
  const FR = (id, f) => S(id) + f * (E(id) - S(id));
  const cts = v => v.toFixed(2).replace('.', ',');
  // mention d'illustration et chip de source ou de condition (≥ 36 px, dans la zone sûre)
  const schema = (ctx, x, y, label = 'SCHÉMA') => chip(ctx, label, x, y, { color: 'rgba(255,255,255,0.8)', size: 40 });
  const src = (ctx, label, x, y, o = {}) => chip(ctx, label, x, y, { color: C.white, size: 36, letter: 0, padX: 20, ...o });

  // ---------- briques ----------
  function stamp(ctx, label, x, y, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.32));
    if (k <= 0.001) return;
    const size = o.size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.06); ctx.scale(lerp(1.5, 1, k), lerp(1.5, 1, k));
    ctx.globalAlpha *= clamp(k * 2.5);
    ctx.font = `900 ${size}px InterDisplay`; const w = ctx.measureText(label).width + 56, h = size + 34;
    roundRect(ctx, -w / 2, -h / 2, w, h, 16); ctx.lineWidth = 8; ctx.strokeStyle = o.color || RED; ctx.stroke();
    ctx.fillStyle = 'rgba(3,4,8,0.72)'; ctx.fill();
    text(ctx, label, 0, 2, { size, weight: 900, color: o.color || RED });
    ctx.restore();
  }
  function drop(ctx, x, y, r, color, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color || AQ;
    ctx.beginPath(); ctx.moveTo(x, y - r * 1.7);
    ctx.bezierCurveTo(x + r * 0.5, y - r * 0.8, x + r, y - r * 0.3, x + r, y + r * 0.2);
    ctx.arc(x, y + r * 0.2, r, 0, Math.PI);
    ctx.bezierCurveTo(x - r, y - r * 0.3, x - r * 0.5, y - r * 0.8, x, y - r * 1.7);
    ctx.fill(); ctx.restore();
  }
  // gouttes qui montent du linge vers l'air
  function vapor(ctx, x, y, w, h, t, n, o = {}) {
    for (let i = 0; i < n; i++) {
      const ph = (t * (o.speed || 0.42) + i * 0.618) % 1;
      const xx = x + ((i * 0.381) % 1 - 0.5) * w + Math.sin(t * 2 + i) * 10;
      drop(ctx, xx, y - ph * h, (o.r || 9) * (1 - ph * 0.3), AQ, Math.sin(ph * Math.PI) * (o.alpha ?? 0.95));
    }
  }
  function shirt(ctx, x, y, w, h, color, sway) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway);
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(-w * 0.2, 0); ctx.lineTo(-w * 0.5, h * 0.1); ctx.lineTo(-w * 0.62, h * 0.34); ctx.lineTo(-w * 0.36, h * 0.38);
    ctx.lineTo(-w * 0.34, h); ctx.lineTo(w * 0.34, h); ctx.lineTo(w * 0.36, h * 0.38); ctx.lineTo(w * 0.62, h * 0.34);
    ctx.lineTo(w * 0.5, h * 0.1); ctx.lineTo(w * 0.2, 0); ctx.quadraticCurveTo(0, h * 0.14, -w * 0.2, 0); ctx.fill();
    ctx.restore();
  }
  function towel(ctx, x, y, w, h, color, sway) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway);
    roundRect(ctx, -w / 2, 0, w, h, 8); ctx.fillStyle = color; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-w / 2, h * 0.76, w, h * 0.07);
    ctx.restore();
  }
  // étendoir ; (cx, y0) = barre du haut
  function rack(ctx, cx, y0, w, t, o = {}) {
    const hw = w / 2, h = w * 1.02;
    ctx.save(); ctx.strokeStyle = '#c9d4e6'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx - hw, y0); ctx.lineTo(cx + hw * 0.72, y0 + h); ctx.moveTo(cx + hw, y0); ctx.lineTo(cx - hw * 0.72, y0 + h); ctx.stroke();
    ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx - hw, y0); ctx.lineTo(cx + hw, y0); ctx.stroke();
    ctx.restore();
    const s = Math.sin(t * 1.6) * 0.03;
    towel(ctx, cx - w * 0.3, y0 + 4, w * 0.27, w * 0.52, '#7fb5e8', s);
    shirt(ctx, cx + w * 0.02, y0 + 4, w * 0.34, w * 0.55, '#f1f4fb', -s);
    towel(ctx, cx + w * 0.34, y0 + 4, w * 0.2, w * 0.42, '#f0a6b8', s * 0.7);
  }
  // sèche-linge générique, sans marque ; on = 0..1
  function dryer(ctx, cx, cy, w, t, on = 1) {
    const h = w * 1.14, x = cx - w / 2, y = cy - h / 2;
    ctx.save();
    if (on > 0.01) { ctx.shadowColor = `rgba(255,138,61,${0.55 * on})`; ctx.shadowBlur = 50; }
    roundRect(ctx, x, y, w, h, w * 0.06); ctx.fillStyle = '#e8ecf3'; ctx.fill(); ctx.restore();
    ctx.save();
    roundRect(ctx, x + w * 0.06, y + w * 0.05, w * 0.88, w * 0.13, 8); ctx.fillStyle = '#b8c2d3'; ctx.fill();
    roundRect(ctx, x + w * 0.52, y + w * 0.075, w * 0.3, w * 0.08, 4); ctx.fillStyle = on > 0.5 ? HOT : '#3a4660'; ctx.fill();
    ctx.fillStyle = '#5a667e'; ctx.beginPath(); ctx.arc(x + w * 0.2, y + w * 0.115, w * 0.05, 0, Math.PI * 2); ctx.fill();
    const dy = cy + h * 0.1, r = w * 0.34;
    ctx.beginPath(); ctx.arc(cx, dy, r + 10, 0, Math.PI * 2); ctx.fillStyle = '#8d98ad'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, dy, r, 0, Math.PI * 2); ctx.fillStyle = '#0d1524'; ctx.fill(); ctx.clip();
    const a = t * 5.2 * on;
    [['#7fb5e8', 0], ['#f1f4fb', 2.1], ['#f0a6b8', 4.2]].forEach(([c, p]) => {
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a + p) * r * 0.5, dy + Math.sin(a + p) * r * 0.5, r * 0.4, r * 0.27, a + p, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }
  function cloud(ctx, x, y, s, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = 'rgba(155,230,250,0.34)';
    [[-1, 0.1, 0.62], [-0.35, -0.3, 0.8], [0.4, -0.2, 0.72], [1, 0.14, 0.56], [0, 0.26, 0.8]].forEach(([a, b, r]) => {
      ctx.beginPath(); ctx.arc(x + a * s, y + b * s, r * s, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }
  // échelle d'étiquette énergie A → G ; cur = classe marquée, grey(i) = 0..1 pour griser une ligne, reveal = 0..1
  const LET = 'ABCDEFG', COL = ['#1fa35f', '#4bb34f', '#a6c43c', '#eed23c', '#f2a93a', '#ec6d32', '#d9262c'];
  function scale(ctx, x, y, t, o = {}) {
    const rh = o.rh || 62, gap = 8, bw = o.w || 250;
    for (let i = 0; i < 7; i++) {
      const k = o.t0 === undefined ? 1 : ease.out(prog(t, o.t0 + i * 0.06, 0.22));
      if (k <= 0.001) continue;
      const yy = y + i * (rh + gap), w = (bw + i * 34) * k, g = o.grey ? o.grey(i) : 0, sel = o.cur === LET[i];
      ctx.save(); ctx.globalAlpha *= (sel ? 1 : lerp(0.82, 0.16, g));
      ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w - rh * 0.4, yy); ctx.lineTo(x + w, yy + rh / 2); ctx.lineTo(x + w - rh * 0.4, yy + rh); ctx.lineTo(x, yy + rh); ctx.closePath();
      ctx.fillStyle = COL[i]; ctx.fill();
      if (sel) { ctx.lineWidth = 6; ctx.strokeStyle = '#ffffff'; ctx.stroke(); }
      text(ctx, LET[i], x + 30, yy + rh / 2 + 2, { size: rh * 0.68, weight: 900, color: '#fff', stroke: 'rgba(0,0,0,0.35)', strokeWidth: 5 });
      ctx.restore();
    }
  }
  function swissFlag(ctx, x, y, s) {
    roundRect(ctx, x - s / 2, y - s / 2, s, s, s * 0.1); ctx.fillStyle = '#d52b1e'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(x - s * 0.1, y - s * 0.31, s * 0.2, s * 0.62); ctx.fillRect(x - s * 0.31, y - s * 0.1, s * 0.62, s * 0.2);
  }
  function bottle(ctx, x, y, w, h, level) {
    const nk = w * 0.36, P = new Path2D();
    P.moveTo(x - nk / 2, y - h / 2); P.lineTo(x + nk / 2, y - h / 2); P.lineTo(x + nk / 2, y - h * 0.34);
    P.quadraticCurveTo(x + w / 2, y - h * 0.26, x + w / 2, y - h * 0.08); P.lineTo(x + w / 2, y + h / 2 - 18);
    P.quadraticCurveTo(x + w / 2, y + h / 2, x + w / 2 - 18, y + h / 2); P.lineTo(x - w / 2 + 18, y + h / 2);
    P.quadraticCurveTo(x - w / 2, y + h / 2, x - w / 2, y + h / 2 - 18); P.lineTo(x - w / 2, y - h * 0.08);
    P.quadraticCurveTo(x - w / 2, y - h * 0.26, x - nk / 2, y - h * 0.34); P.closePath();
    ctx.save(); ctx.fillStyle = '#060b14'; ctx.fill(P);
    ctx.save(); ctx.clip(P);
    const fy = lerp(y + h / 2, y - h * 0.3, clamp(level));
    ctx.fillStyle = AQ; ctx.beginPath(); ctx.moveTo(x - w, y + h); ctx.lineTo(x - w, fy);
    for (let i = 0; i <= 12; i++) ctx.lineTo(x - w + i * w / 6, fy + Math.sin(i + level * 18) * 4);
    ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.lineWidth = 6; ctx.strokeStyle = '#c9d4e6'; ctx.stroke(P); ctx.restore();
  }
  function thermo(ctx, x, y, h, frac, color) {
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -34, -h, 68, h + 20, 34); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.fg; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 40, 58, 0, Math.PI * 2); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 40, 44, 0, Math.PI * 2); ctx.fill();
    const fh = (h - 30) * clamp(frac); roundRect(ctx, -18, 10 - fh, 36, fh + 20, 18); ctx.fill();
    ctx.restore();
  }
  // hygromètre : arc 0–100 %, zone 30–50 % en vert ; v = aiguille
  function hygro(ctx, x, y, r, v, zone) {
    const a = p => Math.PI * (1 + p / 100);
    ctx.save(); ctx.lineCap = 'butt'; ctx.lineWidth = 34; ctx.strokeStyle = '#1b2740';
    ctx.beginPath(); ctx.arc(x, y, r, a(0), a(100)); ctx.stroke();
    if (zone > 0) { ctx.strokeStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, r, a(30), a(30 + 20 * zone)); ctx.stroke(); }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a(v)) * (r - 18), y + Math.sin(a(v)) * (r - 18)); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function card(ctx, x, y, w, h, t, t0, o = {}) {
    const k = t0 === undefined ? 1 : ease.back(prog(t, t0, 0.32));
    if (k <= 0.001) return 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    roundRect(ctx, -w / 2, -h / 2, w, h, 30); ctx.fillStyle = o.bg || '#0b1220'; ctx.fill();
    ctx.lineWidth = o.lw || 4; ctx.strokeStyle = o.border || C.line; ctx.stroke();
    if (o.draw) o.draw();
    ctx.restore();
    return k;
  }

  // déshumidificateur générique, sans marque ; on = 0..1 (souffle d'air, voyant)
  function dehum(ctx, cx, cy, w, t, on = 1) {
    const h = w * 1.45, x = cx - w / 2, y = cy - h / 2;
    ctx.save();
    if (on > 0.01) { ctx.shadowColor = `rgba(56,200,239,${0.5 * on})`; ctx.shadowBlur = 46; }
    roundRect(ctx, x, y, w, h, w * 0.14); ctx.fillStyle = '#eef2f8'; ctx.fill(); ctx.restore();
    ctx.save();
    // grille du haut
    roundRect(ctx, x + w * 0.12, y + w * 0.1, w * 0.76, w * 0.3, 10); ctx.fillStyle = '#c3ccdb'; ctx.fill();
    ctx.strokeStyle = '#9aa6bb'; ctx.lineWidth = 5;
    for (let i = 1; i < 6; i++) { const yy = y + w * 0.1 + i * w * 0.05; ctx.beginPath(); ctx.moveTo(x + w * 0.16, yy); ctx.lineTo(x + w * 0.84, yy); ctx.stroke(); }
    // voyant et écran
    roundRect(ctx, x + w * 0.3, y + w * 0.5, w * 0.4, w * 0.16, 8); ctx.fillStyle = '#0d1524'; ctx.fill();
    ctx.fillStyle = on > 0.5 ? AQ : '#3a4660'; ctx.beginPath(); ctx.arc(cx, y + w * 0.58, w * 0.04, 0, Math.PI * 2); ctx.fill();
    // réservoir avec niveau d'eau
    roundRect(ctx, x + w * 0.1, y + h * 0.58, w * 0.8, h * 0.34, 14); ctx.fillStyle = '#d7dee9'; ctx.fill();
    const lv = 0.25 + 0.15 * on * (0.5 + 0.5 * Math.sin(t * 0.7));
    ctx.save(); roundRect(ctx, x + w * 0.1, y + h * 0.58, w * 0.8, h * 0.34, 14); ctx.clip();
    ctx.fillStyle = 'rgba(56,200,239,0.75)'; ctx.fillRect(x, y + h * (0.92 - 0.34 * lv), w, h); ctx.restore();
    ctx.restore();
    if (on > 0.01) { // air sec qui sort en haut
      ctx.save(); ctx.strokeStyle = `rgba(155,230,250,${0.6 * on})`; ctx.lineWidth = 5; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.8 + i / 3) % 1, yy = y - 20 - ph * 90;
        ctx.globalAlpha = Math.sin(ph * Math.PI);
        ctx.beginPath(); ctx.moveTo(cx - w * 0.3, yy); ctx.quadraticCurveTo(cx, yy - 22, cx + w * 0.3, yy); ctx.stroke();
      }
      ctx.restore();
    }
  }
  function clock(ctx, x, y, r, frac, o = {}) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = '#060b14'; ctx.fill();
    ctx.lineWidth = 8; ctx.strokeStyle = o.color || AQ; ctx.stroke();
    if (frac > 0) { ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r - 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(frac, 1)); ctx.closePath(); ctx.fillStyle = 'rgba(56,200,239,0.35)'; ctx.fill(); }
    const a = -Math.PI / 2 + Math.PI * 2 * (o.hand ?? frac);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * (r - 26), y + Math.sin(a) * (r - 26)); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  // duel de l'accroche : même image au début et à la fin
  function duel(ctx, t, o = {}) {
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(56,200,239,0.45)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(505, 480); ctx.lineTo(505, 1215); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 265, 500, { color: C.white, size: 38, border: AQ });
    chip(ctx, 'TON COLLÈGUE', 730, 500, { color: C.white, size: 34, border: HOT });
    CHR.emo(ctx, 'woman_technologist', 265, 625, 190, t, undefined, { phase: 0.3 });
    CHR.emo(ctx, 'man_technologist', 730, 625, 190, t, undefined, { phase: 1.4 });
    rack(ctx, 265, 770, 300, t);
    rack(ctx, 680, 770, 220, t);
    dehum(ctx, 860, 1000, 120, t, o.on ?? 1);
    if (o.vapor) vapor(ctx, 265, 800, 260, 200, t, o.vapor);
    text(ctx, o.left || 'AU SALON', 265, 1172, { size: o.ls || 48, weight: 900, color: AQ2, maxWidth: 440 });
    text(ctx, o.right || '+ DÉSHUMIDIFICATEUR', 730, 1172, { size: o.rs || 40, weight: 900, color: HOT, maxWidth: 440 });
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['man_technologist', 'woman_technologist', 'cross_mark', 'thermometer', 'droplet', 'high_voltage', 'clipboard', 'fire', 'thinking_face', 'thumbs_up', 'thumbs_down', 'hourglass_done']),
    draw(ctx, t) {
      background(ctx, t, { glow: 'rgba(18,72,96,0.5)' });

      // 1. ACCROCHE (image 0 complète) : s01 → s03
      block(ctx, t, 0, S('s04'), () => {
        const z = 1 + 0.015 * Math.sin(t * 2.2);
        ctx.save(); ctx.translate(500, 385); ctx.scale(z, z);
        text(ctx, 'COMBIEN ?', 0, 0, { size: 140, weight: 900, color: C.white, shadow: 'rgba(56,200,239,0.55)', shadowBlur: 34 });
        ctx.restore();
        duel(ctx, t, { on: prog(t, S('s02'), 0.35), vapor: 6 });
        stamp(ctx, 'EN MARCHE', 730, 1098, t, FR('s02', 0.3), { size: 34, color: HOT, rot: 0.03 });
        stamp(ctx, '?,?? CT', 730, 880, t, FR('s03', 0.35), { size: 50, color: C.white, rot: -0.04 });
      });

      // 2. Promesse
      block(ctx, t, S('s04'), S('s05'), () => {
        card(ctx, 500, 560, 760, 330, t, S('s04') + 0.02, { border: GREEN, draw: () => {
          text(ctx, 'LA RÉPONSE', 0, -100, { size: 64, weight: 900, color: GREEN });
          text(ctx, '?,?? ct', 0, 50, { size: 120, family: F.mono, weight: 700, color: C.white });
        } });
        card(ctx, 500, 990, 760, 360, t, FR('s04', 0.45), { border: RED, draw: () => {
          text(ctx, 'LE PIÈGE DE LA FICHE', 0, 120, { size: 56, weight: 900, color: '#ffb199', maxWidth: 700 });
          CHR.emo(ctx, 'clipboard', 0, -40, 170, t, FR('s04', 0.5));
        } });
      });

      // 3. 2 litres d'eau par machine (jour 37)
      block(ctx, t, S('s05'), S('s06'), () => {
        const k = ease.inOut(prog(t, FR('s05', 0.3), Math.max(0.9, 0.5 * (E('s05') - S('s05')))));
        cloud(ctx, 300, 500, 40 + 56 * k, 0.9);
        rack(ctx, 300, 690, 320, t);
        vapor(ctx, 300, 730, 280, 260, t, 14, { r: 11 });
        bottle(ctx, 730, 700, 190, 400, k);
        text(ctx, k >= 1 ? '≈ 2 L' : `${(2 * k).toFixed(1).replace('.', ',')} L`, 730, 730, { size: 56, family: F.mono, weight: 700, color: '#fff', stroke: 'rgba(0,0,0,0.7)', strokeWidth: 10 });
        stamp(ctx, "D'EAU PAR MACHINE", 500, 985, t, FR('s05', 0.62), { size: 52, color: AQ, rot: -0.02 });
        schema(ctx, 730, 445);
        src(ctx, "ÉTUDE Q-WASH POUR L'ADEME (FRANCE)", 500, 1100, { alpha: ease.out(prog(t, FR('s05', 0.08), 0.3)) });
      });

      // 4. 270 W
      block(ctx, t, S('s06'), S('s07'), () => {
        swissFlag(ctx, 150, 380, 90);
        text(ctx, 'MARQUE SUISSE', 540, 380, { size: 78, weight: 900, color: C.white, maxWidth: 640 });
        dehum(ctx, 300, 720, 250, t, clamp(prog(t, FR('s06', 0.2), 0.3)));
        const a = ease.out(prog(t, FR('s06', 0.55), 0.3));
        readout(ctx, 'PUISSANCE', '270 W', 720, 700, { w: 400, h: 190, size: 92, color: AQ2, border: AQ, labelSize: 36, alpha: a });
        CHR.emo(ctx, 'high_voltage', 840, 540, 100, t, FR('s06', 0.6));
        const sa = ease.out(prog(t, FR('s06', 0.1), 0.3));
        src(ctx, 'STADLER FORM ALBERT · FICHE DU FABRICANT', 500, 1060, { alpha: sa });
        src(ctx, "MESURÉE À 26,7 °C ET 60 % D'HUMIDITÉ", 500, 1140, { alpha: sa });
      });

      // 5. 20 L en 24 h
      block(ctx, t, S('s07'), S('s08'), () => {
        chip(ctx, 'SUR LA FICHE', 500, 360, { color: C.gold2, size: 40, letter: 2 });
        const k = ease.inOut(prog(t, FR('s07', 0.2), Math.max(0.9, 0.6 * (E('s07') - S('s07')))));
        bottle(ctx, 300, 760, 260, 520, k);
        text(ctx, '20 L', 720, 640, { size: 150, family: F.mono, weight: 700, color: AQ2, alpha: ease.out(prog(t, FR('s07', 0.15), 0.3)) });
        text(ctx, 'EN 24 H', 720, 800, { size: 84, weight: 900, color: C.white, alpha: ease.out(prog(t, FR('s07', 0.55), 0.3)) });
        clock(ctx, 720, 990, 90, k);
        src(ctx, 'CAPACITÉ ANNONCÉE · STADLER FORM', 500, 1170, {});
      });

      // 6. 2 L : au mieux 2 h 24
      block(ctx, t, S('s08'), S('s09'), () => {
        text(ctx, '24 h × 2 L ÷ 20 L', 500, 400, { size: 76, family: F.mono, weight: 700, color: C.white, alpha: ease.out(prog(t, S('s08') + 0.05, 0.3)) });
        const k = ease.inOut(prog(t, FR('s08', 0.3), 0.9));
        clock(ctx, 500, 720, 190, 0.1 * k, { hand: 0.1 * k });
        text(ctx, '2 h 24', 500, 1000, { size: 120, family: F.mono, weight: 700, color: AQ2, alpha: ease.out(prog(t, FR('s08', 0.55), 0.3)) });
        stamp(ctx, 'AU MIEUX', 780, 520, t, FR('s08', 0.25), { size: 50, color: C.gold2, rot: 0.05 });
        src(ctx, 'EXEMPLE · CALCUL SUR LA FICHE', 500, 1140, { color: C.gold2 });
      });

      // 7. ≈ 18 ct
      block(ctx, t, S('s09'), S('s10'), () => {
        const a = ease.out(prog(t, S('s09') + 0.05, 0.3)), b = ease.out(prog(t, FR('s09', 0.2), 0.3));
        text(ctx, '0,27 kW × 2,4 h', 500, 380, { size: 76, family: F.mono, weight: 700, color: AQ2, alpha: a });
        text(ctx, '= 0,648 kWh', 500, 480, { size: 76, family: F.mono, weight: 700, color: AQ2, alpha: a });
        text(ctx, '× 27,7 ct/kWh', 500, 590, { size: 76, family: F.mono, weight: 700, color: C.white, alpha: b });
        src(ctx, 'HORS TVA · MÉDIANE ELCOM 2026', 500, 680, { color: C.gold2, alpha: b });
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 5; ctx.globalAlpha *= b; ctx.beginPath(); ctx.moveTo(150, 745); ctx.lineTo(850, 745); ctx.stroke(); ctx.restore();
        text(ctx, '= 17,95 ct', 500, 850, { size: 104, family: F.mono, weight: 700, color: C.white, alpha: ease.out(prog(t, FR('s09', 0.5), 0.3)) });
        stamp(ctx, '≈ 18 CT PAR MACHINE', 500, 1030, t, FR('s09', 0.75), { size: 56, color: GREEN });
        schema(ctx, 500, 1160, 'EXEMPLE · AU MIEUX');
      });

      // 8. SURPRISE : conditions de la fiche
      block(ctx, t, S('s10'), S('s11'), () => {
        text(ctx, 'SURPRISE', 500, 360, { size: 92, weight: 900, color: RED });
        card(ctx, 500, 590, 820, 280, t, S('s10') + 0.05, { border: RED, draw: () => {
          text(ctx, '20 L en 24 h…', 0, -50, { size: 70, family: F.mono, weight: 700, color: AQ2 });
          text(ctx, 'seulement', 0, 50, { size: 56, weight: 900, color: C.white });
        } });
        const a = ease.back(prog(t, FR('s10', 0.45), 0.32)), b = ease.back(prog(t, FR('s10', 0.7), 0.32));
        thermo(ctx, 220, 1030, 220, 0.75, HOT);
        if (a > 0.01) text(ctx, 'DÈS 22 °C', 420, 960, { size: 60, family: F.mono, weight: 700, color: '#ffc299', alpha: clamp(a), align: 'left' });
        if (b > 0.01) text(ctx, 'DÈS 70 %', 420, 1070, { size: 60, family: F.mono, weight: 700, color: AQ2, alpha: clamp(b), align: 'left' });
        if (b > 0.01) text(ctx, "D'HUMIDITÉ", 420, 1140, { size: 42, weight: 900, color: AQ2, alpha: clamp(b), align: 'left' });
        src(ctx, 'STADLER FORM · FICHE DU FABRICANT', 500, 800, {});
      });

      // 9. Plus frais : plus longtemps (sans chiffre)
      block(ctx, t, S('s11'), S('s12'), () => {
        const k = ease.inOut(prog(t, S('s11') + 0.1, 1.2));
        thermo(ctx, 220, 900, 420, lerp(0.75, 0.45, k), k > 0.5 ? AQ : HOT);
        text(ctx, 'PLUS FRAIS', 640, 470, { size: 74, weight: 900, color: AQ2 });
        text(ctx, '= PLUS LONGTEMPS', 640, 570, { size: 58, weight: 900, color: C.white, alpha: ease.out(prog(t, FR('s11', 0.4), 0.3)), maxWidth: 560 });
        const turns = (t - S('s11')) * 0.6;
        clock(ctx, 640, 850, 150, Math.min(1, 0.1 + turns * 0.3), { hand: turns });
        CHR.emo(ctx, 'hourglass_done', 820, 1050, 110, t, FR('s11', 0.5));
        schema(ctx, 640, 1100);
      });

      // 10. Hygrostat vers 50 % (OFSP 30–50 %)
      block(ctx, t, S('s12'), S('s13'), () => {
        text(ctx, 'HYGROSTAT', 500, 380, { size: 92, weight: 900, color: C.white });
        const zk = ease.out(prog(t, FR('s12', 0.45), 0.5));
        const v = lerp(78, 50, ease.inOut(prog(t, S('s12') + 0.2, 1.2)));
        hygro(ctx, 500, 820, 230, v, zk);
        text(ctx, '≈ 50 %', 500, 900, { size: 84, family: F.mono, weight: 700, color: C.white });
        text(ctx, 'OFSP : 30 à 50 %', 500, 1020, { size: 62, family: F.mono, weight: 700, color: GREEN, alpha: zk, maxWidth: 820 });
        src(ctx, 'OFFICE FÉDÉRAL DE LA SANTÉ PUBLIQUE', 500, 1120, { color: C.gold2, alpha: zk });
      });

      // 11. TCS : chauffer plus ne règle pas l'humidité
      block(ctx, t, S('s13'), S('s14'), () => {
        src(ctx, 'TCS · TEST DES DÉSHUMIDIFICATEURS', 500, 360, { color: C.gold2 });
        CHR.emo(ctx, 'fire', 330, 600, 220, t, S('s13') + 0.1);
        CHR.emo(ctx, 'thermometer', 640, 600, 200, t, S('s13') + 0.3);
        CHR.emo(ctx, 'cross_mark', 500, 600, 180, t, FR('s13', 0.4));
        text(ctx, 'CHAUFFER PLUS', 500, 860, { size: 80, weight: 900, color: '#ffc299', alpha: ease.out(prog(t, FR('s13', 0.2), 0.3)) });
        text(ctx, "≠ MOINS D'HUMIDITÉ", 500, 970, { size: 70, weight: 900, color: AQ2, alpha: ease.out(prog(t, FR('s13', 0.55), 0.3)), maxWidth: 840 });
      });

      // 12. Question
      block(ctx, t, S('s14'), S('s15'), () => {
        const k = ease.back(prog(t, S('s14') + 0.05, 0.32));
        ctx.save(); ctx.translate(500, 400); ctx.scale(Math.max(k, 0.01), Math.max(k, 0.01));
        text(ctx, "TU L'AURAIS", 0, 0, { size: 86, weight: 900, color: C.white });
        text(ctx, 'BRANCHÉ ?', 0, 100, { size: 86, weight: 900, color: C.white });
        ctx.restore();
        dehum(ctx, 500, 760, 170, t, 1);
        card(ctx, 280, 1060, 340, 150, t, FR('s14', 0.4), { border: GREEN, draw: () => text(ctx, 'OUI', 0, 2, { size: 70, weight: 900, color: GREEN }) });
        card(ctx, 720, 1060, 340, 150, t, FR('s14', 0.5), { border: RED, draw: () => text(ctx, 'NON', 0, 2, { size: 70, weight: 900, color: RED }) });
        CHR.emo(ctx, 'thinking_face', 820, 640, 120, t, FR('s14', 0.2));
      });

      // 13. Retour au duel
      block(ctx, t, S('s15'), S('s16'), () => {
        text(ctx, 'COMBIEN ?', 500, 385, { size: 120, weight: 900, color: C.white, shadow: 'rgba(56,200,239,0.55)', shadowBlur: 34 });
        const l = t >= FR('s15', 0.42);
        duel(ctx, t, { on: 1, vapor: l ? 12 : 5, left: l ? "DE L'EAU DANS L'AIR" : 'AU SALON', right: 'DES CENTIMES', ls: 42, rs: 42 });
        stamp(ctx, '≈ 18 CT', 730, 880, t, FR('s15', 0.12), { size: 50, color: HOT, rot: 0.03 });
        stamp(ctx, 'AU MIEUX', 730, 1090, t, FR('s15', 0.2), { size: 34, color: C.gold2, rot: -0.02 });
        stamp(ctx, '≈ 2 L', 265, 1090, t, FR('s15', 0.55), { size: 50, color: AQ, rot: -0.03 });
      });

      // 14. Abonne-toi
      block(ctx, t, S('s16'), END + 1, () => {
        followCTA(ctx, t, S('s16'), { when: 'DEMAIN', next: ['Suisse contre France :', 'le kWh, qui paie le plus ?'] });
        swissFlag(ctx, 520, 1150, 90);
      });

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
