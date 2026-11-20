// Vidéo 77 — purificateur « 50 m² » : avec combien de renouvellements d'air (notice Levoit Core 300S, livre blanc AHAM). Chiffres : days/day77/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment } = KIT;
  const END = E('s14') + 0.6;
  // Purificateur dessiné (sans logo) : colonne arrondie, grille du haut, flux d'air animé.
  function purifier(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -130, -220, 260, 440, 60); ctx.fillStyle = '#e6e9ef'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#9aa3b5'; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -205, 110, 22, 0, 0, 7); ctx.fillStyle = '#2f3a50'; ctx.fill();
    for (let i = 0; i < 9; i++) { ctx.fillStyle = '#b9c0cd'; ctx.fillRect(-100, -120 + i * 34, 200, 12); }
    ctx.beginPath(); ctx.arc(0, 170, 14, 0, 7); ctx.fillStyle = o.led || GREEN; ctx.fill();
    if (o.air !== false) {
      ctx.strokeStyle = CYAN; ctx.lineWidth = 8; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) { const ph = (t * 1.2 + i / 3) % 1; ctx.globalAlpha = 1 - ph;
        ctx.beginPath(); ctx.moveTo(-60 + i * 60, -240 - ph * 160); ctx.quadraticCurveTo(-40 + i * 60, -270 - ph * 160, -60 + i * 60, -300 - ph * 160); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  // Pièce vue de dessus : carré proportionnel à la surface (1 m² = k px²).
  function room(ctx, cx, cy, m2, k, col, label, a = 1) {
    const side = Math.sqrt(m2) * k * a; ctx.save(); ctx.lineWidth = 8; ctx.strokeStyle = col; ctx.fillStyle = col + '33';
    ctx.fillRect(cx - side / 2, cy - side / 2, side, side); ctx.strokeRect(cx - side / 2, cy - side / 2, side, side); ctx.restore();
    if (label && a > 0.8) text(ctx, label, cx, cy, { size: 64, weight: 900, color: WHITE });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['magnifying_glass_tilted_left', 'clipboard', 'warning', 'thinking_face', 'check_mark_button', 'face_with_monocle', 'window']),
    draw(ctx, t) {
      background(ctx, t);
      // Image 0 : purificateur + « 50 m² ? »
      block(ctx, t, 0, S('s02'), () => {
        head(ctx, 'TON PURIFICATEUR', 360, t, undefined, { size: 56, color: GOLD });
        purifier(ctx, 240, 760, 0.95, t);
        big(ctx, '50 m²', 640, 700, t, undefined, { size: 170, color: GOLD });
        big(ctx, '?', 640, 900, t, undefined, { size: 190, color: RED });
        line(ctx, 'À COMBIEN DE RENOUVELLEMENTS ?', 500, 1110, t, f('s01', 0.5), { size: 48, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        big(ctx, '50 m²', 500, 640, t, f('s02', 0.15), { size: 150, color: WHITE });
        line(ctx, "PAS UN CHIFFRE FIXE", 500, 800, t, f('s02', 0.3), { size: 60, weight: 900, color: RED, dx: 0 });
        tag(ctx, 'À LA FIN : TA VRAIE SURFACE', 500, 980, t, f('s02', 0.6), { size: 42, color: GREEN });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'EXEMPLE · LEVOIT CORE 300S', 500, 340, t, S('s03'), { size: 44, color: GOLD });
        purifier(ctx, 300, 720, 0.85, t);
        big(ctx, '50 m²', 690, 700, t, f('s03', 0.4), { size: 140, color: GOLD });
        line(ctx, 'DANS LA NOTICE', 690, 830, t, f('s03', 0.55), { size: 50, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, "DÉBIT D'AIR PROPRE (CADR)", 500, 340, t, S('s04'), { size: 44, color: CYAN });
        purifier(ctx, 500, 640, 0.6, t);
        big(ctx, '240 m³/h', 500, 960, t, f('s04', 0.4), { size: 150, color: CYAN });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 500, 440, 150, t, S('s05'));
        tag(ctx, 'PETITE LIGNE DE LA NOTICE', 500, 580, t, S('s05') + 0.1, { size: 42, color: GOLD });
        big(ctx, '2', 500, 780, t, f('s05', 0.4), { size: 220, color: RED });
        line(ctx, 'RENOUVELLEMENTS PAR HEURE', 500, 950, t, f('s05', 0.55), { size: 50, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'NOTICE LEVOIT · PLAFOND', 500, 340, t, S('s06'), { size: 44, color: GOLD });
        // Mur et flèche de hauteur
        const k = ease.out(prog(t, S('s06') + 0.1, 0.6));
        ctx.save(); ctx.strokeStyle = WHITE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(200, 1000); ctx.lineTo(800, 1000); ctx.moveTo(200, 500); ctx.lineTo(800, 500); ctx.stroke();
        ctx.strokeStyle = GOLD; ctx.beginPath(); ctx.moveTo(320, 1000); ctx.lineTo(320, 1000 - 500 * k); ctx.stroke(); ctx.restore();
        big(ctx, '2,4 m', 590, 750, t, f('s06', 0.3), { size: 150, color: GOLD });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'LE CALCUL DE LA NOTICE', 500, 340, t, S('s07'), { size: 44, color: GOLD });
        calc(ctx, ['240 ÷ 2,4 ÷ 2', '= 50 m²'], 500, 600, t, [S('s07') + 0.1, f('s07', 0.6)], { lastSize: 150, color: GOLD });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'AHAM · ÉLECTROMÉNAGER (USA)', 500, 340, t, S('s08'), { size: 42, color: CYAN });
        CHR.emo(ctx, 'clipboard', 500, 520, 150, t, S('s08') + 0.15);
        big(ctx, '4,8', 500, 760, t, f('s08', 0.5), { size: 200, color: GREEN });
        line(ctx, 'RENOUVELLEMENTS PAR HEURE', 500, 920, t, f('s08', 0.65), { size: 50, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        calc(ctx, ['240 ÷ 2,4 ÷ 4,8', '≈ 21 m²'], 500, 420, t, [S('s09') + 0.05, f('s09', 0.35)], { lastSize: 140, color: GREEN });
        const a = ease.out(prog(t, f('s09', 0.5), 0.5));
        room(ctx, 500, 950, 50, 48, GOLD, '', a);
        room(ctx, 500, 950, 21, 48, GREEN, '21 m²', a);
        if (a > 0.8) text(ctx, '50 m² (notice)', 500, 950 - Math.sqrt(50) * 24 - 40, { size: 44, weight: 900, color: GOLD });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        CHR.emo(ctx, 'warning', 500, 420, 150, t, S('s10'));
        tag(ctx, '2E SURPRISE · AHAM', 500, 560, t, S('s10') + 0.1, { size: 44, color: GOLD });
        line(ctx, 'PAS MOINS DE', 500, 680, t, f('s10', 0.35), { size: 56, weight: 900, color: WHITE, dx: 0 });
        big(ctx, '2,2', 500, 840, t, f('s10', 0.5), { size: 200, color: GREEN });
        line(ctx, 'RENOUVELLEMENTS', 500, 1000, t, f('s10', 0.65), { size: 50, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'LES 50 m² DE LA NOTICE', 500, 340, t, S('s11'), { size: 44, color: GOLD });
        big(ctx, '2 < 2,2', 500, 620, t, S('s11') + 0.15, { size: 170, color: RED });
        line(ctx, 'CALCULÉS EN DESSOUS', 500, 820, t, f('s11', 0.45), { size: 60, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 340, t, S('s12'), { size: 44, color: GREEN });
        pop(ctx, t, S('s12') + 0.2, 500, 680, () => { panel(ctx, -360, -230, 720, 460); text(ctx, 'FICHE TECHNIQUE', 0, -160, { size: 44, weight: 800, color: C.muted });
          text(ctx, 'CADR en m³/h', 0, -60, { size: 66, weight: 900, color: GREEN }); text(ctx, 'pas les m²', 0, 30, { size: 54, weight: 900, color: RED });
          text(ctx, 'surface = CADR ÷ hauteur ÷ 4,8', 0, 130, { size: 40, weight: 800, color: WHITE }); });
      });
      block(ctx, t, S('s13'), S('s14'), () => { comment(ctx, t, S('s13'), ['Ta pièce :', 'combien de m² ?', 'Et ton CADR ?'], { color: GOLD }); });
      block(ctx, t, S('s14'), END + 1, () => followCTA(ctx, t, S('s14'), { when: 'CE SOIR', next: ["l'écran « 1 ms »", 'qui ne répond pas en 1 ms'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
