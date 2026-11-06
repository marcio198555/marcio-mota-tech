// Jour 56 — « Faut-il éteindre sa box internet la nuit ? »
// Recette du 05.11 : duel dès l'image 0, promesse, réponse au milieu (9,63 CHF), 2e surprise (ce qu'on coupe), conseils,
// question, retour au duel, abonne-toi. Accent propre au sujet : cyan « voyant de box ». Duel en deux bandes horizontales.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, phone, followCTA, readout } = ENG;
  const END = E('s16') + 0.6;
  const CY = '#2fe0d0', RED = C.red2, AMB = '#ffb547', GREEN = '#46e08a';
  const DIM = 'rgba(47,224,208,0.14)';
  const f = (id, x) => lerp(S(id), E(id), x);   // instant à une fraction de la phrase
  const dec = (v, n) => v.toFixed(n).replace('.', ',');

  // ---------- briques ----------
  function stamp(ctx, label, x, y, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.32));
    if (k <= 0.001) return;
    const size = o.size || 64, col = o.color || RED;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.06); ctx.scale(lerp(1.5, 1, k), lerp(1.5, 1, k));
    ctx.globalAlpha *= clamp(k * 2.5);
    ctx.font = `900 ${size}px InterDisplay`; const w = ctx.measureText(label).width + 52, h = size + 32;
    roundRect(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = 'rgba(3,4,8,0.78)'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = col; ctx.stroke();
    text(ctx, label, 0, 2, { size, weight: 900, color: col });
    ctx.restore();
  }
  function card(ctx, x, y, w, h, col, o = {}) {
    const k = o.t0 === undefined ? 1 : ease.back(prog(o.t, o.t0, 0.34));
    if (k <= 0.001) return false;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-x - w / 2, -y - h / 2);
    roundRect(ctx, x, y, w, h, 30); ctx.fillStyle = o.bg || 'rgba(9,16,28,0.92)'; ctx.fill();
    ctx.lineWidth = o.lw || 4; ctx.strokeStyle = col; ctx.stroke();
    ctx.restore();
    return true;
  }
  function pop(ctx, t, t0, x, y, fn) {
    const k = ease.back(prog(t, t0, 0.34));
    if (k <= 0.001) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha *= clamp(k * 2); fn(); ctx.restore();
  }
  // ondes Wi-Fi au-dessus d'un point ; alpha 0..1
  function waves(ctx, x, y, r, t, alpha = 1, col = CY) {
    if (alpha <= 0.01) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(6, r * 0.12);
    for (let i = 1; i <= 3; i++) {
      const ph = 0.45 + 0.55 * Math.sin(t * 4 - i * 0.9);
      ctx.globalAlpha *= 1; ctx.strokeStyle = col;
      ctx.save(); ctx.globalAlpha *= alpha * (0.35 + 0.65 * ph);
      ctx.beginPath(); ctx.arc(x, y, r * i / 3, -Math.PI * 0.76, -Math.PI * 0.24); ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle = col; ctx.globalAlpha *= alpha; ctx.beginPath(); ctx.arc(x, y + 4, Math.max(5, r * 0.09), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // box générique, sans marque ni logo ; on = 0..1
  function routerBox(ctx, x, y, w, on, t, o = {}) {
    const h = w * 0.56;
    ctx.save(); ctx.translate(x, y);
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, on > 0.5 ? '#eef2f8' : '#667084'); g.addColorStop(1, on > 0.5 ? '#aab4c6' : '#3a4356');
    roundRect(ctx, -w / 2, -h / 2, w, h, h * 0.2); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.stroke();
    // fentes d'aération
    ctx.strokeStyle = on > 0.5 ? 'rgba(40,50,70,0.35)' : 'rgba(0,0,0,0.35)'; ctx.lineWidth = Math.max(3, w * 0.012); ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) { const yy = -h * 0.26 + i * h * 0.1; ctx.beginPath(); ctx.moveTo(-w * 0.38, yy); ctx.lineTo(w * 0.38, yy); ctx.stroke(); }
    // voyant
    const led = o.led || (on > 0.5 ? CY : '#20262f');
    ctx.save(); if (led !== '#20262f') { ctx.shadowColor = led; ctx.shadowBlur = 26; }
    ctx.fillStyle = led; ctx.beginPath(); ctx.arc(0, h * 0.3, Math.max(7, w * 0.035), 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.restore();
    if (o.waves !== false) waves(ctx, x, y - h / 2 - 12, w * 0.42, t, on);
  }
  function socket(ctx, x, y, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -42, -42, 84, 84, 16); ctx.fillStyle = '#e9edf5'; ctx.fill();
    ctx.fillStyle = '#3a4458'; ctx.beginPath(); ctx.arc(-15, 0, 7, 0, Math.PI * 2); ctx.arc(15, 0, 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function plugCable(ctx, ax, ay, bx, by) {
    ctx.save(); ctx.strokeStyle = '#cfd6e4'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.bezierCurveTo(ax + 20, ay + 70, bx - 70, by + 40, bx - 18, by); ctx.stroke();
    roundRect(ctx, bx - 24, by - 22, 44, 44, 10); ctx.fillStyle = '#cfd6e4'; ctx.fill();
    ctx.fillStyle = '#7b8496'; ctx.fillRect(bx + 20, by - 12, 14, 6); ctx.fillRect(bx + 20, by + 6, 14, 6);
    ctx.restore();
  }
  function spark(ctx, x, y, k) {
    if (k <= 0 || k >= 1) return;
    ctx.save(); ctx.strokeStyle = AMB; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.shadowColor = AMB; ctx.shadowBlur = 20; ctx.globalAlpha *= 1 - k;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.3; const r0 = 10 + 26 * k, r1 = r0 + 26; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    ctx.restore();
  }
  const moonCache = {};
  function moon(ctx, x, y, r) {
    let c = moonCache[r];
    if (!c) {
      c = document.createElement('canvas'); c.width = c.height = Math.ceil(r * 2 + 4);
      const g = c.getContext('2d'); g.translate(r + 2, r + 2);
      g.fillStyle = '#d9f7f4'; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
      g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(r * 0.45, -r * 0.25, r * 0.88, 0, Math.PI * 2); g.fill();
      moonCache[r] = c;
    }
    ctx.save(); ctx.shadowColor = 'rgba(47,224,208,0.5)'; ctx.shadowBlur = 30; ctx.drawImage(c, x - r - 2, y - r - 2); ctx.restore();
  }
  // téléphone fixe de bureau, dessiné
  function deskPhone(ctx, x, y, s, col = '#e9edf5') {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(-34, -8); ctx.lineTo(34, -8); ctx.lineTo(50, 42); ctx.quadraticCurveTo(50, 50, 40, 50); ctx.lineTo(-40, 50); ctx.quadraticCurveTo(-50, 50, -50, 42); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 15; ctx.strokeStyle = col; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-54, -18); ctx.quadraticCurveTo(0, -48, 54, -18); ctx.stroke();
    ctx.fillStyle = '#1a2236';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { ctx.beginPath(); ctx.arc(-16 + c * 16, 6 + r * 13, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function coffee(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.lineWidth = 9; ctx.strokeStyle = '#f1ece2'; ctx.beginPath(); ctx.arc(48, -6, 20, -1.3, 1.3); ctx.stroke();
    ctx.fillStyle = '#f1ece2'; ctx.beginPath(); ctx.moveTo(-50, -36); ctx.lineTo(50, -36); ctx.quadraticCurveTo(48, 34, 16, 38); ctx.lineTo(-16, 38); ctx.quadraticCurveTo(-48, 34, -50, -36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8a5a34'; ctx.beginPath(); ctx.ellipse(0, -36, 50, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d9a874'; ctx.beginPath(); ctx.ellipse(-4, -37, 28, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d7dbe3'; ctx.beginPath(); ctx.ellipse(0, 46, 70, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function coin(ctx, x, y, r, label, size) {
    ctx.save();
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r);
    g.addColorStop(0, '#f7e29a'); g.addColorStop(1, '#a9842c');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = Math.max(4, r * 0.06); ctx.strokeStyle = '#6f5519'; ctx.beginPath(); ctx.arc(x, y, r * 0.84, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    if (label) text(ctx, label, x, y + 2, { size, family: F.mono, weight: 700, color: '#2c2208', maxWidth: r * 1.5 });
  }
  function dial(ctx, x, y, r, frac, label) {
    ctx.save();
    ctx.fillStyle = '#060b14'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = DIM; ctx.strokeStyle = CY;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r - 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = C.fg; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    const a = -Math.PI / 2 + Math.PI * 2 * frac;
    ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.strokeStyle = CY; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * (r - 18), y + Math.sin(a) * (r - 18)); ctx.stroke();
    ctx.restore();
    if (label) text(ctx, label, x, y + r + 44, { size: 46, family: F.mono, weight: 700, color: CY });
  }
  function toggle(ctx, x, y, on, w = 180, col = CY) {
    const h = w * 0.52;
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = on > 0.5 ? col : '#2b3850'; ctx.fill();
    const kx = lerp(-w / 2 + h / 2, w / 2 - h / 2, ease.inOut(clamp(on)));
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(kx, 0, h / 2 - 8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function powerStrip(ctx, x, y, w) {
    const h = w * 0.2;
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -w / 2, -h / 2, w, h, h * 0.25); ctx.fillStyle = '#e4e8f0'; ctx.fill();
    for (let i = 0; i < 4; i++) {
      const cx = -w * 0.17 + i * w * 0.17;
      ctx.fillStyle = '#c2c9d6'; ctx.beginPath(); ctx.arc(cx, 0, h * 0.32, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3a4458'; ctx.beginPath(); ctx.arc(cx - h * 0.1, 0, h * 0.05, 0, Math.PI * 2); ctx.arc(cx + h * 0.1, 0, h * 0.05, 0, Math.PI * 2); ctx.fill();
    }
    roundRect(ctx, -w * 0.45, -h * 0.28, w * 0.13, h * 0.56, 8); ctx.fillStyle = RED; ctx.shadowColor = RED; ctx.shadowBlur = 18; ctx.fill();
    ctx.restore();
  }

  // Duel en deux bandes : TOI en haut (box allumée), TON COLLÈGUE en bas (box débranchée)
  function duel(ctx, t, o = {}) {
    const hi = o.hi || 0;  // 0 : rien, 1 : haut, 2 : bas
    card(ctx, 70, 322, 820, 368, hi === 1 ? CY : 'rgba(47,224,208,0.55)', { lw: hi === 1 ? 7 : 4 });
    card(ctx, 70, 802, 820, 368, hi === 2 ? RED : 'rgba(255,59,78,0.55)', { lw: hi === 2 ? 7 : 4 });
    chip(ctx, 'TOI', 94, 370, { align: 'left', color: C.white, size: 36, border: CY });
    chip(ctx, 'TON COLLÈGUE', 94, 870, { align: 'left', color: C.white, size: 36, border: RED });
    moon(ctx, 830, 372, 30);
    CHR.emo(ctx, 'woman_technologist', 175, 540, 210, t, undefined, { phase: 0.3 });
    CHR.emo(ctx, 'man_technologist', 175, 1040, 210, t, undefined, { phase: 1.4 });
    routerBox(ctx, 420, 580, 200, 1, t);
    routerBox(ctx, 420, 1010, 200, 0, t);
    const j = o.jolt || 0;
    socket(ctx, 800, 1115, 0.9);
    plugCable(ctx, 505, 1050, 690 - j * 26, 1118 + Math.sin(j * 9) * 8 * j);
    text(ctx, 'ALLUMÉE', 705, 490, { size: 52, weight: 900, color: CY, maxWidth: 290 });
    text(ctx, 'TOUTE LA NUIT', 705, 555, { size: 37, weight: 800, color: C.white, maxWidth: 290 });
    if (o.bottom) o.bottom();
    else {
      text(ctx, 'DÉBRANCHÉE', 705, 930, { size: 50, weight: 900, color: RED, maxWidth: 300 });
      text(ctx, 'AVANT DE DORMIR', 705, 995, { size: 36, weight: 800, color: C.white, maxWidth: 300 });
    }
  }
  function pill(ctx, label, o = {}) {
    const size = o.size || 112, w = o.w || 700, h = size + 44, y = o.y || 746;
    ctx.save(); ctx.translate(480, y); const s = o.scale || 1; ctx.scale(s, s);
    roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = '#04151a'; ctx.fill();
    ctx.lineWidth = 7; ctx.strokeStyle = o.color || CY; ctx.shadowColor = o.color || CY; ctx.shadowBlur = 28; ctx.stroke(); ctx.shadowBlur = 0;
    text(ctx, label, 0, 4, { size, weight: 900, color: C.white, maxWidth: w - 60 });
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['man_technologist', 'woman_technologist', 'thinking_face', 'money_bag', 'mobile_phone', 'laptop', 'television',
      'video_camera', 'bell', 'cross_mark', 'globe_with_meridians', 'warning', 'high_voltage', 'check_mark_button']),
    draw(ctx, t) {
      background(ctx, t, { glow: 'rgba(16,84,92,0.5)' });

      // 1. ACCROCHE, complète à l'image 0
      block(ctx, t, 0, S('s03'), () => {
        const z = 1 + 0.018 * prog(t, 0, Math.max(0.1, S('s03')));
        ctx.save(); ctx.translate(480, 746); ctx.scale(z, z); ctx.translate(-480, -746);
        const j = ease.out(prog(t, S('s02'), 0.3)) * (1 - ease.in(prog(t, S('s02') + 0.3, 0.5)));
        duel(ctx, t, { hi: t >= S('s02') ? 2 : 1, jolt: j });
        spark(ctx, 745, 1115, prog(t, S('s02') + 0.05, 0.55));
        pill(ctx, 'COMBIEN ?', { scale: 1 + 0.03 * Math.sin(t * 4) });
        stamp(ctx, 'CLAC', 625, 1062, t, f('s02', 0.45), { size: 52, color: AMB, rot: 0.08 });
        ctx.restore();
      });

      // 2. La question : le gain inconnu
      block(ctx, t, S('s03'), S('s04'), () => {
        text(ctx, 'COMBIEN', 480, 430, { size: 128, weight: 900, color: C.white });
        text(ctx, 'IL GAGNE ?', 480, 570, { size: 128, weight: 900, color: CY, shadow: 'rgba(47,224,208,0.5)' });
        pop(ctx, t, S('s03') + 0.35, 480, 820, () => readout(ctx, 'GAIN PAR AN', '?? CHF', 0, 0, { w: 620, h: 220, size: 118, color: AMB, border: CY }));
        CHR.emo(ctx, 'thinking_face', 480, 1060, 170, t, f('s03', 0.65));
      });

      // 3. Promesse : le chiffre, et ce qu'il coupe
      block(ctx, t, S('s04'), S('s05'), () => {
        if (card(ctx, 90, 340, 780, 370, GREEN, { t, t0: S('s04') + 0.1 })) {
          pop(ctx, t, S('s04') + 0.1, 480, 525, () => {
            CHR.emo(ctx, 'money_bag', -240, 0, 200, t);
            text(ctx, 'LE CHIFFRE', 110, -30, { size: 66, weight: 900, color: GREEN, maxWidth: 440 });
            text(ctx, 'EN FRANCS', 110, 50, { size: 44, weight: 800, color: C.white });
          });
        }
        if (card(ctx, 90, 760, 780, 370, RED, { t, t0: f('s04', 0.5) })) {
          pop(ctx, t, f('s04', 0.5), 480, 945, () => {
            deskPhone(ctx, -240, 0, 1.5);
            text(ctx, "CE QU'IL COUPE", 110, -30, { size: 60, weight: 900, color: RED, maxWidth: 460 });
            text(ctx, 'EN DÉBRANCHANT', 110, 50, { size: 42, weight: 800, color: C.white, maxWidth: 460 });
          });
        }
      });

      // 4. La fiche : 11,9 W
      block(ctx, t, S('s05'), S('s06'), () => {
        chip(ctx, 'INTERNET-BOX 5 · FICHE SWISSCOM', 480, 340, { color: CY, size: 36, border: CY });
        const k = ease.out(prog(t, S('s05') + 0.2, 1.1));
        routerBox(ctx, 480, 605, 300, 1, t);
        readout(ctx, 'PUISSANCE', `${dec(lerp(0, 11.9, k), 1)} W`, 480, 860, { w: 560, h: 190, size: 104, color: CY, border: CY });
        const dev = [['mobile_phone', 170, 500], ['laptop', 790, 500], ['television', 170, 680]];
        dev.forEach(([n, x, y], i) => {
          const t0 = f('s05', 0.42 + i * 0.1);
          if (t >= t0) { ctx.save(); ctx.setLineDash([12, 12]); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(47,224,208,0.55)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(480, 590); ctx.stroke(); ctx.restore(); }
          CHR.emo(ctx, n, x, y, 120, t, t0, { phase: i });
        });
        chip(ctx, 'APPAREILS CONNECTÉS', 480, 1000, { color: C.white, size: 30, dot: CY, alpha: ease.out(prog(t, f('s05', 0.5), 0.25)) });
        stamp(ctx, 'SANS TRANSFERT', 480, 1115, t, f('s05', 0.68), { size: 58, color: AMB, rot: -0.03 });
      });

      // 5. Le calcul en kWh
      block(ctx, t, S('s06'), S('s07'), () => {
        const k = ease.inOut(prog(t, S('s06') + 0.1, 1.3));
        dial(ctx, 300, 440, 100, k * 8 / 12);
        text(ctx, `${Math.round(k * 8)} H`, 300, 440, { size: 62, family: F.mono, weight: 700, color: C.white, stroke: '#060b14' });
        moon(ctx, 860, 345, 40);
        text(ctx, 'PAR NUIT', 640, 420, { size: 62, weight: 900, color: C.white });
        chip(ctx, 'EXEMPLE : 8 H', 640, 500, { color: 'rgba(255,255,255,0.8)', size: 40, border: AMB });
        const toks = [['11,9 W', 190], ['× 8 h', 480], ['× 365', 770]];
        toks.forEach(([s, x], i) => pop(ctx, t, f('s06', 0.25 + i * 0.13), x, 690, () => {
          roundRect(ctx, -132, -62, 264, 124, 22); ctx.fillStyle = '#071a20'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = CY; ctx.stroke();
          text(ctx, s, 0, 4, { size: 58, family: F.mono, weight: 700, color: C.white, maxWidth: 240 });
        }));
        const kk = ease.out(prog(t, f('s06', 0.62), 0.8));
        if (t >= f('s06', 0.62)) readout(ctx, 'DE MOINS PAR AN', `${dec(lerp(0, 34.75, kk), 2)} kWh`, 480, 930, { w: 780, h: 210, size: 104, color: CY, border: CY });
        if (kk >= 1) chip(ctx, 'PRESQUE 35 kWh', 480, 1105, { color: C.white, size: 34, border: CY });
      });

      // 6. LA RÉPONSE : 9,63 CHF
      block(ctx, t, S('s07'), S('s08'), () => {
        pop(ctx, t, S('s07') + 0.05, 480, 365, () => text(ctx, '34,75 kWh × 27,7 ct', 0, 0, { size: 62, family: F.mono, weight: 700, color: C.white, maxWidth: 800 }));
        chip(ctx, 'MÉDIANE ELCOM 2026, HORS TVA', 480, 460, { color: CY, size: 36, border: CY, alpha: ease.out(prog(t, f('s07', 0.15), 0.3)) });
        const k = ease.out(prog(t, f('s07', 0.5), 1.0));
        const done = k >= 1;
        const pk = done ? 1 + 0.07 * (1 - ease.out(prog(t, f('s07', 0.5) + 1.0, 0.4))) : 1;
        ctx.save(); ctx.translate(480, 700); ctx.scale(pk, pk);
        text(ctx, dec(lerp(0, 9.63, k), 2), 0, 0, { size: 250, family: F.mono, weight: 700, color: done ? GREEN : C.white, shadow: done ? 'rgba(70,224,138,0.5)' : undefined, maxWidth: 800 });
        ctx.restore();
        text(ctx, 'CHF', 480, 880, { size: 96, weight: 900, color: C.white });
        stamp(ctx, 'PAR AN', 380, 1050, t, f('s07', 0.8), { size: 72, color: GREEN, rot: -0.05 });
        CHR.emo(ctx, 'money_bag', 700, 1050, 170, t, f('s07', 0.86));
      });

      // 7. En objets : centimes par nuit, cafés par an
      block(ctx, t, S('s08'), S('s09'), () => {
        if (card(ctx, 70, 330, 400, 590, AMB, { t, t0: S('s08') + 0.05 })) {
          pop(ctx, t, S('s08') + 0.05, 270, 625, () => {
            text(ctx, 'PAR NUIT', 0, -240, { size: 50, weight: 900, color: C.white });
            coin(ctx, 0, -60, 125, '2,64 ct', 64);
            text(ctx, 'MOINS DE', 0, 130, { size: 44, weight: 800, color: C.white });
            text(ctx, '3 CENTIMES', 0, 195, { size: 58, weight: 900, color: AMB, maxWidth: 360 });
          });
        }
        if (card(ctx, 490, 330, 400, 590, CY, { t, t0: f('s08', 0.45) })) {
          pop(ctx, t, f('s08', 0.45), 690, 625, () => {
            text(ctx, 'PAR AN', 0, -240, { size: 50, weight: 900, color: C.white });
            pop(ctx, t, f('s08', 0.55), -80, -70, () => coffee(ctx, 0, 0, 1.0));
            pop(ctx, t, f('s08', 0.7), 90, -70, () => coffee(ctx, 0, 0, 1.0));
            text(ctx, 'ENVIRON', 0, 130, { size: 44, weight: 800, color: C.white });
            text(ctx, '2 CAFÉS CRÈME', 0, 195, { size: 52, weight: 900, color: CY, maxWidth: 365 });
          });
        }
        pop(ctx, t, f('s08', 0.72), 480, 1000, () => text(ctx, '9,63 ÷ 4,65 = 2,07', 0, 0, { size: 62, family: F.mono, weight: 700, color: C.white }));
        chip(ctx, 'CAFÉ 4,65 CHF · CAFETIERSUISSE 2025', 480, 1110, { color: C.white, size: 36, padX: 20, letter: 1, alpha: ease.out(prog(t, f('s08', 0.5), 0.3)) });
      });

      // 8. 2e surprise : ce qui ne marche que routeur allumé
      block(ctx, t, S('s09'), S('s10'), () => {
        text(ctx, 'ROUTEUR ÉTEINT ?', 480, 370, { size: 88, weight: 900, color: RED, shadow: 'rgba(255,59,78,0.45)' });
        const rows = [['TÉLÉPHONE FIXE', 500, 0.2], ['ALARMES', 680, 0.36], ['CAMÉRAS', 860, 0.5]];
        rows.forEach(([lb, y, d], i) => {
          const t0 = f('s09', d);
          if (!card(ctx, 90, y - 78, 780, 156, 'rgba(255,255,255,0.22)', { t, t0 })) return;
          ctx.save(); ctx.globalAlpha *= ease.out(prog(t, t0, 0.2));
          if (i === 0) deskPhone(ctx, 185, y, 0.95);
          else CHR.emo(ctx, i === 1 ? 'bell' : 'video_camera', 185, y, 112, t, undefined, { phase: i });
          text(ctx, lb, 290, y, { size: 58, weight: 900, color: C.white, align: 'left', maxWidth: 385 });
          ctx.restore();
          stamp(ctx, 'OFF', 790, y, t, f('s09', 0.62 + i * 0.1), { size: 54, rot: -0.1 });
        });
        chip(ctx, 'UNIQUEMENT SI LE ROUTEUR EST ALLUMÉ', 480, 1025, { color: C.white, size: 36, padX: 20, letter: 1, border: RED, alpha: ease.out(prog(t, f('s09', 0.72), 0.25)) });
        chip(ctx, 'SOURCE : SWISSCOM', 480, 1115, { color: CY, size: 36, border: CY, alpha: ease.out(prog(t, f('s09', 0.82), 0.25)) });
      });

      // 9. La multiprise
      block(ctx, t, S('s10'), S('s11'), () => {
        text(ctx, 'LA MULTIPRISE ?', 480, 380, { size: 92, weight: 900, color: C.white, maxWidth: 820 });
        const k = ease.out(prog(t, S('s10') + 0.1, 0.5));
        powerStrip(ctx, lerp(1300, 480, k), 800, 720);
        routerBox(ctx, 480, 570, 260, 1, t, { waves: false });
        ctx.save(); ctx.strokeStyle = '#cfd6e4'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.setLineDash([6, 18]);
        ctx.beginPath(); ctx.moveTo(480, 645); ctx.lineTo(480, 730); ctx.stroke(); ctx.restore();
        CHR.emo(ctx, 'cross_mark', 480, 700, 190, t, f('s10', 0.42));
        stamp(ctx, 'PAS LE ROUTEUR', 480, 985, t, f('s10', 0.6), { size: 66 });
        chip(ctx, 'RECOMMANDATION DE SWISSCOM', 480, 1115, { color: CY, size: 36, padX: 18, letter: 1, border: CY, alpha: ease.out(prog(t, f('s10', 0.3), 0.3)) });
      });

      // 10. Pause du Wi-Fi
      block(ctx, t, S('s11'), S('s12'), () => {
        const on = prog(t, f('s11', 0.55), 0.35);
        pop(ctx, t, S('s11') + 0.05, 275, 730, () => phone(ctx, 0, 0, 350, 680, {
          draw: (x, y, w) => {
            text(ctx, 'MY SWISSCOM', x + w / 2, y + 110, { size: 38, weight: 900, color: C.white, maxWidth: w - 30 });
            text(ctx, 'PAUSE', x + w / 2, y + 200, { size: 54, weight: 900, color: CY });
            text(ctx, 'DU WI-FI', x + w / 2, y + 260, { size: 44, weight: 800, color: C.white });
            toggle(ctx, x + w / 2, y + 370, on, 180);
            text(ctx, '23:00', x + w / 2, y + 480, { size: 54, family: F.mono, weight: 700, color: C.white, alpha: ease.out(prog(t, f('s11', 0.68), 0.25)) });
            text(ctx, '07:00', x + w / 2, y + 548, { size: 54, family: F.mono, weight: 700, color: C.white, alpha: ease.out(prog(t, f('s11', 0.76), 0.25)) });
          }
        }));
        routerBox(ctx, 690, 620, 260, 1, t, { waves: false });
        waves(ctx, 690, 535, 110, t, 1 - on);
        moon(ctx, 830, 370, 46);
        pop(ctx, t, f('s11', 0.78), 690, 800, () => {
          text(ctx, 'WI-FI', 0, -30, { size: 66, weight: 900, color: CY });
          text(ctx, 'COUPÉ', 0, 36, { size: 66, weight: 900, color: C.white });
        });
        chip(ctx, 'SCHÉMA · HEURES : EXEMPLE', 480, 1130, { color: 'rgba(255,255,255,0.8)', size: 40, padX: 16, letter: 1, border: AMB });
        chip(ctx, 'SOURCE : SWISSCOM', 690, 965, { color: CY, size: 36, padX: 16, letter: 1, border: CY });
      });

      // 11. Internet-Box 5 Pro : mode économie
      block(ctx, t, S('s12'), S('s13'), () => {
        text(ctx, 'INTERNET-BOX 5 PRO', 480, 365, { size: 72, weight: 900, color: C.white, maxWidth: 820 });
        chip(ctx, 'MODE ÉCONOMIE', 480, 455, { color: GREEN, size: 32, dot: GREEN, border: GREEN, alpha: ease.out(prog(t, f('s12', 0.22), 0.25)) });
        const k = t >= f('s12', 0.55) ? 1 : 0;   // 15,6 W puis 0,3 W, sans valeur intermédiaire (aucune source ne les donne)
        const v = k ? 0.3 : 15.6;
        readout(ctx, k >= 1 ? 'MODE ÉCONOMIE' : 'STAND-BY', `${dec(v, 1)} W`, 480, 610, { w: 560, h: 190, size: 104, color: k >= 1 ? GREEN : C.white, border: k >= 1 ? GREEN : CY });
        // barre de puissance proportionnelle
        roundRect(ctx, 100, 730, 760, 60, 20); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
        const bw = Math.max(10, 744 * v / 15.6);
        roundRect(ctx, 108, 738, bw, 44, 14); ctx.fillStyle = k >= 1 ? GREEN : CY; ctx.fill();
        routerBox(ctx, 480, 895, 200, 0, t, { waves: false, led: k >= 1 ? GREEN : CY });
        // heures au choix
        const sk = ease.out(prog(t, f('s12', 0.72), 0.4));
        roundRect(ctx, 100, 1005, 760, 42, 21); ctx.fillStyle = '#1b2436'; ctx.fill();
        roundRect(ctx, 480 - 150 * sk, 1005, Math.max(1, 300 * sk), 42, 21); ctx.fillStyle = GREEN; ctx.fill();
        chip(ctx, 'SCHÉMA : HEURES AU CHOIX', 480, 1115, { color: 'rgba(255,255,255,0.8)', size: 40, padX: 18, border: AMB, alpha: sk });
      });

      // 12. Le prix du mode économie
      block(ctx, t, S('s13'), S('s14'), () => {
        text(ctx, 'DANS CE MODE', 480, 380, { size: 88, weight: 900, color: C.white });
        const items = [[270, 'INTERNET', S('s13') + 0.05], [690, 'APPELS', f('s13', 0.5)]];
        items.forEach(([x, lb, t0], i) => {
          if (!card(ctx, x - 190, 480, 380, 540, RED, { t, t0 })) return;
          pop(ctx, t, t0, x, 750, () => {
            if (i === 0) CHR.emo(ctx, 'globe_with_meridians', 0, -80, 220, t);
            else deskPhone(ctx, 0, -80, 1.9);
            text(ctx, lb, 0, 90, { size: 56, weight: 900, color: C.white, maxWidth: 340 });
          });
          stamp(ctx, 'NI', x, 960, t, t0 + 0.25, { size: 64, rot: -0.08 });
        });
        chip(ctx, 'SOURCE : SWISSCOM', 480, 1115, { color: CY, size: 36, border: CY });
      });

      // 13. Question pour les commentaires
      block(ctx, t, S('s14'), S('s15'), () => {
        pop(ctx, t, S('s14') + 0.05, 480, 590, () => {
          roundRect(ctx, -400, -240, 800, 480, 50); ctx.fillStyle = 'rgba(47,224,208,0.13)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = CY; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-240, 235); ctx.lineTo(-300, 330); ctx.lineTo(-120, 235); ctx.closePath(); ctx.fillStyle = '#123a3d'; ctx.fill(); ctx.stroke();
          text(ctx, "QU'EST-CE QUI", 0, -150, { size: 74, weight: 900, color: C.white });
          text(ctx, "S'ARRÊTERAIT", 0, -55, { size: 88, weight: 900, color: CY, maxWidth: 740 });
          text(ctx, 'CHEZ TOI ?', 0, 45, { size: 74, weight: 900, color: C.white });
          text(ctx, 'en commentaire', 0, 150, { size: 46, weight: 700, color: C.fg });
        });
        const tags = [['ALARME ?', 330, 0.3], ['TÉLÉPHONE ?', 620, 0.5], ['CAMÉRA ?', 400, 0.7]];
        tags.forEach(([lb, x, d], i) => pop(ctx, t, f('s14', d), x, i === 2 ? 1120 : 990, () => chip(ctx, lb, 0, 0, { color: C.white, size: 34, border: AMB, padX: 22 })));
        CHR.emo(ctx, 'thinking_face', 730, 1110, 150, t, f('s14', 0.8));
      });

      // 14. Retour au duel, avec la réponse
      block(ctx, t, S('s15'), S('s16'), () => {
        duel(ctx, t, {
          hi: 2,
          bottom: () => {
            pop(ctx, t, f('s15', 0.5), 570, 930, () => {
              deskPhone(ctx, 0, 0, 0.72);
              ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-46, -44); ctx.lineTo(46, 44); ctx.stroke(); ctx.restore();
              text(ctx, 'PLUS DE', 175, -55, { size: 38, weight: 800, color: C.white });
              text(ctx, 'TÉLÉPHONE', 175, -8, { size: 38, weight: 900, color: RED });
              text(ctx, 'FIXE LA NUIT', 175, 39, { size: 38, weight: 900, color: RED, maxWidth: 240 });
            });
          }
        });
        pop(ctx, t, S('s15') + 0.08, 0, 0, () => pill(ctx, '+ 9,63 CHF / AN', { size: 92, w: 780, color: GREEN }));
      });

      // 15. Abonne-toi
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'CE SOIR', next: ['ton micro-ondes balance', 'pourquoi le centre reste froid'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
