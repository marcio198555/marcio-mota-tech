// Jour 6 — « L'eau en trop dans ta bouilloire : ~20 CHF par an » (mécanique : le calcul qui choque, tarif ElCom 2026).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, readout } = ENG;
  const END = E('s10') + 0.55;
  const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',');

  function kettle(ctx, x, y, s, fill, steam, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    // corps
    ctx.beginPath(); ctx.moveTo(-150, 160); ctx.lineTo(-120, -120); ctx.quadraticCurveTo(0, -170, 120, -120); ctx.lineTo(150, 160); ctx.closePath();
    ctx.fillStyle = '#1a2333'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#8e9ab3'; ctx.stroke();
    // eau (fenêtre)
    ctx.save(); ctx.beginPath(); ctx.rect(-40, -100, 80, 250); ctx.clip();
    roundRect(ctx, -40, -100, 80, 250, 20); ctx.fillStyle = '#0b1220'; ctx.fill();
    const h = 250 * clamp(fill); ctx.fillStyle = '#4f86b8'; ctx.fillRect(-40, 150 - h, 80, h);
    ctx.restore(); roundRect(ctx, -40, -100, 80, 250, 20); ctx.lineWidth = 4; ctx.strokeStyle = '#8e9ab3'; ctx.stroke();
    // poignée, bec
    ctx.lineWidth = 14; ctx.strokeStyle = '#8e9ab3'; ctx.beginPath(); ctx.moveTo(130, -90); ctx.quadraticCurveTo(230, -40, 140, 110); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-122, -90); ctx.lineTo(-200, -140); ctx.stroke();
    roundRect(ctx, -170, 160, 340, 34, 10); ctx.fillStyle = '#0d1320'; ctx.fill();
    if (steam) { ctx.strokeStyle = 'rgba(233,237,245,0.55)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) { const ph = (t * 0.9 + i * 0.33) % 1; ctx.globalAlpha = 1 - ph; ctx.beginPath();
        for (let sx = 0; sx <= 16; sx++) { const yy = -160 - ph * 140 - sx * 8, xx = -210 + i * 26 + Math.sin(sx * 0.8 + t * 5 + i) * 10; sx ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } }
    ctx.restore();
  }
  function cup(ctx, x, y, s, fill) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-80, -70); ctx.lineTo(80, -70); ctx.lineTo(62, 80); ctx.lineTo(-62, 80); ctx.closePath(); ctx.fillStyle = '#e9edf5'; ctx.fill();
    ctx.lineWidth = 12; ctx.strokeStyle = '#e9edf5'; ctx.beginPath(); ctx.arc(92, 0, 34, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    if (fill > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(-72, -60); ctx.lineTo(72, -60); ctx.lineTo(56, 70); ctx.lineTo(-56, 70); ctx.closePath(); ctx.clip(); const h = 130 * fill; ctx.fillStyle = '#4f86b8'; ctx.fillRect(-80, 70 - h, 160, h); ctx.restore(); }
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE
      block(ctx, t, 0, S('s02'), () => {
        kettle(ctx, 360, 720, 0.88, 0.95, true, t);
        cup(ctx, 760, 790, 0.85, 0.2);
        text(ctx, '20 CHF', 520, 1020, { size: 190, weight: 900, color: C.gold2, shadow: 'rgba(201,168,76,0.5)', shadowBlur: 50 });
        text(ctx, 'par an, pour de l\'eau en trop', 520, 1150, { size: 52, weight: 800, color: C.white, maxWidth: 900 });
      });

      // Le calcul : 1 L de 15 à 100 °C ≈ 100 Wh
      block(ctx, t, S('s02'), S('s04'), () => {
        chip(ctx, 'LE CALCUL', 520, 400, { color: C.gold, size: 32 });
        const k = ease.inOut(prog(t, S('s03') + 0.2, 1.8));
        const temp = lerp(15, 100, k);
        // thermomètre
        ctx.save(); roundRect(ctx, 230, 480, 70, 560, 35); ctx.fillStyle = '#0b1220'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.fg; ctx.stroke();
        const h = 500 * (temp / 100); roundRect(ctx, 245, 1020 - h, 40, h, 20); ctx.fillStyle = temp > 90 ? C.red2 : '#ff8a6b'; ctx.fill();
        ctx.beginPath(); ctx.arc(265, 1060, 60, 0, Math.PI * 2); ctx.fillStyle = temp > 90 ? C.red2 : '#ff8a6b'; ctx.fill(); ctx.restore();
        readout(ctx, 'EAU · 1 LITRE', Math.round(temp) + ' °C', 640, 600, { w: 440, h: 190, size: 96 });
        const ek = prog(t, S('s03') + 1.8, 0.4);
        text(ctx, '≈ 100 Wh', 640, 860, { size: 120, weight: 900, color: C.gold2, alpha: ek });
        text(ctx, '4,186 kJ/kg·K × 85 K', 640, 960, { size: 32, family: F.mono, weight: 400, color: C.muted, alpha: ek });
      });

      // Tarif 2026 → 3 centimes
      block(ctx, t, S('s04'), S('s06'), () => {
        readout(ctx, 'TARIF MOYEN 2026', '27,7 ct', 520, 520, { w: 600, h: 200, size: 110 });
        text(ctx, 'par kWh · ménage type (ElCom)', 520, 680, { size: 34, family: F.mono, weight: 400, color: C.muted });
        const k = ease.back(prog(t, S('s05'), 0.4));
        if (k > 0) { ctx.save(); ctx.translate(520, 900); ctx.scale(k, k);
          text(ctx, '≈ 3 ct', 0, 0, { size: 200, weight: 900, color: C.gold2 }); ctx.restore();
          text(ctx, 'par litre de trop', 520, 1060, { size: 54, weight: 800, color: C.white, alpha: clamp(k) }); }
      });

      // 2 fois par jour × 365 = 20 CHF
      block(ctx, t, S('s06'), S('s07'), () => {
        text(ctx, '2 × 365', 520, 520, { size: 130, family: F.mono, weight: 700, color: C.white });
        const k = ease.out(prog(t, S('s06') + 0.6, 1.4));
        text(ctx, fmt(20 * k, 0) + ' CHF', 520, 800, { size: 210, weight: 900, color: C.gold2 });
        text(ctx, '+ les pertes de la bouilloire', 520, 990, { size: 46, weight: 800, color: C.muted });
      });

      // Astuce : verse d'abord dans la tasse
      block(ctx, t, S('s07'), S('s09'), () => {
        chip(ctx, "L'ASTUCE", 520, 400, { color: C.gold, size: 32 });
        const k = ease.inOut(prog(t, S('s07') + 0.4, 1.6));
        cup(ctx, 330, 760 - 80 * Math.sin(Math.PI * k), 1.0, 1 - k);
        kettle(ctx, 740, 760, 0.8, 0.25 * k, false, t);
        text(ctx, '1 tasse → 1 tasse', 520, 1100, { size: 70, weight: 900, color: C.white });
      });

      // Commentaire
      block(ctx, t, S('s09'), S('s10'), () => {
        text(ctx, 'COMBIEN', 520, 520, { size: 130, weight: 900, color: C.white });
        text(ctx, 'DE TASSES ?', 520, 660, { size: 120, weight: 900, color: C.gold2 });
        const b = Math.abs(Math.sin((t - S('s09')) * 5)) * 26;
        text(ctx, '👇', 520, 860 + b, { size: 140, family: F.emoji, weight: 400 });
        chip(ctx, 'RÉPONDS EN COMMENTAIRE', 520, 1060, { color: C.gold, size: 32 });
      });

      block(ctx, t, S('s10'), END + 1, () => followCTA(ctx, t, S('s10')));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
