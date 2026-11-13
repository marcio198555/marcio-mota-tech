// Vidéo 42 — téléphone 200 Mpx : par défaut 12,5 Mpx (Xiaomi). Chiffres : days/day42/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect, phone } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment } = KIT;
  const END = E('s13') + 0.6;
  // dos de téléphone avec gros module photo
  function backCam(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -170, -330, 340, 660, 50); ctx.fillStyle = '#1b2333'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#3a4762'; ctx.stroke();
    roundRect(ctx, -130, -290, 260, 260, 60); ctx.fillStyle = '#0c111b'; ctx.fill();
    [[-55, -215, 52], [55, -215, 40], [-55, -105, 40]].forEach(([cx, cy, r], i) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 2, cx, cy, r); g.addColorStop(0, '#5b6f9a'); g.addColorStop(0.5, '#141b2b'); g.addColorStop(1, '#05070c'); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#8894ad'; ctx.stroke(); });
    ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(55, -105, 14 + 3 * Math.sin(t * 5), 0, 7); ctx.fill();
    ctx.restore();
  }
  // grille de pixels : n×n qui se regroupent (k 0 → 1)
  function grid(ctx, x, y, size, n, k, t) {
    const c = size / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const gi = Math.floor(i / 4), gj = Math.floor(j / 4), hue = (gi * 2 + gj) % 4;
      const col = ['#e04848', '#48c048', '#4878e0', '#48c048'][(i + j) % 2 ? 1 : (i % 2 ? 2 : 0)];
      const gcol = ['#d8a040', '#58b0d0', '#9070d8', '#60c080'][hue];
      const gap = lerp(3, 0, k);
      ctx.fillStyle = k > 0.5 ? gcol : col; ctx.globalAlpha = 1;
      ctx.fillRect(x + i * c + gap, y + j * c + gap, c - 2 * gap, c - 2 * gap);
    }
    if (k > 0.5) { ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 6; for (let g = 0; g <= n / 4; g++) { ctx.beginPath(); ctx.moveTo(x + g * c * 4, y); ctx.lineTo(x + g * c * 4, y + size); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y + g * c * 4); ctx.lineTo(x + size, y + g * c * 4); ctx.stroke(); } }
  }
  function settings(ctx, x, y, w, h, sel) {
    ctx.fillStyle = '#0d1422'; ctx.fillRect(x, y, w, h);
    text(ctx, 'Résolution', x + w / 2, y + 70, { size: 40, weight: 800, color: WHITE });
    ['12,5 Mpx', 'Ultra HD · 200 Mpx'].forEach((l, i) => { const yy = y + 170 + i * 120; roundRect(ctx, x + 30, yy - 45, w - 60, 90, 20); ctx.fillStyle = i === sel ? 'rgba(88,214,141,0.25)' : 'rgba(255,255,255,0.06)'; ctx.fill();
      text(ctx, l, x + w / 2, yy, { size: 38, weight: 800, color: i === sel ? GREEN : C.muted, maxWidth: w - 80 }); });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['camera', 'magnifying_glass_tilted_left', 'gear', 'eyes', 'thinking_face']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => {
        backCam(ctx, 300, 820, 1 + 0.02 * Math.sin(t * 2), t);
        big(ctx, '200', 720, 640, t, undefined, { size: 190, color: GOLD });
        big(ctx, 'Mpx', 720, 790, t, undefined, { size: 110, color: GOLD });
        big(ctx, '?', 720, 990, t, undefined, { size: 190, color: RED });
        head(ctx, 'TES PHOTOS ?', 380, t, undefined, { size: 60, color: GOLD });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        tag(ctx, 'XIAOMI · REDMI NOTE 12 PRO+ · PAR DÉFAUT', 500, 560, t, f('s02', 0.2), { size: 34, color: GOLD });
        big(ctx, '12,5 Mpx', 500, 780, t, f('s02', 0.45), { size: 160, color: GREEN });
        big(ctx, '≠ 200', 500, 990, t, f('s02', 0.6), { size: 110, color: RED });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        phone(ctx, 500, 760, 380, 700, { draw: (x, y, w, h) => settings(ctx, x, y, w, h, prog(t, f('s03', 0.5), 0.01) > 0 ? 1 : 0) });
        tag(ctx, 'MODE ULTRA HD · À ACTIVER', 500, 330, t, S('s03'), { size: 40, color: GOLD });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        line(ctx, 'LE CAPTEUR', 500, 380, t, S('s04'), { size: 70, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'REGROUPE SES PIXELS', 500, 470, t, S('s04') + 0.15, { size: 64, weight: 900, dx: 0 });
        grid(ctx, 260, 560, 480, 8, ease.inOut(prog(t, f('s04', 0.4), 0.6)), t);
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'REDMI NOTE 15 PRO · FICHE XIAOMI', 500, 360, t, S('s05'), { size: 38, color: GOLD });
        grid(ctx, 340, 450, 320, 4, ease.inOut(prog(t, f('s05', 0.3), 0.6)), t);
        big(ctx, '16 EN 1', 500, 940, t, f('s05', 0.5), { size: 150, color: CYAN });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        calc(ctx, ['200 Mpx', '÷ 16', '= 12,5 Mpx'], 500, 520, t, [S('s06') + 0.05, f('s06', 0.35), f('s06', 0.6)], { lastSize: 150, color: GREEN });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        const k = ease.out(prog(t, f('s07', 0.3), 0.6));
        pop(ctx, t, S('s07'), 300, 700, () => { ctx.fillStyle = '#4878e0'; ctx.fillRect(-28, -28, 56, 56); });
        ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.fillStyle = '#9070d8'; const s = lerp(56, 224, k); ctx.fillRect(700 - s / 2, 700 - s / 2, s, s); ctx.restore();
        line(ctx, '0,56 µm', 300, 900, t, S('s07') + 0.1, { size: 60, family: F.mono, weight: 700, dx: 0 });
        line(ctx, '2,24 µm', 700, 900, t, f('s07', 0.5), { size: 60, family: F.mono, weight: 700, color: CYAN, dx: 0 });
        big(ctx, '× 4', 500, 1060, t, f('s07', 0.6), { size: 110, color: CYAN });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        stamp(ctx, 'VERDICT', 500, 380, t, S('s08'), { size: 70, color: GOLD });
        line(ctx, '200 Mpx = LE CAPTEUR', 500, 620, t, f('s08', 0.2), { size: 66, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'PAS CHAQUE PHOTO', 500, 760, t, f('s08', 0.5), { size: 66, weight: 900, color: RED, dx: 0 });
        CHR.emo(ctx, 'camera', 500, 980, 220, t, f('s08', 0.6));
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        phone(ctx, 500, 760, 380, 700, { draw: (x, y, w, h) => settings(ctx, x, y, w, h, 0) });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 740, 560, 220, t, S('s09') + 0.2);
        tag(ctx, 'RÉGLAGES PHOTO · RÉSOLUTION', 500, 330, t, S('s09'), { size: 40, color: GREEN });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, 'BONUS · HONOR 400', 500, 360, t, S('s10'), { size: 44, color: CYAN });
        big(ctx, '200 Mpx', 500, 600, t, f('s10', 0.2), { size: 140, color: GOLD });
        stamp(ctx, 'MODE HIGH-RES', 500, 840, t, f('s10', 0.5), { size: 70, color: CYAN });
        tag(ctx, 'À ACTIVER', 500, 990, t, f('s10', 0.6), { size: 40 });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        CHR.emo(ctx, 'gear', 500, 560, 260, t, S('s11'));
        line(ctx, 'LES PIXELS RÉELS', 500, 820, t, f('s11', 0.2), { size: 64, weight: 900, dx: 0 });
        line(ctx, 'VARIENT SELON LE MODE', 500, 910, t, f('s11', 0.35), { size: 60, weight: 900, color: CYAN, dx: 0 });
        tag(ctx, 'SELON HONOR', 500, 1030, t, f('s11', 0.5), { size: 38 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ton téléphone,', 'réglé sur combien ?', '?? Mpx'], { color: GOLD }); });
      block(ctx, t, S('s13'), END + 1, () => followCTA(ctx, t, S('s13'), { when: 'CE SOIR', next: ['Netflix : en Suisse ou en', 'France, qui paie le plus ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
