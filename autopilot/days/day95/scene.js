// Vidéo 95 — Écouteurs « 24 heures » : combien d'une traite, en vrai ? (Sony WF-1000XM6, Reel d'essai Instagram)
// Chiffres : communiqué Sony Europe du 12.02.2026 et guide d'aide officiel Sony ; calculs : days/day95/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, battery, clock, toggle, comment, head } = KIT;
  const L = '#58d68d', R = '#ff5a5f';
  const END = E('s15') + 0.6;
  function split(ctx, lt, rt) {
    ctx.save(); ctx.globalAlpha *= 0.14; ctx.fillStyle = L; ctx.fillRect(0, 440, 500, 760); ctx.fillStyle = R; ctx.fillRect(500, 440, 580, 760); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 450); ctx.lineTo(500, 1190); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 275, 500, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, 500, { color: WHITE, size: 36 });
    if (lt) chip(ctx, lt, 275, 575, { color: L, size: 36 });
    if (rt) chip(ctx, rt, 725, 575, { color: R, size: 36 });
  }
  // écouteurs génériques (sans logo) : boîtier ouvert + deux écouteurs noirs
  function buds(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 140, 130, 18, 0, 0, 7); ctx.fill();
    roundRect(ctx, -120, -20, 240, 150, 60); ctx.fillStyle = '#2a2d33'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#5a606b'; ctx.stroke();
    ctx.strokeStyle = '#4a4f59'; ctx.beginPath(); ctx.moveTo(-118, 22); ctx.lineTo(118, 22); ctx.stroke();
    ctx.fillStyle = '#58d68d'; ctx.beginPath(); ctx.arc(0, 78, 6, 0, 7); ctx.fill();
    const bob = 7 * Math.sin(t * 2.4);
    [-1, 1].forEach((sd) => {
      ctx.save(); ctx.translate(sd * 58, -62 + bob * sd); ctx.rotate(sd * 0.2);
      ctx.beginPath(); ctx.ellipse(0, 0, 46, 40, 0, 0, 7); ctx.fillStyle = '#1b1d22'; ctx.fill(); ctx.strokeStyle = '#6a707c'; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(sd * -6, -4, 26, 22, 0, 0, 7); ctx.fillStyle = '#3a3f48'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(sd * -38, 10, 16, 13, 0, 0, 7); ctx.fillStyle = '#4b505a'; ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }
  // batterie qui se vide en boucle (illustration, aucune valeur)
  function drain(ctx, x, y, w, t, col) { battery(ctx, x, y, w, 0.15 + 0.85 * (1 - ((t * 0.35) % 1)), { color: col }); }
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
    load: () => CHR.load(['magnifying_glass_tilted_left', 'warning', 'thinking_face', 'clipboard', 'low_battery', 'loudly_crying_face', 'gear']),
    draw(ctx, t) {
      background(ctx, t);
      // image 0 : « 24 HEURES » en très gros qui bat, les deux paires d'écouteurs, batteries qui se vident, « ? »
      block(ctx, t, 0, S('s03'), () => {
        text(ctx, 'Sony WF-1000XM6', 500, 342, { size: 66, family: F.display, weight: 900, color: WHITE });
        const b = 1 + 0.07 * Math.sin(t * 5);
        ctx.save(); ctx.translate(500, 425); ctx.scale(b, b); text(ctx, '24 HEURES ?', 0, 0, { size: 104, family: F.mono, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)', maxWidth: 860 }); ctx.restore();
        split(ctx, 'SON STANDARD', 'SON HI-RES');
        ctx.save(); ctx.translate(0, 120);
        buds(ctx, 275, 640, 0.85, t); buds(ctx, 725, 640, 0.85, t + 0.8);
        drain(ctx, 275, 900, 220, t, L); drain(ctx, 725, 900, 220, t + 0.4, R);
        ctx.restore();
        head(ctx, "QUI TIENT LE PLUS LONGTEMPS ?", 1195, t, 1.0, { size: 48 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN', 500, 430, t, S('s03'), { size: 46, color: GOLD });
        big(ctx, 'LE VRAI', 500, 600, t, S('s03') + 0.15, { size: 140, family: F.display, color: WHITE });
        big(ctx, 'CHIFFRE', 500, 760, t, f('s03', 0.3), { size: 140, family: F.display, color: GOLD });
        line(ctx, 'DE TON COLLÈGUE', 500, 920, t, f('s03', 0.55), { size: 62, weight: 900, color: R, dx: 0 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'SONY · COMMUNIQUÉ DU 12.02.2026', 500, 400, t, S('s04'), { size: 38, color: GOLD });
        buds(ctx, 500, 640, 1.1, t);
        big(ctx, '24 H', 500, 920, t, f('s04', 0.3), { size: 190, color: GOLD });
        line(ctx, 'RÉDUCTION DE BRUIT ACTIVÉE', 500, 1080, t, f('s04', 0.6), { size: 50, weight: 900, dx: 0 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        stamp(ctx, 'LIS LA NOTE', 500, 420, t, S('s05'), { size: 70, color: GOLD });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 500, 660, 240, t, S('s05') + 0.15);
        line(ctx, 'AVEC LE BOÎTIER', 500, 900, t, f('s05', 0.45), { size: 76, weight: 900, color: WHITE, dx: 0 });
        line(ctx, 'DE CHARGE', 500, 995, t, f('s05', 0.55), { size: 76, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'SONY : 8 H + 16 H = 24 H', 500, 420, t, S('s06'), { size: 40, color: GOLD });
        const k1 = ease.out(prog(t, S('s06') + 0.2, 0.6)), k2 = ease.out(prog(t, f('s06', 0.5), 0.6));
        const x0 = 110, W = 780, y = 640;
        roundRect(ctx, x0, y, W, 120, 24); ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fill();
        if (k1 > 0) { roundRect(ctx, x0, y, W / 3 * k1, 120, 24); ctx.fillStyle = L; ctx.fill(); }
        if (k2 > 0) { roundRect(ctx, x0 + W / 3 + 6, y, (W * 2 / 3 - 6) * k2, 120, 24); ctx.fillStyle = '#56627a'; ctx.fill(); }
        if (k1 > 0.6) { text(ctx, '8 H', x0 + W / 6, y + 62, { size: 64, family: F.mono, weight: 900, color: '#071018' }); text(ctx, 'ÉCOUTEURS', x0 + W / 6, y + 180, { size: 40, weight: 900, color: L }); }
        if (k2 > 0.6) { text(ctx, '+ 16 H', x0 + W * 2 / 3, y + 62, { size: 64, family: F.mono, weight: 900, color: WHITE }); text(ctx, 'BOÎTIER (RECHARGES)', x0 + W * 2 / 3, y + 180, { size: 40, weight: 900, color: '#c9d2e3' }); }
        line(ctx, "8 H D'UNE TRAITE AU MIEUX", 500, 1000, t, f('s06', 0.8), { size: 52, weight: 900, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        chip(ctx, 'TOI · SON STANDARD (AAC / SBC)', 500, 420, { color: L, size: 38 });
        battery(ctx, 500, 640, 360, lerp(1, 0.33, ease.inOut(prog(t, S('s07'), E('s07') - S('s07')))), { color: L });
        big(ctx, '8 H MAX', 500, 900, t, f('s07', 0.4), { size: 150, color: L });
        tag(ctx, 'RÉDUCTION DE BRUIT ACTIVÉE', 500, 1060, t, f('s07', 0.5), { size: 38 });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        line(ctx, 'SANS RÉDUCTION DE BRUIT', 500, 430, t, S('s08'), { size: 54, weight: 900, color: '#c9d2e3', dx: 0 });
        big(ctx, '12 H', 500, 620, t, S('s08') + 0.2, { size: 160, color: WHITE });
        stamp(ctx, 'MAIS TU LES AS', 500, 860, t, f('s08', 0.5), { size: 62, color: RED });
        stamp(ctx, 'ACHETÉS POUR ÇA', 500, 990, t, f('s08', 0.6), { size: 62, color: RED, rot: 0.04 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, 'GUIDE D\'AIDE SONY', 500, 420, t, S('s09'), { size: 40, color: GOLD });
        const on = ease.inOut(prog(t, S('s09') + 0.3, 0.4));
        text(ctx, 'ÉGALISEUR', 160, 610, { size: 54, weight: 900, color: WHITE, align: 'left' }); toggle(ctx, 780, 600, on, { color: R });
        text(ctx, 'DSEE EXTREME', 160, 760, { size: 54, weight: 900, color: WHITE, align: 'left' }); toggle(ctx, 780, 750, ease.inOut(prog(t, S('s09') + 0.6, 0.4)), { color: R });
        big(ctx, 'ENCORE MOINS', 500, 960, t, f('s09', 0.6), { size: 104, family: F.display, color: R });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, 'BONNE NOUVELLE', 500, 420, t, S('s10'), { size: 64, color: GREEN });
        clock(ctx, 300, 700, 130, (t - S('s10')) * 6, { color: GREEN });
        big(ctx, '5 MIN', 700, 640, t, f('s10', 0.3), { size: 96, color: WHITE });
        big(ctx, '≈ 1 H', 700, 780, t, f('s10', 0.55), { size: 110, color: GREEN });
        tag(ctx, "DE CHARGE → D'ÉCOUTE", 500, 960, t, f('s10', 0.6), { size: 40 });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'CONSEIL', 500, 420, t, S('s11'), { size: 46, color: GREEN });
        CHR.emo(ctx, 'clipboard', 500, 650, 240, t, S('s11') + 0.1);
        line(ctx, "LE GUIDE D'AIDE", 500, 900, t, f('s11', 0.3), { size: 70, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'PAS LA PUBLICITÉ', 500, 995, t, f('s11', 0.55), { size: 70, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Tes écouteurs', 'tiennent combien', "d'heures ?"], { color: GOLD, size: 64 }); });
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, 'PUBLICITÉ', 500, 420, t, S('s13'), { size: 44, color: GOLD });
        big(ctx, '24 H', 500, 590, t, S('s13') + 0.1, { size: 170, color: GOLD });
        chip(ctx, 'TON COLLÈGUE · HAUTE RÉSOLUTION', 500, 790, { color: R, size: 38 });
        drain(ctx, 500, 960, 300, t, R);
        text(ctx, '?', 500, 1110, { size: 110, weight: 900, color: R });
      });
      block(ctx, t, S('s14'), S('s15'), () => {
        tag(ctx, 'LDAC + RÉDUCTION DE BRUIT', 500, 420, t, S('s14'), { size: 40, color: R });
        big(ctx, '5 H', 500, 640, t, S('s14') + 0.1, { size: 230, color: R });
        line(ctx, "D'AFFILÉE, AU MAXIMUM", 500, 830, t, f('s14', 0.3), { size: 56, weight: 900, dx: 0 });
        stamp(ctx, '≈ 5 FOIS MOINS QUE 24 H', 500, 980, t, f('s14', 0.55), { size: 56, color: GOLD });
        tag(ctx, "SOURCE : GUIDE D'AIDE SONY", 500, 1110, t, f('s14', 0.6), { size: 36 });
      });
      block(ctx, t, S('s15'), END + 1, () => igEnd(ctx, t, S('s15')));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
