// Jour 37 — « Linge au salon ou sèche-linge : qui paie vraiment ? »
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
  // duel de l'accroche : même image au début et à la fin
  function duel(ctx, t, o = {}) {
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(56,200,239,0.45)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(505, 480); ctx.lineTo(505, 1215); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 265, 500, { color: C.white, size: 38, border: AQ });
    chip(ctx, 'TON COLLÈGUE', 730, 500, { color: C.white, size: 34, border: HOT });
    CHR.emo(ctx, 'woman_technologist', 265, 625, 190, t, undefined, { phase: 0.3 });
    CHR.emo(ctx, 'man_technologist', 730, 625, 190, t, undefined, { phase: 1.4 });
    rack(ctx, 265, 770, 320, t);
    dryer(ctx, 730, 925, 262, t, o.on ?? 1);
    if (o.vapor) vapor(ctx, 265, 800, 280, 200, t, o.vapor);
    text(ctx, o.left || 'AU SALON', 265, 1172, { size: o.ls || 48, weight: 900, color: AQ2, maxWidth: 440 });
    text(ctx, o.right || 'SÈCHE-LINGE', 730, 1172, { size: o.ls || 48, weight: 900, color: HOT, maxWidth: 420 });
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['man_technologist', 'woman_technologist', 'bathtub', 'couch_and_lamp', 'cross_mark', 'window', 'television', 'high_voltage']),
    draw(ctx, t) {
      background(ctx, t, { glow: 'rgba(18,72,96,0.5)' });

      // 1. ACCROCHE (image 0 complète)
      block(ctx, t, 0, S('s03'), () => {
        const z = 1 + 0.015 * Math.sin(t * 2.2);
        ctx.save(); ctx.translate(500, 385); ctx.scale(z, z);
        text(ctx, 'QUI PAIE ?', 0, 0, { size: 140, weight: 900, color: C.white, shadow: 'rgba(56,200,239,0.55)', shadowBlur: 34 });
        ctx.restore();
        duel(ctx, t, { on: prog(t, S('s02'), 0.35), vapor: 6 });
        stamp(ctx, 'EN MARCHE', 730, 1098, t, FR('s02', 0.2), { size: 34, color: HOT, rot: 0.03 });
      });

      // 2. Promesse : en francs, puis dans l'air
      block(ctx, t, S('s03'), S('s04'), () => {
        card(ctx, 500, 540, 760, 330, t, S('s03') + 0.02, { border: GREEN, draw: () => {
          text(ctx, 'EN FRANCS', 0, -100, { size: 64, weight: 900, color: GREEN });
          text(ctx, '?,?? CHF', 0, 50, { size: 120, family: F.mono, weight: 700, color: C.white });
        } });
        card(ctx, 500, 985, 760, 370, t, FR('s03', 0.48), { border: AQ, draw: () => {
          cloud(ctx, 0, -20, 92, 0.95);
          vapor(ctx, 0, 140, 420, 220, t, 10);
          text(ctx, "LA SURPRISE DANS L'AIR", 0, 135, { size: 54, weight: 900, color: AQ2, maxWidth: 700 });
          text(ctx, '?', 0, -30, { size: 118, weight: 900, color: C.white });
        } });
      });

      // 3. Pompe à chaleur : 0,99 kWh
      block(ctx, t, S('s04'), S('s05'), () => {
        text(ctx, 'POMPE À CHALEUR', 500, 360, { size: 78, weight: 900, color: C.white, maxWidth: 840 });
        scale(ctx, 80, 430, t, { t0: S('s04'), cur: 'C', rh: 50, w: 200 });
        const on = clamp(prog(t, FR('s04', 0.15), 0.3));
        dryer(ctx, 700, 610, 280, t, on);
        const k = ease.inOut(prog(t, FR('s04', 0.42), Math.max(0.8, 0.45 * (E('s04') - S('s04')))));
        readout(ctx, 'KWH PAR SÉCHAGE', cts(0.99 * k), 500, 925, { w: 820, h: 170, size: 96, color: AQ2, border: AQ, labelSize: 36 });
        const sa = ease.out(prog(t, FR('s04', 0.3), 0.3));
        src(ctx, 'BOSCH WTW87680CH · 8 KG', 500, 1065, { alpha: sa });
        src(ctx, 'PROGRAMME ECO · FICHE SUISSE', 500, 1140, { alpha: sa });
      });

      // 4. Le calcul : 27 ct
      block(ctx, t, S('s05'), S('s06'), () => {
        const a = ease.out(prog(t, S('s05') + 0.05, 0.3)), b = ease.out(prog(t, FR('s05', 0.25), 0.3));
        text(ctx, '0,99 kWh', 500, 390, { size: 92, family: F.mono, weight: 700, color: AQ2, alpha: a });
        text(ctx, '× 27,7 ct/kWh', 500, 510, { size: 84, family: F.mono, weight: 700, color: C.white, alpha: b });
        src(ctx, 'HORS TVA · MÉDIANE ELCOM 2026', 500, 610, { color: C.gold2, alpha: b });
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 5; ctx.globalAlpha *= b; ctx.beginPath(); ctx.moveTo(150, 682); ctx.lineTo(850, 682); ctx.stroke(); ctx.restore();
        const k = ease.inOut(prog(t, FR('s05', 0.45), Math.max(0.7, 0.35 * (E('s05') - S('s05')))));
        text(ctx, `= ${(27.423 * k).toFixed(1).replace('.', ',')} ct`, 500, 800, { size: 112, family: F.mono, weight: 700, color: C.white });
        stamp(ctx, '27 CT PAR SÉCHAGE', 500, 1010, t, FR('s05', 0.82), { size: 60, color: GREEN });
        CHR.emo(ctx, 'high_voltage', 840, 390, 110, t, S('s05') + 0.1);
      });

      // 5. Classe G : 85 ct
      block(ctx, t, S('s06'), S('s07'), () => {
        text(ctx, 'À CONDENSATION', 500, 360, { size: 78, weight: 900, color: C.white, maxWidth: 840 });
        scale(ctx, 80, 430, t, { t0: S('s06'), cur: 'G', rh: 50, w: 200 });
        dryer(ctx, 710, 575, 250, t, 1);
        const k = ease.inOut(prog(t, FR('s06', 0.3), Math.max(0.7, 0.3 * (E('s06') - S('s06')))));
        readout(ctx, 'KWH PAR SÉCHAGE', cts(3.08 * k), 300, 925, { w: 460, h: 170, size: 84, color: '#ffb199', border: RED, labelSize: 36 });
        const c = ease.out(prog(t, FR('s06', 0.62), 0.25));
        text(ctx, '× 27,7 ct', 745, 910, { size: 58, family: F.mono, weight: 700, color: C.white, alpha: c });
        text(ctx, '= 85,3 ct', 745, 985, { size: 58, family: F.mono, weight: 700, color: C.white, alpha: c });
        stamp(ctx, '85 CT', 710, 790, t, FR('s06', 0.85), { size: 76 });
        const sa = ease.out(prog(t, FR('s06', 0.12), 0.3));
        src(ctx, 'BOSCH WTN83203FG · 8 KG', 500, 1065, { alpha: sa });
        src(ctx, 'PROGRAMME ECO · FICHE BELGE', 500, 1140, { alpha: sa });
      });

      // 6. En Suisse : classe C au minimum
      block(ctx, t, S('s07'), S('s08'), () => {
        swissFlag(ctx, 150, 380, 100);
        text(ctx, 'EN SUISSE', 520, 380, { size: 92, weight: 900, color: C.white, maxWidth: 620 });
        const g = i => i < 3 ? 0 : ease.out(prog(t, FR('s07', 0.35) + (i - 3) * 0.2, 0.25));
        scale(ctx, 90, 480, t, { rh: 62, w: 230, grey: g });
        stamp(ctx, 'CLASSE C', 700, 590, t, FR('s07', 0.62), { size: 66, color: GREEN, rot: -0.04 });
        text(ctx, 'AU MINIMUM', 700, 690, { size: 50, weight: 900, color: GREEN, alpha: ease.out(prog(t, FR('s07', 0.72), 0.25)) });
        CHR.emo(ctx, 'cross_mark', 680, 900, 130, t, FR('s07', 0.5));
        src(ctx, 'DEPUIS LE 1.7.2025 · ≤ 4 KG/H', 500, 1050, { alpha: ease.out(prog(t, FR('s07', 0.15), 0.3)) });
        src(ctx, 'SOURCE : OFEN', 500, 1140, { color: C.gold2 });
      });

      // 7. RÉPONSE : tableau de score
      block(ctx, t, S('s08'), S('s09'), () => {
        chip(ctx, 'EN ÉLECTRICITÉ', 500, 355, { color: C.gold2, size: 38, letter: 2 });
        card(ctx, 265, 720, 420, 620, t, S('s08') + 0.02, { border: AQ, draw: () => {
          text(ctx, 'TOI', 0, -255, { size: 56, weight: 900, color: AQ2 });
          rack(ctx, 0, -190, 220, t);
          text(ctx, '0 kWh', 0, 110, { size: 64, family: F.mono, weight: 700, color: AQ2 });
          text(ctx, '0,00 fr.', 0, 205, { size: 72, family: F.mono, weight: 700, color: C.white });
        } });
        card(ctx, 725, 720, 420, 620, t, FR('s08', 0.35), { border: HOT, draw: () => {
          text(ctx, 'TON COLLÈGUE', 0, -255, { size: 46, weight: 900, color: HOT, maxWidth: 400 });
          dryer(ctx, 0, -80, 190, t, 1);
          text(ctx, '0,99 kWh', 0, 110, { size: 56, family: F.mono, weight: 700, color: '#ffc299' });
          text(ctx, '27 ct', 0, 205, { size: 72, family: F.mono, weight: 700, color: C.white });
        } });
        stamp(ctx, 'IL PAIE', 725, 1095, t, FR('s08', 0.75), { size: 60, color: HOT });
        stamp(ctx, '0 FR.', 265, 1095, t, FR('s08', 0.18), { size: 60, color: GREEN, rot: 0.05 });
        src(ctx, 'ÉTENDOIR · CHAUFFAGE NON COMPTÉ', 500, 1195, {});
      });

      // 8. 2e SURPRISE : l'eau part dans l'air
      block(ctx, t, S('s09'), S('s10'), () => {
        const k = ease.inOut(prog(t, FR('s09', 0.3), Math.max(0.9, 0.5 * (E('s09') - S('s09')))));
        text(ctx, 'MAIS…', 500, 355, { size: 82, weight: 900, color: AQ });
        cloud(ctx, 300, 500, 40 + 56 * k, 0.9);
        rack(ctx, 300, 690, 320, t);
        vapor(ctx, 300, 730, 280, 260, t, 14, { r: 11 });
        bottle(ctx, 730, 700, 190, 400, k);
        text(ctx, k >= 1 ? '≈ 2 L' : `${(2 * k).toFixed(1).replace('.', ',')} L`, 730, 730, { size: 56, family: F.mono, weight: 700, color: '#fff', stroke: 'rgba(0,0,0,0.7)', strokeWidth: 10 });
        stamp(ctx, "D'EAU PAR MACHINE", 500, 985, t, FR('s09', 0.62), { size: 52, color: AQ, rot: -0.02 });
        schema(ctx, 730, 445);
        src(ctx, "ÉTUDE Q-WASH POUR L'ADEME (FRANCE)", 500, 1090, { alpha: ease.out(prog(t, FR('s09', 0.08), 0.3)) });
        src(ctx, "HAUSSE D'HUMIDITÉ TEMPORAIRE · Q-WASH", 500, 1165, {});
      });

      // 9. × 4
      block(ctx, t, S('s10'), S('s11'), () => {
        const yb = 930, base = 110;
        const a = ease.out(prog(t, S('s10') + 0.05, 0.45)), b = ease.out(prog(t, FR('s10', 0.35), 0.45));
        [[300, 4 * base * a, AQ, 'LINGE'], [700, base * b, '#7d8aa5', 'BAIN OU DOUCHE']].forEach(([x, h, c, lb]) => {
          roundRect(ctx, x - 110, yb - h, 220, Math.max(h, 1), 18); ctx.fillStyle = c; ctx.fill();
          text(ctx, lb, x, yb + 45, { size: 44, weight: 900, color: C.white, maxWidth: 400 });
        });
        rack(ctx, 300, yb - 4 * base * a - 170, 150, t);
        CHR.emo(ctx, 'bathtub', 700, yb - base * b - 95, 170, t, FR('s10', 0.4));
        stamp(ctx, '×4', 300, yb - 220, t, FR('s10', 0.5), { size: 96, color: '#ffffff', rot: -0.04 });
        schema(ctx, 700, 500);
        src(ctx, 'VAPEUR ÉMISE · Q-WASH', 500, 1060, {});
        src(ctx, "HAUSSE D'HUMIDITÉ TEMPORAIRE · Q-WASH", 500, 1135, {});
      });

      // 10. Pièce plus froide
      block(ctx, t, S('s11'), S('s12'), () => {
        const k = ease.inOut(prog(t, FR('s11', 0.2), 1.1));
        const pulse = 1 + 0.03 * Math.sin((t - S('s11')) * 6);
        thermo(ctx, 210, 960, 480, lerp(0.74, 0.5, k), lerp(0, 1, k) > 0.5 ? AQ : HOT);
        ctx.save(); ctx.translate(590, 500); ctx.scale(pulse, pulse);
        text(ctx, '−1 à −2 °C', 0, 0, { size: 104, family: F.mono, weight: 700, color: AQ2, shadow: 'rgba(56,200,239,0.5)' , alpha: ease.out(prog(t, FR('s11', 0.25), 0.3)) });
        ctx.restore();
        text(ctx, 'DANS LA PIÈCE', 590, 640, { size: 62, weight: 900, color: C.white, alpha: ease.out(prog(t, FR('s11', 0.04), 0.25)) });
        stamp(ctx, 'PENDANT LE SÉCHAGE', 600, 790, t, FR('s11', 0.7), { size: 38, color: AQ, rot: 0.02 });
        src(ctx, 'SOURCE : Q-WASH · ADEME', 590, 900, { color: C.gold2 });
        schema(ctx, 590, 990);
        vapor(ctx, 590, 1180, 480, 120, t, 6, { alpha: 0.6 });
      });

      // 11. OFSP
      block(ctx, t, S('s12'), S('s13'), () => {
        src(ctx, 'OFFICE FÉDÉRAL DE LA SANTÉ PUBLIQUE', 500, 350, { color: C.gold2 });
        CHR.emo(ctx, 'couch_and_lamp', 500, 540, 260, t, S('s12') + 0.1);
        CHR.emo(ctx, 'cross_mark', 650, 470, 120, t, FR('s12', 0.42));
        const lines = ['« Evitez de sécher', 'le linge dans les', 'pièces habitables. »'];
        card(ctx, 500, 880, 830, 340, t, FR('s12', 0.2), { border: AQ, draw: () => {
          lines.forEach((l, i) => {
            const lit = t >= FR('s12', 0.45 + i * 0.17);
            text(ctx, l, 0, -92 + i * 92, { size: 72, weight: 900, color: lit ? C.white : 'rgba(255,255,255,0.45)', maxWidth: 770 });
          });
        } });
        src(ctx, 'OFSP · ATTENTION AUX MOISISSURES', 500, 1120, { alpha: ease.out(prog(t, FR('s12', 0.5), 0.3)) });
      });

      // 12. Aérer, viser 30–50 %
      block(ctx, t, S('s13'), S('s14'), () => {
        const mid = FR('s13', 0.56);
        CHR.emo(ctx, 'window', 180, 450, 200, t, S('s13') + 0.05);
        const rem = 300 * ease.out(prog(t, S('s13') + 0.2, 3.2));  // compte jusqu'à 5:00, la valeur de l'OFSP
        readout(ctx, 'AU MOINS', `${Math.floor(rem / 60)}:${String(Math.floor(rem % 60)).padStart(2, '0')}`, 590, 450, { w: 560, h: 190, size: 92, color: AQ2, border: AQ, labelSize: 36 });
        ['MATIN', 'MIDI', 'COUCHER'].forEach((m, i) => {
          card(ctx, 195 + i * 305, 620, 280, 96, t, FR('s13', 0.18 + i * 0.1), { border: AQ, draw: () => text(ctx, m, 0, 2, { size: 44, weight: 900, color: C.white, maxWidth: 250 }) });
        });
        const zk = ease.out(prog(t, mid, 0.5));
        const v = lerp(78, 40, ease.inOut(prog(t, mid + 0.15, 1.2)));
        hygro(ctx, 500, 1020, 190, v, zk);
        text(ctx, 'HUMIDITÉ ?', 500, 760, { size: 70, weight: 900, color: C.muted, alpha: 1 - zk });
        text(ctx, "30 à 50 % d'humidité", 500, 760, { size: 62, family: F.mono, weight: 700, color: GREEN, alpha: zk, maxWidth: 820 });
        src(ctx, 'OFSP · EN PÉRIODE DE CHAUFFAGE', 500, 1095, {});
        schema(ctx, 500, 1178);
      });

      // 13. La question : plan d'appartement
      block(ctx, t, S('s14'), S('s15'), () => {
        const k = ease.back(prog(t, S('s14') + 0.05, 0.32));
        ctx.save(); ctx.translate(500, 370); ctx.scale(Math.max(k, 0.01), Math.max(k, 0.01));
        text(ctx, 'DANS QUELLE PIÈCE ?', 0, 0, { size: 76, weight: 900, color: C.white, maxWidth: 840 });
        ctx.restore();
        const rooms = [[100, 470, 460, 330, 'SALON'], [560, 470, 340, 330, 'CHAMBRE'], [100, 800, 340, 330, 'CUISINE'], [440, 800, 460, 330, 'BUANDERIE']];
        const n = Math.floor((t - S('s14')) / Math.max(0.3, (E('s14') - S('s14')) / 4)) % 4;
        rooms.forEach(([x, y, w, h, l], i) => {
          ctx.save(); ctx.fillStyle = i === n ? 'rgba(56,200,239,0.3)' : '#0b1220'; ctx.fillRect(x, y, w, h);
          ctx.lineWidth = 7; ctx.strokeStyle = i === n ? AQ : '#3a4660'; ctx.strokeRect(x, y, w, h); ctx.restore();
          text(ctx, l, x + w / 2, y + 56, { size: 40, weight: 900, color: i === n ? C.white : C.muted, maxWidth: w - 30 });
        });
        const [rx, ry, rw] = rooms[n];
        rack(ctx, rx + rw / 2, ry + 120, 170, t);
        schema(ctx, 500, 1185);
      });

      // 14. Retour au duel
      block(ctx, t, S('s15'), S('s16'), () => {
        text(ctx, 'QUI PAIE ?', 500, 385, { size: 120, weight: 900, color: C.white, shadow: 'rgba(56,200,239,0.55)', shadowBlur: 34 });
        const l = t >= FR('s15', 0.42);
        duel(ctx, t, { on: 1, vapor: l ? 12 : 5, left: l ? "DE L'EAU DANS L'AIR" : 'AU SALON', right: 'DES CENTIMES', ls: 42 });
        stamp(ctx, '27 CT', 730, 1090, t, FR('s15', 0.12), { size: 50, color: HOT, rot: 0.03 });
        stamp(ctx, '≈ 2 L', 265, 1090, t, FR('s15', 0.55), { size: 50, color: AQ, rot: -0.03 });
      });

      // 15. Abonne-toi
      block(ctx, t, S('s16'), END + 1, () => {
        followCTA(ctx, t, S('s16'), { when: 'CE SOIR', next: ['ta télé quand tu crois', "l'avoir éteinte"] });
        CHR.emo(ctx, 'television', 520, 1150, 130, t, FR('s16', 0.35));
      });

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
