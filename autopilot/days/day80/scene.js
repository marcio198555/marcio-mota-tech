// Vidéo 80 — trottinette « 40 km » : conditions du test (Segway Ninebot F2 D, site suisse). Chiffres : days/day80/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, battery, thermometer, head, comment } = KIT;
  const END = E('s15') + 0.6;
  // trottinette dessinée (sans logo), centrée sur le plateau
  function scooter(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const spin = o.spin || 0;
    ctx.lineCap = 'round';
    // plateau
    roundRect(ctx, -170, -18, 330, 36, 18); ctx.fillStyle = '#2b3446'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#4a5670'; ctx.stroke();
    // garde-boue arrière + colonne
    ctx.strokeStyle = '#8c97ad'; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(150, 0); ctx.lineTo(200, -30); ctx.lineTo(160, -330); ctx.stroke();
    ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(105, -335); ctx.lineTo(215, -325); ctx.stroke();
    // lampe avant
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(176, -250, 9, 0, 7); ctx.fill();
    // roues
    for (const wx of [-180, 210]) {
      ctx.save(); ctx.translate(wx, 40);
      ctx.beginPath(); ctx.arc(0, 0, 58, 0, 7); ctx.fillStyle = '#0d121c'; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = '#3b455a'; ctx.stroke();
      ctx.rotate(spin); ctx.lineWidth = 6; ctx.strokeStyle = '#7d889f';
      for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-32, 0); ctx.lineTo(32, 0); ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
  }
  function road(ctx, y, t, speed = 1) {
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 6; ctx.setLineDash([60, 40]); ctx.lineDashOffset = t * 300 * speed;
    ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(1000, y); ctx.stroke(); ctx.restore();
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thermometer', 'battery', 'low_battery', 'thinking_face', 'magnifying_glass_tilted_left', 'check_mark_button', 'warning', 'clipboard', 'stopwatch', 'package']),
    draw(ctx, t) {
      background(ctx, t);
      // s01 — image 0 : trottinette + 40 km ?
      block(ctx, t, 0, S('s02'), () => {
        head(ctx, 'TA TROTTINETTE', 350, t, undefined, { size: 56, color: GOLD });
        big(ctx, '40 km', 500, 590, t, undefined, { size: 200, color: GOLD });
        big(ctx, '?', 840, 820, t, undefined, { size: 190, color: RED });
        road(ctx, 1130, t);
        scooter(ctx, 470, 1060, 1.05, { spin: t * 4 });
      });
      // s02 — oui, mais
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'OUI…', 500, 400, t, S('s02'), { size: 100, color: GREEN });
        line(ctx, 'MAIS DANS LES', 500, 640, t, f('s02', 0.35), { size: 66, weight: 900, color: WHITE, dx: 0 });
        line(ctx, 'CONDITIONS DU TEST', 500, 740, t, f('s02', 0.45), { size: 66, weight: 900, color: GOLD, dx: 0 });
        CHR.emo(ctx, 'clipboard', 500, 990, 220, t, f('s02', 0.55));
      });
      // s03 — promesse
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN, TU SAURAS LIRE…', 500, 380, t, S('s03'), { size: 44, color: CYAN });
        big(ctx, '40 km', 500, 620, t, S('s03') + 0.1, { size: 150, color: GOLD });
        pop(ctx, t, f('s03', 0.45), 500, 800, () => { panel(ctx, -380, -55, 760, 110); text(ctx, '* la petite ligne sous ce chiffre', 0, 4, { size: 40, weight: 800, color: WHITE }); });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 760, 950, 180, t, f('s03', 0.6));
      });
      // s04 — exemple Segway Ninebot F2 D
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'SEGWAY NINEBOT F2 D · SITE SUISSE', 500, 360, t, S('s04'), { size: 40, color: GOLD });
        scooter(ctx, 470, 800, 0.9, { spin: t * 3 });
        big(ctx, "JUSQU'À 40 km", 500, 1060, t, f('s04', 0.55), { size: 96, color: GOLD });
      });
      // s05 — batterie pleine, 75 kg
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'NOTE DU FABRICANT [1]', 500, 360, t, S('s05'), { size: 42, color: CYAN });
        pop(ctx, t, S('s05') + 0.1, 300, 640, () => battery(ctx, 0, 0, 300, 1, { color: GREEN, label: '100 %', size: 58 }));
        line(ctx, 'BATTERIE PLEINE', 300, 800, t, S('s05') + 0.2, { size: 44, weight: 900, color: GREEN, dx: 0 });
        big(ctx, '75 kg', 720, 640, t, f('s05', 0.5), { size: 130, color: WHITE });
        line(ctx, 'DE CHARGE', 720, 800, t, f('s05', 0.6), { size: 44, weight: 900, color: WHITE, dx: 0 });
      });
      // s06 — 25 °C, 15 km/h, chaussée
      block(ctx, t, S('s06'), S('s07'), () => {
        const k = ease.out(prog(t, S('s06'), 0.8));
        thermometer(ctx, 220, 860, 380, 0.7 * k, GOLD);
        big(ctx, '25 °C', 600, 520, t, S('s06') + 0.05, { size: 130, color: GOLD });
        big(ctx, '15 km/h', 600, 720, t, f('s06', 0.4), { size: 110, color: WHITE });
        line(ctx, 'DE MOYENNE', 600, 820, t, f('s06', 0.45), { size: 42, weight: 900, color: C.muted, dx: 0 });
        line(ctx, 'SUR CHAUSSÉE', 600, 960, t, f('s06', 0.7), { size: 56, weight: 900, color: CYAN, dx: 0 });
      });
      // s07 — à fond : 36 km
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'À FOND : 20 km/h', 500, 360, t, S('s07'), { size: 46, color: RED });
        road(ctx, 900, t, 2.2);
        scooter(ctx, 300, 820, 0.6, { spin: t * 9 });
        big(ctx, '36 km', 750, 640, t, f('s07', 0.3), { size: 140, color: WHITE });
        line(ctx, "JUSQU'À", 750, 500, t, f('s07', 0.25), { size: 44, weight: 900, color: C.muted, dx: 0 });
        line(ctx, 'TOUJOURS À 25 °C, 75 kg', 500, 1060, t, f('s07', 0.6), { size: 50, weight: 900, color: GOLD, dx: 0 });
      });
      // s08 — toi en novembre ?
      block(ctx, t, S('s08'), S('s09'), () => {
        head(ctx, 'TOI, EN NOVEMBRE…', 360, t, S('s08'), { size: 60, color: CYAN });
        const k = ease.out(prog(t, f('s08', 0.3), 0.8));
        thermometer(ctx, 260, 900, 380, lerp(0.7, 0.12, k), lerp(0, 1, k) > 0.5 ? BLUE : GOLD);
        big(ctx, '25 °C', 680, 680, t, S('s08') + 0.1, { size: 130, color: GOLD });
        big(ctx, '?', 680, 900, t, f('s08', 0.5), { size: 170, color: RED });
      });
      // s09 — le froid peut réduire l'autonomie
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, "SEGWAY L'ÉCRIT", 500, 360, t, S('s09'), { size: 44, color: GOLD });
        const lv = lerp(0.9, 0.55, ease.out(prog(t, f('s09', 0.3), 0.9)));
        battery(ctx, 500, 640, 420, lv, { color: lv > 0.6 ? GREEN : GOLD });
        line(ctx, 'LE FROID PEUT RÉDUIRE', 500, 860, t, f('s09', 0.35), { size: 56, weight: 900, color: CYAN, dx: 0 });
        line(ctx, "L'AUTONOMIE · C'EST NORMAL", 500, 950, t, f('s09', 0.55), { size: 50, weight: 900, color: WHITE, dx: 0 });
      });
      // s10 — −20 °C : jusqu'à la moitié
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, 'MANUEL SEGWAY (SÉRIE ES)', 500, 360, t, S('s10'), { size: 40, color: C.muted });
        big(ctx, '−20 °C', 500, 560, t, S('s10') + 0.1, { size: 150, color: BLUE });
        const lv = lerp(1, 0.5, ease.out(prog(t, f('s10', 0.4), 0.7)));
        battery(ctx, 500, 820, 420, lv, { color: lv > 0.6 ? GREEN : RED });
        big(ctx, "PEUT TOMBER À ÷ 2", 500, 1060, t, f('s10', 0.6), { size: 76, color: RED });
      });
      // s11 — pente 18 % avec 75 kg
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'PENTE MAX. · FICHE F2 D', 500, 360, t, S('s11'), { size: 42, color: GOLD });
        const k = ease.out(prog(t, S('s11') + 0.1, 0.6));
        ctx.save(); ctx.beginPath(); ctx.moveTo(120, 1080); ctx.lineTo(960, 1080); ctx.lineTo(960, 1080 - 151 * k); ctx.closePath(); ctx.fillStyle = 'rgba(57,198,216,0.25)'; ctx.fill(); ctx.restore();
        big(ctx, '18 %', 290, 700, t, f('s11', 0.3), { size: 150, color: CYAN });
        big(ctx, '75 kg', 760, 700, t, f('s11', 0.55), { size: 110, color: WHITE });
        line(ctx, 'AVEC', 760, 570, t, f('s11', 0.5), { size: 44, weight: 900, color: C.muted, dx: 0 });
      });
      // s12 — conseil avant d'acheter
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s12'), { size: 46, color: GREEN });
        pop(ctx, t, S('s12') + 0.1, 500, 720, () => { panel(ctx, -380, -260, 760, 520);
          text(ctx, "* NOTE SOUS L'AUTONOMIE", 0, -180, { size: 40, weight: 800, color: C.muted }); });
        ['POIDS : 75 kg', 'VITESSE : 15 km/h', 'TEMPÉRATURE : 25 °C'].forEach((s, i) => line(ctx, '✓ ' + s, 500, 640 + i * 110, t, f('s12', 0.3 + i * 0.15), { size: 54, weight: 900, color: [WHITE, WHITE, GOLD][i], dx: 0 }));
      });
      // s13 — bonus : stockage sous 0 °C
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, 'BONUS · SEGWAY (FICHE F2 D)', 500, 360, t, S('s13'), { size: 40, color: CYAN });
        big(ctx, 'STOCKÉE < 0 °C ?', 500, 540, t, S('s13') + 0.1, { size: 90, color: BLUE });
        CHR.emo(ctx, 'thermometer', 500, 760, 200, t, f('s13', 0.4));
        big(ctx, '> 5 °C', 500, 960, t, f('s13', 0.55), { size: 120, color: GOLD });
        line(ctx, 'AVANT DE CHARGER', 500, 1080, t, f('s13', 0.7), { size: 50, weight: 900, color: WHITE, dx: 0 });
      });
      // s14 — question commentaires
      block(ctx, t, S('s14'), S('s15'), () => { comment(ctx, t, S('s14'), ['Ta trottinette,', 'combien de km', 'en hiver ?'], { color: GOLD }); });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'CE SOIR', next: ['le four : faut-il vraiment', 'le préchauffer ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
