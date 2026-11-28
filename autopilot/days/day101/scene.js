// Vidéo 101 — Disque d'1 To : 931 Go sous Windows, 1 To sur Mac. Qui s'est fait avoir ? (Reel d'essai Instagram). Faits : days/day101/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, segById, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, bars, comment, head, duelFrame } = KIT;
  const has = id => !!segById(id);
  const LAST = ['s15', 's14', 's13'].find(has);
  const END = E(LAST) + 0.6;
  // disque dur schématique (sans marque)
  function hdd(ctx, x, y, s, label, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -150, -100, 300, 200, 22); ctx.fillStyle = '#2a3242'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = o.border || '#c9d2e3'; ctx.stroke();
    ctx.fillStyle = '#9aa6bb'; ctx.beginPath(); ctx.arc(-55, -5, 70, 0, 7); ctx.fill();
    ctx.fillStyle = '#2a3242'; ctx.beginPath(); ctx.arc(-55, -5, 14, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(-55, -5); ctx.rotate((o.spin || 0)); ctx.strokeStyle = '#5c677c'; ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, 30 + i * 13, i, i + 1.6); ctx.stroke(); } ctx.restore();
    ctx.strokeStyle = '#e6e9f0'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(90, 70); ctx.lineTo(10, -20); ctx.stroke();
    if (label) { roundRect(ctx, 40, -86, 100, 52, 10); ctx.fillStyle = o.labelBg || GOLD; ctx.fill(); text(ctx, label, 90, -60, { size: 34, weight: 900, color: '#071018', maxWidth: 92 }); }
    ctx.restore();
  }
  // écran d'ordinateur avec la capacité affichée
  function screen(ctx, x, y, s, value, color, sub) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -170, -120, 340, 220, 18); ctx.fillStyle = '#0d1420'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#c9d2e3'; ctx.stroke();
    ctx.fillStyle = '#c9d2e3'; ctx.fillRect(-30, 100, 60, 40); roundRect(ctx, -90, 136, 180, 16, 8); ctx.fill();
    if (sub) text(ctx, sub, 0, -70, { size: 36, weight: 800, color: '#9fb0c8' });
    text(ctx, value, 0, 10, { size: 92, family: F.display, weight: 900, color });
    ctx.restore();
  }
  function igEnd(ctx, t, t0) {
    const k = ease.back(prog(t, t0 + 0.25, 0.35));
    ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(500, 800); ctx.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k);
    panel(ctx, -420, -190, 840, 380, { r: 40, border: GOLD, lw: 4, bg: 'rgba(201,168,76,0.12)' });
    text(ctx, 'CHAQUE JOUR', 0, -110, { size: 44, family: F.mono, weight: 700, color: GOLD, letter: 6 });
    text(ctx, 'un chiffre vérifié', 0, -10, { size: 72, weight: 900, color: WHITE, maxWidth: 780 });
    text(ctx, 'sur les objets', 0, 75, { size: 60, weight: 800, color: WHITE, maxWidth: 780 });
    text(ctx, 'de ta maison', 0, 145, { size: 60, weight: 800, color: WHITE, maxWidth: 780 });
    ctx.restore();
    const p = 1 + 0.05 * Math.sin((t - t0) * 7);
    pop(ctx, t, t0 + 0.5, 500, 1110, () => { ctx.scale(p, p); roundRect(ctx, -230, -58, 460, 116, 58); ctx.fillStyle = RED; ctx.fill(); text(ctx, 'ABONNE-TOI', 0, 2, { size: 56, weight: 900, color: WHITE }); });
  }
  // blocs : [premier segment, dessin] ; chaque bloc dure jusqu'au début du bloc suivant présent
  const PLAN = [
    ['s01', t => {
      const b = 1 + 0.06 * Math.sin(t * 5);
      ctx0.save(); ctx0.translate(500, 420); ctx0.scale(b, b); text(ctx0, '1 To = 931 Go ?', 0, 0, { size: 108, family: F.display, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)' }); ctx0.restore();
      duelFrame(ctx0, { y0: 540, y1: 1180 });
      hdd(ctx0, 275, 700, 0.75, '1 To', { spin: t * 3 }); hdd(ctx0, 725, 700, 0.75, '1 To', { spin: t * 3 });
      screen(ctx0, 275, 960, 0.85, '931 Go', RED, 'PC WINDOWS'); screen(ctx0, 725, 960, 0.85, '1 To', GREEN, 'MAC');
      head(ctx0, 'QUI S\'EST FAIT AVOIR ?', 1205, t, undefined, { size: 52 });
    }],
    ['s03', t => {
      tag(ctx0, 'À LA FIN', 500, 430, t, S('s03'), { size: 46, color: GOLD });
      hdd(ctx0, 500, 740, 1.6, '20 To', { spin: t * 2 });
      big(ctx0, 'COMBIEN « MANQUE » ?', 500, 1080, t, f('s03', 0.35), { size: 66, family: F.display, color: GOLD });
    }],
    ['s04', t => {
      tag(ctx0, 'SELON SEAGATE', 500, 420, t, S('s04'), { size: 40, color: GOLD });
      hdd(ctx0, 500, 660, 1.2, '1 To', { spin: t * 2 });
      big(ctx0, 'LA BOÎTE : BASE 10', 500, 960, t, f('s04', 0.4), { size: 76, family: F.display, color: GREEN });
    }],
    ['s05', t => {
      tag(ctx0, 'BASE 10', 500, 420, t, S('s05'), { size: 44, color: GREEN });
      line(ctx0, '1 Go =', 500, 580, t, f('s05', 0.05), { size: 64, weight: 900, dx: 0 });
      line(ctx0, '1 000 000 000 octets', 500, 680, t, f('s05', 0.1), { size: 62, family: F.mono, weight: 700, color: GREEN, dx: 0 });
      line(ctx0, '1 To =', 500, 860, t, f('s05', 0.5), { size: 64, weight: 900, dx: 0 });
      line(ctx0, '1 000 000 000 000', 500, 960, t, f('s05', 0.55), { size: 62, family: F.mono, weight: 700, color: GREEN, dx: 0 });
      line(ctx0, 'octets', 500, 1045, t, f('s05', 0.55), { size: 52, family: F.mono, weight: 700, color: GREEN, dx: 0 });
    }],
    ['s06', t => {
      tag(ctx0, 'WINDOWS : BASE 2', 500, 420, t, S('s06'), { size: 44, color: RED });
      line(ctx0, 'Son « Go » =', 500, 580, t, f('s06', 0.1), { size: 64, weight: 900, dx: 0 });
      line(ctx0, '1 073 741 824 octets', 500, 680, t, f('s06', 0.15), { size: 60, family: F.mono, weight: 700, color: RED, dx: 0 });
      big(ctx0, '≈ 7 % PLUS GROS', 500, 900, t, f('s06', 0.55), { size: 92, family: F.display, color: GOLD });
    }],
    ['s07', t => {
      tag(ctx0, 'LE CALCUL', 500, 420, t, S('s07'), { size: 44, color: GOLD });
      line(ctx0, '1 000 000 000 000', 500, 580, t, f('s07', 0.05), { size: 60, family: F.mono, weight: 700, dx: 0 });
      line(ctx0, '÷ 1 073 741 824', 500, 680, t, f('s07', 0.3), { size: 60, family: F.mono, weight: 700, color: RED, dx: 0 });
      big(ctx0, '≈ 931 Go', 500, 900, t, f('s07', 0.7), { size: 150, family: F.display, color: GOLD });
    }],
    ['s08', t => {
      bars(ctx0, [
        { label: 'Sur la boîte : 1 To', v: 1, value: '1 To', color: GREEN, t0: f('s08', 0.05) },
        { label: 'Sous Windows : 931 Go', v: 1, value: '931 Go', color: RED, t0: f('s08', 0.25) }
      ], 120, 520, 760, t, { size: 46 });
      stamp(ctx0, 'MÊME QUANTITÉ', 500, 1000, t, f('s08', 0.55), { size: 64, color: GOLD });
    }],
    ['s09', t => {
      tag(ctx0, 'SEAGATE COMPARE', 500, 420, t, S('s09'), { size: 40, color: GOLD });
      const k = ease.inOut(prog(t, f('s09', 0.15), 1.2));
      ctx0.save(); ctx0.strokeStyle = '#9fb0c8'; ctx0.lineWidth = 14; ctx0.lineCap = 'round'; ctx0.beginPath(); ctx0.moveTo(160, 760); ctx0.lineTo(160 + 680 * k, 760); ctx0.stroke(); ctx0.restore();
      line(ctx0, '1 km', 500, 660, t, f('s09', 0.3), { size: 72, weight: 900, color: GREEN, dx: 0 });
      line(ctx0, '= 0,621 mile', 500, 880, t, f('s09', 0.5), { size: 72, weight: 900, color: CYAN, dx: 0 });
      big(ctx0, 'MÊME CHEMIN', 500, 1060, t, f('s09', 0.65), { size: 76, family: F.display, color: GOLD });
    }],
    ['s10', t => {
      tag(ctx0, 'ET LE MAC ?', 500, 420, t, S('s10'), { size: 44, color: GOLD });
      screen(ctx0, 500, 700, 1.4, '1 To', GREEN, 'MAC');
      big(ctx0, 'APPLE : BASE 10', 500, 1050, t, f('s10', 0.45), { size: 76, family: F.display, color: GREEN });
    }],
    ['s11', t => {
      duelFrame(ctx0, { y0: 520, y1: 1180 });
      hdd(ctx0, 275, 800, 0.8, '1 To', { spin: t * 2 }); hdd(ctx0, 725, 800, 0.8, '1 To', { spin: t * 2 });
      text(ctx0, '931 Go', 275, 980, { size: 52, weight: 900, color: RED }); text(ctx0, '1 To', 725, 980, { size: 52, weight: 900, color: GREEN });
      stamp(ctx0, 'MÊME DISQUE', 500, 1110, t, f('s11', 0.45), { size: 64, color: GOLD });
    }],
    ['s12', t => {
      tag(ctx0, 'SEAGATE : CE QUE WINDOWS AFFICHE', 500, 420, t, S('s12'), { size: 36, color: GOLD });
      bars(ctx0, [
        { label: '1 To → 931 Go', v: 0.931, value: '−69 Go', color: GOLD, t0: f('s12', 0.05) },
        { label: '4 To → 3,63 To', v: 0.908, value: '−370 Go', color: GOLD, t0: f('s12', 0.3) },
        { label: '10 To → 9,09 To', v: 0.909, value: '−910 Go', color: RED, t0: f('s12', 0.55) }
      ], 120, 520, 760, t, { size: 46 });
    }],
    ['s13', t => { comment(ctx0, t, S('s13'), ['Ton disque,', 'il affiche combien ?'], { color: GOLD, size: 66 }); }],
    ['s14', t => {
      tag(ctx0, 'SEAGATE', 500, 410, t, S('s14'), { size: 40, color: GOLD });
      hdd(ctx0, 500, 620, 1.1, '20 To', { spin: t * 2 });
      line(ctx0, 'Windows affiche :', 500, 840, t, f('s14', 0.25), { size: 56, weight: 900, dx: 0 });
      big(ctx0, '18,18 To', 500, 960, t, f('s14', 0.3), { size: 130, family: F.display, color: RED });
      stamp(ctx0, '1,82 To JAMAIS PERDUS', 500, 1130, t, f('s14', 0.6), { size: 52, color: GREEN });
    }],
    ['s15', t => igEnd(ctx0, t, S('s15'))]
  ].filter(p => has(p[0]));
  let ctx0 = null;
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face']),
    draw(ctx, t) {
      ctx0 = ctx;
      background(ctx, t);
      PLAN.forEach((p, i) => {
        const a = i === 0 ? 0 : S(p[0]);
        const b = i + 1 < PLAN.length ? S(PLAN[i + 1][0]) : END + 1;
        block(ctx, t, a, b, () => p[1](t));
      });
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
