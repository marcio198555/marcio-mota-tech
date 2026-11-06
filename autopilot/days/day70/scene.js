// Vidéo 70 — Suisse contre France : l'iPhone 17. Prix relevés le 06.11.2026 ; calculs : days/day70/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect, phone } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, bars, flagCH, flagFR, comment } = KIT;
  const FR = '#5aa9ff', CH = '#ff5a5f';
  const END = E('s16') + 0.6;
  function split(ctx, t) { // écran partagé rouge / bleu
    ctx.save(); ctx.globalAlpha *= 0.16; ctx.fillStyle = CH; ctx.fillRect(0, 440, 500, 800); ctx.fillStyle = FR; ctx.fillRect(500, 440, 580, 800); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 450); ctx.lineTo(500, 1220); ctx.stroke(); ctx.restore();
    flagCH(ctx, 275, 520, 90); flagFR(ctx, 725, 520, 76);
    chip(ctx, 'TOI', 275, 615, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, 615, { color: WHITE, size: 34 });
  }
  function tel(ctx, x, y, s, color) {
    phone(ctx, x, y, 210 * s, 400 * s, { border: color || '#6b7a97', draw: (a, b, w, h) => { const g = ctx.createLinearGradient(0, b, 0, b + h); g.addColorStop(0, '#22345a'); g.addColorStop(1, '#0b1220'); ctx.fillStyle = g; ctx.fillRect(a, b, w, h); text(ctx, '256', a + w / 2, b + h * 0.46, { size: 60 * s, weight: 900, color: WHITE }); text(ctx, 'Go', a + w / 2, b + h * 0.62, { size: 36 * s, weight: 800, color: '#aeb8cc' }); } });
  }
  function price(ctx, s, x, y, t, t0, col, o = {}) { // étiquette de prix
    pop(ctx, t, t0, x, y, () => { ctx.rotate(o.rot ?? -0.03); panel(ctx, -(o.w || 215), -82, (o.w || 215) * 2, 164, { r: 22, border: col, lw: 7, bg: '#0a1322' }); text(ctx, s, 0, 4, { size: o.size || 86, family: F.mono, weight: 700, color: col, maxWidth: (o.w || 215) * 2 - 30 }); });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['mobile_phone', 'credit_card', 'receipt', 'stopwatch', 'warning', 'thinking_face', 'exploding_head', 'chart_decreasing', 'chart_increasing', 'man_technologist', 'woman_technologist']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => {
        big(ctx, 'iPhone 17 · 256 Go', 500, 345, t, undefined, { size: 74, family: F.display, color: WHITE });
        split(ctx, t); tel(ctx, 275, 860, 1.05); tel(ctx, 725, 860, 1.05);
        KIT.head(ctx, 'QUI PAIE LE MOINS ?', 1190, t, undefined, { size: 60 });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        big(ctx, 'DÉTAXE', 500, 510, t, S('s02'), { size: 150, family: F.display, color: GOLD });
        stamp(ctx, 'MÊME AVEC ÇA ?', 500, 720, t, f('s02', 0.45), { size: 70 });
        CHR.emo(ctx, 'thinking_face', 500, 980, 260, t, f('s02', 0.2));
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        flagCH(ctx, 500, 430, 170); tel(ctx, 500, 780, 1.05);
        price(ctx, '899 CHF', 500, 1115, t, f('s03', 0.45), CH);
        tag(ctx, 'APPLE SUISSE · 6.11.2026 · TVA 8,1 % COMPRISE', 500, 545, t, S('s03') + 0.1, { size: 28 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        flagFR(ctx, 500, 430, 150); tel(ctx, 500, 780, 1.05);
        price(ctx, '1 119 €', 500, 1115, t, f('s04', 0.4), FR);
        tag(ctx, 'APPLE FRANCE · 6.11.2026', 500, 545, t, S('s04') + 0.1, { size: 30 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        line(ctx, '1 119 € × 0,9180', 500, 500, t, S('s05') + 0.1, { size: 72, family: F.mono, weight: 700, dx: 0 });
        tag(ctx, 'BNS, 5.11.2026 : 1 € = 0,9180 CHF', 500, 610, t, f('s05', 0.3), { size: 32 });
        big(ctx, '1 027 CHF', 500, 830, t, f('s05', 0.6), { size: 136, color: FR });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        bars(ctx, [{ label: 'Suisse', v: 0.72, value: '899', color: CH, t0: S('s06') }, { label: 'France', v: 0.86, value: '1 027', color: FR, t0: S('s06') + 0.25 }], 110, 440, 780, t, { rh: 190 });
        stamp(ctx, '+ 128 CHF', 500, 960, t, f('s06', 0.5), { size: 110 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        pop(ctx, t, S('s07') + 0.1, 500, 640, () => { ctx.rotate(-0.08 + Math.sin(t * 3) * 0.02); roundRect(ctx, -300, -180, 600, 360, 34); const g = ctx.createLinearGradient(-300, -180, 300, 180); g.addColorStop(0, '#d6b65a'); g.addColorStop(1, '#7c6020'); ctx.fillStyle = g; ctx.fill(); text(ctx, 'DÉTAXE', 0, -40, { size: 96, weight: 900, color: '#201707' }); text(ctx, 'TVA remboursée', 0, 60, { size: 46, weight: 800, color: '#201707' }); });
        tag(ctx, 'RÉSIDENT SUISSE · PLUS DE 100 € · DOUANE FRANÇAISE', 500, 900, t, f('s07', 0.5), { size: 26 });
        CHR.emo(ctx, 'man_technologist', 500, 1085, 210, t, f('s07', 0.3));
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        line(ctx, '1 119 € ÷ 1,20 = 932,50 €', 500, 480, t, S('s08'), { size: 54, family: F.mono, weight: 700, dx: 0 });
        stamp(ctx, '− TVA 20 %', 500, 620, t, f('s08', 0.25), { size: 72, color: GREEN });
        big(ctx, '856 CHF', 500, 840, t, f('s08', 0.55), { size: 150, color: FR });
        tag(ctx, 'SANS FRAIS DE DÉTAXE', 500, 990, t, f('s08', 0.7));
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        ctx.fillStyle = '#d3d7df'; ctx.fillRect(110, 500, 780, 16); [0, 1, 2, 3, 4, 5].forEach(i => { ctx.fillStyle = i % 2 ? RED : WHITE; ctx.fillRect(110 + i * 130, 500, 130, 16); });
        roundRect(ctx, 380, 420, 240, 80, 14); ctx.fillStyle = '#d52b1e'; ctx.fill(); text(ctx, 'DOUANE', 500, 462, { size: 46, weight: 900, color: WHITE });
        big(ctx, '> 150 CHF', 500, 650, t, S('s09') + 0.2, { size: 104 });
        stamp(ctx, 'TVA SUISSE : 8,1 %', 500, 830, t, f('s09', 0.55), { size: 72 });
        tag(ctx, 'OFDF · SUR TOUTE LA VALEUR · QUICKZOLL', 500, 985, t, f('s09', 0.7), { size: 28 });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        line(ctx, '856,04 × 1,081', 500, 450, t, S('s10'), { size: 66, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '925 CHF', 500, 650, t, f('s10', 0.3), { size: 150, color: FR });
        stamp(ctx, '+ 26 CHF', 500, 870, t, f('s10', 0.6), { size: 110 });
        tag(ctx, 'CONTRE 899 CHF EN SUISSE', 500, 1030, t, f('s10', 0.7));
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        stamp(ctx, 'SURPRISE', 500, 430, t, S('s11'), { size: 80 });
        big(ctx, 'SANS TAXE', 500, 620, t, f('s11', 0.2), { size: 130, family: F.display, color: WHITE });
        CHR.emo(ctx, 'exploding_head', 500, 930, 300, t, f('s11', 0.5));
      });
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, 'HORS TAXES', 500, 400, t, S('s12'), { size: 36, color: GOLD });
        bars(ctx, [{ label: 'France : 932,50 € × 0,9180', v: 1, value: '856', color: FR, t0: S('s12') + 0.1 }, { label: 'Suisse : 899 ÷ 1,081', v: 0.97, value: '832', color: CH, t0: f('s12', 0.4) }], 110, 490, 780, t, { rh: 200 });
        stamp(ctx, '− 24 CHF', 500, 960, t, f('s12', 0.7), { size: 90, color: GREEN });
      });
      block(ctx, t, S('s13'), S('s14'), () => {
        CHR.emo(ctx, 'chart_increasing', 300, 620, 280, t, S('s13')); CHR.emo(ctx, 'chart_decreasing', 700, 620, 280, t, S('s13') + 0.2);
        line(ctx, 'COURS ET PRIX DU 5-6.11.2026', 500, 870, t, f('s13', 0.3), { size: 46, color: GOLD, dx: 0 });
        stamp(ctx, 'REFAIS LE CALCUL', 500, 1020, t, f('s13', 0.45), { size: 72, color: WHITE });
      });
      block(ctx, t, S('s14'), S('s15'), () => { comment(ctx, t, S('s14'), ['Ton téléphone,', 'tu l\'achètes où ?'], {}); flagCH(ctx, 400, 1120, 90); flagFR(ctx, 600, 1120, 76); });
      block(ctx, t, S('s15'), S('s16'), () => {
        big(ctx, 'iPhone 17 · 256 Go', 500, 345, t, undefined, { size: 74, family: F.display, color: WHITE });
        split(ctx, t); tel(ctx, 275, 860, 0.9); tel(ctx, 725, 860, 0.9);
        price(ctx, '899', 275, 1125, t, S('s15') + 0.1, CH, { w: 150, size: 80 }); price(ctx, '925', 725, 1125, t, f('s15', 0.4), FR, { w: 150, size: 80 });
      });
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'DEMAIN', next: ['ta box internet, la nuit :', "faut-il l'éteindre ?"] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
