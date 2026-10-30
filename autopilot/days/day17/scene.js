// Jour 17 — « Ampoules : lis les lumens, pas les watts » (valeurs de référence du règl. (CE) 244/2009 ; règl. (UE) 2019/2020, repris par l'OEEE).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, readout } = ENG;
  const END = E('s05') + 0.55;

  function bulb(ctx, x, y, s, glow, led) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (glow > 0) { const g = ctx.createRadialGradient(0, -60, 10, 0, -60, 300); g.addColorStop(0, `rgba(255,214,120,${0.55 * glow})`); g.addColorStop(1, 'rgba(255,214,120,0)'); ctx.fillStyle = g; ctx.fillRect(-320, -380, 640, 640); }
    ctx.beginPath(); ctx.arc(0, -80, 130, Math.PI * 0.78, Math.PI * 2.22); ctx.lineTo(55, 90); ctx.lineTo(-55, 90); ctx.closePath();
    ctx.fillStyle = glow > 0 ? `rgba(255,236,180,${0.25 + 0.6 * glow})` : '#1a2333'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = '#c8cfdd'; ctx.stroke();
    ctx.strokeStyle = led ? '#ffd27a' : '#e0a050'; ctx.lineWidth = 6; ctx.beginPath();
    if (led) { ctx.moveTo(-40, -60); ctx.lineTo(40, -60); ctx.moveTo(-40, -20); ctx.lineTo(40, -20); }
    else { ctx.moveTo(-30, 60); ctx.lineTo(-30, -60); for (let i = 0; i < 6; i++) ctx.lineTo(-30 + 12 * i, -60 + (i % 2 ? 14 : -14)); ctx.lineTo(30, -60); ctx.lineTo(30, 60); }
    ctx.stroke();
    for (let i = 0; i < 4; i++) { roundRect(ctx, -60, 95 + i * 26, 120, 20, 8); ctx.fillStyle = '#8e9ab3'; ctx.fill(); }
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : 60 W ✕ → LUMENS
      block(ctx, t, 0, S('s02'), () => {
        bulb(ctx, 520, 700, 1.0 + 0.04 * ease.out(prog(t, 0, 3)), 0.7 + 0.2 * Math.sin(t * 3), false);
        text(ctx, '60 W', 520, 420, { size: 170, family: F.mono, weight: 700, color: C.white });
        ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(330, 470); ctx.lineTo(710, 370); ctx.stroke();
        text(ctx, 'REGARDE LES', 520, 1010, { size: 70, weight: 900, color: C.white });
        text(ctx, 'LUMENS', 520, 1130, { size: 140, weight: 900, color: C.gold2, shadow: 'rgba(201,168,76,0.5)', shadowBlur: 40 });
      });

      // 60 W ≈ 806 lm
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'RÉFÉRENCE · RÈGL. (CE) 244/2009', 520, 400, { color: C.gold, size: 34 });
        bulb(ctx, 300, 760, 0.85, 0.8, false);
        text(ctx, 'ancienne', 300, 1050, { size: 46, weight: 800, color: C.muted });
        readout(ctx, 'ANCIENNE 60 W', '≈ 806 lm', 700, 700, { w: 420, h: 190, size: 84 });
        const k = ease.out(prog(t, S('s02') + 0.8, 0.5));
        text(ctx, '40 W ≈ 470 lm', 700, 900, { size: 44, family: F.mono, weight: 700, color: C.white, alpha: k });
        text(ctx, '100 W ≈ 1 521 lm', 700, 970, { size: 44, family: F.mono, weight: 700, color: C.white, alpha: k });
      });

      // LED : 7 à 8 W pour 806 lm
      block(ctx, t, S('s03'), S('s04'), () => {
        chip(ctx, 'EX. FICHE PHILIPS : 7 W · 806 lm', 520, 400, { color: C.gold, size: 34 });
        bulb(ctx, 300, 760, 0.85, 0.8, true);
        text(ctx, 'LED', 300, 1050, { size: 52, weight: 900, color: C.gold2 });
        const k = ease.out(prog(t, S('s03') + 0.3, 1.2));
        readout(ctx, 'MÊME LUMIÈRE', '7–8 W', 700, 640, { w: 420, h: 190, size: 96 });
        text(ctx, 'au lieu de 60 W', 700, 830, { size: 48, weight: 800, color: C.white, alpha: k });
        text(ctx, '≈ ÷ 8', 700, 960, { size: 110, family: F.mono, weight: 700, color: C.green, alpha: k });
      });

      // L'emballage : lumens 2 × plus gros
      block(ctx, t, S('s04'), S('s05'), () => {
        chip(ctx, 'RÈGL. (UE) 2019/2020 · OEEE (CH)', 520, 400, { color: C.gold, size: 34 });
        const k = ease.back(prog(t, S('s04') + 0.3, 0.5));
        roundRect(ctx, 230, 470, 580, 620, 30); ctx.fillStyle = '#e9edf5'; ctx.fill();
        text(ctx, 'EMBALLAGE (EX.)', 520, 540, { size: 38, family: F.mono, weight: 700, color: '#6b7488' });
        ctx.save(); ctx.translate(520, 720); ctx.scale(k, k);
        text(ctx, '806 lm', 0, 0, { size: 150, weight: 900, color: '#030408' }); ctx.restore();
        text(ctx, '7 W', 520, 880, { size: 72, weight: 800, color: '#3a4256', alpha: clamp(k) });
        text(ctx, 'lumens ≥ 2 × plus gros', 520, 1010, { size: 44, weight: 900, color: C.red, alpha: clamp(k) });
      });

      block(ctx, t, S('s05'), END + 1, () => followCTA(ctx, t, S('s05'), { when: 'CE SOIR', next: ['ce que la fiche d\'un', 'téléviseur écrit en petit'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
