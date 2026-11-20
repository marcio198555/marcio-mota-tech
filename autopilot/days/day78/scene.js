// Vidéo 78 — Suisse contre France : AirPods Pro 3 (série des jours 70 et 73). Prix relevés le 20.11.2026 ; calculs : days/day78/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, flagCH, flagFR, comment, head } = KIT;
  const FR = '#5aa9ff', CH = '#ff5a5f';
  const END = E('s16') + 0.6;
  function split(ctx, t) {
    ctx.save(); ctx.globalAlpha *= 0.16; ctx.fillStyle = CH; ctx.fillRect(0, 440, 500, 760); ctx.fillStyle = FR; ctx.fillRect(500, 440, 580, 760); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 450); ctx.lineTo(500, 1190); ctx.stroke(); ctx.restore();
    flagCH(ctx, 275, 520, 90); flagFR(ctx, 725, 520, 76);
    chip(ctx, 'TOI', 275, 615, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, 615, { color: WHITE, size: 36 });
  }
  // écouteurs génériques (sans logo) : boîtier ouvert + deux écouteurs
  function buds(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -120, -20, 240, 150, 50); ctx.fillStyle = '#f2f4f7'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#b9c0cc'; ctx.stroke();
    ctx.strokeStyle = '#c9ced8'; ctx.beginPath(); ctx.moveTo(-118, 20); ctx.lineTo(118, 20); ctx.stroke();
    ctx.fillStyle = '#58d68d'; ctx.beginPath(); ctx.arc(0, 75, 6, 0, 7); ctx.fill();
    const bob = 6 * Math.sin(t * 2.4);
    [-1, 1].forEach((sd) => {
      ctx.save(); ctx.translate(sd * 55, -70 + bob * sd); ctx.rotate(sd * 0.18);
      roundRect(ctx, -14, -10, 28, 110, 14); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = '#b9c0cc'; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(sd * -10, -30, 38, 32, 0, 0, 7); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(sd * -34, -38, 14, 12, 0, 0, 7); ctx.fillStyle = '#d7dbe3'; ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }
  function price(ctx, s, x, y, t, t0, col, o = {}) {
    pop(ctx, t, t0, x, y, () => { ctx.rotate(o.rot ?? -0.03); panel(ctx, -(o.w || 215), -82, (o.w || 215) * 2, 164, { r: 22, border: col, lw: 7, bg: '#0a1322' }); text(ctx, s, 0, 4, { size: o.size || 80, family: F.mono, weight: 700, color: col, maxWidth: (o.w || 215) * 2 - 30 }); });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['receipt', 'warning', 'thinking_face', 'exploding_head', 'chart_decreasing', 'package', 'magnifying_glass_tilted_left', 'money_with_wings']),
    draw(ctx, t) {
      background(ctx, t);
      // image 0 : écouteurs + les deux prix de la boîte en très gros + « ? »
      block(ctx, t, 0, S('s02'), () => {
        big(ctx, 'AirPods Pro 3', 500, 345, t, undefined, { size: 80, family: F.display, color: WHITE });
        split(ctx, t); buds(ctx, 275, 760, 0.95 + 0.02 * Math.sin(t * 2), t); buds(ctx, 725, 760, 0.95, t);
        text(ctx, '219', 275, 985, { size: 170, family: F.mono, weight: 900, color: CH, stroke: 'rgba(0,0,0,0.55)' });
        text(ctx, '249', 725, 985, { size: 170, family: F.mono, weight: 900, color: FR, stroke: 'rgba(0,0,0,0.55)' });
        text(ctx, 'CHF', 275, 1090, { size: 52, weight: 900, color: CH }); text(ctx, '€', 725, 1090, { size: 60, weight: 900, color: FR });
        text(ctx, '?', 500, 985, { size: 170, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)' });
        head(ctx, 'QUI PAIE LE MOINS ?', 1195, t, 1.0, { size: 52 });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        big(ctx, 'CETTE FOIS', 500, 480, t, S('s02'), { size: 120, family: F.display, color: GOLD });
        stamp(ctx, 'PAS LA FRANCE', 500, 690, t, f('s02', 0.25), { size: 76, color: CH });
        CHR.emo(ctx, 'thinking_face', 500, 950, 220, t, f('s02', 0.5));
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        flagCH(ctx, 500, 405, 130); buds(ctx, 500, 760, 1.25, t);
        price(ctx, '219.00 CHF', 500, 1100, t, f('s03', 0.45), CH, { w: 250 });
        tag(ctx, 'APPLE SUISSE · 20.11.2026', 500, 530, t, S('s03') + 0.1, { size: 38 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        flagFR(ctx, 500, 405, 110); buds(ctx, 500, 760, 1.25, t);
        price(ctx, '249,00 €', 500, 1100, t, f('s04', 0.45), FR, { w: 230 });
        tag(ctx, 'APPLE FRANCE · 20.11.2026', 500, 530, t, S('s04') + 0.1, { size: 38 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'BNS · 19.11.2026 · 1 € = 0,9263 CHF', 500, 380, t, S('s05'), { size: 38, color: GOLD });
        line(ctx, '249 × 0,9263', 500, 560, t, S('s05') + 0.2, { size: 70, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '231 CHF', 500, 770, t, f('s05', 0.55), { size: 160, color: FR });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        split(ctx, t);
        price(ctx, '219', 275, 860, t, S('s06') - 1, CH, { w: 170, size: 96 }); price(ctx, '231', 725, 860, t, S('s06') - 1, FR, { w: 170, size: 96 });
        stamp(ctx, '+ 12 CHF', 725, 1070, t, f('s06', 0.3), { size: 76, color: RED });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'OFDF · FRANCHISE 150 CHF', 500, 380, t, S('s07'), { size: 40, color: GOLD });
        CHR.emo(ctx, 'package', 500, 630, 250, t, S('s07') + 0.1);
        line(ctx, '231 > 150', 500, 860, t, f('s07', 0.35), { size: 70, family: F.mono, weight: 700, color: WHITE, dx: 0 });
        line(ctx, 'TVA SUISSE 8,1 %', 500, 970, t, f('s07', 0.6), { size: 60, weight: 900, color: CH, dx: 0 });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        line(ctx, 'TVA sur 192 (sans TVA FR)', 500, 430, t, S('s08'), { size: 46, family: F.mono, weight: 700, color: C.dim || '#aab4c8', dx: 0 });
        line(ctx, '231 + 16', 500, 560, t, S('s08') + 0.15, { size: 72, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '≈ 246 CHF', 500, 760, t, f('s08', 0.45), { size: 150, color: FR });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        split(ctx, t);
        price(ctx, '219', 275, 860, t, S('s09') - 1, CH, { w: 170, size: 96 }); price(ctx, '≈ 246', 725, 860, t, S('s09'), FR, { w: 200, size: 90 });
        stamp(ctx, '+ 27 CHF', 725, 1070, t, f('s09', 0.3), { size: 76, color: RED });
        CHR.emo(ctx, 'money_with_wings', 275, 1070, 150, t, f('s09', 0.5));
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, '2e SURPRISE', 500, 380, t, S('s10'), { size: 66, color: GOLD });
        big(ctx, 'DÉTAXE', 500, 560, t, f('s10', 0.15), { size: 130, family: F.display, color: GOLD });
        tag(ctx, 'SI UN VENDEUR L\'ACCORDE · AU MIEUX', 500, 720, t, f('s10', 0.35), { size: 38 });
        big(ctx, '≈ 208 CHF', 500, 900, t, f('s10', 0.65), { size: 130, color: GREEN });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        big(ctx, '− 11 CHF', 500, 560, t, S('s11'), { size: 170, color: GREEN });
        CHR.emo(ctx, 'exploding_head', 500, 960, 200, t, f('s11', 0.5));
        tag(ctx, 'HORS FRAIS DE DÉTAXE', 500, 760, t, f('s11', 0.4), { size: 40 });
      });
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, 'CONSEIL', 500, 380, t, S('s12'), { size: 46, color: GREEN });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 500, 630, 250, t, S('s12') + 0.1);
        line(ctx, 'COMPARE LES 2 SITES', 500, 880, t, f('s12', 0.3), { size: 58, weight: 900, dx: 0 });
        line(ctx, 'LE JOUR DE L\'ACHAT', 500, 970, t, f('s12', 0.55), { size: 58, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s13'), S('s14'), () => {
        CHR.emo(ctx, 'chart_decreasing', 500, 600, 260, t, S('s13'));
        line(ctx, 'LES PRIX BOUGENT', 500, 870, t, f('s13', 0.3), { size: 66, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s14'), S('s15'), () => { comment(ctx, t, S('s14'), ['Tes écouteurs,', 'achetés où ?', '🇨🇭 ou 🇫🇷'], { color: GOLD }); });
      block(ctx, t, S('s15'), S('s16'), () => {
        split(ctx, t); buds(ctx, 275, 790, 0.8, t); buds(ctx, 725, 790, 0.8, t);
        price(ctx, '219', 275, 1060, t, S('s15'), CH, { w: 170, size: 96 }); price(ctx, '≈ 246', 725, 1060, t, f('s15', 0.4), FR, { w: 200, size: 90 });
      });
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'CE SOIR', next: ['ton sèche-cheveux :', 'combien par an ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
