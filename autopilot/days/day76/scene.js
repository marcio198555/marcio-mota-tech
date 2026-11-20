// Vidéo 76 — enceinte « 100 W » : watts crête ou watts RMS (JBL EON710, Boombox 3, IEC 60268-5). Chiffres : days/day76/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment } = KIT;
  const END = E('s14') + 0.6;
  // Enceinte dessinée (sans logo) : boîtier arrondi, 2 haut-parleurs, grille.
  function speaker(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -230, -150, 460, 300, 90); ctx.fillStyle = '#232b3b'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#46526b'; ctx.stroke();
    const pulse = o.pulse === false ? 0 : 6 * Math.max(0, Math.sin(t * 9));
    for (const dx of [-110, 110]) {
      ctx.beginPath(); ctx.arc(dx, 0, 92, 0, 7); ctx.fillStyle = '#151b27'; ctx.fill();
      ctx.beginPath(); ctx.arc(dx, 0, 70 + pulse, 0, 7); ctx.fillStyle = '#2f3a50'; ctx.fill();
      ctx.beginPath(); ctx.arc(dx, 0, 24, 0, 7); ctx.fillStyle = o.color || GOLD; ctx.fill();
    }
    ctx.restore();
  }
  // Barre horizontale (puissance), largeur proportionnelle.
  function bar(ctx, x, y, w, h, k, col, label) {
    roundRect(ctx, x, y, Math.max(2, w * k), h, 16); ctx.fillStyle = col; ctx.fill();
    if (label && k > 0.6) text(ctx, label, x + 24, y + h / 2, { size: 46, weight: 900, color: '#0d1220', align: 'left' });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['high_voltage', 'magnifying_glass_tilted_left', 'stopwatch', 'warning', 'electric_plug', 'battery', 'clipboard', 'thinking_face', 'check_mark_button', 'collision']),
    draw(ctx, t) {
      background(ctx, t);
      // Image 0 : enceinte + « 100 W ? »
      block(ctx, t, 0, S('s02'), () => {
        head(ctx, 'TON ENCEINTE', 360, t, undefined, { size: 56, color: GOLD });
        speaker(ctx, 500, 600, 1.1, t);
        big(ctx, '100 W', 470, 920, t, undefined, { size: 190, color: GOLD });
        big(ctx, '?', 840, 920, t, undefined, { size: 190, color: RED });
        line(ctx, 'QUELS WATTS ?', 500, 1100, t, f('s01', 0.55), { size: 64, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        big(ctx, '100 W', 500, 640, t, f('s02', 0.15), { size: 150, color: WHITE });
        line(ctx, 'TOUT SEUL = RIEN', 500, 800, t, f('s02', 0.3), { size: 60, weight: 900, color: RED, dx: 0 });
        tag(ctx, 'À LA FIN : LESQUELS CROIRE', 500, 980, t, f('s02', 0.6), { size: 42, color: GREEN });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'WATTS CRÊTE', 500, 360, t, S('s03'), { size: 48, color: RED });
        // Pic bref : tracé
        const k = ease.out(prog(t, S('s03') + 0.1, 0.8));
        ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = RED; ctx.beginPath();
        const pts = [[140, 860], [380, 860], [460, 860], [500, 500], [540, 860], [620, 860], [860, 860]];
        const n = Math.max(1, Math.round(k * (pts.length - 1)));
        ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i <= n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.restore();
        CHR.emo(ctx, 'stopwatch', 760, 560, 150, t, f('s03', 0.45));
        line(ctx, 'QUELQUES MILLISECONDES', 500, 990, t, f('s03', 0.55), { size: 52, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'WATTS RMS = CONTINUS', 500, 360, t, S('s04'), { size: 48, color: GREEN });
        const k = ease.out(prog(t, S('s04') + 0.1, 1.2));
        ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = GREEN; ctx.beginPath(); ctx.moveTo(140, 700); ctx.lineTo(140 + 720 * k, 700); ctx.stroke(); ctx.restore();
        line(ctx, 'TIENT DANS LA DURÉE', 500, 860, t, f('s04', 0.45), { size: 58, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'JBL EON710 · ENCEINTE DE SONO', 500, 340, t, S('s05'), { size: 40, color: GOLD });
        speaker(ctx, 500, 560, 0.8, t, { color: RED });
        big(ctx, '1 300 W', 500, 840, t, f('s05', 0.4), { size: 160, color: RED });
        line(ctx, 'CRÊTE', 500, 990, t, f('s05', 0.55), { size: 60, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'FICHE JBL · MÊME ENCEINTE', 500, 340, t, S('s06'), { size: 40, color: GOLD });
        const k1 = ease.out(prog(t, S('s06'), 0.5)), k2 = ease.out(prog(t, f('s06', 0.25), 0.6));
        line(ctx, 'CRÊTE', 500, 470, undefined, undefined, { size: 46, weight: 900, color: RED, dx: 0 });
        bar(ctx, 120, 510, 760, 110, k1, RED, '1 300 W');
        line(ctx, 'CONTINU', 500, 690, t, f('s06', 0.25), { size: 46, weight: 900, color: GREEN, dx: 0 });
        bar(ctx, 120, 730, 760, 110, k2 * 0.5, GREEN, '');
        big(ctx, '650 W', 700, 785, t, f('s06', 0.4), { size: 90, color: GREEN });
        big(ctx, '÷ 2', 500, 1010, t, f('s06', 0.65), { size: 150, color: GOLD });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'EXEMPLE · MÊME RAPPORT', 500, 340, t, S('s07'), { size: 44, color: GOLD });
        big(ctx, '100 W crête', 500, 560, t, S('s07') + 0.1, { size: 120, color: RED });
        big(ctx, '= 50 W', 500, 760, t, f('s07', 0.4), { size: 170, color: GREEN });
        line(ctx, 'CONTINUS', 500, 910, t, f('s07', 0.5), { size: 60, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        CHR.emo(ctx, 'warning', 500, 440, 160, t, S('s08'));
        tag(ctx, 'SELON UN FABRICANT AUDIO', 500, 580, t, S('s08') + 0.1, { size: 40, color: GOLD });
        big(ctx, '1 000 W crête', 500, 720, t, f('s08', 0.25), { size: 110, color: RED });
        big(ctx, '≈ 250 W RMS ?', 500, 900, t, f('s08', 0.6), { size: 110, color: GREEN });
        line(ctx, 'LE QUART', 500, 1040, t, f('s08', 0.8), { size: 56, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, 'JBL BOOMBOX 3 · SUR SECTEUR', 500, 340, t, S('s09'), { size: 42, color: GOLD });
        CHR.emo(ctx, 'electric_plug', 500, 500, 150, t, S('s09') + 0.1);
        calc(ctx, ['80 + 2 × 40 + 2 × 10', '= 180 W RMS'], 500, 700, t, [f('s09', 0.3), f('s09', 0.6)], { lastSize: 130, color: GREEN });
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, 'MÊME ENCEINTE · SUR BATTERIE', 500, 340, t, S('s10'), { size: 42, color: GOLD });
        CHR.emo(ctx, 'battery', 500, 500, 150, t, S('s10') + 0.05);
        calc(ctx, ['60 + 2 × 30 + 2 × 8', '= 136 W RMS'], 500, 700, t, [f('s10', 0.15), f('s10', 0.45)], { lastSize: 130, color: CYAN });
        line(ctx, 'au lieu de 180 W', 500, 1060, t, f('s10', 0.7), { size: 54, weight: 900, color: RED, dx: 0 });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'NORME IEC 60268-5 (2003)', 500, 340, t, S('s11'), { size: 44, color: CYAN });
        big(ctx, '4', 500, 560, t, S('s11') + 0.1, { size: 220, color: GOLD });
        line(ctx, 'PUISSANCES DIFFÉRENTES', 500, 720, t, f('s11', 0.25), { size: 54, weight: 900, color: WHITE, dx: 0 });
        const L = ['bruit assigné', 'max. court terme', 'max. long terme', 'sinusoïdale assignée'];
        L.forEach((s, i) => line(ctx, s, 500, 820 + i * 66, t, f('s11', 0.35 + i * 0.12), { size: 46, weight: 800, color: C.muted, dx: 0 }));
      });
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 340, t, S('s12'), { size: 44, color: GREEN });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 500, 500, 150, t, S('s12') + 0.1);
        pop(ctx, t, f('s12', 0.3), 500, 780, () => { panel(ctx, -360, -170, 720, 340); text(ctx, 'FICHE TECHNIQUE', 0, -100, { size: 44, weight: 800, color: C.muted });
          text(ctx, '« RMS » ou « continu »', 0, 0, { size: 58, weight: 900, color: GREEN }); text(ctx, 'pas seulement le gros chiffre', 0, 90, { size: 44, weight: 800, color: GOLD }); });
      });
      block(ctx, t, S('s13'), S('s14'), () => { comment(ctx, t, S('s13'), ['Ta boîte écrit', 'quels watts ?', 'RMS, crête, rien ?'], { color: GOLD }); });
      block(ctx, t, S('s14'), END + 1, () => followCTA(ctx, t, S('s14'), { when: 'CE SOIR', next: ['la guirlande LED tout décembre :', 'combien en francs ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
