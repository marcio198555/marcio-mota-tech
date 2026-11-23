// Vidéo 94 — Suisse contre France : Thermomix TM7 (Reel d'essai Instagram). Prix relevés le 23.11.2026 ; calculs : days/day94/facts.md.
// PlayStation 5 écartée : Sony ne publie aucun prix en francs (voir facts.md).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, WHITE, f, pop, stamp, panel, big, line, tag, flagCH, flagFR, comment, head } = KIT;
  const FR = '#5aa9ff', CH = '#ff5a5f';
  const END = E('s15') + 0.6;
  function split(ctx) {
    ctx.save(); ctx.globalAlpha *= 0.16; ctx.fillStyle = CH; ctx.fillRect(0, 440, 500, 760); ctx.fillStyle = FR; ctx.fillRect(500, 440, 580, 760); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 450); ctx.lineTo(500, 1190); ctx.stroke(); ctx.restore();
    flagCH(ctx, 275, 520, 90); flagFR(ctx, 725, 520, 76);
    chip(ctx, 'TOI', 275, 615, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, 615, { color: WHITE, size: 36 });
  }
  // robot de cuisine générique (sans logo) : socle, écran, molette qui tourne, bol inox, couvercle, vapeur
  function robot(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 150, 150, 22, 0, 0, 7); ctx.fill();
    // bol
    const g = ctx.createLinearGradient(-90, 0, 90, 0); g.addColorStop(0, '#8d96a6'); g.addColorStop(0.45, '#eef1f6'); g.addColorStop(1, '#7b8494');
    ctx.beginPath(); ctx.moveTo(-95, -150); ctx.lineTo(95, -150); ctx.lineTo(80, 10); ctx.lineTo(-80, 10); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = '#5c6575'; ctx.stroke();
    roundRect(ctx, 95, -120, 34, 90, 14); ctx.fillStyle = '#d9dde4'; ctx.fill(); ctx.stroke();
    // couvercle
    roundRect(ctx, -105, -178, 210, 34, 14); ctx.fillStyle = '#f4f5f8'; ctx.fill(); ctx.stroke();
    roundRect(ctx, -26, -205, 52, 30, 10); ctx.fillStyle = '#c8cdd6'; ctx.fill(); ctx.stroke();
    // socle
    ctx.beginPath(); ctx.moveTo(-130, 0); ctx.lineTo(130, 0); ctx.lineTo(145, 145); ctx.lineTo(-145, 145); ctx.closePath(); ctx.fillStyle = '#f6f7fa'; ctx.fill(); ctx.strokeStyle = '#aab1bd'; ctx.stroke();
    roundRect(ctx, -70, 22, 140, 64, 12); ctx.fillStyle = '#0d1624'; ctx.fill();
    ctx.fillStyle = '#58d68d'; ctx.fillRect(-56, 36, 70 + 30 * Math.sin(t * 3), 10); ctx.fillStyle = '#3a6ea8'; ctx.fillRect(-56, 56, 90, 10);
    // molette
    ctx.save(); ctx.translate(0, 118); ctx.rotate(t * 1.6); ctx.beginPath(); ctx.arc(0, 0, 22, 0, 7); ctx.fillStyle = '#d0d5de'; ctx.fill(); ctx.strokeStyle = '#7b8494'; ctx.stroke();
    ctx.fillStyle = '#5c6575'; ctx.fillRect(-3, -20, 6, 14); ctx.restore();
    // vapeur
    for (let i = 0; i < 3; i++) {
      const p = ((t * 0.55 + i / 3) % 1); ctx.save(); ctx.globalAlpha *= (1 - p) * 0.55;
      ctx.beginPath(); ctx.arc(Math.sin(p * 6 + i) * 18, -215 - p * 120, 14 + p * 22, 0, 7); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }
  function price(ctx, s, x, y, t, t0, col, o = {}) {
    pop(ctx, t, t0, x, y, () => { ctx.rotate(o.rot ?? -0.03); panel(ctx, -(o.w || 215), -82, (o.w || 215) * 2, 164, { r: 22, border: col, lw: 7, bg: '#0a1322' }); text(ctx, s, 0, 4, { size: o.size || 80, family: F.mono, weight: 700, color: col, maxWidth: (o.w || 215) * 2 - 30 }); });
  }
  // fin propre à Instagram : pas d'@, pas de « ce soir », pas de carte TikTok
  function igEnd(ctx, t, t0) {
    pop(ctx, t, t0, 500, 520, () => { chip(ctx, 'JE MESURE TOUT', 0, 0, { color: GOLD, dot: RED, size: 46 }); });
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
    load: () => CHR.load(['thinking_face', 'exploding_head', 'chart_increasing', 'package', 'receipt', 'money_with_wings', 'check_mark_button']),
    draw(ctx, t) {
      background(ctx, t);
      // image 0 : deux robots, les deux prix en très gros (qui battent), « ? » qui tourne
      block(ctx, t, 0, S('s03'), () => {
        big(ctx, 'Thermomix TM7', 500, 345, t, undefined, { size: 86, family: F.display, color: WHITE });
        split(ctx); robot(ctx, 275, 862, 0.62, t); robot(ctx, 725, 862, 0.62, t + 0.7);
        const b = 1 + 0.06 * Math.sin(t * 5);
        ctx.save(); ctx.translate(275, 1022); ctx.scale(b, b); text(ctx, '1699', 0, 0, { size: 128, family: F.mono, weight: 900, color: CH, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        ctx.save(); ctx.translate(725, 1022); ctx.scale(2 - b, 2 - b); text(ctx, '1599', 0, 0, { size: 128, family: F.mono, weight: 900, color: FR, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        text(ctx, 'CHF', 275, 1108, { size: 52, weight: 900, color: CH }); text(ctx, '€', 725, 1108, { size: 60, weight: 900, color: FR });
        ctx.save(); ctx.translate(500, 760); ctx.rotate(0.25 * Math.sin(t * 3)); text(ctx, '?', 0, 0, { size: 170, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        head(ctx, 'QUI PAIE LE MOINS ?', 1195, t, 1.0, { size: 52 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN', 500, 430, t, S('s03'), { size: 46, color: GOLD });
        big(ctx, "L'ÉCART", 500, 600, t, S('s03') + 0.15, { size: 140, family: F.display, color: WHITE });
        big(ctx, 'EN FRANCS', 500, 760, t, f('s03', 0.35), { size: 110, family: F.display, color: GOLD });
        line(ctx, 'TVA SUISSE COMPRISE', 500, 920, t, f('s03', 0.6), { size: 56, weight: 900, color: CH, dx: 0 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        flagCH(ctx, 500, 405, 130); robot(ctx, 500, 760, 1.0, t);
        tag(ctx, 'VORWERK SUISSE · 23.11.2026', 500, 535, t, S('s04') + 0.1, { size: 38 });
        price(ctx, '1699.– CHF', 500, 1090, t, f('s04', 0.4), CH, { w: 270, size: 82 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        flagFR(ctx, 500, 405, 110); robot(ctx, 500, 760, 1.0, t);
        tag(ctx, 'VORWERK FRANCE · 23.11.2026', 500, 535, t, S('s05') + 0.1, { size: 38 });
        price(ctx, '1599,00 €', 500, 1090, t, f('s05', 0.4), FR, { w: 270, size: 82 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'BNS 20.11.2026 : 1 € = 0,9232 CHF', 500, 400, t, S('s06'), { size: 36, color: GOLD });
        line(ctx, '1599 × 0,9232', 500, 580, t, S('s06') + 0.2, { size: 72, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '1476 CHF', 500, 790, t, f('s06', 0.55), { size: 150, color: FR });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        split(ctx);
        price(ctx, '1699', 275, 860, t, S('s07') - 1, CH, { w: 195, size: 90 }); price(ctx, '1476', 725, 860, t, S('s07') - 1, FR, { w: 195, size: 90 });
        stamp(ctx, '− 223 CHF', 725, 1075, t, f('s07', 0.3), { size: 72, color: GREEN });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'OFDF · FRANCHISE 150 CHF', 500, 400, t, S('s08'), { size: 40, color: GOLD });
        CHR.emo(ctx, 'package', 500, 640, 250, t, S('s08') + 0.1);
        line(ctx, 'OBJET > 150 CHF', 500, 870, t, f('s08', 0.3), { size: 66, family: F.mono, weight: 700, color: WHITE, dx: 0 });
        big(ctx, 'TVA 8,1 %', 500, 1030, t, f('s08', 0.6), { size: 110, color: CH });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        line(ctx, '1599 ÷ 1,2 = 1332,50 €', 500, 420, t, S('s09'), { size: 52, family: F.mono, weight: 700, color: '#c9d2e3', dx: 0 });
        line(ctx, '× 0,9232 = 1230 CHF', 500, 520, t, S('s09') + 0.2, { size: 52, family: F.mono, weight: 700, color: '#c9d2e3', dx: 0 });
        line(ctx, '1230 × 8,1 %', 500, 650, t, f('s09', 0.35), { size: 70, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '≈ 100 CHF', 500, 860, t, f('s09', 0.6), { size: 150, color: CH });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, '2e SURPRISE', 500, 400, t, S('s10'), { size: 66, color: GOLD });
        split(ctx);
        pop(ctx, t, f('s10', 0.3), 725, 860, () => { text(ctx, '3', 0, 0, { size: 200, family: F.mono, weight: 900, color: GREEN, stroke: 'rgba(0,0,0,0.6)' }); text(ctx, 'ANS DE GARANTIE', 0, 140, { size: 38, weight: 900, color: WHITE }); });
        pop(ctx, t, f('s10', 0.65), 275, 860, () => { text(ctx, '2', 0, 0, { size: 200, family: F.mono, weight: 900, color: CH, stroke: 'rgba(0,0,0,0.6)' }); text(ctx, 'ANS DE GARANTIE', 0, 140, { size: 38, weight: 900, color: WHITE }); });
        tag(ctx, 'SELON LES SITES VORWERK', 500, 1150, t, f('s10', 0.7), { size: 36 });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        flagCH(ctx, 500, 420, 120);
        CHR.emo(ctx, 'chart_increasing', 500, 660, 240, t, S('s11') + 0.1);
        big(ctx, '12.01.2027', 500, 900, t, f('s11', 0.45), { size: 120, color: GOLD });
        tag(ctx, 'HAUSSE ANNONCÉE PAR VORWERK SUISSE', 500, 1040, t, f('s11', 0.6), { size: 36 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ton robot de cuisine,', 'acheté où ?', '🇨🇭 ou 🇫🇷'], { color: GOLD, size: 62 }); });
      block(ctx, t, S('s13'), S('s14'), () => {
        split(ctx); robot(ctx, 275, 820, 0.55, t); robot(ctx, 725, 820, 0.55, t + 0.7);
        price(ctx, '1699', 275, 1080, t, S('s13'), CH, { w: 195, size: 90 }); price(ctx, '≈ 1576', 725, 1080, t, f('s13', 0.45), FR, { w: 215, size: 84 });
      });
      block(ctx, t, S('s14'), S('s15'), () => {
        tag(ctx, 'TVA SUISSE COMPRISE', 500, 420, t, S('s14'), { size: 42, color: GOLD });
        big(ctx, '≈ 123 CHF', 500, 640, t, f('s14', 0.3), { size: 170, color: GREEN });
        line(ctx, 'DE MOINS EN FRANCE', 500, 820, t, f('s14', 0.5), { size: 64, weight: 900, dx: 0 });
        tag(ctx, 'EXEMPLE DE CALCUL', 500, 950, t, f('s14', 0.6), { size: 38 });
        tag(ctx, 'PAS UN CONSEIL FISCAL', 500, 1020, t, f('s14', 0.6), { size: 38 });
        CHR.emo(ctx, 'money_with_wings', 500, 1150, 120, t, f('s14', 0.7));
      });
      block(ctx, t, S('s15'), END + 1, () => igEnd(ctx, t, S('s15')));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
