// Jour 60 — « Charge rapide : ça abîme la batterie ? » (format V, suite du jour 55)
// Accent propre au sujet : cyan électrique (la charge) contre orange (la chaleur). Aucun chiffre hors facts.md.
// Tout le timing passe par S()/E() et des fractions de phrase : la vraie voix aura d'autres durées.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, phone, followCTA, readout } = ENG;
  const END = E('s16') + 0.6;
  const VOLT = '#3fe0ff', HOT = '#ff7a3c', COOL = '#5aa9ff', RED = C.red2, GREEN = C.green, SOFT = 'rgba(255,255,255,0.86)', GOLDISH = C.gold2;
  const f = (id, a) => S(id) + a * (E(id) - S(id));

  // ---------- briques (copiées et adaptées du jour 55) ----------
  function stamp(ctx, label, x, y, t, t0, o = {}) {
    const k = ease.back(prog(t, t0, 0.32));
    if (k <= 0.001) return;
    const size = o.size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.05); ctx.scale(lerp(1.5, 1, k), lerp(1.5, 1, k));
    ctx.globalAlpha *= clamp(k * 2.5);
    ctx.font = `900 ${size}px InterDisplay`; const w = ctx.measureText(label).width + 56, h = size + 34;
    roundRect(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = 'rgba(3,4,8,0.82)'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = o.color || RED; ctx.stroke();
    text(ctx, label, 0, 2, { size, weight: 900, color: o.color || RED });
    ctx.restore();
  }
  function battery(ctx, x, y, w, level, o = {}) {
    const h = w * 0.46;
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -w / 2, -h / 2, w, h, h * 0.22); ctx.fillStyle = '#060b14'; ctx.fill();
    ctx.lineWidth = Math.max(5, w * 0.03); ctx.strokeStyle = o.border || C.fg; ctx.stroke();
    roundRect(ctx, w / 2 + 4, -h * 0.18, w * 0.06, h * 0.36, 6); ctx.fillStyle = o.border || C.fg; ctx.fill();
    const m = w * 0.05, iw = (w - 2 * m) * clamp(level);
    if (iw > 2) { roundRect(ctx, -w / 2 + m, -h / 2 + m, iw, h - 2 * m, Math.min(h * 0.14, iw / 2)); ctx.fillStyle = o.color || VOLT; ctx.fill(); }
    if (o.label !== false) text(ctx, o.label || `${Math.round(level * 100)} %`, 0, 4, { size: o.size || w * 0.24, family: F.mono, weight: 700, color: C.white, stroke: 'rgba(0,0,0,0.7)' });
    ctx.restore();
  }
  function bolt(ctx, x, y, s, color, glow = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(12, -50); ctx.lineTo(-26, 8); ctx.lineTo(-2, 8); ctx.lineTo(-12, 50); ctx.lineTo(28, -12); ctx.lineTo(4, -12); ctx.closePath();
    ctx.shadowColor = color; ctx.shadowBlur = 26 * glow; ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }
  // bloc secteur générique, sans marque
  function charger(ctx, x, y, label, o = {}) {
    const w = o.w || 170, h = o.h || 130, col = o.color || VOLT;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    ctx.fillStyle = '#aab3c5'; ctx.fillRect(-w * 0.2, -h / 2 - 26, 14, 30); ctx.fillRect(w * 0.2 - 14, -h / 2 - 26, 14, 30);
    roundRect(ctx, -w / 2, -h / 2, w, h, 20); ctx.fillStyle = o.fill || '#e9edf5'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = col; ctx.stroke();
    text(ctx, label, 0, 4, { size: o.size || 50, family: F.mono, weight: 700, color: o.ink || '#07101d', maxWidth: w - 20 });
    ctx.restore();
  }
  function wire(ctx, x0, y0, x1, y1, t, color, on = true) {
    ctx.save(); ctx.strokeStyle = '#cfd6e4'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, y0 + 56, x1, y1 - 56, x1, y1); ctx.stroke();
    if (on) {
      for (let i = 0; i < 3; i++) {
        const k = (t * 1.3 + i / 3) % 1, u = 1 - k;
        const X = u * u * u * x0 + 3 * u * u * k * x0 + 3 * u * k * k * x1 + k * k * k * x1;
        const Y = u * u * u * y0 + 3 * u * u * k * (y0 + 56) + 3 * u * k * k * (y1 - 56) + k * k * k * y1;
        ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(X, Y, 8, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }
  function thermometer(ctx, x, y, h, frac, color) {
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -34, -h, 68, h + 20, 34); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.fg; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 40, 58, 0, Math.PI * 2); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 40, 44, 0, Math.PI * 2); ctx.fill();
    const fh = (h - 30) * clamp(frac);
    roundRect(ctx, -18, 10 - fh, 36, fh + 20, 18); ctx.fill();
    ctx.restore();
  }
  function heatWaves(ctx, x, y, t, n = 3, gap = 70, color = '232,110,50') {
    for (let j = 0; j < n; j++) {
      const ph = (t * 1.3 + j * 0.33) % 1, X = x + (j - (n - 1) / 2) * gap, Y = y - ph * 60;
      ctx.save(); ctx.strokeStyle = `rgba(${color},${1 - ph})`; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(X, Y); ctx.bezierCurveTo(X - 22, Y - 20, X + 22, Y - 40, X, Y - 60); ctx.stroke(); ctx.restore();
    }
  }
  function paper(ctx, x, y, w, h, title, k, color) {
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    roundRect(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = '#0b1220'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = color; ctx.stroke();
    text(ctx, title, 0, -h / 2 + 62, { size: 56, weight: 900, color: C.white, maxWidth: w - 40 });
    ctx.fillStyle = 'rgba(142,154,179,0.55)';
    for (let i = 0; i < 5; i++) { const lw = (w - 70) * (i === 4 ? 0.55 : 1 - i * 0.06); roundRect(ctx, -w / 2 + 35, -h / 2 + 124 + i * 44, lw, 16, 8); ctx.fill(); }
    ctx.restore();
  }
  function swissFlag(ctx, x, y, s) {
    roundRect(ctx, x - s / 2, y - s / 2, s, s, s * 0.08); ctx.fillStyle = '#d52b1e'; ctx.fill();
    ctx.fillStyle = '#fff'; const a = s * 0.62, b = s * 0.2;
    ctx.fillRect(x - a / 2, y - b / 2, a, b); ctx.fillRect(x - b / 2, y - a / 2, b, a);
  }
  function clock(ctx, x, y, r, ang, color) {
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.fg; ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.fillStyle = C.muted; ctx.fillRect(Math.cos(a) * r * 0.8 - 3, Math.sin(a) * r * 0.8 - 3, 6, 6); }
    ctx.lineCap = 'round'; ctx.strokeStyle = C.white; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang / 12) * r * 0.46, Math.sin(ang / 12) * r * 0.46); ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang) * r * 0.72, Math.sin(ang) * r * 0.72); ctx.stroke();
    ctx.restore();
  }
  // le duel : même image à l'ouverture et avant la fin
  function duel(ctx, t, o = {}) {
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(63,224,255,0.4)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(520, 500); ctx.lineTo(520, 1130); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 275, 510, { color: C.white, size: 36, border: VOLT });
    chip(ctx, 'TON COLLÈGUE', 760, 510, { color: C.white, size: 32, border: 'rgba(255,255,255,0.5)' });
    CHR.emo(ctx, 'woman_technologist', 150, 650, 190, t, undefined, { phase: 0.3 });
    CHR.emo(ctx, 'man_technologist', 635, 650, 190, t, undefined, { phase: 1.4 });
    wire(ctx, 370, 690, 275, 800, t * 1.8, VOLT);
    wire(ctx, 840, 690, 760, 800, t * 0.45, '#9aa6bd');
    charger(ctx, 370, 625, '45 W', { w: 186, h: 124, size: 62, color: VOLT });
    charger(ctx, 840, 625, 'VIEUX', { w: 176, h: 124, size: 38, fill: '#8d94a3', color: '#59606e' });
    phone(ctx, 275, 955, 176, 310, { border: VOLT, draw: (x, y, w, h) => {
      battery(ctx, x + w / 2, y + h / 2 + 40, w * 0.8, o.left ?? 0.5, { label: false, color: VOLT });
      bolt(ctx, x + w / 2, y + h / 2 - 54, 0.8, VOLT);
    } });
    phone(ctx, 760, 955, 176, 310, { draw: (x, y, w, h) => {
      battery(ctx, x + w / 2, y + h / 2 + 40, w * 0.8, o.right ?? 0.5, { label: false, color: '#9aa6bd' });
      text(ctx, o.rightMark || '?', x + w / 2, y + h / 2 - 54, { size: 68, weight: 900, color: C.white });
    } });
  }

  // courbe de charge schématique : u 0..1 -> niveau 0..1 (rapide jusqu'à 80 %, puis plus lent)
  const chargeCurve = u => (u < 0.42 ? (u / 0.42) * 0.8 : 0.8 + 0.2 * Math.sin(((u - 0.42) / 0.58) * Math.PI / 2));

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['man_technologist', 'woman_technologist', 'thinking_face', 'magnifying_glass_tilted_left', 'cross_mark',
      'check_mark_button', 'thermometer', 'fire', 'hourglass_done', 'money_bag', 'droplet', 'high_voltage', 'warning', 'electric_plug', 'red_question_mark', 'eyes']),
    draw(ctx, t) {
      background(ctx, t, { glow: 'rgba(20,70,96,0.5)' });

      // 1. ACCROCHE, complète à l'image 0 : duel et question
      block(ctx, t, 0, S('s03'), () => {
        const z = 1 + 0.035 * ease.out(prog(t, 0, 3));
        ctx.save(); ctx.translate(520, 390); ctx.scale(z, z);
        text(ctx, '45 W', -100, 0, { size: 150, family: F.mono, weight: 700, color: VOLT, shadow: 'rgba(63,224,255,0.55)', shadowBlur: 34 });
        text(ctx, '?', 215, 0, { size: 150, weight: 900, color: RED });
        ctx.restore();
        const lift = ease.inOut(prog(t, f('s01', 0.3), 1.8));
        duel(ctx, t, { left: lerp(0.32, 0.8, lift), right: lerp(0.32, 0.5, lift) });
        bolt(ctx, 275 + 90, 800, 0.5 + 0.08 * Math.sin(t * 9), VOLT);
        text(ctx, 'LEQUEL L\'ABÎME LE PLUS ?', 520, 1188, { size: 54, weight: 900, color: C.white, maxWidth: 820 });
        stamp(ctx, 'VIEUX CHARGEUR', 735, 1075, t, f('s02', 0.35), { size: 34, color: '#d7dde9', rot: 0.03 });
      });

      // 2. Lequel des deux l'abîme le plus ?
      block(ctx, t, S('s03'), S('s04'), () => {
        text(ctx, 'LEQUEL L\'ABÎME', 520, 390, { size: 96, weight: 900, color: C.white, maxWidth: 840 });
        text(ctx, 'LE PLUS ?', 520, 495, { size: 96, weight: 900, color: RED });
        charger(ctx, 275, 660, '45 W', { w: 230, h: 130, size: 70, color: VOLT });
        charger(ctx, 760, 660, 'VIEUX', { w: 230, h: 130, size: 54, fill: '#8d94a3', color: '#59606e' });
        wire(ctx, 275, 725, 275, 790, t * 1.8, VOLT);
        wire(ctx, 760, 725, 760, 790, t * 0.45, '#9aa6bd');
        const k = ease.out(prog(t, f('s03', 0.25), 0.3));
        battery(ctx, 275, 870, 290, 0.5, { label: k > 0.5 ? '?' : false, color: '#31405c', size: 78 });
        battery(ctx, 760, 870, 290, 0.5, { label: k > 0.5 ? '?' : false, color: '#31405c', size: 78 });
        text(ctx, 'TOI', 275, 1010, { size: 44, weight: 800, color: SOFT });
        text(ctx, 'TON COLLÈGUE', 760, 1010, { size: 44, weight: 800, color: SOFT });
        CHR.emo(ctx, 'thinking_face', 520, 1125, 150, t, f('s03', 0.45));
      });

      // 3. Promesse : les deux fiches
      block(ctx, t, S('s04'), S('s05'), () => {
        text(ctx, 'CE QU\'ILS ÉCRIVENT', 520, 400, { size: 80, weight: 900, color: C.white, maxWidth: 820 });
        const k1 = ease.back(prog(t, f('s04', 0.05), 0.35)), k2 = ease.back(prog(t, f('s04', 0.22), 0.35));
        if (k1 > 0) paper(ctx, 285, 760, 400, 500, 'APPLE', Math.max(0.01, k1), VOLT);
        if (k2 > 0) paper(ctx, 745, 760, 330, 500, 'SAMSUNG', Math.max(0.01, k2), HOT);
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 520, 1110, 190, t, f('s04', 0.5));
      });

      // 4. Deux temps : rapide jusqu'à 80 %, puis plus lent
      block(ctx, t, S('s05'), S('s06'), () => {
        const x0 = 140, x1 = 880, yb = 950, yt = 560;
        const lt = prog(t, f('s05', 0.05), 0.88 * (E('s05') - S('s05')));
        const fast = lt < 0.42;
        readout(ctx, 'BATTERIE', `${Math.round(chargeCurve(lt) * 100)} %`, 235, 395, { w: 350, h: 150, size: 72, labelSize: 30, border: VOLT, color: VOLT });
        chip(ctx, fast ? 'TEMPS 1 : RAPIDE' : 'TEMPS 2 : PLUS LENT', 660, 395, { color: fast ? VOLT : HOT, size: 30, border: fast ? VOLT : HOT, padX: 18 });
        ctx.save(); ctx.strokeStyle = C.line; ctx.lineWidth = 3;
        [0, 0.8, 1].forEach(v => { const y = lerp(yb, yt, v); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); });
        ctx.restore();
        text(ctx, '80 %', x0, lerp(yb, yt, 0.8) - 30, { size: 40, family: F.mono, weight: 700, color: VOLT, align: 'left' });
        text(ctx, '100 %', x0, yt - 30, { size: 36, family: F.mono, weight: 700, color: C.muted, align: 'left' });
        ctx.save(); ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const n = 90; let split = Math.min(lt, 0.42);
        ctx.strokeStyle = VOLT; ctx.shadowColor = VOLT; ctx.shadowBlur = 20; ctx.beginPath();
        for (let i = 0; i <= n; i++) { const u = split * i / n, X = lerp(x0, x1, u), Y = lerp(yb, yt, chargeCurve(u)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke();
        if (lt > 0.42) {
          ctx.strokeStyle = HOT; ctx.shadowColor = HOT; ctx.beginPath();
          for (let i = 0; i <= n; i++) { const u = lerp(0.42, lt, i / n), X = lerp(x0, x1, u), Y = lerp(yb, yt, chargeCurve(u)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
          ctx.stroke();
        }
        ctx.restore();
        const hx = lerp(x0, x1, lt), hy = lerp(yb, yt, chargeCurve(lt));
        bolt(ctx, hx, hy, 0.62, C.white);
        text(ctx, 'TEMPS DE CHARGE →', x1, yb + 44, { size: 36, family: F.mono, weight: 700, color: C.muted, align: 'right' });
        chip(ctx, 'SCHÉMA : COMPTEUR', 340, 1060, { color: 'rgba(255,255,255,0.8)', size: 40 });
        chip(ctx, 'SOURCE : APPLE', 340, 1148, { color: C.white, size: 36, border: VOLT });
      });

      // 5. Selon Apple, ce mélange prolonge la durée de vie
      block(ctx, t, S('s06'), S('s07'), () => {
        chip(ctx, 'APPLE ÉCRIT', 520, 410, { color: VOLT, size: 38, border: VOLT });
        const k = ease.out(prog(t, f('s06', 0.05), 0.3));
        text(ctx, '« ça prolonge aussi', 500, 540, { size: 74, weight: 800, color: C.white, alpha: k, maxWidth: 800 });
        text(ctx, 'la durée de vie »', 500, 630, { size: 74, weight: 800, color: VOLT, alpha: k, maxWidth: 800 });
        text(ctx, 'traduit de l\'anglais', 500, 715, { size: 40, weight: 700, color: SOFT, alpha: k });
        stamp(ctx, 'SELON APPLE', 500, 860, t, f('s06', 0.25), { size: 66, color: VOLT });
        chip(ctx, 'SANS COMPARAISON AVEC UN AUTRE CHARGEUR', 495, 1030, { color: HOT, size: 36, letter: 0, padX: 20, border: HOT, alpha: ease.out(prog(t, f('s06', 0.55), 0.25)) });
      });

      // 6. Charger chauffe la batterie
      block(ctx, t, S('s07'), S('s08'), () => {
        const k = ease.inOut(prog(t, f('s07', 0.08), 0.5 * (E('s07') - S('s07'))));
        thermometer(ctx, 195, 930, 460, lerp(0.15, 0.85, k), k > 0.6 ? HOT : VOLT);
        battery(ctx, 610, 560, 400, 0.6, { label: false, color: lerp(0, 1, k) > 0.5 ? HOT : VOLT });
        bolt(ctx, 610, 560, 1.1, C.white);
        if (k > 0.2) heatWaves(ctx, 610, 450, t, 3, 110);
        text(ctx, 'ÇA CHAUFFE EN CHARGEANT', 575, 740, { size: 50, weight: 900, color: C.white, maxWidth: 620, alpha: ease.out(prog(t, f('s07', 0.2), 0.3)) });
        stamp(ctx, 'PEUT RÉDUIRE', 580, 880, t, f('s07', 0.55), { size: 60, color: HOT });
        text(ctx, 'SA DURÉE DE VIE', 580, 985, { size: 56, weight: 900, color: HOT, alpha: ease.out(prog(t, f('s07', 0.65), 0.3)) });
        chip(ctx, 'SCHÉMA', 200, 1140, { color: 'rgba(255,255,255,0.8)', size: 40 });
        chip(ctx, 'SOURCE : APPLE', 580, 1140, { color: C.white, size: 36, border: HOT });
      });

      // 7. Le courant baisse en fin de charge
      block(ctx, t, S('s08'), S('s09'), () => {
        text(ctx, 'COURANT', 520, 395, { size: 86, weight: 900, color: C.white });
        const lt = prog(t, f('s08', 0.05), 0.85 * (E('s08') - S('s08')));
        const bars = 8, x0 = 150, gap = 92, yb = 960;
        for (let i = 0; i < bars; i++) {
          const pop = clamp((lt * bars - i) * 1.2); if (pop <= 0) continue;
          const v = i < 4 ? 1 : 1 - (i - 3) * 0.17, h = 400 * v * ease.out(pop);
          roundRect(ctx, x0 + i * gap, yb - h, 66, h, 14); ctx.fillStyle = i < 4 ? VOLT : COOL; ctx.fill();
        }
        ctx.fillStyle = C.line; ctx.fillRect(130, yb + 8, 780, 5);
        text(ctx, 'EN FIN DE CHARGE →', 890, yb + 56, { size: 40, family: F.mono, weight: 700, color: SOFT, align: 'right' });
        chip(ctx, 'SCHÉMA', 170, 1110, { color: 'rgba(255,255,255,0.8)', size: 40 });
        chip(ctx, 'iPHONE · SOURCE : APPLE', 615, 1110, { color: C.white, size: 36, border: COOL });
        CHR.emo(ctx, 'thermometer', 800, 480, 120, t, f('s08', 0.6));
      });

      // 8. RÉPONSE AU MILIEU : pas de chiffre
      block(ctx, t, S('s09'), S('s10'), () => {
        text(ctx, 'LE GAGNANT ?', 520, 400, { size: 104, weight: 900, color: C.white });
        const a = ease.back(prog(t, f('s09', 0.04), 0.3)), b = ease.back(prog(t, f('s09', 0.2), 0.3));
        [[275, 'APPLE', a, VOLT], [725, 'SAMSUNG', b, HOT]].forEach(([x, name, k, col]) => {
          if (k <= 0.001) return;
          ctx.save(); ctx.translate(x, 660); ctx.scale(k, k);
          roundRect(ctx, -180, -130, 360, 260, 28); ctx.fillStyle = '#0b1220'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = col; ctx.stroke();
          text(ctx, name, 0, -70, { size: 50, weight: 900, color: C.white, maxWidth: 320 });
          text(ctx, '? %', 0, 40, { size: 96, family: F.mono, weight: 700, color: col });
          ctx.restore();
        });
        stamp(ctx, 'AUCUN CHIFFRE', 520, 900, t, f('s09', 0.45), { size: 84 });
        chip(ctx, 'SUR LES FICHES LUES', 520, 1060, { color: C.white, size: 36, alpha: ease.out(prog(t, f('s09', 0.6), 0.25)) });
        CHR.emo(ctx, 'woman_technologist', 140, 1150, 130, t, f('s09', 0.7), { phase: 0.3 });
        CHR.emo(ctx, 'man_technologist', 830, 1150, 130, t, f('s09', 0.7), { phase: 1.4 });
      });

      // 9. Samsung Suisse : pas de jeu ni de vidéo en chargeant
      block(ctx, t, S('s10'), S('s11'), () => {
        swissFlag(ctx, 150, 400, 90);
        text(ctx, 'SAMSUNG SUISSE', 210, 400, { size: 74, weight: 900, color: C.white, align: 'left', maxWidth: 690 });
        const cards = [[275, 'JOUER', f('s10', 0.08)], [725, 'VIDÉOS', f('s10', 0.28)]];
        cards.forEach(([x, lb, d], i) => {
          const k = ease.back(prog(t, d, 0.3)); if (k <= 0.001) return;
          ctx.save(); ctx.translate(x, 760); ctx.scale(k, k);
          roundRect(ctx, -195, -270, 390, 540, 32); ctx.fillStyle = '#0b1220'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = HOT; ctx.stroke();
          phone(ctx, 0, -50, 190, 340, { draw: (x0, y0, w, h) => {
            const cx = x0 + w / 2, cy = y0 + h / 2;
            if (i === 0) { // manette schématique
              roundRect(ctx, cx - 64, cy - 32, 128, 64, 30); ctx.fillStyle = C.fg; ctx.fill();
              ctx.fillStyle = '#0b1220'; ctx.fillRect(cx - 44, cy - 5, 34, 10); ctx.fillRect(cx - 32, cy - 17, 10, 34);
              ctx.beginPath(); ctx.arc(cx + 34, cy - 8, 8, 0, 7); ctx.arc(cx + 22, cy + 10, 8, 0, 7); ctx.fill();
            } else { // lecture
              ctx.fillStyle = C.fg; ctx.beginPath(); ctx.moveTo(cx - 28, cy - 40); ctx.lineTo(cx + 44, cy); ctx.lineTo(cx - 28, cy + 40); ctx.closePath(); ctx.fill();
            }
          } });
          text(ctx, lb, 0, 190, { size: 56, weight: 900, color: C.white });
          ctx.restore();
          CHR.emo(ctx, 'cross_mark', x + 120, 560, 130, t, d + 0.3);
        });
        chip(ctx, 'ÉVITE SURTOUT, EN CHARGEANT', 520, 1100, { color: HOT, size: 30, border: HOT, alpha: ease.out(prog(t, f('s10', 0.7), 0.25)) });
      });

      // 10. Vieillit plus vite
      block(ctx, t, S('s11'), S('s12'), () => {
        const lt = prog(t, S('s11'), E('s11') - S('s11'));
        clock(ctx, 240, 590, 165, -Math.PI / 2 + lt * lt * 26, HOT);
        battery(ctx, 660, 590, 370, lerp(0.95, 0.5, ease.inOut(lt)), { label: false, color: HOT });
        chip(ctx, 'SCHÉMA', 660, 745, { color: 'rgba(255,255,255,0.8)', size: 40 });
        stamp(ctx, 'VIEILLIT PLUS VITE', 520, 890, t, f('s11', 0.3), { size: 74, color: HOT });
        text(ctx, '« qu\'on le voudrait »', 520, 1030, { size: 56, weight: 800, color: C.white, alpha: ease.out(prog(t, f('s11', 0.6), 0.25)) });
        chip(ctx, 'SOURCE : SAMSUNG SUISSE', 520, 1140, { color: C.white, size: 36, border: HOT, alpha: ease.out(prog(t, f('s11', 0.7), 0.2)) });
      });

      // 11. La facture : calcul exact (facts.md)
      block(ctx, t, S('s12'), S('s13'), () => {
        text(ctx, 'CÔTÉ FACTURE', 455, 390, { size: 84, weight: 900, color: C.white });
        const rows = [['1 h × 45 W', '= 0,045 kWh', 0.03], ['× 27,7 ct./kWh', '= 1,25 ct.', 0.22]];
        rows.forEach(([a, b, d], i) => {
          const k = ease.back(prog(t, f('s12', d), 0.3)); if (k <= 0.001) return;
          ctx.save(); ctx.translate(490, 540 + i * 150); ctx.scale(k, k);
          roundRect(ctx, -410, -62, 820, 124, 24); ctx.fillStyle = '#060b14'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = VOLT; ctx.stroke();
          text(ctx, a, -385, 2, { size: 46, family: F.mono, weight: 700, color: C.white, align: 'left', maxWidth: 400 });
          text(ctx, b, 385, 2, { size: 46, family: F.mono, weight: 700, color: VOLT, align: 'right', maxWidth: 340 });
          ctx.restore();
        });
        stamp(ctx, 'MOINS DE 2 CENTIMES', 490, 870, t, f('s12', 0.45), { size: 70, color: VOLT });
        CHR.emo(ctx, 'money_bag', 860, 390, 110, t, f('s12', 0.6));
        chip(ctx, 'EXEMPLE : PLAFOND THÉORIQUE', 490, 990, { color: GOLDISH, size: 40, border: GOLDISH, alpha: ease.out(prog(t, f('s12', 0.6), 0.2)) });
        chip(ctx, 'ELCOM 2026 · HORS TVA', 490, 1095, { color: C.white, size: 36, letter: 1, alpha: ease.out(prog(t, f('s12', 0.72), 0.2)) });
      });

      // 12. Trop chaud : limite après 80 %, mets-le au frais
      block(ctx, t, S('s13'), S('s14'), () => {
        const hot = 1 - ease.inOut(prog(t, f('s13', 0.62), 0.25 * (E('s13') - S('s13'))));
        const lvl = 0.8;
        text(ctx, hot > 0.5 ? 'TROP CHAUD' : 'AU FRAIS', 520, 395, { size: 104, weight: 900, color: hot > 0.5 ? HOT : COOL });
        // zone fraîche
        const zk = 1 - hot;
        ctx.save(); ctx.globalAlpha *= zk; roundRect(ctx, 490, 490, 410, 470, 34); ctx.fillStyle = 'rgba(90,169,255,0.18)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = COOL; ctx.stroke(); ctx.restore();
        const px = lerp(280, 695, 1 - hot);
        phone(ctx, px, 730, 200, 360, { border: hot > 0.5 ? HOT : COOL, draw: (x, y, w, h) => battery(ctx, x + w / 2, y + h / 2, w * 0.82, lvl, { size: 42, color: hot > 0.5 ? HOT : COOL }) });
        if (hot > 0.3) heatWaves(ctx, px, 520, t, 3, 62);
        charger(ctx, px + 150 * (px < 500 ? 1 : -0.98), 880, '', { w: 90, h: 76, color: '#59606e' });
        stamp(ctx, 'LIMITE APRÈS 80 %', 500, 1040, t, f('s13', 0.3), { size: 56, color: HOT });
        chip(ctx, 'iPHONE · SOURCE : APPLE', 500, 1150, { color: C.white, size: 36, border: HOT });
      });

      // 13. Question : combien de watts ?
      block(ctx, t, S('s14'), S('s15'), () => {
        const z = lerp(0.8, 1.06, ease.out(prog(t, S('s14'), E('s14') - S('s14'))));
        ctx.save(); ctx.translate(500, 700); ctx.scale(z, z);
        charger(ctx, 0, 0, '', { w: 560, h: 390, color: VOLT });
        const pulse = 1 + 0.05 * Math.sin((t - S('s14')) * 7);
        text(ctx, '?? W', 0, 0, { size: 170 * pulse, family: F.mono, weight: 700, color: '#07101d' });
        ctx.restore();
        const k = ease.back(prog(t, f('s14', 0.45), 0.3));
        ctx.save(); ctx.translate(500, 1090); ctx.scale(Math.max(0.01, k), Math.max(0.01, k));
        roundRect(ctx, -390, -68, 780, 136, 40); ctx.fillStyle = 'rgba(63,224,255,0.14)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = VOLT; ctx.stroke();
        text(ctx, 'ÉCRIS-LE EN COMMENTAIRE', 0, 4, { size: 54, weight: 900, color: C.white, maxWidth: 730 });
        ctx.restore();
      });

      // 14. Retour au duel
      block(ctx, t, S('s15'), S('s16'), () => {
        text(ctx, 'TOI OU LUI ?', 520, 400, { size: 110, weight: 900, color: C.white });
        duel(ctx, t, { left: 0.8, right: 0.8, rightMark: '?' });
        const k = ease.out(prog(t, f('s15', 0.35), 0.3));
        ctx.save(); ctx.globalAlpha *= k; roundRect(ctx, 130, 1120, 780, 96, 26); ctx.fillStyle = 'rgba(3,4,8,0.9)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = GREEN; ctx.stroke(); ctx.restore();
        text(ctx, 'TÉLÉPHONE TRANQUILLE EN CHARGE', 520, 1169, { size: 40, weight: 900, color: C.white, alpha: k, maxWidth: 730 });
        CHR.emo(ctx, 'check_mark_button', 355, 1040, 110, t, f('s15', 0.6));
        CHR.emo(ctx, 'check_mark_button', 840, 1040, 110, t, f('s15', 0.6));
      });

      // 15. Abonne-toi
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'CE SOIR', next: ['ton frigo balance', 's\'il est réglé trop froid'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
