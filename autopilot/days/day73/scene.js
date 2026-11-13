// Vidéo 73 — Suisse contre France : Nintendo Switch 2 (partie 2 du jour 70). Prix relevés le 13.11.2026 ; calculs : days/day73/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, flagCH, flagFR, comment, head } = KIT;
  const FR = '#5aa9ff', CH = '#ff5a5f';
  const END = E('s16') + 0.6;
  function split(ctx, t) {
    ctx.save(); ctx.globalAlpha *= 0.16; ctx.fillStyle = CH; ctx.fillRect(0, 440, 500, 700); ctx.fillStyle = FR; ctx.fillRect(500, 440, 580, 700); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 450); ctx.lineTo(500, 1130); ctx.stroke(); ctx.restore();
    flagCH(ctx, 275, 520, 90); flagFR(ctx, 725, 520, 76);
    chip(ctx, 'TOI', 275, 615, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, 615, { color: WHITE, size: 36 });
  }
  // console portable générique (sans logo) : écran + deux manettes
  function console2(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -200, -85, 60, 170, 28); ctx.fillStyle = '#4a5468'; ctx.fill();
    roundRect(ctx, 140, -85, 60, 170, 28); ctx.fillStyle = '#4a5468'; ctx.fill();
    roundRect(ctx, -145, -90, 290, 180, 16); ctx.fillStyle = '#10141c'; ctx.fill();
    roundRect(ctx, -128, -74, 256, 148, 8); const g = ctx.createLinearGradient(0, -74, 0, 74); g.addColorStop(0, '#3b5fa8'); g.addColorStop(1, '#5e2f8f'); ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = '#10141c'; ctx.beginPath(); ctx.arc(-170, -40, 14, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(170, 30, 14, 0, 7); ctx.fill();
    ctx.restore();
  }
  function price(ctx, s, x, y, t, t0, col, o = {}) {
    pop(ctx, t, t0, x, y, () => { ctx.rotate(o.rot ?? -0.03); panel(ctx, -(o.w || 215), -82, (o.w || 215) * 2, 164, { r: 22, border: col, lw: 7, bg: '#0a1322' }); text(ctx, s, 0, 4, { size: o.size || 80, family: F.mono, weight: 700, color: col, maxWidth: (o.w || 215) * 2 - 30 }); });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['receipt', 'warning', 'thinking_face', 'exploding_head', 'chart_decreasing', 'credit_card', 'package']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => {
        big(ctx, 'Nintendo Switch 2', 500, 345, t, undefined, { size: 74, family: F.display, color: WHITE });
        split(ctx, t); console2(ctx, 275, 870, 1.0 + 0.02 * Math.sin(t * 2), t); console2(ctx, 725, 870, 1.0, t);
        head(ctx, 'QUI PAIE LE MOINS ?', 1190, t, undefined, { size: 60 });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        big(ctx, 'CETTE FOIS', 500, 500, t, S('s02'), { size: 120, family: F.display, color: GOLD });
        stamp(ctx, 'ÇA S\'INVERSE', 500, 720, t, f('s02', 0.4), { size: 80 });
        CHR.emo(ctx, 'thinking_face', 500, 980, 240, t, f('s02', 0.2));
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        flagCH(ctx, 500, 405, 130); console2(ctx, 500, 790, 1.2, t);
        price(ctx, '499.90 CHF', 500, 1100, t, f('s03', 0.5), CH, { w: 250 });
        tag(ctx, 'BOUTIQUE NINTENDO · 13.11.2026', 500, 530, t, S('s03') + 0.1, { size: 36 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        flagFR(ctx, 500, 405, 110); console2(ctx, 500, 790, 1.2, t);
        price(ctx, '499,99 €', 500, 1100, t, f('s04', 0.4), FR, { w: 230 });
        tag(ctx, 'BOUTIQUE NINTENDO FRANCE · TVA COMPRISE', 500, 530, t, S('s04') + 0.1, { size: 34 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'BNS · 12.11.2026 · 1 € = 0,9228 CHF', 500, 380, t, S('s05'), { size: 38, color: GOLD });
        line(ctx, '499,99 × 0,9228', 500, 560, t, S('s05') + 0.15, { size: 64, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '461 CHF', 500, 760, t, f('s05', 0.5), { size: 150, color: FR });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        split(ctx, t);
        price(ctx, '499.90', 275, 860, t, S('s06') - 1, CH, { w: 200 }); price(ctx, '461', 725, 860, t, S('s06') - 1, FR, { w: 170 });
        stamp(ctx, '− 38 CHF', 725, 1060, t, f('s06', 0.3), { size: 76, color: GREEN });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'OFDF · FRANCHISE 150 CHF', 500, 380, t, S('s07'), { size: 40, color: GOLD });
        CHR.emo(ctx, 'package', 500, 640, 260, t, S('s07') + 0.1);
        line(ctx, 'AU-DESSUS : TVA SUISSE 8,1 %', 500, 900, t, f('s07', 0.5), { size: 56, weight: 900, color: CH, dx: 0 });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        line(ctx, '461 + 31 (TVA suisse)', 500, 520, t, S('s08'), { size: 60, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '≈ 493 CHF', 500, 720, t, f('s08', 0.45), { size: 140, color: FR });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        split(ctx, t);
        price(ctx, '499.90', 275, 860, t, S('s09') - 1, CH, { w: 200 }); price(ctx, '≈ 493', 725, 860, t, S('s09'), FR, { w: 200 });
        stamp(ctx, '− 7 CHF', 725, 1060, t, f('s09', 0.3), { size: 76, color: GREEN });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, '2e SURPRISE', 500, 380, t, S('s10'), { size: 66, color: GOLD });
        big(ctx, 'DÉTAXE', 500, 560, t, f('s10', 0.15), { size: 130, family: F.display, color: GOLD });
        tag(ctx, 'SI UN VENDEUR L\'ACCORDE · AU MIEUX', 500, 720, t, f('s10', 0.35), { size: 38 });
        big(ctx, '≈ 416 CHF', 500, 900, t, f('s10', 0.6), { size: 130, color: GREEN });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        big(ctx, '− 84 CHF', 500, 620, t, S('s11') + 0.05, { size: 170, color: GREEN });
        tag(ctx, 'FRAIS DE DÉTAXE ET LIVRAISON NON COMPTÉS', 500, 840, t, f('s11', 0.4), { size: 34 });
      });
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, 'CONSEIL', 500, 380, t, S('s12'), { size: 46, color: GREEN });
        CHR.emo(ctx, 'receipt', 500, 640, 260, t, S('s12') + 0.1);
        line(ctx, 'QUITTANCE AVEC TVA FRANÇAISE', 500, 880, t, f('s12', 0.35), { size: 54, weight: 900, dx: 0 });
        line(ctx, '+ DÉCLARE TON ACHAT', 500, 970, t, f('s12', 0.6), { size: 54, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s13'), S('s14'), () => {
        CHR.emo(ctx, 'chart_decreasing', 500, 600, 280, t, S('s13'));
        line(ctx, 'LES PRIX BOUGENT', 500, 880, t, f('s13', 0.3), { size: 66, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s14'), S('s15'), () => { comment(ctx, t, S('s14'), ['Ta console,', 'achetée où ?', '🇨🇭 ou 🇫🇷'], { color: GOLD }); });
      block(ctx, t, S('s15'), S('s16'), () => {
        split(ctx, t); console2(ctx, 275, 800, 0.9, t); console2(ctx, 725, 800, 0.9, t);
        price(ctx, '499.90', 275, 1040, t, S('s15'), CH, { w: 200 }); price(ctx, '≈ 493', 725, 1040, t, f('s15', 0.4), FR, { w: 200 });
      });
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'CE SOIR', next: ['le mode avion fait-il', 'charger plus vite ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
