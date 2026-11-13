// Vidéo 52 — aspirateur sans fil « 60 min » : autonomie par mode (fiche Bosch Unlimited 10). Chiffres : days/day52/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, bars, battery, clock, head, comment } = KIT;
  const END = E('s13') + 0.6;
  // aspirateur balai générique (sans marque)
  function stick(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot ?? -0.12);
    ctx.strokeStyle = '#9aa6bd'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 330); ctx.stroke();
    roundRect(ctx, -70, -260, 140, 220, 40); ctx.fillStyle = '#3b4a66'; ctx.fill();
    roundRect(ctx, -52, -240, 104, 70, 24); ctx.fillStyle = 'rgba(160,210,255,0.35)'; ctx.fill();
    roundRect(ctx, -60, -120, 120, 80, 18); ctx.fillStyle = o.batt || GREEN; ctx.fill();
    roundRect(ctx, -110, 320, 220, 60, 22); ctx.fillStyle = '#2a3346'; ctx.fill();
    const sp = (t * 8) % 1; ctx.fillStyle = '#6a7690'; for (let i = 0; i < 5; i++) ctx.fillRect(-100 + ((i * 44 + sp * 44) % 200), 360, 18, 14);
    ctx.restore();
  }
  function modeRow(ctx, y, label, min, max, col, t, t0) {
    bars(ctx, [{ label, v: min / max, value: min + ' min', color: col, t0 }], 150, y, 700, t, { size: 46 });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['broom', 'stopwatch', 'warning', 'magnifying_glass_tilted_left', 'battery', 'low_battery', 'thinking_face']),
    draw(ctx, t) {
      background(ctx, t);
      block(ctx, t, 0, S('s02'), () => {
        stick(ctx, 280, 760, 1.15, t);
        pop(ctx, t, -1, 700, 700, () => { panel(ctx, -200, -230, 400, 460, { border: GOLD }); text(ctx, '60', 0, -40, { size: 200, weight: 900, family: F.mono, color: GOLD }); text(ctx, 'MIN', 0, 110, { size: 80, weight: 900, color: WHITE }); });
        big(ctx, '?', 700, 1060, t, undefined, { size: 170, color: RED });
        head(ctx, "D'AUTONOMIE ?", 380, t, undefined, { size: 60, color: GOLD });
      });
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        big(ctx, 'MODE ÉCO', 500, 680, t, f('s02', 0.3), { size: 150, color: GREEN, family: F.display });
        tag(ctx, 'SEULEMENT', 500, 860, t, f('s02', 0.5), { size: 50 });
      });
      block(ctx, t, S('s03'), S('s04'), () => {
        line(ctx, 'LE GROS CHIFFRE =', 500, 400, t, S('s03'), { size: 66, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'le réglage le plus faible', 500, 560, t, f('s03', 0.3), { size: 58, dx: 0 });
        line(ctx, "+ l'accessoire le plus simple", 500, 660, t, f('s03', 0.55), { size: 58, dx: 0 });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 500, 900, 240, t, f('s03', 0.4));
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'FICHE BOSCH UNLIMITED 10 · BSS1041GHF', 500, 360, t, S('s04'), { size: 34, color: GOLD });
        stick(ctx, 250, 760, 0.9, t);
        big(ctx, "JUSQU'À", 680, 620, t, f('s04', 0.3), { size: 66, color: WHITE, family: F.display });
        big(ctx, '80 min', 680, 760, t, f('s04', 0.45), { size: 130, color: GOLD });
      });
      block(ctx, t, S('s05'), S('s06'), () => {
        big(ctx, '80 min', 500, 470, t, undefined, { size: 120, color: GOLD });
        stamp(ctx, 'MODE ÉCO', 500, 680, t, S('s05') + 0.1, { size: 80, color: GREEN });
        line(ctx, '+ accessoire non électrique', 500, 880, t, f('s05', 0.4), { size: 56, dx: 0 });
      });
      block(ctx, t, S('s06'), S('s07'), () => {
        modeRow(ctx, 450, 'Éco, accessoire simple', 80, 80, GREEN, t, S('s06') - 5);
        modeRow(ctx, 640, 'Éco, brosse motorisée', 65, 80, GREEN, t, S('s06') + 0.2);
        tag(ctx, "JUSQU'À · SELON LA FICHE", 500, 1000, t, f('s06', 0.5), { size: 38 });
      });
      block(ctx, t, S('s07'), S('s08'), () => {
        modeRow(ctx, 380, 'Éco, accessoire simple', 80, 80, GREEN, t, -5);
        modeRow(ctx, 550, 'Éco, brosse motorisée', 65, 80, GREEN, t, -5);
        modeRow(ctx, 720, 'Auto', 25, 80, GOLD, t, S('s07') + 0.15);
      });
      block(ctx, t, S('s08'), S('s09'), () => {
        modeRow(ctx, 330, 'Éco, accessoire simple', 80, 80, GREEN, t, -5);
        modeRow(ctx, 500, 'Éco, brosse motorisée', 65, 80, GREEN, t, -5);
        modeRow(ctx, 670, 'Auto', 25, 80, GOLD, t, -5);
        modeRow(ctx, 840, 'Turbo', 11, 80, RED, t, S('s08') + 0.1);
        stamp(ctx, '7 × MOINS', 500, 1110, t, f('s08', 0.55), { size: 76 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'VERDICT', 500, 380, t, S('s09'), { size: 70, color: GOLD });
        big(ctx, '60 min ✓', 500, 620, t, f('s09', 0.15), { size: 130, color: GREEN });
        line(ctx, 'EN ÉCO SEULEMENT', 500, 820, t, f('s09', 0.45), { size: 72, weight: 900, color: RED, dx: 0 });
        CHR.emo(ctx, 'low_battery', 500, 1030, 180, t, f('s09', 0.6));
      });
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s10'), { size: 44, color: GREEN });
        pop(ctx, t, S('s10') + 0.15, 500, 700, () => { panel(ctx, -360, -230, 720, 460); text(ctx, 'FICHE TECHNIQUE', 0, -150, { size: 44, weight: 800, color: C.muted });
          text(ctx, 'Turbo : ?? min', 0, -20, { size: 76, family: F.mono, weight: 700, color: RED }); text(ctx, 'pas la boîte', 0, 120, { size: 52, weight: 800, color: WHITE }); });
      });
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'BONUS · BATTERIE INTERCHANGEABLE', 500, 360, t, S('s11'), { size: 38, color: CYAN });
        battery(ctx, 330, 700, 260, 0.15, { color: RED }); battery(ctx, 680, 700, 260, ease.out(prog(t, f('s11', 0.3), 0.6)), { color: GREEN });
        text(ctx, '⇄', 505, 700, { size: 110, weight: 900, color: CYAN });
        tag(ctx, '2e BATTERIE = TU CONTINUES', 500, 940, t, f('s11', 0.5), { size: 40 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Tu aspires', 'en quel mode ?', 'Éco · Auto · Turbo'], { color: GOLD }); });
      block(ctx, t, S('s13'), END + 1, () => followCTA(ctx, t, S('s13'), { when: 'CE SOIR', next: ['le couvercle sur la casserole :', 'combien ça change ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
