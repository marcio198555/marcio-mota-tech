// Jour 21 — « Lave-vaisselle : le programme le plus long consomme le moins » (guide rapide Bosch SMS4ECI28E, valeurs EN 60436).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, readout } = ENG;
  const END = E('s06') + 0.55;

  function bars(ctx, t, t0, y) {
    const rows = [
      { n: 'ÉCO 50°', d: '4 h 30', kwh: 0.543, txt: '0,54 kWh', col: C.green },
      { n: 'INTENSIF 70°', d: '≈ 2 h 30', kwh: 1.25, txt: '1,15–1,25 kWh', col: C.red2 },
    ];
    rows.forEach((r, i) => {
      const yy = y + i * 220, k = ease.out(prog(t, t0 + i * 0.25, 0.9));
      text(ctx, r.n, 110, yy, { size: 52, weight: 900, color: C.white, align: 'left' });
      text(ctx, r.d, 880, yy, { size: 52, family: F.mono, weight: 700, color: C.white, align: 'right' });
      roundRect(ctx, 110, yy + 45, 770, 70, 18); ctx.fillStyle = '#1a2333'; ctx.fill();
      roundRect(ctx, 110, yy + 45, 770 * (r.kwh / 1.25) * k + 1, 70, 18); ctx.fillStyle = r.col; ctx.fill();
      text(ctx, r.txt, 130, yy + 150, { size: 46, family: F.mono, weight: 700, color: r.col, align: 'left', alpha: k });
    });
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE
      block(ctx, t, 0, S('s02'), () => {
        text(ctx, 'LE PLUS LONG', 520, 420, { size: 104, weight: 900, color: C.white });
        text(ctx, '= LE MOINS CHER', 520, 530, { size: 92, weight: 900, color: C.gold2, shadow: 'rgba(201,168,76,0.5)', shadowBlur: 40 });
        bars(ctx, t, -1, 680);
        chip(ctx, 'BOSCH SMS4ECI28E · NOTICE', 520, 1130, { color: C.gold, size: 34 });
      });

      // Éco
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'PROGRAMME ÉCO 50°', 520, 400, { color: C.green, size: 36 });
        const k = ease.out(prog(t, S('s02') + 0.3, 1.5));
        readout(ctx, 'DURÉE', '4 h 30', 520, 590, { w: 600, h: 190, size: 110 });
        readout(ctx, 'ÉNERGIE / CYCLE', (0.543 * k).toFixed(2).replace('.', ',') + ' kWh', 520, 850, { w: 600, h: 190, size: 96 });
        text(ctx, 'mesuré selon EN 60436 (Bosch)', 520, 1030, { size: 36, family: F.mono, weight: 400, color: C.muted });
      });

      // Intensif
      block(ctx, t, S('s03'), S('s04'), () => {
        chip(ctx, 'PROGRAMME INTENSIF 70°', 520, 400, { color: C.red2, size: 36 });
        readout(ctx, 'DURÉE', '≈ 2 h 30', 520, 590, { w: 600, h: 190, size: 110 });
        readout(ctx, 'ÉNERGIE / CYCLE', '1,15–1,25 kWh', 520, 850, { w: 640, h: 190, size: 66 });
      });

      // × 2
      block(ctx, t, S('s04'), S('s05'), () => {
        const k = ease.back(prog(t, S('s04'), 0.45));
        ctx.save(); ctx.translate(520, 700); ctx.scale(k, k);
        text(ctx, '× 2,1', 0, 0, { size: 240, family: F.mono, weight: 700, color: C.red2 }); ctx.restore();
        text(ctx, '1,15 ÷ 0,543 = 2,1', 520, 920, { size: 50, family: F.mono, weight: 700, color: C.white, alpha: clamp(k) });
        text(ctx, 'au minimum', 520, 1000, { size: 44, weight: 800, color: C.muted, alpha: clamp(k) });
      });

      // Pourquoi
      block(ctx, t, S('s05'), S('s06'), () => {
        chip(ctx, 'POURQUOI ?', 520, 400, { color: C.gold, size: 36 });
        const k = ease.inOut(prog(t, S('s05') + 0.2, 1.2));
        text(ctx, '50 °C', 290, 640, { size: 104, family: F.mono, weight: 700, color: C.green });
        text(ctx, 'éco', 290, 760, { size: 56, weight: 800, color: C.white });
        text(ctx, '70 °C', 760, 640, { size: 104, family: F.mono, weight: 700, color: C.red2, alpha: 0.4 + 0.6 * k });
        text(ctx, 'intensif', 760, 760, { size: 56, weight: 800, color: C.white, alpha: 0.4 + 0.6 * k });
        text(ctx, 'moins chaud,', 520, 940, { size: 70, weight: 900, color: C.white });
        text(ctx, 'mais plus longtemps', 520, 1030, { size: 70, weight: 900, color: C.gold2 });
      });

      block(ctx, t, S('s06'), END + 1, () => followCTA(ctx, t, S('s06'), { when: 'CE SOIR', next: ['ce que la fiche d\'un portable', 'écrit en petit'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
