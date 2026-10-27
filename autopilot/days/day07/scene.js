// Jour 7 — « Deux câbles USB-C identiques : 60 W ou 240 W » (mécanique : le piège invisible, avant le Black Friday).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, bookmark } = ENG;
  const END = E('s09') + 0.55;

  function cable(ctx, x, y, len, rot, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.strokeStyle = color || '#d9dee8'; ctx.lineWidth = 22; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(len * 0.3, -60, len * 0.6, 60, len, 0); ctx.stroke();
    [[0, 1], [len, -1]].forEach(([px, dir]) => {
      ctx.save(); ctx.translate(px, 0);
      roundRect(ctx, -46, -26, 92, 52, 14); ctx.fillStyle = '#e9edf5'; ctx.fill();
      roundRect(ctx, -30 + dir * 60 - 0, -14, 60, 28, 12); ctx.fillStyle = '#8e9ab3'; ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }
  function bar(ctx, x, y, w, maxW, label, value, color) {
    text(ctx, label, x, y - 46, { size: 34, family: F.mono, weight: 700, color: C.muted, align: 'left' });
    roundRect(ctx, x, y - 22, maxW, 44, 22); ctx.fillStyle = '#0b1220'; ctx.fill();
    roundRect(ctx, x, y - 22, Math.max(44, w), 44, 22); ctx.fillStyle = color; ctx.fill();
    text(ctx, value, x + maxW, y - 46, { size: 38, family: F.mono, weight: 700, color: C.fg, align: 'right' });
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : deux câbles identiques
      block(ctx, t, 0, S('s03'), () => {
        cable(ctx, 220, 560, 600, 0, '#d9dee8');
        cable(ctx, 220, 820, 600, 0, '#d9dee8');
        const k = prog(t, S('s02') + 0.6, 0.3), k2 = prog(t, S('s02') + 1.6, 0.3);
        text(ctx, '60 W', 880, 470, { size: 70, weight: 900, color: C.red2, alpha: k, align: 'right' });
        text(ctx, '240 W', 880, 730, { size: 70, weight: 900, color: C.gold2, alpha: k2, align: 'right' });
        text(ctx, 'IDENTIQUES ?', 520, 1060, { size: 110, weight: 900, color: C.white });
      });

      // 3 A × 20 V = 60 W
      block(ctx, t, S('s03'), S('s04'), () => {
        chip(ctx, 'CÂBLE USB-C NORMAL', 520, 420, { color: C.fg, size: 32 });
        text(ctx, '3 A × 20 V', 520, 640, { size: 120, family: F.mono, weight: 700, color: C.white });
        const k = ease.back(prog(t, S('s03') + 1.0, 0.4));
        if (k > 0) { ctx.save(); ctx.translate(520, 860); ctx.scale(k, k); text(ctx, '= 60 W', 0, 0, { size: 170, weight: 900, color: C.gold2 }); ctx.restore(); }
      });

      // 5 A : 100 W, EPR 240 W
      block(ctx, t, S('s04'), S('s05'), () => {
        chip(ctx, 'CÂBLE 5 A', 520, 420, { color: C.gold, size: 32, dot: C.gold });
        text(ctx, '5 A × 20 V = 100 W', 520, 620, { size: 76, family: F.mono, weight: 700, color: C.white, maxWidth: 900 });
        const k = ease.back(prog(t, S('s04') + 1.6, 0.4));
        if (k > 0) { ctx.save(); ctx.translate(520, 820); ctx.scale(k, k);
          text(ctx, '5 A × 48 V', 0, 0, { size: 76, family: F.mono, weight: 700, color: C.white }); ctx.restore();
          text(ctx, '= 240 W', 520, 980, { size: 150, weight: 900, color: C.gold2, alpha: clamp(k) }); }
      });

      // Données : 480 Mbit/s vs 40/80 Gbit/s
      block(ctx, t, S('s05'), S('s07'), () => {
        chip(ctx, 'DONNÉES', 520, 420, { color: C.fg, size: 32 });
        const maxW = 760, x = 140;
        const k1 = ease.out(prog(t, S('s05') + 0.4, 0.6));
        bar(ctx, x, 620, maxW * (480 / 80000) * k1, maxW, 'USB 2', '480 Mbit/s', C.red2);
        const k2 = ease.out(prog(t, S('s06') + 0.2, 0.9));
        bar(ctx, x, 800, maxW * 0.5 * k2, maxW, 'USB4', '40 Gbit/s', C.gold);
        const k3 = ease.out(prog(t, S('s06') + 0.9, 0.9));
        bar(ctx, x, 980, maxW * 1.0 * k3, maxW, 'USB4 v2', '80 Gbit/s', C.gold2);
        if (k2 > 0.5) text(ctx, '× 83', 520, 1120, { size: 80, weight: 900, color: C.white, alpha: clamp((k2 - 0.5) * 2) });
      });

      // L'emballage
      block(ctx, t, S('s07'), S('s08'), () => {
        roundRect(ctx, 200, 420, 640, 700, 34); ctx.fillStyle = '#e9edf5'; ctx.fill();
        text(ctx, 'EMBALLAGE', 520, 490, { size: 30, family: F.mono, weight: 700, color: '#5a6478', letter: 4 });
        const k = ease.back(prog(t, S('s07') + 0.5, 0.35)), k2 = ease.back(prog(t, S('s07') + 1.0, 0.35));
        if (k > 0) { ctx.save(); ctx.translate(520, 680); ctx.scale(k, k); roundRect(ctx, -200, -90, 400, 180, 26); ctx.lineWidth = 10; ctx.strokeStyle = '#05080f'; ctx.stroke(); text(ctx, '240 W', 0, 4, { size: 110, weight: 900, color: '#05080f' }); ctx.restore(); }
        if (k2 > 0) { ctx.save(); ctx.translate(520, 940); ctx.scale(k2, k2); roundRect(ctx, -200, -90, 400, 180, 26); ctx.lineWidth = 10; ctx.strokeStyle = '#05080f'; ctx.stroke(); text(ctx, '40 Gbps', 0, 4, { size: 96, weight: 900, color: '#05080f' }); ctx.restore(); }
        chip(ctx, 'WATTS + VITESSE', 520, 1190, { color: C.gold, size: 30 });
      });

      // Black Friday
      block(ctx, t, S('s08'), S('s09'), () => {
        const k = ease.back(prog(t, S('s08'), 0.35));
        bookmark(ctx, 520, 600, 1.5 * Math.max(0.01, k), C.gold2);
        text(ctx, 'ENREGISTRE', 520, 870, { size: 120, weight: 900, color: C.white });
        chip(ctx, 'POUR LE BLACK FRIDAY', 520, 990, { color: C.gold, size: 34, dot: C.red });
      });

      block(ctx, t, S('s09'), END + 1, () => followCTA(ctx, t, S('s09'), { next: ['l\'eau en trop dans', 'ta bouilloire : combien ?'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
