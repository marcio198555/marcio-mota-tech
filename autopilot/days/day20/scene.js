// Jour 20 — « Achat en ligne en Suisse : pas de droit légal de retour de 14 jours » (SECO kmu.admin.ch, ch.ch, CO art. 40a ss).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA } = ENG;
  const END = E('s06') + 0.55;

  function box(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(0.04 * Math.sin(t * 1.5));
    ctx.fillStyle = '#b8875a'; ctx.fillRect(-170, -120, 340, 240);
    ctx.fillStyle = '#9a6f47'; ctx.fillRect(-170, -120, 340, 50);
    ctx.fillStyle = '#e6d3b3'; ctx.fillRect(-30, -120, 60, 240);
    text(ctx, '↩', 0, 30, { size: 110, weight: 900, color: '#030408' });
    ctx.restore();
  }
  function calendar(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -170, -160, 340, 320, 28); ctx.fillStyle = '#e9edf5'; ctx.fill();
    roundRect(ctx, -170, -160, 340, 90, 28); ctx.fillStyle = C.red; ctx.fill(); ctx.fillRect(-170, -100, 340, 30);
    text(ctx, 'JOURS', 0, -118, { size: 44, weight: 900, color: C.white });
    text(ctx, '14', 0, 50, { size: 170, family: F.mono, weight: 700, color: '#030408' });
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : 14 jours pour renvoyer ? Pas en Suisse
      block(ctx, t, 0, S('s02'), () => {
        const z = 1 + 0.03 * ease.out(prog(t, 0, 3));
        ctx.save(); ctx.translate(520, 700); ctx.scale(z, z); ctx.translate(-520, -700);
        text(ctx, 'ACHAT EN LIGNE', 520, 360, { size: 92, weight: 900, color: C.white });
        calendar(ctx, 310, 680, 0.95);
        box(ctx, 740, 690, 0.85, t);
        ctx.save(); ctx.strokeStyle = C.red2; ctx.lineWidth = 16; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(150, 520); ctx.lineTo(470, 840); ctx.stroke(); ctx.restore();
        text(ctx, 'PAS DE RETOUR', 520, 1010, { size: 90, weight: 900, color: C.red2 });
        text(ctx, 'LÉGAL EN SUISSE', 520, 1110, { size: 90, weight: 900, color: C.white });
        text(ctx, '(si tu changes d\'avis)', 520, 1195, { size: 50, weight: 800, color: C.gold2 });
        ctx.restore();
      });

      // Aucun droit de changer d'avis
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'SOURCE : SECO · CH.CH', 520, 380, { color: C.gold, size: 38 });
        const k = ease.back(prog(t, S('s02') + 0.1, 0.5));
        ctx.save(); ctx.translate(520, 640); ctx.scale(k, k);
        text(ctx, 'AUCUN', 0, -70, { size: 150, weight: 900, color: C.red2 });
        text(ctx, 'droit légal', 0, 70, { size: 90, weight: 900, color: C.white });
        ctx.restore();
        text(ctx, 'de changer d\'avis', 520, 910, { size: 64, weight: 800, color: C.gold2, alpha: clamp(k) });
        text(ctx, 'après un achat en ligne', 520, 990, { size: 64, weight: 800, color: C.gold2, alpha: clamp(k) });
      });

      // Les 14 jours : démarchage seulement
      block(ctx, t, S('s03'), S('s04'), () => {
        chip(ctx, 'CO ART. 40a SS · CH.CH', 520, 360, { color: C.gold, size: 36 });
        const k1 = ease.out(prog(t, S('s03'), 0.4));
        ctx.save(); ctx.globalAlpha = k1;
        roundRect(ctx, 90, 430, 860, 300, 28); ctx.fillStyle = 'rgba(14,22,38,0.9)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.green; ctx.stroke();
        text(ctx, '✓ 14 jours', 520, 510, { size: 70, weight: 900, color: C.green });
        text(ctx, 'démarchage à domicile', 520, 600, { size: 54, weight: 800, color: C.white });
        text(ctx, 'ou par téléphone, dès 100 CHF', 520, 670, { size: 54, weight: 800, color: C.white });
        ctx.restore();
        const k2 = ease.out(prog(t, S('s03') + 1.6, 0.4));
        ctx.save(); ctx.globalAlpha = k2;
        roundRect(ctx, 90, 780, 860, 230, 28); ctx.fillStyle = 'rgba(14,22,38,0.9)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.red2; ctx.stroke();
        text(ctx, '✗ achat en ligne', 520, 860, { size: 70, weight: 900, color: C.red2 });
        text(ctx, 'pas concerné', 520, 945, { size: 54, weight: 800, color: C.white });
        ctx.restore();
      });

      // Le vendeur décide (CG)
      block(ctx, t, S('s04'), S('s05'), () => {
        const k = ease.back(prog(t, S('s04') + 0.05, 0.45));
        ctx.save(); ctx.translate(520, 600); ctx.scale(k, k);
        roundRect(ctx, -260, -230, 520, 460, 18); ctx.fillStyle = '#e9edf5'; ctx.fill();
        text(ctx, 'CONDITIONS', 0, -160, { size: 50, weight: 900, color: '#030408' });
        text(ctx, 'GÉNÉRALES', 0, -100, { size: 50, weight: 900, color: '#030408' });
        ctx.fillStyle = '#b9c0cc'; for (let i = 0; i < 4; i++) { roundRect(ctx, -200, -30 + i * 55, 400 - (i % 2) * 90, 20, 8); ctx.fill(); }
        ctx.restore();
        text(ctx, 'le retour : selon le vendeur', 520, 960, { size: 62, weight: 900, color: C.gold2, alpha: clamp(k) });
      });

      // Lis-les avant de payer
      block(ctx, t, S('s05'), S('s06'), () => {
        const k = ease.back(prog(t, S('s05'), 0.35));
        ctx.save(); ctx.translate(520, 680); ctx.scale(k, k);
        text(ctx, 'LIS LES CG', 0, -70, { size: 120, weight: 900, color: C.white });
        text(ctx, 'AVANT DE PAYER', 0, 60, { size: 96, weight: 900, color: C.gold2 });
        ctx.restore();
      });

      block(ctx, t, S('s06'), END + 1, () => followCTA(ctx, t, S('s06'), { when: 'DEMAIN', next: ['le programme éco du lave-vaisselle', '2 fois moins que l\'intensif'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
