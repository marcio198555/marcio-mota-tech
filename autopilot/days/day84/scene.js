// Vidéo 84 — guirlande LED de Noël : combien en francs pour tout décembre ? (Konstsmide 3 W, US DOE 42 W, ElCom 27,7 ct., SuisseEnergie). Chiffres : days/day84/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment, clock, toggle, coins } = KIT;
  const END = E('s14') + 0.6;
  const PINE = '#1f6b45', WARM = '#ffb347', ICE = '#bfe6ff';
  const BULB = ['#ff5a4f', '#ffd35a', '#52d6ff', '#7dff8a', '#ff8bd8'];
  // guirlande en chaînette : style 'inc' (grosses ampoules colorées, halo) ou 'led' (petites diodes blanc chaud)
  function garland(ctx, x0, x1, y, sag, n, t, style, o = {}) {
    const pts = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([lerp(x0, x1, u), y + sag * 4 * u * (1 - u)]); }
    ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = PINE; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    const on = o.on ?? 1;
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n, x = lerp(x0, x1, u), yy = y + sag * 4 * u * (1 - u);
      const tw = 0.75 + 0.25 * Math.sin(t * 5 + i * 1.7);
      if (style === 'inc') {
        const col = BULB[i % BULB.length];
        ctx.save(); ctx.globalAlpha *= on * tw; ctx.shadowColor = col; ctx.shadowBlur = 40; ctx.fillStyle = col;
        ctx.beginPath(); ctx.ellipse(x, yy + 26, 15, 24, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#2a3a2e'; ctx.fillRect(x - 8, yy, 16, 12);
      } else {
        ctx.save(); ctx.globalAlpha *= on * (0.85 + 0.15 * tw); ctx.shadowColor = WARM; ctx.shadowBlur = 18; ctx.fillStyle = '#fff1c9';
        ctx.beginPath(); ctx.arc(x, yy + 8, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    ctx.restore();
  }
  // compteur d'heures 0 → 744 (valeur calculée : 31 j × 24 h)
  function hours(ctx, t, t0, dur, x, y, size) {
    const v = Math.round(744 * ease.out(prog(t, t0, dur)));
    text(ctx, `${v} h`, x, y, { size, weight: 900, family: F.mono, color: GOLD, stroke: 'rgba(0,0,0,0.55)', shadow: GOLD + '66' });
  }
  function duel(ctx, t, o = {}) {
    KIT.duelFrame(ctx, { y0: 430, y1: 1190 });
    garland(ctx, 90, 460, 510, 100, 7, t, 'inc', { on: o.leftOn ?? 1 });
    garland(ctx, 540, 910, 510, 100, 14, t, 'led', { on: o.rightOn ?? 1 });
    text(ctx, 'À AMPOULES', 275, 690, { size: 44, weight: 900, color: WARM });
    text(ctx, 'LED', 725, 690, { size: 50, weight: 900, color: ICE });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['magnifying_glass_tilted_left', 'label', 'red_question_mark', 'stopwatch', 'money_with_wings', 'check_mark_button', 'light_bulb', 'high_voltage']),
    draw(ctx, t) {
      background(ctx, t, { glow: 'rgba(120,28,40,0.5)' });
      // s01–s02 : image 0 — le duel, le compteur d'heures qui monte déjà, la question
      block(ctx, t, 0, S('s03'), () => {
        head(ctx, 'TOUT DÉCEMBRE ALLUMÉE', 345, t, undefined, { size: 46, color: RED, bg: 'rgba(255,77,90,0.16)' });
        duel(ctx, t, { rightOn: t < S('s02') ? 0.55 + 0.45 * Math.abs(Math.sin(t * 3)) : 1 });
        hours(ctx, t, 0, Math.max(2.5, S('s02') - 0.2), 500, 880, 170);
        line(ctx, 'heures allumées en décembre', 500, 990, t, undefined, { size: 42, weight: 800, color: C.muted, dx: 0 });
        big(ctx, 'QUI PAIE COMBIEN ?', 500, 1120, t, undefined, { size: 84, family: F.display, color: WHITE, glow: false });
        if (t >= S('s02')) pop(ctx, t, S('s02'), 725, 770, () => chip(ctx, 'PAREIL', 0, 0, { color: GREEN, size: 40 }));
      });
      // s03 : promesse (le résultat final n'apparaît pas)
      block(ctx, t, S('s03'), S('s04'), () => {
        stamp(ctx, 'ATTENDS', 500, 400, t, S('s03'), { size: 80, color: GOLD });
        clock(ctx, 330, 700, 140, t * 2.2, { color: GOLD });
        pop(ctx, t, f('s03', 0.35), 680, 700, () => text(ctx, '÷ 4', 0, 0, { size: 170, weight: 900, family: F.mono, color: GREEN }));
        line(ctx, 'À LA FIN : LE GESTE', 500, 960, t, f('s03', 0.2), { size: 60, weight: 900, dx: 0 });
        line(ctx, 'QUI PEUT DIVISER LA FACTURE', 500, 1045, t, f('s03', 0.4), { size: 52, weight: 900, color: GOLD, dx: 0 });
      });
      // s04 : la fiche
      block(ctx, t, S('s04'), S('s05'), () => {
        pop(ctx, t, S('s04'), 470, 650, () => {
          panel(ctx, -300, -230, 600, 460, { border: 'rgba(255,255,255,0.5)' });
          text(ctx, 'FICHE PRODUIT', 0, -150, { size: 48, weight: 900, color: C.muted });
          text(ctx, '… W', 0, -10, { size: 150, weight: 900, family: F.mono, color: GOLD });
          text(ctx, 'puissance', 0, 130, { size: 46, weight: 800, color: WHITE });
        });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 760, 820, 220, t, f('s04', 0.3));
      });
      // s05 : 100 LED = 3 W
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'FICHE KONSTSMIDE · 100 LED', 500, 340, t, S('s05'), { size: 40, color: ICE });
        garland(ctx, 110, 890, 430, 150, 22, t, 'led');
        big(ctx, '3 W', 500, 820, t, f('s05', 0.35), { size: 240, color: ICE });
        line(ctx, '3 kWh / 1000 h (étiquette énergie)', 500, 1020, t, f('s05', 0.55), { size: 40, weight: 800, color: C.muted, dx: 0 });
      });
      // s06 : ancienne guirlande = 42 W en moyenne
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'À INCANDESCENCE', 500, 340, t, S('s06'), { size: 42, color: WARM });
        garland(ctx, 110, 890, 430, 150, 11, t, 'inc');
        big(ctx, '42 W', 500, 820, t, f('s06', 0.3), { size: 240, color: RED });
        line(ctx, 'en moyenne', 500, 990, t, f('s06', 0.45), { size: 52, weight: 900, color: WHITE, dx: 0 });
        line(ctx, 'département américain de l\'énergie (2008)', 500, 1070, t, f('s06', 0.6), { size: 38, weight: 700, color: C.muted, dx: 0 });
      });
      // s07 : ×14, relance
      block(ctx, t, S('s07'), S('s08'), () => {
        const k = ease.out(prog(t, S('s07'), 0.6));
        roundRect(ctx, 220, 1000 - 40 * k, 200, 40 * k + 1, 14); ctx.fillStyle = ICE; ctx.fill();
        roundRect(ctx, 580, 1000 - 560 * k, 200, 560 * k + 1, 14); ctx.fillStyle = RED; ctx.fill();
        text(ctx, 'LED 3 W', 320, 1060, { size: 46, weight: 900, color: ICE });
        text(ctx, 'ANCIENNE 42 W', 680, 1060, { size: 42, weight: 900, color: RED });
        stamp(ctx, '× 14', 380, 560, t, f('s07', 0.15), { size: 110, color: GOLD });
        line(ctx, 'ET CE N\'EST PAS TOUT…', 500, 1160, t, f('s07', 0.55), { size: 50, weight: 900, color: GOLD, dx: 0 });
      });
      // s08 : 744 heures
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'JOUR ET NUIT, TOUT DÉCEMBRE', 500, 340, t, S('s08'), { size: 40, color: GOLD });
        clock(ctx, 500, 590, 170, t * 6, { color: GOLD });
        hours(ctx, t, S('s08') + 0.1, Math.max(1, (E('s08') - S('s08')) * 0.8), 500, 900, 180);
        line(ctx, '31 jours × 24 h', 500, 1050, t, f('s08', 0.4), { size: 52, weight: 800, family: F.mono, color: WHITE, dx: 0 });
      });
      // s09 : la LED, 0,62 CHF
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, 'ELCOM 2026 · 27,7 ct./kWh hors TVA', 500, 340, t, S('s09'), { size: 36, color: GOLD });
        garland(ctx, 160, 840, 420, 80, 16, t, 'led');
        calc(ctx, ['3 W × 744 h = 2,232 kWh', '× 0,277 CHF', '0,62 CHF'], 500, 640, t, [S('s09') + 0.1, f('s09', 0.35), f('s09', 0.7)], { size: 52, lastSize: 160, color: GREEN });
      });
      // s10 : surprise, l'ancienne 8,66 CHF
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, 'SURPRISE', 500, 360, t, S('s10'), { size: 70, color: RED });
        garland(ctx, 160, 840, 450, 80, 8, t, 'inc');
        calc(ctx, ['42 W × 744 h = 31,25 kWh', '8,66 CHF'], 500, 680, t, [f('s10', 0.15), f('s10', 0.45)], { size: 52, lastSize: 170, color: RED });
        line(ctx, 'le même mois', 500, 1010, t, f('s10', 0.6), { size: 52, weight: 900, color: WHITE, dx: 0 });
        coins(ctx, t, f('s10', 0.5), 7, 200, 800, 1200, 'F');
      });
      // s11 : SuisseEnergie, minuterie
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'SUISSEENERGIE', 500, 340, t, S('s11'), { size: 44, color: CYAN });
        CHR.emo(ctx, 'stopwatch', 500, 600, 280, t, S('s11'));
        line(ctx, 'UNE MINUTERIE', 500, 870, t, f('s11', 0.3), { size: 84, weight: 900, color: GREEN, dx: 0 });
        toggle(ctx, 500, 1030, prog(t, f('s11', 0.55), 0.4), { w: 200, color: GREEN });
      });
      // s12 : commentaire
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Combien d\'heures', 'par soir ?'], { color: WARM }); });
      // s13 : retour au duel, promesse tenue : 0,62 → 0,15 CHF (÷ 4) avec l'exemple 6 h
      block(ctx, t, S('s13'), S('s14'), () => {
        duel(ctx, t, { leftOn: 0.35 });
        text(ctx, '8,66 CHF', 275, 900, { size: 74, weight: 900, family: F.mono, color: RED });
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(130, 920); ctx.lineTo(420, 880); ctx.stroke(); ctx.restore();
        chip(ctx, 'exemple · 6 h par soir', 500, 790, { color: WHITE, size: 38 });
        line(ctx, '0,62 CHF', 725, 880, t, S('s13'), { size: 60, weight: 900, family: F.mono, color: C.muted, dx: 0 });
        pop(ctx, t, f('s13', 0.25), 725, 965, () => text(ctx, '÷ 4', 0, 0, { size: 80, weight: 900, family: F.mono, color: GOLD }));
        big(ctx, '0,15 CHF', 725, 1075, t, f('s13', 0.5), { size: 110, color: GREEN, maxWidth: 400 });
        line(ctx, 'tout décembre', 725, 1160, t, f('s13', 0.6), { size: 40, weight: 800, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s14'), END + 1, () => followCTA(ctx, t, S('s14'), { when: 'DEMAIN', next: ['ton purificateur « 50 m² »…', 'combien de renouvellements ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
