// Vidéo 98 — Suisse contre France : capsules Nespresso Livanto (Reel d'essai Instagram). Prix et calculs : days/day98/facts.md.
// Segment s11 de la voix (300 capsules) retiré au montage pour tenir 59–65 s.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, WHITE, f, pop, stamp, panel, big, line, tag, flagCH, flagFR, comment, head } = KIT;
  const FR = '#5aa9ff', CH = '#ff5a5f';
  // valeurs (facts.md)
  const RATE_TXT = 'BNS 25.11.2026 : 1 € = 0,9130 CHF';      // ex. « BNS 27.11.2026 : 1 € = 0,9130 CHF »
  const FR_CHF = '4.20';          // étui FR en CHF, ex. « 4.20 »
  const END = E('s15') + 0.6;
  function split(ctx) {
    ctx.save(); ctx.globalAlpha *= 0.16; ctx.fillStyle = CH; ctx.fillRect(0, 440, 500, 760); ctx.fillStyle = FR; ctx.fillRect(500, 440, 580, 760); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 450); ctx.lineTo(500, 1190); ctx.stroke(); ctx.restore();
    flagCH(ctx, 275, 520, 90); flagFR(ctx, 725, 520, 76);
    chip(ctx, 'TOI', 275, 615, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, 615, { color: WHITE, size: 36 });
  }
  // capsule générique (sans logo) : dôme doré vu de profil
  function capsule(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 70, 70, 12, 0, 0, 7); ctx.fill();
    const g = ctx.createLinearGradient(-60, 0, 60, 0); g.addColorStop(0, '#8a6a1f'); g.addColorStop(0.45, '#f1d27a'); g.addColorStop(1, '#7a5a16');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-80, 40); ctx.lineTo(80, 40); ctx.lineTo(80, 52); ctx.lineTo(-80, 52); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-62, 40); ctx.bezierCurveTo(-60, -40, -30, -70, 0, -72); ctx.bezierCurveTo(30, -70, 60, -40, 62, 40); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-34, 20); ctx.bezierCurveTo(-32, -30, -18, -52, 0, -56); ctx.stroke();
    ctx.restore();
  }
  function sleeve(ctx, x, y, s, t, n = 10) { // étui de 10, capsules alignées
    for (let i = 0; i < n; i++) capsule(ctx, x + (i - (n - 1) / 2) * 42 * s, y + Math.sin(t * 3 + i) * 3, s * 0.42, t);
  }
  function stack(ctx, x, y, n, s, t, t0) { // étuis empilés
    for (let i = 0; i < n; i++) {
      const k = ease.back(prog(t, t0 + i * 0.12, 0.3)); if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha *= clamp(k * 2);
      roundRect(ctx, x - 150 * s, y - i * 34 * s - (1 - k) * 60, 300 * s, 30 * s, 8); ctx.fillStyle = i % 2 ? '#c9a84c' : '#a8862f'; ctx.fill();
      ctx.restore();
    }
  }
  function price(ctx, s, x, y, t, t0, col, o = {}) {
    pop(ctx, t, t0, x, y, () => { ctx.rotate(o.rot ?? -0.03); panel(ctx, -(o.w || 215), -82, (o.w || 215) * 2, 164, { r: 22, border: col, lw: 7, bg: '#0a1322' }); text(ctx, s, 0, 4, { size: o.size || 80, family: F.mono, weight: 700, color: col, maxWidth: (o.w || 215) * 2 - 30 }); });
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
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face', 'package', 'warning', 'check_mark_button', 'shopping_cart', 'money_with_wings']),
    draw(ctx, t) {
      background(ctx, t);
      // image 0 : une capsule de chaque côté, les deux prix en très gros (qui battent), « ? » qui tourne
      block(ctx, t, 0, S('s03'), () => {
        big(ctx, 'NESPRESSO LIVANTO', 500, 345, t, undefined, { size: 70, family: F.display, color: WHITE });
        split(ctx); capsule(ctx, 275, 800, 1.2, t, { rot: 0.08 * Math.sin(t * 2) }); capsule(ctx, 725, 800, 1.2, t, { rot: -0.08 * Math.sin(t * 2) });
        const b = 1 + 0.06 * Math.sin(t * 5);
        ctx.save(); ctx.translate(275, 1010); ctx.scale(b, b); text(ctx, '5.70', 0, 0, { size: 124, family: F.mono, weight: 900, color: CH, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        ctx.save(); ctx.translate(725, 1010); ctx.scale(2 - b, 2 - b); text(ctx, '4,60', 0, 0, { size: 124, family: F.mono, weight: 900, color: FR, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        text(ctx, 'CHF / 10', 275, 1100, { size: 46, weight: 900, color: CH }); text(ctx, '€ / 10', 725, 1100, { size: 50, weight: 900, color: FR });
        ctx.save(); ctx.translate(500, 760); ctx.rotate(0.25 * Math.sin(t * 3)); text(ctx, '?', 0, 0, { size: 170, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        head(ctx, 'QUI PAIE LE PLUS ?', 1195, t, 1.0, { size: 52 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN', 500, 430, t, S('s03'), { size: 46, color: GOLD });
        stack(ctx, 500, 900, 10, 1, t, S('s03') + 0.1);
        CHR.emo(ctx, 'warning', 500, 560, 150, t, f('s03', 0.4));
        big(ctx, 'LA CAPSULE DE TROP', 500, 1080, t, f('s03', 0.35), { size: 74, family: F.display, color: GOLD });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        flagCH(ctx, 500, 405, 130); sleeve(ctx, 500, 760, 1.9, t);
        tag(ctx, 'NESPRESSO SUISSE · LIVANTO', 500, 520, t, S('s04') + 0.1, { size: 38 });
        price(ctx, '5.70 CHF', 500, 960, t, f('s04', 0.2), CH, { w: 250, size: 84 });
        big(ctx, '0.57 / capsule', 500, 1120, t, f('s04', 0.6), { size: 70, color: WHITE });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        flagFR(ctx, 500, 405, 110); sleeve(ctx, 500, 760, 1.9, t);
        tag(ctx, 'NESPRESSO FRANCE · LIVANTO', 500, 520, t, S('s05') + 0.1, { size: 38 });
        price(ctx, '4,60 €', 500, 960, t, f('s05', 0.3), FR, { w: 250, size: 84 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, RATE_TXT, 500, 400, t, S('s06'), { size: 34, color: GOLD });
        line(ctx, '4,60 € × cours BNS', 500, 580, t, S('s06') + 0.2, { size: 66, family: F.mono, weight: 700, dx: 0 });
        big(ctx, FR_CHF + ' CHF', 500, 790, t, f('s06', 0.45), { size: 150, color: FR });
        line(ctx, "L'ÉTUI DE 10", 500, 960, t, f('s06', 0.6), { size: 54, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        split(ctx);
        price(ctx, '0.57', 275, 860, t, S('s07') - 1, CH, { w: 180, size: 96 }); price(ctx, '0.42', 725, 860, t, S('s07') - 1, FR, { w: 180, size: 96 });
        text(ctx, 'CHF / capsule', 500, 990, { size: 44, weight: 800, color: '#c9d2e3' });
        stamp(ctx, '− 0.15', 725, 1100, t, f('s07', 0.2), { size: 76, color: GREEN });
        stamp(ctx, '− 26 %', 275, 1100, t, f('s07', 0.6), { size: 70, color: GOLD });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        flagFR(ctx, 500, 420, 100);
        CHR.emo(ctx, 'package', 500, 680, 230, t, S('s08') + 0.1);
        line(ctx, 'LIVRAISON : FRANCE SEULEMENT', 500, 900, t, f('s08', 0.25), { size: 50, weight: 900, color: WHITE, dx: 0 });
        CHR.emo(ctx, 'shopping_cart', 500, 1060, 150, t, f('s08', 0.55));
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, 'OFDF · FRANCHISE-VALEUR', 500, 400, t, S('s09'), { size: 40, color: GOLD });
        big(ctx, '150 CHF', 500, 620, t, S('s09') + 0.3, { size: 150, color: GREEN });
        line(ctx, 'PAR PERSONNE ET PAR JOUR', 500, 790, t, f('s09', 0.35), { size: 50, weight: 900, color: WHITE, dx: 0 });
        line(ctx, 'VALEUR SANS TVA FRANÇAISE (5,5 %)', 500, 900, t, f('s09', 0.65), { size: 44, weight: 900, color: '#c9d2e3', dx: 0 });
      });
      block(ctx, t, S('s10'), S('s12'), () => {
        split(ctx);
        tag(ctx, '100 CAPSULES', 500, 700, t, S('s10'), { size: 44, color: GOLD });
        price(ctx, '57.00', 275, 900, t, f('s10', 0.45), CH, { w: 190, size: 88 }); price(ctx, '42.00', 725, 900, t, f('s10', 0.25), FR, { w: 190, size: 88 });
        stamp(ctx, '− 15 CHF', 500, 1080, t, f('s10', 0.7), { size: 80, color: GREEN });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ton café,', 'tu l\'achètes où ?', '🇨🇭 ou 🇫🇷'], { color: GOLD, size: 62 }); });
      block(ctx, t, S('s13'), S('s14'), () => {
        stamp(ctx, '> 150 CHF', 500, 450, t, S('s13'), { size: 70, color: RED });
        CHR.emo(ctx, 'warning', 500, 640, 170, t, S('s13') + 0.3);
        line(ctx, 'TVA SUISSE SUR LE TOUT', 500, 820, t, f('s13', 0.3), { size: 56, weight: 900, color: WHITE, dx: 0 });
        big(ctx, '2,6 %', 500, 990, t, f('s13', 0.6), { size: 140, color: CH });
        tag(ctx, 'TAUX RÉDUIT · CAFÉ', 500, 1120, t, f('s13', 0.7), { size: 38 });
      });
      block(ctx, t, S('s14'), S('s15'), () => {
        tag(ctx, 'LA CAPSULE DE TROP', 500, 410, t, S('s14'), { size: 42, color: GOLD });
        big(ctx, 'N° 377', 500, 600, t, f('s14', 0.15), { size: 160, color: RED });
        line(ctx, '377 × 0,46 € / 1,055 × 0,913 = 150.08', 500, 770, t, f('s14', 0.3), { size: 40, family: F.mono, weight: 700, color: '#c9d2e3', dx: 0 });
        stack(ctx, 500, 1110, 6, 0.9, t, f('s14', 0.45));
        stamp(ctx, '37 ÉTUIS OK · LE 38e PAIE', 500, 1195, t, f('s14', 0.7), { size: 46, color: GOLD });
        tag(ctx, 'EXEMPLE DE CALCUL', 500, 850, t, f('s14', 0.6), { size: 38 });
      });
      block(ctx, t, S('s15'), END + 1, () => igEnd(ctx, t, S('s15')));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
