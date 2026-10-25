// Jour 3 — « 20 000 mAh ≠ 5 recharges » : le piège des batteries externes (mécanique : le calcul qui choque).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, phone, followCTA, bookmark, readout } = ENG;
  const END = E('s10') + 0.55;

  function powerbank(ctx, x, y, s, label, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -170, -270, 340, 540, 44); ctx.fillStyle = '#1a2333'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#3a4660'; ctx.stroke();
    roundRect(ctx, -60, 210, 120, 26, 13); ctx.fillStyle = '#0b1220'; ctx.fill(); // port
    for (let i = 0; i < 4; i++) { ctx.fillStyle = i < 3 ? C.green : '#2b3850'; ctx.beginPath(); ctx.arc(-54 + i * 36, 150, 10, 0, Math.PI * 2); ctx.fill(); }
    text(ctx, label, 0, -40, { size: 70, family: F.mono, weight: 700, color: C.gold2 });
    text(ctx, 'mAh', 0, 30, { size: 46, family: F.mono, weight: 700, color: C.fg });
    if (o.small) text(ctx, o.small, 0, 100, { size: 26, family: F.mono, weight: 400, color: o.smallColor || C.muted });
    ctx.restore();
  }
  function phoneBattery(ctx, x, y, s, fill, color) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -70, -130, 140, 260, 26); ctx.lineWidth = 8; ctx.strokeStyle = C.fg; ctx.stroke();
    const h = 228 * clamp(fill);
    roundRect(ctx, -56, 116 - h, 112, h, 14); ctx.fillStyle = color || C.green; ctx.fill();
    ctx.restore();
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : 20 000 ÷ 4 000 = 5 ?
      block(ctx, t, 0, S('s03'), () => {
        powerbank(ctx, 520, 600, 0.95, '20 000');
        text(ctx, '20 000 ÷ 4 000', 520, 955, { size: 78, family: F.mono, weight: 700, color: C.white });
        text(ctx, '= 5 ?', 520, 1050, { size: 78, family: F.mono, weight: 700, color: C.white });
        const nk = prog(t, S('s02'), 0.3);
        if (nk > 0) {
          ctx.save(); ctx.globalAlpha *= clamp(nk * 3); ctx.strokeStyle = C.red2; ctx.lineWidth = 14; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(486, 1006); ctx.lineTo(lerp(486, 554, ease.out(nk)), lerp(1006, 1094, ease.out(nk))); ctx.stroke(); ctx.restore();
          const s = lerp(1.6, 1, ease.back(nk));
          ctx.save(); ctx.translate(520, 1180); ctx.scale(s, s);
          text(ctx, 'NON.', 0, 0, { size: 120, weight: 900, color: C.red2, alpha: clamp(nk * 3) });
          ctx.restore();
        }
      });

      // 3,7 V
      block(ctx, t, S('s03'), S('s04'), () => {
        powerbank(ctx, 360, 700, 0.9, '20 000', { small: 'à 3,7 V', smallColor: C.gold2 });
        const k = ease.back(prog(t, S('s03') + 0.6, 0.4));
        ctx.save(); ctx.translate(740, 640); ctx.scale(k, k);
        ctx.lineWidth = 12; ctx.strokeStyle = C.gold2; ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(85, 85); ctx.lineTo(170, 170); ctx.stroke();
        text(ctx, '3,7 V', 0, 0, { size: 72, family: F.mono, weight: 700, color: C.gold2 });
        ctx.restore();
        text(ctx, 'tension des cellules', 520, 1130, { size: 50, weight: 800, color: C.fg });
      });

      // 74 Wh
      block(ctx, t, S('s04'), S('s05'), () => {
        text(ctx, '20 000 mAh × 3,7 V', 520, 560, { size: 66, family: F.mono, weight: 700, color: C.fg, maxWidth: 900 });
        text(ctx, '=', 520, 690, { size: 80, weight: 900, color: C.muted });
        const k = ease.back(prog(t, S('s04') + 0.7, 0.4));
        ctx.save(); ctx.translate(520, 880); ctx.scale(Math.max(0.01, k), Math.max(0.01, k));
        text(ctx, '74 Wh', 0, 0, { size: 220, weight: 900, color: C.gold2, shadow: 'rgba(201,168,76,0.5)', shadowBlur: 50 });
        ctx.restore();
        chip(ctx, 'ÉNERGIE STOCKÉE', 520, 1100, { color: C.gold, size: 34 });
      });

      // Téléphone ≈ 15 Wh
      block(ctx, t, S('s05'), S('s06'), () => {
        phone(ctx, 295, 760, 330, 640, { draw: () => { phoneBattery(ctx, 0, 30, 1.2, 1, C.green); } });
        text(ctx, '4 000 mAh', 700, 640, { size: 64, family: F.mono, weight: 700, color: C.fg });
        text(ctx, '≈ 15 Wh', 700, 780, { size: 104, weight: 900, color: C.gold2 });
        text(ctx, '(à 3,85 V)', 700, 880, { size: 38, family: F.mono, weight: 400, color: 'rgba(255,255,255,0.8)' });
      });

      // Pertes 18 %
      block(ctx, t, S('s06'), S('s07'), () => {
        const x = 140, y = 640, w = 760, h = 150;
        roundRect(ctx, x, y, w, h, 30); ctx.fillStyle = '#0b1220'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.line; ctx.stroke();
        const lk = ease.inOut(prog(t, S('s06') + 0.5, 1.0));
        const keep = lerp(1, 0.82, lk);
        roundRect(ctx, x + 10, y + 10, (w - 20) * keep, h - 20, 22); ctx.fillStyle = C.gold; ctx.fill();
        if (lk > 0) { roundRect(ctx, x + 10 + (w - 20) * keep, y + 10, (w - 20) * (1 - keep), h - 20, 22); ctx.fillStyle = C.red2; ctx.fill(); }
        text(ctx, '74 Wh', x + 30, y - 50, { size: 50, family: F.mono, weight: 700, color: C.fg, align: 'left' });
        text(ctx, '− 18 %', x + w - 20, y - 50, { size: 56, weight: 900, color: C.red2, align: 'right', alpha: lk });
        text(ctx, '🔥', x + w - 70, y + h / 2, { size: 70, family: F.emoji, weight: 400, alpha: lk });
        text(ctx, '≈ 61 Wh utiles', 520, 960, { size: 86, weight: 900, color: C.gold2, alpha: lk });
        text(ctx, 'source : Anker (rendement ~82 %)', 520, 1060, { size: 38, family: F.mono, weight: 400, color: 'rgba(255,255,255,0.8)', alpha: lk });
      });

      // Résultat : 3 à 4 recharges
      block(ctx, t, S('s07'), S('s08'), () => {
        const fills = [1, 1, 1, 0.75];
        fills.forEach((f, i) => {
          const k = ease.out(prog(t, S('s07') + 0.1 + i * 0.18, 0.35));
          phoneBattery(ctx, 220 + i * 200, 560, 0.85, f * k, i === 3 ? C.gold : C.green);
        });
        text(ctx, '3 à 4', 520, 840, { size: 180, weight: 900, color: C.white });
        text(ctx, 'PAS 5', 520, 990, { size: 96, weight: 900, color: C.red2 });
        const ck = ease.out(prog(t, S('s07') + 1.2, 0.4));
        text(ctx, '61 Wh ÷ 15,4 Wh ≈ 3,9', 520, 1095, { size: 40, family: F.mono, weight: 700, color: C.fg, alpha: ck });
        text(ctx, 'moins les pertes de charge du téléphone', 520, 1152, { size: 36, weight: 700, color: 'rgba(255,255,255,0.8)', alpha: ck, maxWidth: 820 });
      });

      // Regarde les Wh
      block(ctx, t, S('s08'), S('s09'), () => {
        roundRect(ctx, 170, 460, 700, 560, 36); ctx.fillStyle = '#e9edf5'; ctx.fill();
        text(ctx, 'ÉTIQUETTE', 520, 530, { size: 30, family: F.mono, weight: 700, color: '#5a6478', letter: 4 });
        text(ctx, '20 000 mAh', 520, 660, { size: 84, family: F.mono, weight: 700, color: '#5a6478' });
        const k = ease.out(prog(t, S('s08') + 0.4, 0.4));
        ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(260, 660); ctx.lineTo(lerp(260, 780, k), 660); ctx.stroke(); ctx.restore();
        text(ctx, '74 Wh', 520, 860, { size: 130, family: F.mono, weight: 700, color: '#05080f' });
        const k2 = ease.out(prog(t, S('s08') + 0.9, 0.5));
        ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(520, 860, 250, 110, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k2); ctx.stroke(); ctx.restore();
        chip(ctx, 'REGARDE LES Wh', 520, 1110, { color: C.gold, size: 34 });
      });

      // Avion : 100 Wh
      block(ctx, t, S('s09'), S('s10'), () => {
        text(ctx, '✈️', 520, 530, { size: 180, family: F.emoji, weight: 400 });
        text(ctx, '100 Wh', 520, 770, { size: 170, weight: 900, color: C.gold2 });
        text(ctx, 'max. par batterie externe', 520, 905, { size: 50, weight: 800, color: C.white });
        text(ctx, 'en cabine · 2 max. par passager', 520, 978, { size: 42, weight: 700, color: 'rgba(255,255,255,0.8)', maxWidth: 820 });
        text(ctx, 'pas de recharge à bord', 520, 1036, { size: 42, weight: 700, color: 'rgba(255,255,255,0.8)' });
      });

      // Black Friday puis abonnement
      const mid = S('s10') + (E('s10') - S('s10')) * 0.5;
      block(ctx, t, S('s10'), mid, () => {
        const k = ease.back(prog(t, S('s10'), 0.35));
        bookmark(ctx, 520, 600, 1.5 * Math.max(0.01, k), C.gold2);
        text(ctx, 'ENREGISTRE', 520, 870, { size: 120, weight: 900, color: C.white });
        chip(ctx, 'POUR LE BLACK FRIDAY', 520, 990, { color: C.gold, size: 34, dot: C.red });
      });
      block(ctx, t, mid, END + 1, () => followCTA(ctx, t, mid));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
