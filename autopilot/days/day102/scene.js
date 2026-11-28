// Vidéo 102 — Chargeur « 65 W » à 3 ports : ce qui reste quand on branche plusieurs appareils (Anker 735, fiche officielle) (Reel d'essai Instagram). Faits : days/day102/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, segById, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, bars, comment, head, duelFrame } = KIT;
  const has = id => !!segById(id);
  const LAST = ['s15', 's14', 's13'].find(has);
  const END = E(LAST) + 0.6;
  let ctx0 = null;
  // chargeur schématique à 3 ports (C1, C2, A) ; w = watts affichés par port (null = vide)
  function charger(ctx, x, y, s, w = {}, t = 0, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -120, -170, 240, 340, 36); ctx.fillStyle = '#e9edf3'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#9aa6bb'; ctx.stroke();
    text(ctx, o.title || '65 W', 0, -120, { size: 40, weight: 900, color: '#1b2433' });
    const ports = [['C1', -40, true], ['C2', 40, true], ['A', 120, false]];
    ports.forEach(([id, py, isC]) => {
      const on = w[id] !== undefined && w[id] !== null;
      if (isC) { roundRect(ctx, -48, py - 14, 96, 28, 14); } else { roundRect(ctx, -56, py - 16, 112, 32, 4); }
      ctx.fillStyle = on ? '#1b2433' : '#3b4558'; ctx.fill();
      text(ctx, id === 'A' ? 'USB-A' : 'USB-' + id, -175, py, { size: 34, weight: 800, color: '#c9d2e3', align: 'right' });
      if (on) {
        const pulse = 0.6 + 0.4 * Math.sin(t * 6 + py);
        ctx.save(); ctx.globalAlpha *= pulse; ctx.strokeStyle = w[id] >= 45 ? GREEN : (w[id] >= 20 ? GOLD : RED); ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(60, py); ctx.lineTo(150, py); ctx.stroke(); ctx.restore();
        text(ctx, w[id] + ' W', 165, py, { size: 46, family: F.mono, weight: 700, color: w[id] >= 45 ? GREEN : (w[id] >= 20 ? GOLD : RED), align: 'left' });
      }
    });
    ctx.restore();
  }
  function laptop(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -110, -80, 220, 140, 12); ctx.fillStyle = '#1d3b66'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#c9d2e3'; ctx.stroke();
    roundRect(ctx, -140, 60, 280, 22, 8); ctx.fillStyle = '#c9d2e3'; ctx.fill(); ctx.restore();
  }
  function phoneIcon(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -40, -75, 80, 150, 16); ctx.fillStyle = '#11161f'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#c9d2e3'; ctx.stroke();
    roundRect(ctx, -32, -64, 64, 128, 10); ctx.fillStyle = '#1d3b66'; ctx.fill(); ctx.restore();
  }
  function igEnd(ctx, t, t0) {
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
  const PLAN = [
    ['s01', t => {
      const b = 1 + 0.07 * Math.sin(t * 5);
      ctx0.save(); ctx0.translate(500, 420); ctx0.scale(b, b); text(ctx0, 'CHARGEUR 65 W', 0, 0, { size: 96, family: F.display, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)' }); ctx0.restore();
      duelFrame(ctx0, { y0: 540, y1: 1180 });
      laptop(ctx0, 275, 720, 0.9); laptop(ctx0, 725, 700, 0.8); phoneIcon(ctx0, 860, 760, 0.6);
      text(ctx0, '1 appareil', 275, 900, { size: 44, weight: 900, color: WHITE }); text(ctx0, '+ son téléphone', 725, 900, { size: 44, weight: 900, color: WHITE });
      text(ctx0, '65 W', 275, 1010, { size: 84, family: F.display, weight: 900, color: GREEN });
      const q = 1 + 0.1 * Math.sin(t * 7);
      ctx0.save(); ctx0.translate(725, 1010); ctx0.scale(q, q); text(ctx0, '? W', 0, 0, { size: 84, family: F.display, weight: 900, color: RED }); ctx0.restore();
      head(ctx0, 'COMBIEN POUR SON ORDI ?', 1205, t, undefined, { size: 50 });
    }],
    ['s03', t => {
      tag(ctx0, 'À LA FIN', 500, 430, t, S('s03'), { size: 46, color: GOLD });
      charger(ctx0, 470, 760, 1.25, {}, t);
      big(ctx0, 'LE MAUVAIS DUO DE PORTS', 500, 1100, t, f('s03', 0.35), { size: 62, family: F.display, color: GOLD });
    }],
    ['s04', t => {
      tag(ctx0, 'FICHE OFFICIELLE ANKER', 500, 420, t, S('s04'), { size: 40, color: GOLD });
      charger(ctx0, 470, 760, 1.25, {}, t, { title: 'NANO II' });
      line(ctx0, 'Anker 735 (Nano II) · 3 ports', 500, 1080, t, f('s04', 0.35), { size: 50, weight: 900, dx: 0 });
    }],
    ['s05', t => {
      tag(ctx0, '1 SEUL APPAREIL', 500, 420, t, S('s05'), { size: 44, color: GREEN });
      charger(ctx0, 480, 760, 1.25, { C1: 65 }, t);
      laptop(ctx0, 500, 1090, 0.8);
    }],
    ['s06', t => {
      tag(ctx0, 'CAPACITÉ TOTALE', 500, 420, t, S('s06'), { size: 44, color: GOLD });
      big(ctx0, '65 W', 500, 680, t, f('s06', 0.1), { size: 190, family: F.display, color: GOLD });
      stamp(ctx0, 'À PARTAGER', 500, 950, t, f('s06', 0.5), { size: 72, color: RED });
    }],
    ['s07', t => {
      tag(ctx0, 'USB-C 1 + USB-C 2', 500, 420, t, S('s07'), { size: 44, color: GOLD });
      const on = t > f('s08', 0.1) || !has('s08');
      charger(ctx0, 480, 760, 1.25, on ? { C1: 45, C2: 20 } : { C1: '?', C2: '?' }, t);
      laptop(ctx0, 330, 1100, 0.6); phoneIcon(ctx0, 640, 1090, 0.55);
    }],
    ['s09', t => {
      tag(ctx0, 'SUR LE PAPIER', 500, 420, t, S('s09'), { size: 44, color: GOLD });
      line(ctx0, '65 W → 45 W max', 500, 620, t, f('s09', 0.05), { size: 74, family: F.mono, weight: 700, dx: 0 });
      big(ctx0, '−20 W', 500, 860, t, f('s09', 0.35), { size: 190, family: F.display, color: RED });
    }],
    ['s10', t => {
      tag(ctx0, '3 APPAREILS', 500, 420, t, S('s10'), { size: 44, color: GOLD });
      const on = has('s11') && t > f('s11', 0.05);
      charger(ctx0, 480, 760, 1.25, on ? { C1: 40, C2: 12, A: 12 } : { C1: '?', C2: '?', A: '?' }, t);
      CHR.emo(ctx0, 'headphone', 760, 1080, 120, t, f('s10', 0.3));
    }],
    ['s12', t => {
      duelFrame(ctx0, { y0: 520, y1: 1180 });
      laptop(ctx0, 275, 760, 0.9); laptop(ctx0, 725, 760, 0.9);
      text(ctx0, '65 W', 275, 960, { size: 96, family: F.display, weight: 900, color: GREEN });
      text(ctx0, '45 W max', 725, 960, { size: 76, family: F.display, weight: 900, color: GOLD });
      stamp(ctx0, 'PLUS LENT POSSIBLE', 725, 1110, t, f('s12', 0.55), { size: 40, color: RED });
    }],
    ['s13', t => { comment(ctx0, t, S('s13'), ['Combien d\'appareils', 'sur ton chargeur ?'], { color: GOLD, size: 64 }); }],
    ['s14', t => {
      tag(ctx0, 'LE PIÈGE', 500, 410, t, S('s14'), { size: 46, color: RED });
      const on = t > f('s14', 0.35);
      charger(ctx0, 480, 720, 1.2, on ? { C2: 12, A: 12 } : {}, t);
      big(ctx0, '24 W', 500, 1040, t, f('s14', 0.6), { size: 150, family: F.display, color: RED });
      line(ctx0, 'sur 65 W', 500, 1165, t, f('s14', 0.68), { size: 52, weight: 900, dx: 0 });
    }],
    ['s15', t => igEnd(ctx0, t, S('s15'))]
  ].filter(p => has(p[0]));
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['headphone']),
    draw(ctx, t) {
      ctx0 = ctx;
      background(ctx, t);
      PLAN.forEach((p, i) => {
        const a = i === 0 ? 0 : S(p[0]);
        const b = i + 1 < PLAN.length ? S(PLAN[i + 1][0]) : END + 1;
        block(ctx, t, a, b, () => p[1](t));
      });
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
