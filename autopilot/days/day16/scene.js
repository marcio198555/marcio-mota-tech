// Jour 16 — « En Suisse, la garantie de 2 ans peut être exclue » (CO art. 199 et 210 ; SECO kmu.admin.ch ; FRC).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA } = ENG;
  const END = E('s06') + 0.55;

  function doc(ctx, x, y, w, h) {
    roundRect(ctx, x, y, w, h, 18); ctx.fillStyle = '#e9edf5'; ctx.fill();
    ctx.fillStyle = '#b9c0cc';
    for (let i = 0; i < 7; i++) { if (i !== 3) { roundRect(ctx, x + 50, y + 110 + i * 62, w - 100 - (i % 3) * 60, 20, 8); ctx.fill(); } }
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : garantie 2 ans… exclue
      block(ctx, t, 0, S('s02'), () => {
        const z = 1 + 0.03 * ease.out(prog(t, 0, 3));
        ctx.save(); ctx.translate(520, 700); ctx.scale(z, z); ctx.translate(-520, -700);
        chip(ctx, 'SUISSE · CODE DES OBLIGATIONS', 520, 370, { color: C.gold, size: 36 });
        text(ctx, 'GARANTIE', 520, 520, { size: 110, weight: 900, color: C.white });
        text(ctx, '2 ANS', 520, 690, { size: 220, family: F.mono, weight: 700, color: C.gold2 });
        ctx.save(); ctx.translate(520, 900); ctx.rotate(-0.08 + 0.015 * Math.sin(t * 2));
        roundRect(ctx, -330, -80, 660, 160, 22); ctx.lineWidth = 12; ctx.strokeStyle = C.red2; ctx.stroke();
        text(ctx, 'PEUT ÊTRE EXCLUE', 0, 4, { size: 64, weight: 900, color: C.red2 });
        ctx.restore();
        ctx.restore();
      });

      // La loi : 2 ans
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'CO ART. 210', 520, 400, { color: C.gold, size: 38 });
        const k = ease.back(prog(t, S('s02') + 0.1, 0.5));
        ctx.save(); ctx.translate(520, 680); ctx.scale(k, k);
        text(ctx, '2 ans', 0, 0, { size: 230, family: F.mono, weight: 700, color: C.gold2 }); ctx.restore();
        text(ctx, 'pour les défauts', 520, 930, { size: 70, weight: 900, color: C.white, alpha: clamp(k) });
      });

      // Exclusion écrite clairement dans le contrat
      block(ctx, t, S('s03'), S('s04'), () => {
        chip(ctx, 'SOURCE : SECO (KMU.ADMIN.CH)', 520, 360, { color: C.gold, size: 36 });
        const k = ease.out(prog(t, S('s03'), 0.4));
        ctx.save(); ctx.globalAlpha = k;
        doc(ctx, 230, 430, 580, 560);
        text(ctx, 'CONTRAT', 520, 480, { size: 50, weight: 900, color: '#030408' });
        const hl = ease.inOut(prog(t, S('s03') + 0.9, 0.7));
        roundRect(ctx, 270, 430 + 110 + 3 * 62 - 25, 500 * hl, 70, 10); ctx.fillStyle = 'rgba(230,198,106,0.85)'; ctx.fill();
        text(ctx, 'Garantie : exclue.', 290, 430 + 110 + 3 * 62 + 10, { size: 46, weight: 900, color: '#030408', align: 'left' });
        ctx.restore();
        chip(ctx, 'EXEMPLE', 520, 1015, { color: C.white, size: 38 });
        text(ctx, 'écrit CLAIREMENT', 520, 1120, { size: 66, weight: 900, color: C.white, alpha: k });
      });

      // Sauf défaut caché exprès
      block(ctx, t, S('s04'), S('s05'), () => {
        chip(ctx, 'CO ART. 199', 520, 400, { color: C.gold, size: 38 });
        const k = ease.back(prog(t, S('s04') + 0.05, 0.4));
        ctx.save(); ctx.translate(520, 620); ctx.scale(k, k);
        text(ctx, 'JAMAIS', 0, 0, { size: 170, weight: 900, color: C.red2, shadow: 'rgba(200,32,48,0.5)', shadowBlur: 40 }); ctx.restore();
        text(ctx, 'si le vendeur a caché', 520, 860, { size: 64, weight: 900, color: C.white, alpha: clamp(k) });
        text(ctx, 'le défaut exprès', 520, 945, { size: 64, weight: 900, color: C.white, alpha: clamp(k) });
      });

      // Réparer au lieu de rembourser
      block(ctx, t, S('s05'), S('s06'), () => {
        chip(ctx, 'SOURCE : FRC', 520, 380, { color: C.gold, size: 38 });
        text(ctx, 'RÉPARER', 520, 540, { size: 100, weight: 900, color: C.white });
        text(ctx, 'au lieu de rembourser ?', 520, 650, { size: 62, weight: 800, color: C.gold2 });
        const k = ease.back(prog(t, S('s05') + 2.4, 0.45));
        ctx.save(); ctx.translate(520, 860); ctx.scale(k, k);
        roundRect(ctx, -400, -110, 800, 220, 30); ctx.fillStyle = 'rgba(14,22,38,0.92)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.green; ctx.stroke();
        text(ctx, 'seulement si le contrat', 0, -38, { size: 56, weight: 900, color: C.white });
        text(ctx, 'ou les CG le prévoient', 0, 42, { size: 56, weight: 900, color: C.green });
        ctx.restore();
      });

      block(ctx, t, S('s06'), END + 1, () => followCTA(ctx, t, S('s06'), { when: 'DEMAIN', next: ['les ampoules :', 'lis les lumens, pas les watts'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
