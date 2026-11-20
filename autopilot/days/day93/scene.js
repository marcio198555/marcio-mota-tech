// Vidéo 93 — Console en mode repos : combien en francs par an ? (mesures Sony PS5 CFI-2016, support PlayStation, ElCom 2026). Chiffres : days/day93/facts.md.
// Thème : violet / indigo « nuit ». Duel toi (repos tout activé) / ton collègue (repos par défaut), réponse au milieu, écart en francs à la fin.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, WHITE, f, pop, stamp, panel, big, line, tag, calc, comment, toggle, coins, clock } = KIT;
  const END = E('s16') + 0.6;
  const VIO = '#a98bff', VIO2 = '#5b3fc4', ORANGE = '#ffb347';
  function theme(ctx, t) {
    const g = ctx.createRadialGradient(540, 700, 80, 540, 700, 1100); g.addColorStop(0, 'rgba(90,60,200,0.28)'); g.addColorStop(1, 'rgba(10,6,40,0.20)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); for (let i = 0; i < 14; i++) { const x = (i * 157) % 1000 + 40, y = 260 + (i * 97) % 900; ctx.globalAlpha = 0.15 + 0.15 * Math.sin(t * 2 + i); ctx.fillStyle = '#d8ccff'; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
  }
  // console de salon générique (boîtier + voyant) ; led = couleur du voyant ; zz = petits « z » de sommeil
  function konsole(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -70, -150, 140, 300, 26); const g = ctx.createLinearGradient(-70, 0, 70, 0); g.addColorStop(0, '#2a2f45'); g.addColorStop(1, '#151827'); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = '#4b5378'; ctx.stroke();
    roundRect(ctx, -54, 100, 108, 10, 5); ctx.fillStyle = '#0a0c14'; ctx.fill();
    const pulse = 0.55 + 0.45 * Math.sin(t * 3 + (o.phase || 0));
    ctx.shadowColor = o.led || ORANGE; ctx.shadowBlur = 30 * pulse; ctx.fillStyle = o.led || ORANGE; ctx.beginPath(); ctx.arc(0, 128, 9, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    if (o.zz) for (let i = 0; i < 3; i++) { const p = ((t * 0.6 + i / 3) % 1); text(ctx, 'z', 80 + p * 50, -60 - p * 80, { size: 40 + i * 6, weight: 900, color: '#d8ccff', alpha: 1 - p }); }
    ctx.restore();
  }
  // icônes d'options : prise USB et globe Internet (dessinés)
  function usb(ctx, x, y, s, on) {
    ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= on ? 1 : 0.3; ctx.strokeStyle = on ? GOLD : '#8890b0'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, s * 0.5); ctx.lineTo(0, -s * 0.45); ctx.moveTo(0, -s * 0.1); ctx.lineTo(-s * 0.28, -s * 0.28); ctx.moveTo(0, s * 0.1); ctx.lineTo(s * 0.28, -s * 0.12); ctx.stroke();
    ctx.fillStyle = on ? GOLD : '#8890b0'; ctx.beginPath(); ctx.moveTo(0, -s * 0.6); ctx.lineTo(-s * 0.12, -s * 0.42); ctx.lineTo(s * 0.12, -s * 0.42); ctx.fill(); ctx.beginPath(); ctx.arc(0, s * 0.55, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function globe(ctx, x, y, r, on) {
    ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= on ? 1 : 0.3; ctx.strokeStyle = on ? GOLD : '#8890b0'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.45, r, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke(); ctx.restore();
  }
  function duelImage(ctx, t, o = {}) {
    KIT.duelFrame(ctx, { y0: o.y0 || 500, y1: o.y1 || 1080 });
    const cy = o.cy || 760;
    konsole(ctx, 275, cy, o.s || 1, t, { led: ORANGE, zz: true });
    konsole(ctx, 725, cy, o.s || 1, t, { led: ORANGE, zz: true, phase: 1.3 });
    if (o.labels !== false) {
      const iy = cy + 275 * (o.s || 1);
      usb(ctx, 215, iy, 60, true); globe(ctx, 335, iy, 26, true);
      usb(ctx, 665, iy, 60, false); globe(ctx, 785, iy, 26, false);
      text(ctx, 'TOUT ACTIVÉ', 275, cy + 200 * (o.s || 1), { size: 46, weight: 900, color: GOLD });
      text(ctx, 'PAR DÉFAUT', 725, cy + 200 * (o.s || 1), { size: 46, weight: 900, color: GREEN });
    }
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['warning', 'video_camera', 'clipboard', 'money_bag', 'gear', 'check_mark_button', 'electric_plug']),
    draw(ctx, t) {
      background(ctx, t); theme(ctx, t);
      // s01–s02 : image 0 — duel des deux consoles en repos + « ? CHF / an » qui pulse + pièces qui tombent à gauche
      block(ctx, t, 0, S('s03'), () => {
        const z = 1 + 0.06 * Math.sin(t * 4);
        ctx.save(); ctx.translate(500, 385); ctx.scale(z, z);
        text(ctx, '? CHF / an', 0, 0, { size: 120, weight: 900, family: F.mono, color: GOLD, stroke: 'rgba(0,0,0,0.6)', shadow: GOLD + '66', shadowBlur: 30 });
        ctx.restore();
        text(ctx, 'PS5 en MODE REPOS', 500, 478, { size: 44, weight: 800, color: '#d8ccff' });
        duelImage(ctx, t, { y0: 545, y1: 1080 });
        if (t > S('s02')) stamp(ctx, 'ATTENDS', 725, 720, t, f('s02', 0.45), { size: 46, color: GOLD, rot: 0.06 });
        KIT.head(ctx, 'COMBIEN PAR AN ?', 1170, t, undefined, { size: 56, color: VIO, bg: 'rgba(169,139,255,0.18)' });
      });
      // s03 : promesse + piège
      block(ctx, t, S('s03'), S('s04'), () => {
        line(ctx, 'À LA FIN :', 500, 400, t, S('s03'), { size: 64, weight: 900, color: GOLD, dx: 0 });
        line(ctx, "L'ÉCART EN FRANCS", 500, 500, t, f('s03', 0.15), { size: 72, weight: 900, dx: 0 });
        CHR.emo(ctx, 'money_bag', 330, 760, 220, t, f('s03', 0.25));
        pop(ctx, t, f('s03', 0.55), 690, 760, () => { CHR.emo(ctx, 'warning', 0, -20, 200, t, f('s03', 0.55)); text(ctx, '+ UN PIÈGE', 0, 130, { size: 54, weight: 900, color: RED }); });
      });
      // s04 : mesures publiées par Sony
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'MESURES PUBLIÉES PAR SONY', 500, 340, t, S('s04'), { size: 40, color: VIO });
        konsole(ctx, 500, 680, 1.2, t, { led: ORANGE });
        CHR.emo(ctx, 'clipboard', 760, 560, 170, t, S('s04') + 0.2);
        line(ctx, 'PS5 · modèle CFI-2016', 500, 960, t, f('s04', 0.3), { size: 60, weight: 900, dx: 0 });
        line(ctx, 'test du 26.01.2024', 500, 1045, t, f('s04', 0.5), { size: 42, weight: 800, color: 'rgba(255,255,255,0.8)', dx: 0 });
      });
      // s05 : repos par défaut 0,31 W
      block(ctx, t, S('s05'), S('s07'), () => {
        line(ctx, "Et ce n'est pas tout", 500, 330, t, S('s05'), { size: 42, weight: 800, color: GOLD, dx: 0 });
        chip(ctx, 'PAR DÉFAUT', 275, 450, { size: 38, color: GREEN });
        big(ctx, '0,31 W', 275, 600, t, S('s05') + 0.4, { size: 110, color: GREEN });
        const kL = ease.out(prog(t, f('s05', 0.6), 0.5));
        roundRect(ctx, 215, 1050 - 30 * kL, 120, Math.max(4, 30 * kL), 10); ctx.fillStyle = GREEN; ctx.fill();
        // s06 : tout activé 3,8 W
        if (t >= S('s06')) {
          chip(ctx, 'TOUT ACTIVÉ', 725, 450, { size: 38, color: GOLD });
          big(ctx, '3,8 W', 725, 600, t, S('s06') + 0.1, { size: 110, color: RED });
          const kR = ease.out(prog(t, f('s06', 0.3), 0.6));
          roundRect(ctx, 665, 1050 - 368 * kR, 120, Math.max(4, 368 * kR), 10); ctx.fillStyle = RED; ctx.fill();
          usb(ctx, 640, 1110, 60, true); globe(ctx, 810, 1110, 26, true);
        }
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, 1052); ctx.lineTo(860, 1052); ctx.stroke(); ctx.restore();
      });
      // s07 : réponse — environ 12 fois plus
      block(ctx, t, S('s07'), S('s08'), () => {
        stamp(ctx, '≈ ×12', 500, 430, t, S('s07'), { size: 140, color: RED });
        for (let i = 0; i < 12; i++) pop(ctx, t, S('s07') + 0.3 + i * 0.05, 230 + (i % 6) * 108, 690 + Math.floor(i / 6) * 120, () => { ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.fillStyle = RED; ctx.fill(); text(ctx, '⚡', 0, 4, { size: 44, family: F.emoji, weight: 400 }); });
        pop(ctx, t, f('s07', 0.6), 500, 1000, () => { ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.fillStyle = GREEN; ctx.fill(); text(ctx, '⚡', 0, 4, { size: 44, family: F.emoji, weight: 400 }); });
        line(ctx, 'toi · tout activé', 500, 600, t, f('s07', 0.3), { size: 42, weight: 800, color: 'rgba(255,255,255,0.85)', dx: 0 });
        line(ctx, 'ton collègue · par défaut', 500, 1090, t, f('s07', 0.65), { size: 42, weight: 800, color: 'rgba(255,255,255,0.85)', dx: 0 });
      });
      // s08 : le piège — une option activée, plus sous 0,5 W (support PlayStation)
      block(ctx, t, S('s08'), S('s09'), () => {
        stamp(ctx, 'LE PIÈGE', 500, 350, t, S('s08'), { size: 80, color: RED });
        tag(ctx, 'SUPPORT OFFICIEL PLAYSTATION', 500, 470, t, S('s08') + 0.1, { size: 38, color: VIO });
        const on = clamp((t - f('s08', 0.25)) * 3);
        pop(ctx, t, S('s08') + 0.15, 500, 680, () => {
          panel(ctx, -390, -130, 780, 260, { border: 'rgba(169,139,255,0.6)' });
          text(ctx, 'Recharge USB', -120, 0, { size: 50, weight: 800, color: WHITE });
          toggle(ctx, 250, 0, on, { color: GOLD });
        });
        line(ctx, '1 option activée →', 500, 900, t, f('s08', 0.45), { size: 52, weight: 900, dx: 0 });
        big(ctx, 'plus sous 0,5 W', 500, 1020, t, f('s08', 0.6), { size: 84, color: RED, family: F.display });
      });
      // s09 : surprise — 1 h de jeu ≈ 57 h de repos tout activé
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'SURPRISE', 500, 340, t, S('s09'), { size: 64, color: GOLD });
        chip(ctx, '1 h DE JEU', 230, 470, { size: 38, color: WHITE });
        big(ctx, '216,8 W', 230, 600, t, S('s09') + 0.2, { size: 72, color: ORANGE });
        text(ctx, '≈', 500, 600, { size: 110, weight: 900, color: WHITE, alpha: clamp((t - f('s09', 0.35)) * 4) });
        chip(ctx, 'REPOS TOUT ACTIVÉ', 760, 470, { size: 36, color: GOLD });
        big(ctx, '57 h', 770, 600, t, f('s09', 0.45), { size: 110, color: GOLD });
        clock(ctx, 740, 860, 120, (t - S('s09')) * 8, { color: GOLD });
        pop(ctx, t, S('s09') + 0.25, 260, 860, () => { roundRect(ctx, -110, -70, 220, 140, 24); ctx.fillStyle = '#26203f'; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.stroke(); text(ctx, '🎮', 0, 4, { size: 90, family: F.emoji, weight: 400 }); });
        line(ctx, '216,8 ÷ 3,8 ≈ 57 (moyenne Sony, 3 jeux PS5)', 500, 1070, t, f('s09', 0.6), { size: 36, weight: 700, color: 'rgba(255,255,255,0.8)', dx: 0 });
      });
      // s10–s11 : conseil — chemin du menu, puis on désactive
      block(ctx, t, S('s10'), S('s12'), () => {
        tag(ctx, 'CONSEIL', 500, 330, t, S('s10'), { size: 44, color: GREEN });
        const items = ['Paramètres', 'Système', "Gestion de l'alimentation", 'Fonctionnalités disponibles', 'en mode repos'];
        const tt = [0.05, 0.2, 0.38, 0.58, 0.62];
        items.forEach((it, i) => {
          const a = clamp((t - f('s10', tt[i])) * 4); if (a <= 0) return;
          const last = i >= 3;
          ctx.save(); ctx.globalAlpha *= a;
          if (i < 4) { roundRect(ctx, 130, 410 + i * 105, 740, i === 3 ? 170 : 86, 20); ctx.fillStyle = last ? 'rgba(169,139,255,0.30)' : 'rgba(255,255,255,0.07)'; ctx.fill(); if (last) { ctx.lineWidth = 4; ctx.strokeStyle = VIO; ctx.stroke(); } }
          text(ctx, (i < 3 ? '›  ' : i === 3 ? '›  ' : '    ') + it, 160, 453 + i * 105 - (i === 4 ? 25 : 0), { size: 46, weight: last ? 900 : 700, color: WHITE, align: 'left' });
          ctx.restore();
        });
        if (t >= S('s11')) {
          const off = clamp((t - S('s11') - 0.2) * 3);
          pop(ctx, t, S('s11'), 500, 1045, () => {
            panel(ctx, -390, -120, 780, 240, { border: 'rgba(88,214,141,0.6)' });
            usb(ctx, -300, -45, 50, off < 0.5); text(ctx, 'USB', -200, -45, { size: 44, weight: 800, color: WHITE, align: 'left' }); toggle(ctx, 260, -45, 1 - off, { color: GOLD, w: 140 });
            globe(ctx, -300, 55, 22, off < 0.5); text(ctx, 'Internet', -200, 55, { size: 44, weight: 800, color: WHITE, align: 'left' }); toggle(ctx, 260, 55, 1 - off, { color: GOLD, w: 140 });
          });
        }
      });
      // s12 : commentaire
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['USB ? Internet ?', 'Aucune ?'], { color: VIO }); });
      // s13 : exemple — hypothèse et tarif
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, 'EXEMPLE', 500, 340, t, S('s13'), { size: 48, color: GOLD });
        calc(ctx, ['20 h de repos par jour', '× 365 jours', '27,7 ct./kWh'], 500, 480, t, [S('s13') + 0.1, f('s13', 0.3), f('s13', 0.55)], { lastSize: 96, color: GOLD, gap: 110 });
        line(ctx, 'médiane ElCom 2026, hors TVA', 500, 900, t, f('s13', 0.6), { size: 42, weight: 800, color: 'rgba(255,255,255,0.85)', dx: 0 });
      });
      // s14 : retour au duel — montants par an (exemple)
      block(ctx, t, S('s14'), S('s15'), () => {
        tag(ctx, 'exemple', 500, 330, t, S('s14'), { size: 40, color: GOLD });
        duelImage(ctx, t, { y0: 420, y1: 1110, cy: 640, s: 0.75, labels: false });
        big(ctx, '7,68 CHF', 275, 900, t, S('s14') + 0.15, { size: 76, color: RED });
        big(ctx, '0,63 CHF', 725, 900, t, f('s14', 0.55), { size: 76, color: GREEN });
        text(ctx, 'par an · tout activé', 275, 990, { size: 38, weight: 800, color: 'rgba(255,255,255,0.85)', alpha: clamp((t - S('s14') - 0.3) * 3) });
        text(ctx, 'par an · par défaut', 725, 990, { size: 38, weight: 800, color: 'rgba(255,255,255,0.85)', alpha: clamp((t - f('s14', 0.6)) * 3) });
      });
      // s15 : promesse tenue — l'écart
      block(ctx, t, S('s15'), S('s16'), () => {
        line(ctx, "L'ÉCART", 500, 400, t, S('s15'), { size: 66, weight: 900, color: WHITE, dx: 0 });
        big(ctx, '≈ 7 CHF / an', 500, 600, t, S('s15') + 0.15, { size: 120, color: GOLD });
        coins(ctx, t, S('s15') + 0.3, 9, 250, 750, 1050, 'F');
        tag(ctx, 'exemple · écart 7,06 CHF/an, hors TVA', 500, 1120, t, S('s15') + 0.2, { size: 36, color: 'rgba(255,255,255,0.85)' });
      });
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'DEMAIN', next: ['un nouveau chiffre', 'vérifié'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
