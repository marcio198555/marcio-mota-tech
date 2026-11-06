// Vidéo 58 — format A : le micro-ondes balance pourquoi le centre reste froid. Chiffres : days/day58/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, coin, comment, MICRO } = KIT;
  const HOT = '#ff6a3d', COLD = '#58b7ff';
  const END = E('s16') + 0.6;
  const IDS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12','s13','s14','s15'];
  const PUNCH = [[f('s01',0.5),0.05],[f('s04',0.6),0.08],[f('s06',0.5),0.05],[f('s08',0.6),0.07],[f('s09',0.3),0.06],[f('s13',0.7),0.05],[S('s15'),0.05]];
  function card(ctx, h = 520, o = {}) { panel(ctx, 70, 310, 860, h, { bg: 'rgba(14,14,20,0.9)', border: o.border || 'rgba(255,106,61,0.6)' }); }
  // plat vu du dessus : bord chaud, centre froid (schéma)
  function plate(ctx, x, y, r, heat) {
    ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r * 1.14, 0, 7); ctx.fillStyle = '#e9e6dd'; ctx.fill();
    const g = ctx.createRadialGradient(0, 0, r * 0.12, 0, 0, r);
    g.addColorStop(0, COLD); g.addColorStop(lerp(0.2, 0.5, heat), COLD); g.addColorStop(0.8, '#e8a14d'); g.addColorStop(1, HOT);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = g; ctx.fill(); ctx.restore();
  }
  // coupe verticale d'un plat : profondeur chauffée depuis les bords
  function coupe(ctx, x, y, w, h, depth, t) {
    roundRect(ctx, x, y, w, h, 18); ctx.fillStyle = COLD; ctx.fill();
    ctx.save(); roundRect(ctx, x, y, w, h, 18); ctx.clip(); ctx.fillStyle = HOT;
    const d = depth * h; ctx.fillRect(x, y, w, d); ctx.fillRect(x, y + h - d, w, d); ctx.fillRect(x, y, d, h); ctx.fillRect(x + w - d, y, d, h); ctx.restore();
    ctx.lineWidth = 5; ctx.strokeStyle = WHITE; roundRect(ctx, x, y, w, h, 18); ctx.stroke();
  }
  function microAt(t) {
    let y = 1290, sq = 0; const x = 500 + 30 * Math.sin(t * 0.8);
    IDS.forEach(id => { const d = t - S(id); if (d >= 0 && d < 0.34) { y -= 20 * Math.sin(Math.PI * d / 0.34); sq -= 0.03 * Math.sin(Math.PI * d / 0.34); } });
    PUNCH.forEach(([tp]) => { const d = t - tp; if (d >= 0 && d < 0.5) sq += 0.05 * Math.sin(d * 18) * Math.exp(-d * 6); });
    return [x, y, sq];
  }
  function duelCard(ctx, t, o = {}) {
    card(ctx, 520);
    ctx.save(); ctx.setLineDash([14, 14]); ctx.strokeStyle = 'rgba(230,198,106,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 330); ctx.lineTo(500, 810); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 285, 362, { color: WHITE, size: 36 }); chip(ctx, 'TON COLLÈGUE', 715, 362, { color: WHITE, size: 36 });
    CHR.emo(ctx, 'woman_technologist', 285, 490, 170, t, undefined, { phase: 0.3 }); CHR.emo(ctx, 'man_technologist', 715, 490, 170, t, undefined, { phase: 1.4 });
    text(ctx, 'IL CHAUFFE MAL', 285, 612, { size: 42, weight: 900, color: WHITE, maxWidth: 390 });
    text(ctx, "DE L'INTÉRIEUR", 715, 612, { size: 42, weight: 900, color: WHITE, maxWidth: 390 });
  }
  window.SCENE = {
    duration: END,
    load: () => Promise.all([CHR.loadArt(['decor_cuisine', 'perso_microondes']), CHR.load(['man_technologist', 'woman_technologist', 'stopwatch', 'high_voltage', 'hourglass_done', 'check_mark_button', 'cross_mark'])]),
    draw(ctx, t) {
      CHR.backdrop(ctx, t, 'decor_cuisine', { blur: 2.5, z0: 1.12, z1: 1.2, focus: [0.3, 0.7], dur: END, dim: t >= S('s16') ? 0.72 : 0.4 });
      CHR.camera(ctx, t, PUNCH, { cy: 900 });
      if (t < S('s16')) { const [x, y, sq] = microAt(t); CHR.art(ctx, 'perso_microondes', x, y, 340, t, { ...MICRO, squash: sq }); }
      block(ctx, t, 0, S('s03'), () => { duelCard(ctx, t);
        plate(ctx, 285, 730, 72, 0.3); plate(ctx, 715, 730, 72, 0.3);
        line(ctx, 'QUI A RAISON ?', 500, 880, t, undefined, { size: 64, weight: 900, color: GOLD, dx: 0, stroke: 'rgba(0,0,0,0.7)' });
      });
      block(ctx, t, S('s03'), S('s04'), () => { card(ctx, 520);
        plate(ctx, 500, 540, 165, prog(t, S('s03') + 0.3, 1.5));
        line(ctx, 'ÉVITER LE MILIEU FROID', 500, 770, t, S('s03') + 0.2, { size: 50, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s04'), S('s05'), () => { card(ctx, 520);
        text(ctx, '« JE CHAUFFE DE', 500, 430, { size: 62, weight: 900, color: WHITE });
        text(ctx, "L'INTÉRIEUR »", 500, 510, { size: 62, weight: 900, color: WHITE });
        stamp(ctx, 'FAUX', 500, 660, t, f('s04', 0.5), { size: 130 });
      });
      block(ctx, t, S('s05'), S('s06'), () => { card(ctx, 520);
        tag(ctx, 'FDA · DANS UN PLAT ÉPAIS', 500, 370, t, S('s05'), { size: 36 });
        coupe(ctx, 170, 430, 660, 260, 0.26, t);
        line(ctx, 'FROID', 500, 560, t, f('s05', 0.3), { size: 56, color: '#07213a', dx: 0 });
        line(ctx, 'COUCHES EXTÉRIEURES', 500, 755, t, f('s05', 0.5), { size: 46, color: HOT, dx: 0 });
      });
      block(ctx, t, S('s06'), S('s07'), () => { card(ctx, 520);
        tag(ctx, 'USDA : 1 À 1,5 POUCE', 500, 370, t, S('s06'), { size: 36 });
        for (let i = 0; i <= 4; i++) { const x = 200 + i * 150; ctx.fillStyle = WHITE; ctx.fillRect(x - 3, 450, 6, i % 2 ? 26 : 44); text(ctx, String(i), x, 515, { size: 40, family: F.mono, weight: 700, color: WHITE }); }
        ctx.fillStyle = WHITE; ctx.fillRect(200, 450, 600, 6); text(ctx, 'cm', 860, 515, { size: 36, family: F.mono, weight: 700, color: '#aeb8cc' });
        const k = ease.out(prog(t, f('s06', 0.2), 0.6)); roundRect(ctx, 200, 560, 572 * k, 80, 14); ctx.fillStyle = HOT; ctx.fill();
        big(ctx, '2,5 à 3,8 cm', 500, 730, t, f('s06', 0.5), { size: 80, color: GOLD });
      });
      block(ctx, t, S('s07'), S('s08'), () => { card(ctx, 520);
        const d = lerp(0.14, 0.44, ease.inOut(prog(t, S('s07') + 0.2, Math.max(0.8, E('s07') - S('s07') - 0.3))));
        coupe(ctx, 170, 400, 660, 300, d, t);
        line(ctx, 'DE PROCHE EN PROCHE', 500, 765, t, S('s07') + 0.2, { size: 50, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s08'), S('s09'), () => { card(ctx, 520);
        stamp(ctx, 'EXEMPLE', 200, 385, t, S('s08'), { size: 40, color: WHITE });
        line(ctx, 'LASAGNE · 8 cm', 620, 385, t, S('s08') + 0.1, { size: 50, dx: 0 });
        coupe(ctx, 330, 440, 340, 340, 0.47, t);
        line(ctx, '3,8', 240, 500, t, f('s08', 0.3), { size: 50, family: F.mono, weight: 700, color: HOT, dx: 0 }); line(ctx, '3,8', 240, 720, t, f('s08', 0.4), { size: 50, family: F.mono, weight: 700, color: HOT, dx: 0 });
        ctx.fillStyle = COLD; ctx.fillRect(330, 604, 340, 12);
        stamp(ctx, 'HORS DE PORTÉE DIRECTE', 500, 610, t, f('s08', 0.6), { size: 44 });
      });
      block(ctx, t, S('s09'), S('s10'), () => { card(ctx, 520);
        stamp(ctx, 'SURPRISE', 500, 372, t, S('s09'), { size: 44 });
        for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { const px = 200 + i * 120, py = 470 + j * 110, hot = (i + j) % 2 === 0, a = clamp((t - f('s09', 0.2) - (i + j) * 0.05) * 4);
          ctx.save(); ctx.globalAlpha *= a * (0.65 + 0.35 * Math.sin(t * 5 + i)); ctx.fillStyle = hot ? HOT : COLD; ctx.beginPath(); ctx.arc(px, py, 44, 0, 7); ctx.fill(); ctx.restore(); }
        tag(ctx, '≈ TOUS LES 6 cm (SCHÉMA)', 500, 800, t, f('s09', 0.5), { size: 36, color: COLD });
      });
      block(ctx, t, S('s10'), S('s11'), () => { card(ctx, 520);
        ctx.save(); ctx.translate(500, 560); ctx.rotate((t - S('s10')) * 2.2); plate(ctx, 0, 0, 150, 0.6);
        ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(0, -120, 14, 0, 7); ctx.fill(); ctx.restore();
        line(ctx, 'LE PLATEAU DÉPLACE LE PLAT', 500, 775, t, S('s10') + 0.2, { size: 44, color: GOLD, dx: 0 });
      });
      block(ctx, t, S('s11'), S('s12'), () => { card(ctx, 520);
        [['ÉTALE', 0.05], ['COUVRE', 0.3], ['MÉLANGE À MI-TEMPS', 0.55]].forEach(([s, u], i) => {
          pop(ctx, t, f('s11', u), 500, 420 + i * 140, () => { panel(ctx, -390, -56, 780, 112, { border: GREEN }); text(ctx, s, 0, 2, { size: 58, weight: 900, color: WHITE, maxWidth: 730 }); }); });
      });
      block(ctx, t, S('s12'), S('s13'), () => { card(ctx, 520);
        CHR.emo(ctx, 'hourglass_done', 500, 500, 240, t, S('s12'));
        big(ctx, 'REPOS ≥ 3 min', 500, 720, t, f('s12', 0.3), { size: 96, color: WHITE });
        tag(ctx, 'LA CUISSON CONTINUE', 500, 800, t, f('s12', 0.5), { color: HOT });
      });
      block(ctx, t, S('s13'), S('s14'), () => { card(ctx, 520);
        stamp(ctx, 'EXEMPLE', 500, 385, t, S('s13'), { size: 44, color: WHITE });
        line(ctx, '1 000 W consommés × 4 min', 500, 480, t, S('s13') + 0.15, { size: 44, family: F.mono, weight: 700, dx: 0 });
        line(ctx, '66,7 Wh × 27,7 ct / kWh', 500, 550, t, S('s13') + 0.4, { size: 44, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '1,85 ct', 500, 670, t, f('s13', 0.6), { size: 120 });
        tag(ctx, 'MÉDIANE ELCOM 2026, HORS TVA', 500, 790, t, f('s13', 0.7), { size: 36 });
      });
      block(ctx, t, S('s14'), S('s15'), () => comment(ctx, t, S('s14'), ['Tu mélanges', 'ou tu rajoutes', 'du temps ?'], { y: 560, color: HOT }));
      block(ctx, t, S('s15'), S('s16'), () => { duelCard(ctx, t);
        stamp(ctx, 'À MOITIÉ', 285, 730, t, S('s15') + 0.2, { size: 60, color: GOLD }); CHR.emo(ctx, 'cross_mark', 715, 730, 150, t, f('s15', 0.5));
      });
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'DEMAIN', next: ['Suisse contre France :', 'même machine à laver'] }));
      ctx.restore();
      brand(ctx, t);
      captions(ctx, t, { y: 1385, size: 64, maxWidth: 800, x: 515, fromZero: true });
    }
  };
})();
