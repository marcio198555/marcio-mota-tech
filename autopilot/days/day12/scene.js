// Jour 12 — « Ton chargeur 65 W ne charge pas ton téléphone à 65 W » (USB-IF, fiches Samsung).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, roundRect, chip, captions, brand, block, followCTA, phone } = ENG;
  const END = E('s06') + 0.55;

  function charger(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -150, -170, 300, 340, 46); ctx.fillStyle = '#e9edf5'; ctx.fill();
    roundRect(ctx, -40, 170, 80, 40, 10); ctx.fillStyle = '#b9c0cc'; ctx.fill();
    text(ctx, '65 W', 0, -20, { size: 104, family: F.mono, weight: 700, color: '#030408' });
    text(ctx, 'USB-C PD', 0, 80, { size: 40, family: F.mono, weight: 700, color: '#4a5468' });
    ctx.restore();
  }
  function cable(ctx, x1, y1, x2, y2, k) {
    ctx.save(); ctx.strokeStyle = '#cfd5df'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.bezierCurveTo(x1, y1 + 50, x2, y2 + 50, x2, y2); ctx.stroke();
    // impulsion qui circule
    const u = (k % 1);
    const px = lerp(x1, x2, u), py = lerp(y1, y2, u) + 37 * Math.sin(Math.PI * u);
    ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fillStyle = C.gold2; ctx.fill();
    ctx.restore();
  }
  function bar(ctx, y, label, w, val, color, k) {
    text(ctx, label, 110, y - 48, { size: 50, weight: 800, color: C.white, align: 'left' });
    roundRect(ctx, 110, y, 760, 64, 16); ctx.fillStyle = '#1b2638'; ctx.fill();
    const ww = 760 * w * ease.out(clamp(k));
    if (ww > 20) { roundRect(ctx, 110, y, ww, 64, 16); ctx.fillStyle = color; ctx.fill(); }
    text(ctx, val, 110 + Math.max(ww, 150) - 20, y + 33, { size: 46, family: F.mono, weight: 700, color: '#030408', align: 'right', alpha: clamp(k * 2) });
  }

  window.SCENE = {
    duration: END,
    draw(ctx, t) {
      background(ctx, t);

      // ACCROCHE : 65 W ? ton téléphone en prend moins
      block(ctx, t, 0, S('s02'), () => {
        const z = 1 + 0.03 * ease.out(prog(t, 0, 3));
        ctx.save(); ctx.translate(520, 700); ctx.scale(z, z); ctx.translate(-520, -700);
        text(ctx, 'CHARGEUR 65 W ?', 520, 360, { size: 96, weight: 900, color: C.white });
        charger(ctx, 300, 690, 0.95);
        phone(ctx, 750, 700, 250, 470, { draw: (x, y, w, h) => {
          text(ctx, '⚡', x + w / 2, y + h * 0.36, { size: 90, family: F.emoji });
          text(ctx, '? W', x + w / 2, y + h * 0.66, { size: 64, family: F.mono, weight: 700, color: C.red2 });
        } });
        cable(ctx, 300, 880, 750, 935, t * 0.6);
        text(ctx, 'TON TÉLÉPHONE', 520, 1080, { size: 80, weight: 900, color: C.white });
        text(ctx, 'DÉCIDE CE QU\'IL PREND', 520, 1170, { size: 74, weight: 900, color: C.red2 });
        ctx.restore();
      });

      // Le téléphone demande
      block(ctx, t, S('s02'), S('s03'), () => {
        chip(ctx, 'USB POWER DELIVERY · USB-IF', 520, 380, { color: C.gold, size: 36 });
        const k = ease.back(prog(t, S('s02') + 0.1, 0.5));
        phone(ctx, 300, 720, 230, 430, { draw: (x, y, w, h) => text(ctx, '? W', x + w / 2, y + h / 2, { size: 50, family: F.mono, weight: 700, color: C.gold2 }) });
        ctx.save(); ctx.globalAlpha = clamp(k);
        text(ctx, '→', 520, 700, { size: 120, weight: 900, color: C.gold2 });
        ctx.restore();
        charger(ctx, 760, 700, 0.75);
        text(ctx, 'le téléphone demande,', 520, 1010, { size: 62, weight: 900, color: C.white, alpha: clamp(k) });
        text(ctx, 'le chargeur fournit', 520, 1090, { size: 62, weight: 900, color: C.gold2, alpha: clamp(k) });
      });

      // Puissances maximales officielles
      block(ctx, t, S('s03'), S('s05'), () => {
        chip(ctx, 'SOURCE : SAMSUNG.COM (FILAIRE)', 520, 370, { color: C.gold, size: 36 });
        bar(ctx, 520, 'Ton chargeur', 1, '65 W', C.muted, prog(t, S('s03'), 0.5));
        bar(ctx, 720, 'Galaxy S25', 25 / 65, '25 W', C.gold, prog(t, S('s03') + 0.6, 0.7));
        bar(ctx, 920, 'Galaxy S25 Ultra', 45 / 65, '45 W', C.gold2, prog(t, S('s04'), 0.7));
        text(ctx, '45 W : chargeur 45 W + câble 5 A', 520, 1080, { size: 50, weight: 800, color: C.white, alpha: clamp(prog(t, S('s04') + 1.2, 0.4)) });
      });

      // Plus de watts ≠ plus vite
      block(ctx, t, S('s05'), S('s06'), () => {
        const k = ease.back(prog(t, S('s05') + 0.1, 0.45));
        ctx.save(); ctx.translate(520, 640); ctx.scale(k, k);
        text(ctx, '+ DE WATTS', 0, -90, { size: 110, weight: 900, color: C.white });
        text(ctx, '≠ + VITE', 0, 40, { size: 110, weight: 900, color: C.red2 });
        ctx.restore();
        text(ctx, 'au-delà du maximum', 520, 900, { size: 58, weight: 800, color: C.gold2, alpha: clamp(k) });
        text(ctx, 'de ton téléphone', 520, 975, { size: 58, weight: 800, color: C.gold2, alpha: clamp(k) });
      });

      block(ctx, t, S('s06'), END + 1, () => followCTA(ctx, t, S('s06'), { when: 'DEMAIN', next: ['le prix barré :', 'ce que dit la loi suisse'] }));

      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
