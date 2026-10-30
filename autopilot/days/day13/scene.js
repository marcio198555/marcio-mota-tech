// Jour 13 — « Prix barré du Black Friday : ce que dit la loi suisse » (OIP, RS 942.211, art. 16, version 1.1.2025).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, readout } = ENG;
  const END = E('s06') + 0.55;

  function tag(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.06 + 0.02 * Math.sin(t * 1.6));
    ctx.beginPath(); ctx.moveTo(-250, -150); ctx.lineTo(170, -150); ctx.lineTo(260, 0); ctx.lineTo(170, 150); ctx.lineTo(-250, 150); ctx.closePath();
    ctx.fillStyle = '#e9edf5'; ctx.fill();
    ctx.beginPath(); ctx.arc(180, 0, 22, 0, Math.PI * 2); ctx.fillStyle = '#030408'; ctx.fill();
    text(ctx, 'CHF 200.–', -40, -55, { size: 58, family: F.mono, weight: 700, color: '#6b7488' });
    ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-190, -55); ctx.lineTo(110, -55); ctx.stroke();
    text(ctx, 'CHF 100.–', -40, 60, { size: 76, family: F.mono, weight: 700, color: '#030408' });
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : −50 % ? par rapport à quoi ?
      block(ctx, t, 0, S('s02'), () => {
        const z = 1 + 0.03 * ease.out(prog(t, 0, 3));
        ctx.save(); ctx.translate(520, 760); ctx.scale(z, z); ctx.translate(-520, -760);
        text(ctx, '−50 %', 520, 450, { size: 210, weight: 900, color: C.red2, shadow: 'rgba(200,32,48,0.5)', shadowBlur: 40 });
        tag(ctx, 500, 770, 0.95, t);
        text(ctx, 'PAR RAPPORT', 520, 1030, { size: 92, weight: 900, color: C.white });
        text(ctx, 'À QUOI ?', 520, 1135, { size: 92, weight: 900, color: C.gold2 });
        ctx.restore();
        chip(ctx, 'PRIX D\'EXEMPLE', 790, 590, { color: C.muted, size: 36 });
      });

      // La loi
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'SUISSE · OIP · RS 942.211', 520, 420, { color: C.gold, size: 36 });
        const k = ease.back(prog(t, S('s02') + 0.1, 0.5));
        ctx.save(); ctx.translate(520, 700); ctx.scale(k, k);
        text(ctx, '§ 16', 0, 0, { size: 230, family: F.mono, weight: 700, color: C.gold2 }); ctx.restore();
        text(ctx, 'Ordonnance sur', 520, 930, { size: 64, weight: 800, color: C.white, alpha: clamp(k) });
        text(ctx, 'l\'indication des prix', 520, 1010, { size: 64, weight: 800, color: C.white, alpha: clamp(k) });
      });

      // Deux voies pour l'ancien prix
      block(ctx, t, S('s03'), S('s05'), () => {
        chip(ctx, 'L\'ANCIEN PRIX (ART. 16)', 520, 360, { color: C.gold, size: 36 });
        // carte 1
        const k1 = ease.out(prog(t, S('s03'), 0.4));
        ctx.save(); ctx.globalAlpha = k1;
        roundRect(ctx, 90, 430, 860, 330, 28); ctx.fillStyle = 'rgba(14,22,38,0.9)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.line; ctx.stroke();
        text(ctx, 'pratiqué juste avant', 520, 500, { size: 50, weight: 800, color: C.white });
        const b = ease.inOut(prog(t, S('s03') + 1.2, 1.4));
        roundRect(ctx, 150, 560, 740, 50, 14); ctx.fillStyle = '#26324a'; ctx.fill();
        if (b > 0.06) { roundRect(ctx, 150, 560, 740 * 0.5 * b, 50, 14); ctx.fillStyle = C.gold; ctx.fill(); }
        text(ctx, '½ de sa durée · 2 mois max.', 520, 700, { size: 54, weight: 900, color: C.gold2 });
        ctx.restore();
        // carte 2
        const k2 = ease.out(prog(t, S('s04'), 0.4));
        ctx.save(); ctx.globalAlpha = k2;
        roundRect(ctx, 90, 800, 860, 330, 28); ctx.fillStyle = 'rgba(14,22,38,0.9)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.green; ctx.stroke();
        text(ctx, 'pratiqué au moins 30 jours', 520, 870, { size: 50, weight: 800, color: C.white });
        text(ctx, '≥ 30 j', 520, 975, { size: 90, family: F.mono, weight: 700, color: C.white });
        text(ctx, 'sans limite de temps', 520, 1075, { size: 54, weight: 900, color: C.green });
        ctx.restore();
      });

      // Prix conseillé
      block(ctx, t, S('s05'), S('s06'), () => {
        chip(ctx, 'ART. 16 AL. 5', 520, 400, { color: C.gold, size: 36 });
        text(ctx, '« PRIX CONSEILLÉ »', 520, 560, { size: 82, weight: 900, color: C.white });
        const k = ease.back(prog(t, S('s05') + 0.5, 0.45));
        ctx.save(); ctx.translate(520, 760); ctx.scale(k, k);
        text(ctx, 'seulement si', 0, 0, { size: 70, weight: 800, color: C.gold2 }); ctx.restore();
        text(ctx, 'd\'autres vendeurs', 520, 900, { size: 70, weight: 900, color: C.white, alpha: clamp(k) });
        text(ctx, 'le pratiquent vraiment', 520, 990, { size: 70, weight: 900, color: C.white, alpha: clamp(k) });
      });

      block(ctx, t, S('s06'), END + 1, () => followCTA(ctx, t, S('s06'), { when: 'CE SOIR', next: ['ce que la boîte d\'un routeur', 'Wi-Fi écrit en petit'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
