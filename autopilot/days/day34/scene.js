// Vidéo 34 — Le mode avion fait-il charger plus vite ? Chiffres et citations : days/day34/facts.md.
// Recette « vérité du quotidien en francs » : duel toi / ton collègue à l'image 0, réponse au milieu, surprise (chaleur),
// calcul en francs (batterie d'EXEMPLE), conseils, commentaire, retour au duel, DEMAIN.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect, phone } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, coins, clock, toggle, duelFrame, head, comment, thermometer, wifi } = KIT;
  const END = E('s15') + 0.6;

  function plane(ctx, x, y, s, a = 1) { text(ctx, '✈️', x, y, { size: s, family: F.emoji, weight: 400, alpha: a }); }
  function bolt(ctx, x, y, s, color) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); ctx.beginPath();
    ctx.moveTo(10, -50); ctx.lineTo(-24, 6); ctx.lineTo(-2, 6); ctx.lineTo(-12, 50); ctx.lineTo(26, -8); ctx.lineTo(4, -8); ctx.closePath();
    ctx.fillStyle = color || GOLD; ctx.fill(); ctx.restore();
  }
  function cable(ctx, x, y, len) {
    ctx.save(); ctx.strokeStyle = '#cfd6e4'; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y + len * 0.6, x + 40, y + len); ctx.stroke(); ctx.restore();
  }
  // téléphone en charge ; mode : 'off' (écran noir + avion), 'feed' (écran allumé qui défile), 'hot', 'pause'
  function phoneC(ctx, x, y, w, h, t, mode, level, o = {}) {
    if (o.cable !== false) cable(ctx, x, y + h / 2 - 6, o.cableLen || 70);
    phone(ctx, x, y, w, h, { screen: mode === 'feed' ? '#1d2a44' : '#04070d', border: o.border, draw: (sx, sy, sw, sh) => {
      if (mode === 'feed') {
        ctx.save(); roundRect(ctx, sx, sy, sw, sh, sw * 0.1); ctx.clip();
        const off = ((t * 140) % 150);
        for (let i = -1; i < 8; i++) { const yy = sy + 60 + i * 150 - off;
          roundRect(ctx, sx + 16, yy, sw - 32, 120, 14); ctx.fillStyle = ['#3b6fd8', '#c0537a', '#3aa57a', '#d89a3b'][(i + 8) % 4]; ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(sx + 30, yy + 88, (sw - 60) * 0.6, 12); }
        ctx.restore();
        ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.10)'; roundRect(ctx, sx, sy, sw, sh, sw * 0.1); ctx.fill(); ctx.restore();
      } else {
        const cx = sx + sw / 2;
        bolt(ctx, cx, sy + sh * 0.36, sw * 0.38, mode === 'hot' ? RED : GREEN);
        roundRect(ctx, sx + sw * 0.18, sy + sh * 0.56, sw * 0.64, 22, 11); ctx.fillStyle = '#1a2436'; ctx.fill();
        roundRect(ctx, sx + sw * 0.18, sy + sh * 0.56, sw * 0.64 * clamp(level), 22, 11); ctx.fillStyle = mode === 'hot' ? RED : GREEN; ctx.fill();
        if (mode === 'off') plane(ctx, cx, sy + sh * 0.76, sw * 0.26);
        if (mode === 'pause') { ctx.fillStyle = WHITE; ctx.fillRect(cx - 30, sy + sh * 0.7, 20, 64); ctx.fillRect(cx + 10, sy + sh * 0.7, 20, 64); }
      }
    } });
  }
  function duel(ctx, t, o = {}) {
    duelFrame(ctx, { y0: 520, y1: 1170 });
    const lv = 0.35 + 0.1 * Math.sin(t * 0.6);
    phoneC(ctx, 275, 810, 230, 420, t, 'off', lv, { cableLen: o.cableLen });
    phoneC(ctx, 725, 810, 230, 420, t, 'feed', lv, { cableLen: o.cableLen });
    if (!o.noLabels) {
      text(ctx, 'MODE AVION', 275, 1110, { size: 48, weight: 900, color: WHITE });
      text(ctx, 'IL SCROLLE', 725, 1110, { size: 48, weight: 900, color: WHITE });
    }
  }
  function controller(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-150, -40); ctx.quadraticCurveTo(0, -80, 150, -40); ctx.quadraticCurveTo(220, 90, 140, 100);
    ctx.quadraticCurveTo(80, 100, 50, 40); ctx.lineTo(-50, 40); ctx.quadraticCurveTo(-80, 100, -140, 100); ctx.quadraticCurveTo(-220, 90, -150, -40); ctx.closePath();
    ctx.fillStyle = '#2b3850'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#6c7ea0'; ctx.stroke();
    ctx.fillStyle = '#cfd6e4'; ctx.fillRect(-120, -10, 70, 20); ctx.fillRect(-95, -35, 20, 70);
    [[90, -20, RED], [125, 5, GOLD], [90, 30, GREEN], [55, 5, BLUE]].forEach(([bx, by, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(bx, by, 14, 0, 7); ctx.fill(); });
    ctx.restore();
  }
  function cross(ctx, x, y, r, a = 1) {
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = RED; ctx.lineWidth = 18; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.stroke(); ctx.restore();
  }
  function quote(ctx, who, lines, x, y, t, t0, color, w = 820) {
    pop(ctx, t, t0, x, y, () => {
      const h = 120 + lines.length * 62;
      panel(ctx, -w / 2, -h / 2, w, h, { border: color || GOLD });
      text(ctx, who, 0, -h / 2 + 52, { size: 38, family: F.mono, weight: 700, color: color || GOLD, maxWidth: w - 60 });
      lines.forEach((ln, i) => text(ctx, ln, 0, -h / 2 + 118 + i * 62, { size: 48, weight: 900, color: WHITE, maxWidth: w - 50 }));
    });
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['magnifying_glass_tilted_left', 'satellite_antenna', 'mobile_phone', 'thermometer', 'fire', 'sparkles', 'high_voltage', 'man_technologist', 'woman_technologist', 'clipboard']),
    draw(ctx, t) {
      background(ctx, t);
      // 0 – s03 : duel, complet à l'image 0
      block(ctx, t, 0, S('s03'), () => {
        big(ctx, 'CHARGE PLUS VITE ?', 500, 340, t, undefined, { size: 76, color: GOLD, family: F.display });
        head(ctx, t < S('s02') ? 'QUI A RAISON ?' : 'LEQUEL CHARGE LE PLUS VITE ?', 450, t, t < S('s02') ? undefined : S('s02'), { size: t < S('s02') ? 56 : 44 });
        duel(ctx, t);
      });
      // s03 : promesse
      block(ctx, t, S('s03'), S('s04'), () => {
        const lv = lerp(0.2, 0.85, ease.inOut(prog(t, S('s03'), Math.max(0.8, E('s03') - S('s03')))));
        KIT.battery(ctx, 500, 560, 520, lv, { label: false });
        bolt(ctx, 500, 560, 150, WHITE);
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 760, 760, 230, t, f('s03', 0.3));
        line(ctx, 'CE QUI RALENTIT', 420, 850, t, f('s03', 0.2), { size: 58, color: WHITE, dx: 0 });
        line(ctx, 'TA CHARGE', 420, 930, t, f('s03', 0.35), { size: 58, color: GOLD, dx: 0 });
      });
      // s04 : le mode avion coupe le réseau ; Google
      block(ctx, t, S('s04'), S('s05'), () => {
        pop(ctx, t, S('s04'), 500, 420, () => { panel(ctx, -380, -80, 760, 160, {});
          plane(ctx, -270, 4, 80); text(ctx, 'Mode avion', -40, 2, { size: 56, weight: 900, color: WHITE });
          toggle(ctx, 260, 0, prog(t, f('s04', 0.15), 0.3), { w: 150 }); });
        CHR.emo(ctx, 'satellite_antenna', 500, 690, 230, t, S('s04') + 0.1);
        cross(ctx, 500, 690, 95, clamp((t - f('s04', 0.3)) * 4));
        line(ctx, 'RÉSEAU MOBILE COUPÉ', 500, 860, t, f('s04', 0.3), { size: 52, color: WHITE, dx: 0 });
        tag(ctx, 'GOOGLE : SI TU N\'EN AS PAS BESOIN', 500, 980, t, f('s04', 0.55), { size: 36, color: GOLD });
      });
      // s05 : OFSP
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'OFSP · FICHE TÉLÉPHONES MOBILES', 500, 360, t, S('s05'), { size: 36, color: GOLD });
        line(ctx, 'IL ÉMET SURTOUT PENDANT…', 500, 460, t, S('s05') + 0.1, { size: 54, dx: 0 });
        pop(ctx, t, f('s05', 0.45), 290, 720, () => { panel(ctx, -190, -180, 380, 360, { border: CYAN });
          text(ctx, '📞', 0, -60, { size: 120, family: F.emoji, weight: 400 }); text(ctx, 'UN APPEL', 0, 100, { size: 48, weight: 900, color: WHITE }); });
        pop(ctx, t, f('s05', 0.7), 710, 720, () => { panel(ctx, -190, -180, 380, 360, { border: CYAN });
          text(ctx, '⇅', 0, -60, { size: 130, weight: 900, color: CYAN }); text(ctx, 'DES DONNÉES', 0, 100, { size: 44, weight: 900, color: WHITE }); });
        if (t > f('s05', 0.5)) wifi(ctx, 290, 990, 130, CYAN, t);
        if (t > f('s05', 0.75)) wifi(ctx, 710, 990, 130, CYAN, t);
      });
      // s06 : au repos, un signal toutes les quelques minutes (schéma)
      block(ctx, t, S('s06'), S('s07'), () => {
        line(ctx, 'AU REPOS', 500, 370, t, S('s06'), { size: 70, color: WHITE, dx: 0 });
        tag(ctx, 'SCHÉMA', 820, 370, t, S('s06'), { size: 36 });
        const x0 = 110, x1 = 890, yy = 620, u = prog(t, S('s06') + 0.1, Math.max(1, (E('s06') - S('s06')) * 0.7));
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(lerp(x0, x1, u), yy); ctx.stroke(); ctx.restore();
        [0.12, 0.5, 0.88].forEach((p, i) => { if (u > p) { const xx = lerp(x0, x1, p); ctx.save(); ctx.strokeStyle = CYAN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy - 130); ctx.stroke(); ctx.restore(); text(ctx, '·))', xx + 40, yy - 120, { size: 40, weight: 900, color: CYAN }); } });
        line(ctx, '1 SIGNAL TOUTES LES QUELQUES MINUTES', 500, 720, t, f('s06', 0.25), { size: 40, color: CYAN, dx: 0 });
        clock(ctx, 230, 930, 110, (t - S('s06')) * 6);
        stamp(ctx, 'PEU À COUPER', 600, 930, t, f('s06', 0.62), { size: 66, color: GOLD });
      });
      // s07 : écran allumé = charge plus lente (Xiaomi)
      block(ctx, t, S('s07'), S('s08'), () => {
        phoneC(ctx, 230, 690, 250, 450, t, 'feed', 0.5, { cableLen: 60 });
        quote(ctx, 'XIAOMI', ['ÉCRAN ALLUMÉ :', 'CHARGE', 'PLUS LENTE'], 640, 640, t, f('s07', 0.4), GOLD, 500);
        if (t > f('s07', 0.2)) { const k = (t * 0.25) % 1; roundRect(ctx, 120, 1000, 740, 46, 23); ctx.fillStyle = '#1a2436'; ctx.fill(); roundRect(ctx, 120, 1000, 740 * (0.3 + 0.1 * k), 46, 23); ctx.fillStyle = GOLD; ctx.fill(); text(ctx, '🐢', 120 + 740 * (0.3 + 0.1 * k) + 50, 1022, { size: 64, family: F.emoji, weight: 400 }); }
        tag(ctx, 'SCHÉMA', 760, 1110, t, f('s07', 0.2), { size: 36 });
      });
      // s08 : Honor, gros jeu
      block(ctx, t, S('s08'), S('s09'), () => {
        pop(ctx, t, S('s08'), 500, 560, () => controller(ctx, 0, 0, 1.3));
        cross(ctx, 500, 580, 160, clamp((t - f('s08', 0.5)) * 4));
        quote(ctx, 'HONOR', ['ÉVITE DE L\'UTILISER', 'EN CHARGE'], 500, 930, t, f('s08', 0.25), GOLD);
      });
      // s09 : surprise, la chaleur
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, 'SURPRISE', 500, 360, t, S('s09'), { size: 56 });
        const hot = ease.inOut(prog(t, S('s09') + 0.2, 1.2));
        thermometer(ctx, 250, 800, 330, lerp(0.3, 0.95, hot), hot > 0.6 ? RED : GOLD);
        phoneC(ctx, 640, 700, 250, 450, t, t > f('s09', 0.55) ? 'pause' : 'hot', 0.6, { border: hot > 0.6 ? RED : undefined, cableLen: 60 });
        tag(ctx, 'GOOGLE : PAUSE POSSIBLE', 500, 1080, t, f('s09', 0.6), { size: 36, color: GOLD });
      });
      // s10 : calcul d'une charge (exemple)
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, 'EXEMPLE', 500, 370, t, S('s10'), { size: 48, color: WHITE });
        KIT.battery(ctx, 500, 540, 300, 1, { label: '19 Wh', size: 58 });
        calc(ctx, ['0,019 kWh × 27,7 ct', '≈ 0,53 ct'], 500, 730, t, [f('s10', 0.3), f('s10', 0.55)], { gap: 120, lastSize: 140 });
        tag(ctx, 'MÉDIANE ELCOM 2026, HORS TVA', 500, 1080, t, f('s10', 0.6), { size: 36 });
      });
      // s11 : un an
      block(ctx, t, S('s11'), S('s12'), () => {
        const n = Math.round(lerp(1, 365, ease.inOut(prog(t, S('s11') + 0.1, Math.max(0.6, (E('s11') - S('s11')) * 0.55)))));
        big(ctx, String(n), 500, 430, t, undefined, { size: 170 });
        line(ctx, 'CHARGES PAR AN', 500, 560, t, S('s11') + 0.1, { size: 54, dx: 0 });
        big(ctx, '≈ 1,92 CHF', 500, 720, t, f('s11', 0.55), { size: 130 });
        coins(ctx, t, f('s11', 0.6), 6, 200, 800, 1000, '');
        tag(ctx, 'EXEMPLE · SANS LES PERTES', 500, 1100, t, f('s11', 0.6), { size: 36 });
      });
      // s12 : conseils
      block(ctx, t, S('s12'), S('s13'), () => {
        [['ÉCRAN ÉTEINT', '📱', 0.02], ['PAS DE JEU', '🎮', 0.3], ['PAS AU SOLEIL', '☀️', 0.55]].forEach(([s, e, u], i) => {
          pop(ctx, t, f('s12', u), 500, 440 + i * 200, () => { panel(ctx, -400, -78, 800, 156, { border: GREEN });
            text(ctx, e, -300, 4, { size: 86, family: F.emoji, weight: 400 }); text(ctx, s, 60, 2, { size: 62, weight: 900, color: WHITE, maxWidth: 560 }); }); });
      });
      // s13 : commentaire
      block(ctx, t, S('s13'), S('s14'), () => comment(ctx, t, S('s13'), ['Tu charges', 'en mode avion ?'], { y: 650 }));
      // s14 : retour au duel, verdict
      block(ctx, t, S('s14'), S('s15'), () => {
        head(ctx, 'VERDICT', 420, t, undefined, { size: 56 });
        duel(ctx, t, { noLabels: true, cableLen: 30 });
        line(ctx, 'UN PETIT PLUS,', 275, 1095, t, S('s14') + 0.1, { size: 44, color: GOLD, dx: 0 });
        line(ctx, 'PEUT-ÊTRE', 275, 1150, t, S('s14') + 0.2, { size: 44, color: GOLD, dx: 0 });
        stamp(ctx, 'PLUS LENTE', 725, 1100, t, f('s14', 0.55), { size: 52 });
      });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['Télé 65 pouces :', '165 cm de large ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515, fromZero: true });
    }
  };
})();
