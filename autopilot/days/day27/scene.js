// Vidéo 27 — format A : le frigo balance s'il est réglé trop froid. Chiffres : days/day27/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, thermometer, coin, comment, FRIDGE } = KIT;
  const ICE = '#8fd8ff';
  const END = E('s15') + 0.6;
  const IDS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12','s13','s14'];
  const PUNCH = [[f('s01',0.3),0.04],[f('s03',0.6),0.06],[f('s06',0.6),0.08],[f('s08',0.6),0.08],[f('s10',0.6),0.05],[f('s12',0.7),0.05],[S('s14'),0.05]];
  function card(ctx, h = 500, o = {}) { panel(ctx, 70, 310, 860, h, { bg: 'rgba(7,18,32,0.9)', border: o.border || 'rgba(143,216,255,0.55)' }); }
  function dial(ctx, x, y, r, pos, t) { // bouton 1 à 5 ; pos = cran (1..5)
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = '#dfe4ec'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#7f8ca6'; ctx.stroke();
    for (let i = 1; i <= 5; i++) { const a = -Math.PI * 0.75 + (i - 1) * Math.PI * 0.375;
      text(ctx, String(i), Math.sin(a) * r * 1.3, -Math.cos(a) * r * 1.3, { size: r * 0.42, weight: 900, color: WHITE, stroke: 'rgba(0,0,0,0.6)' }); }
    ctx.rotate(-Math.PI * 0.75 + (pos - 1) * Math.PI * 0.375);
    roundRect(ctx, -r * 0.1, -r * 0.92, r * 0.2, r * 0.8, r * 0.08); ctx.fillStyle = RED; ctx.fill(); ctx.restore();
  }
  function therm(ctx, x, label, frac, col, o = {}) {
    thermometer(ctx, x, 630, 190, frac, col);
    big(ctx, label.replace(' ', '\u202f'), x + (o.dx ?? 170), 560, 0, undefined, { size: 92, color: col });
  }
  function duelCard(ctx, t) {
    card(ctx, 500);
    ctx.save(); ctx.setLineDash([14, 14]); ctx.strokeStyle = 'rgba(230,198,106,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 330); ctx.lineTo(500, 790); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 285, 362, { color: WHITE, size: 36 }); chip(ctx, 'TON COLLÈGUE', 715, 362, { color: WHITE, size: 36 });
    therm(ctx, 170, '2 °C', 0.25, ICE); therm(ctx, 600, '5 °C', 0.55, GOLD);
  }
  function fridgeAt(t) {
    let y = 1290, sq = 0; const x = 500 + 40 * Math.sin(t * 0.7);
    IDS.forEach(id => { const d = t - S(id); if (d >= 0 && d < 0.34) { y -= 22 * Math.sin(Math.PI * d / 0.34); sq -= 0.03 * Math.sin(Math.PI * d / 0.34); } });
    PUNCH.forEach(([tp]) => { const d = t - tp; if (d >= 0 && d < 0.5) sq += 0.05 * Math.sin(d * 18) * Math.exp(-d * 6); });
    return [x, y, sq];
  }
  window.SCENE = {
    duration: END,
    load: () => Promise.all([CHR.loadArt(['decor_cuisine', 'perso_frigo']), CHR.load(['thermometer', 'droplet', 'magnifying_glass_tilted_left', 'high_voltage', 'warning', 'money_bag', 'hourglass_done', 'thinking_face'])]),
    draw(ctx, t) {
      CHR.backdrop(ctx, t, 'decor_cuisine', { blur: 1.5, z0: 1.04, z1: 1.12, focus: [0.5, 0.75], dur: END, dim: t >= S('s15') ? 0.72 : 0.32 });
      CHR.camera(ctx, t, PUNCH, { cy: 900 });
      if (t < S('s15')) { const [x, y, sq] = fridgeAt(t); CHR.art(ctx, 'perso_frigo', x, y, 450, t, { ...FRIDGE, squash: sq }); }
      block(ctx, t, 0, S('s02'), () => { duelCard(ctx, t); line(ctx, 'QUI PAIE POUR RIEN ?', 500, 770, t, undefined, { size: 58, weight: 900, color: GOLD, dx: 0 }); });
      block(ctx, t, S('s02'), S('s03'), () => { card(ctx, 500); dial(ctx, 500, 570, 120, 3 + 2 * Math.sin((t - S('s02')) * 5), t); line(ctx, 'MON BOUTON TE MENT ?', 500, 760, t, S('s02') + 0.2, { size: 58, weight: 900, color: GOLD, dx: 0 }); });
      block(ctx, t, S('s03'), S('s04'), () => { card(ctx, 500);
        line(ctx, '− 1 °C', 500, 375, t, S('s03') + 0.1, { size: 60, color: ICE, dx: 0 });
        [0, 1, 2].forEach(i => { const k = ease.out(prog(t, f('s03', 0.3 + i * 0.16), 0.3)), h = (i + 1) * 80 * k;
          roundRect(ctx, 190 + i * 215, 720 - h, 190, Math.max(1, h), 14); ctx.fillStyle = [GOLD, '#ee9a4a', RED][i]; ctx.fill();
          if (k > 0.6) text(ctx, '+ 5 %', 285 + i * 215, 690, { size: 44, family: F.mono, weight: 700, color: '#071018' }); });
        tag(ctx, 'SOURCE : QUE CHOISIR', 500, 765, t, f('s03', 0.55));
      });
      block(ctx, t, S('s04'), S('s05'), () => { card(ctx, 500);
        const v = [5, 4, 3, 2][Math.min(3, Math.floor(clamp((t - S('s04')) / Math.max(0.6, (E('s04') - S('s04')) * 0.55)) * 4))];
        big(ctx, v + ' °C', 280, 520, t, undefined, { size: 130, color: v > 3 ? GOLD : ICE });
        big(ctx, '≈ 15 %', 660, 520, t, f('s04', 0.55), { size: 100, color: RED });
        line(ctx, "d'énergie en plus", 660, 640, t, f('s04', 0.6), { size: 42 });
        tag(ctx, '3 DEGRÉS × 5 %', 500, 745, t, f('s04', 0.65));
      });
      block(ctx, t, S('s05'), S('s06'), () => { card(ctx, 500);
        stamp(ctx, 'EXEMPLE', 500, 390, t, S('s05') + 0.05, { color: WHITE, size: 50 });
        big(ctx, '315 kWh', 500, 540, t, f('s05', 0.3), { size: 124 });
        line(ctx, 'par an, un combiné moyen', 500, 660, t, f('s05', 0.45), { size: 46 });
        tag(ctx, 'ADEME · FRANCE', 500, 745, t, f('s05', 0.6));
      });
      block(ctx, t, S('s06'), S('s07'), () => { card(ctx, 500);
        line(ctx, '315 kWh × 15 % = 47 kWh', 500, 385, t, S('s06'), { size: 50, family: F.mono, weight: 700, dx: 0 });
        line(ctx, '47 kWh × 27,7 ct', 500, 460, t, S('s06') + 0.3, { size: 50, family: F.mono, weight: 700, dx: 0 });
        stamp(ctx, 'EXEMPLE', 800, 690, t, S('s06'), { size: 36, color: WHITE }); big(ctx, '≤ 13 CHF', 500, 590, t, f('s06', 0.5), { size: 130 });
        line(ctx, 'de plus par an', 400, 695, t, f('s06', 0.6), { size: 46 });
        tag(ctx, 'MÉDIANE ELCOM 2026, HORS TVA', 500, 765, t, f('s06', 0.65), { size: 36 });
      });
      block(ctx, t, S('s07'), S('s08'), () => { card(ctx, 500);
        coin(ctx, 300, 560, 120, '1', {}); big(ctx, '≈ 1 CHF', 640, 520, t, S('s07') + 0.1, { size: 100 }); stamp(ctx, 'EXEMPLE', 640, 730, t, S('s07') + 0.2, { size: 44, color: WHITE });
        line(ctx, 'par mois', 640, 620, t, S('s07') + 0.3, { size: 54 });
      });
      block(ctx, t, S('s08'), S('s09'), () => { card(ctx, 500, { border: 'rgba(255,77,90,0.7)' });
        dial(ctx, 260, 570, 105, 3, t); big(ctx, 'CRAN 3', 660, 480, t, f('s08', 0.2), { size: 86, color: WHITE });
        stamp(ctx, '≠ 3 °C', 660, 630, t, f('s08', 0.55), { size: 92 });
        tag(ctx, 'FRIGO MÉCANIQUE', 500, 765, t, f('s08', 0.3));
      });
      block(ctx, t, S('s09'), S('s10'), () => { card(ctx, 500);
        for (let i = 1; i <= 5; i++) { const a = clamp((t - S('s09') - i * 0.12) * 5);
          text(ctx, String(i), 100 + i * 135, 660, { size: 60, weight: 900, color: WHITE, alpha: a });
          for (let n = 0; n < i; n++) text(ctx, '❄️', 100 + i * 135, 590 - n * 52, { size: 46, family: F.emoji, weight: 400, alpha: a }); }
        tag(ctx, 'LA FORCE DU FROID', 500, 745, t, S('s09') + 0.3, { color: ICE });
      });
      block(ctx, t, S('s10'), S('s11'), () => { card(ctx, 500);
        line(ctx, 'ANSES : AU POINT LE PLUS FROID', 500, 375, t, S('s10'), { size: 38, color: GOLD, dx: 0 });
        roundRect(ctx, 130, 520, 740, 84, 20); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill();
        const X = v => 170 + v * 132; const k = ease.out(prog(t, f('s10', 0.35), 0.4));
        roundRect(ctx, X(0), 520, 528 * k, 84, 16); ctx.fillStyle = GREEN; ctx.fill();
        [0, 2, 4, 5].forEach(v => text(ctx, v + ' °C', X(v), 490, { size: 38, family: F.mono, weight: 700, color: WHITE }));
        big(ctx, '0 à 4 °C', X(2), 562, t, f('s10', 0.5), { size: 54, color: '#06281a', glow: false });
        ctx.save(); ctx.globalAlpha *= clamp((t - f('s10', 0.2)) * 4); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(X(5), 615); ctx.lineTo(X(5) - 22, 650); ctx.lineTo(X(5) + 22, 650); ctx.closePath(); ctx.fill(); ctx.restore();
        line(ctx, 'ton collègue : 5 °C, à quel endroit ?', 500, 700, t, f('s10', 0.25), { size: 42, color: RED, dx: 0 });
      });
      block(ctx, t, S('s11'), S('s12'), () => { card(ctx, 500);
        roundRect(ctx, 320, 340, 360, 440, 20); ctx.fillStyle = '#eef2f7'; ctx.fill();
        [440, 530, 620].forEach(y => { ctx.fillStyle = '#b8c2d2'; ctx.fillRect(330, y, 340, 8); });
        const a = 0.55 + 0.35 * Math.sin(t * 6);
        ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = RED; ctx.fillRect(610, 345, 66, 430); ctx.fillRect(330, 660, 270, 115); ctx.restore();
        line(ctx, 'PORTE', 850, 450, t, S('s11') + 0.2, { size: 42, color: RED, align: 'center', dx: 0 });
        line(ctx, 'BAC À', 175, 690, t, f('s11', 0.45), { size: 42, color: RED, dx: 0 }); line(ctx, 'LÉGUMES', 175, 740, t, f('s11', 0.45), { size: 36, color: RED, dx: 0 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { card(ctx, 500);
        const k = clamp((t - S('s12')) / 2);
        roundRect(ctx, 170, 470, 170, 240, 14); ctx.fillStyle = 'rgba(143,216,255,0.28)'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = WHITE; ctx.stroke();
        ctx.fillStyle = ICE; ctx.globalAlpha *= 0.8; ctx.fillRect(176, 530, 158, 174); ctx.globalAlpha /= 0.8;
        line(ctx, 'AU MILIEU', 255, 420, t, S('s12') + 0.1, { size: 40, dx: 0 });
        text(ctx, '🌙', 500, 530, { size: 120, family: F.emoji, weight: 400, alpha: clamp((t - f('s12', 0.4)) * 4) });
        line(ctx, 'UNE NUIT', 500, 650, t, f('s12', 0.4), { size: 40, dx: 0 });
        if (t > f('s12', 0.62)) thermometer(ctx, 735, 640, 220, 0.4, GOLD);
        tag(ctx, '> 4 °C : UN CRAN DE PLUS', 500, 755, t, f('s12', 0.75), { size: 36 });
      });
      block(ctx, t, S('s13'), S('s14'), () => comment(ctx, t, S('s13'), ['Ton verre d\'eau', 'affiche combien ?', '?? °C'], { y: 540, color: ICE }));
      block(ctx, t, S('s14'), S('s15'), () => { duelCard(ctx, t);
        stamp(ctx, '≤ + 13 CHF', 285, 775, t, S('s14') + 0.1, { size: 44 });
        stamp(ctx, 'TROP CHAUD ?', 715, 775, t, f('s14', 0.5), { size: 40, color: GOLD });
      });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['linge au salon ou sèche-linge :', 'qui paie vraiment ?'] }));
      ctx.restore();
      brand(ctx, t);
      captions(ctx, t, { y: 1385, size: 64, maxWidth: 800, x: 515, fromZero: true });
    }
  };
})();
