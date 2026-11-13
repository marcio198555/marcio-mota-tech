// Vidéo 61 — format A : l'ampoule LED balance ce que coûte une nuit allumée. Chiffres : days/day61/facts.md.
// Décor IA existant (decor_chambre), ampoule dessinée dans la scène (formes simples) + CHR.face (yeux, bouche synchronisée).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, calc, bars, clock, coins, comment } = KIT;
  const WARM = '#ffd27a';
  const END = E('s15') + 0.6;
  const IDS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12','s13','s14'];
  const PUNCH = [[f('s01',0.5),0.05],[f('s03',0.5),0.06],[f('s06',0.7),0.05],[f('s09',0.3),0.07],[f('s11',0.4),0.07],[S('s14'),0.05]];
  const MOOD = { s01: 'malin', s02: 'malin', s03: 'malin', s04: 'content', s05: 'neutre', s06: 'neutre', s07: 'content', s08: 'malin',
                 s09: 'surpris', s10: 'fache', s11: 'fache', s12: 'neutre', s13: 'content', s14: 'malin' };
  function segAt(t) { let id = 's01'; IDS.forEach(s => { if (t >= S(s)) id = s; }); return id; }
  function card(ctx, h = 520, o = {}) { panel(ctx, 70, 310, 860, h, { bg: 'rgba(10,12,22,0.9)', border: o.border || 'rgba(255,210,122,0.6)' }); }

  // ampoule LED personnage ; (x, y) = bas du culot ; s = échelle ; glow 0..1
  function bulb(ctx, x, y, s, t, o = {}) {
    const gy = y - 330 * s, r = 150 * s, glow = o.glow ?? 1;
    ctx.save();
    if (glow > 0) { const g = ctx.createRadialGradient(x, gy, r * 0.3, x, gy, r * 3.2);
      g.addColorStop(0, `rgba(255,214,130,${0.55 * glow})`); g.addColorStop(1, 'rgba(255,214,130,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, gy, r * 3.2, 0, 7); ctx.fill(); }
    // culot E27
    for (let i = 0; i < 4; i++) { roundRect(ctx, x - 62 * s, y - (130 - i * 26) * s, 124 * s, 22 * s, 10 * s); ctx.fillStyle = i % 2 ? '#8d939e' : '#b9bfc9'; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(x - 40 * s, y - 26 * s); ctx.lineTo(x + 40 * s, y - 26 * s); ctx.lineTo(x + 18 * s, y); ctx.lineTo(x - 18 * s, y); ctx.closePath(); ctx.fillStyle = '#3a3f4a'; ctx.fill();
    // col
    ctx.beginPath(); ctx.moveTo(x - 66 * s, y - 132 * s); ctx.lineTo(x + 66 * s, y - 132 * s); ctx.lineTo(x + 92 * s, gy + r * 0.72); ctx.lineTo(x - 92 * s, gy + r * 0.72); ctx.closePath();
    ctx.fillStyle = '#f2f3f6'; ctx.fill();
    // globe opale
    const gg = ctx.createRadialGradient(x - r * 0.35, gy - r * 0.4, r * 0.1, x, gy, r * 1.05);
    gg.addColorStop(0, '#ffffff'); gg.addColorStop(1, glow > 0.3 ? '#ffe6b0' : '#cfd3db');
    ctx.beginPath(); ctx.arc(x, gy, r, 0, 7); ctx.fillStyle = gg; ctx.fill();
    ctx.lineWidth = 5 * s; ctx.strokeStyle = 'rgba(120,100,60,0.45)'; ctx.stroke();
    ctx.restore();
    if (o.face !== false) CHR.face(ctx, x, gy + 6 * s, s * 0.82, t, { mood: o.mood, look: o.look, talk: o.talk });
  }
  // ancienne ampoule à incandescence (filament)
  function oldBulb(ctx, x, y, s, t) {
    const gy = y - 300 * s, r = 140 * s;
    const g = ctx.createRadialGradient(x, gy, r * 0.2, x, gy, r * 2.6); g.addColorStop(0, 'rgba(255,170,60,0.6)'); g.addColorStop(1, 'rgba(255,170,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, gy, r * 2.6, 0, 7); ctx.fill();
    for (let i = 0; i < 4; i++) { roundRect(ctx, x - 55 * s, y - (120 - i * 24) * s, 110 * s, 20 * s, 9 * s); ctx.fillStyle = i % 2 ? '#a07a3a' : '#c9a25a'; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(x - 58 * s, y - 122 * s); ctx.lineTo(x + 58 * s, y - 122 * s); ctx.lineTo(x + 80 * s, gy + r * 0.75); ctx.lineTo(x - 80 * s, gy + r * 0.75); ctx.closePath(); ctx.fillStyle = 'rgba(255,240,210,0.35)'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, gy, r, 0, 7); ctx.fillStyle = 'rgba(255,240,210,0.25)'; ctx.fill(); ctx.lineWidth = 5 * s; ctx.strokeStyle = 'rgba(255,240,210,0.8)'; ctx.stroke();
    ctx.save(); ctx.strokeStyle = '#ffb347'; ctx.shadowColor = '#ffb347'; ctx.shadowBlur = 20; ctx.lineWidth = 6 * s; ctx.beginPath();
    ctx.moveTo(x - 30 * s, gy + 60 * s); ctx.lineTo(x - 30 * s, gy); for (let i = 0; i <= 6; i++) ctx.lineTo(x - 30 * s + i * 10 * s, gy + (i % 2 ? -14 : 0) * s); ctx.lineTo(x + 30 * s, gy + 60 * s); ctx.stroke(); ctx.restore();
  }
  function moon(ctx, x, y, r) {
    ctx.save(); ctx.fillStyle = '#f2e6b8'; ctx.shadowColor = 'rgba(242,230,184,0.6)'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = '#0a0c16'; ctx.beginPath(); ctx.arc(x + r * 0.45, y - r * 0.25, r * 0.85, 0, 7); ctx.fill(); ctx.restore();
  }
  function bulbAt(t) {
    let y = 1290, sq = 0; const x = 500 + 26 * Math.sin(t * 0.7);
    IDS.forEach(id => { const d = t - S(id); if (d >= 0 && d < 0.34) y -= 18 * Math.sin(Math.PI * d / 0.34); });
    return [x, y];
  }
  function duelCard(ctx, t, o = {}) {
    card(ctx, 520);
    ctx.save(); ctx.setLineDash([14, 14]); ctx.strokeStyle = 'rgba(255,210,122,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 330); ctx.lineTo(500, 810); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 285, 362, { color: WHITE, size: 36 }); chip(ctx, 'TON COLLÈGUE', 715, 362, { color: WHITE, size: 36 });
    // toi : lampe allumée + lune
    bulb(ctx, 285, 640, 0.5, t, { face: false, glow: 0.9 + 0.1 * Math.sin(t * 4) });
    moon(ctx, 410, 445, 30);
    // collègue : chambre noire
    roundRect(ctx, 545, 400, 340, 260, 20); ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fill();
    CHR.emo(ctx, 'man_technologist', 715, 530, 170, t, undefined, { phase: 1.4, alpha: 0.45 });
    if (o.left) o.left(); else text(ctx, 'ALLUMÉE', 285, 700, { size: 46, weight: 900, color: WARM });
    if (o.right) o.right(); else text(ctx, 'TOUT ÉTEINT', 715, 700, { size: 46, weight: 900, color: WHITE });
  }

  window.SCENE = {
    duration: END,
    load: () => Promise.all([CHR.loadArt(['decor_chambre']), CHR.load(['man_technologist', 'collision', 'person_facepalming', 'hourglass_done', 'package', 'magnifying_glass_tilted_left', 'cross_mark'])]),
    draw(ctx, t) {
      const night = t >= S('s15') ? 0.75 : 0.5;
      CHR.backdrop(ctx, t, 'decor_chambre', { blur: 2.5, z0: 1.1, z1: 1.18, focus: [0.5, 0.7], dur: END, dim: night });
      CHR.camera(ctx, t, PUNCH, { cy: 900 });
      if (t < S('s15')) { const [x, y] = bulbAt(t); const id = segAt(t); bulb(ctx, x, y, 0.8, t, { mood: MOOD[id], look: t > S('s03') ? [0, -0.8] : [0, 0], glow: 0.85 + 0.15 * Math.sin(t * 3) }); }
      // 0 – s03 : duel + question, complet à l'image 0
      block(ctx, t, 0, S('s03'), () => { duelCard(ctx, t);
        big(ctx, '? CHF', 500, 772, t, undefined, { size: 76, color: GOLD });
        line(ctx, t < S('s02') ? 'TOUTE LA NUIT' : 'COMBIEN ÇA COÛTE ?', 500, 872, t, t < S('s02') ? undefined : S('s02'), { size: 60, weight: 900, color: WHITE, dx: 0, stroke: 'rgba(0,0,0,0.7)' });
      });
      // s03 : promesse
      block(ctx, t, S('s03'), S('s04'), () => { card(ctx, 520);
        oldBulb(ctx, 290, 800, 0.8, t); bulb(ctx, 710, 800, 0.8, t, { face: false });
        big(ctx, '× 12 ?', 500, 385, t, S('s03') + 0.15, { size: 96, color: RED });
      });
      // s04 : fiche
      block(ctx, t, S('s04'), S('s05'), () => { card(ctx, 520);
        stamp(ctx, 'EXEMPLE', 230, 385, t, S('s04'), { size: 40, color: WHITE });
        line(ctx, "FICHE D'UNE LED", 640, 385, t, S('s04') + 0.1, { size: 44, dx: 0 });
        big(ctx, '806 lm', 500, 540, t, f('s04', 0.35), { size: 150, color: WARM });
        big(ctx, '5 W', 500, 720, t, f('s04', 0.6), { size: 130, color: GOLD });
      });
      // s05 : une nuit d'exemple
      block(ctx, t, S('s05'), S('s06'), () => { card(ctx, 520);
        clock(ctx, 250, 560, 160, (t - S('s05')) * 10);
        stamp(ctx, 'EXEMPLE', 660, 400, t, S('s05'), { size: 40, color: WHITE });
        line(ctx, '8 h × 5 W', 660, 530, t, S('s05') + 0.15, { size: 64, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '40 Wh', 660, 690, t, f('s05', 0.55), { size: 120 });
      });
      // s06 : en francs
      block(ctx, t, S('s06'), S('s07'), () => { card(ctx, 520);
        calc(ctx, ['0,04 kWh × 27,7 ct', '≈ 1,1 ct'], 500, 420, t, [S('s06'), f('s06', 0.5)], { gap: 140, lastSize: 160 });
        tag(ctx, 'PAR NUIT · ELCOM 2026, HORS TVA', 500, 770, t, f('s06', 0.6), { size: 36 });
      });
      // s07 : un an
      block(ctx, t, S('s07'), S('s08'), () => { card(ctx, 520);
        const n = Math.round(lerp(1, 365, ease.inOut(prog(t, S('s07') + 0.05, Math.max(0.6, (E('s07') - S('s07')) * 0.55)))));
        big(ctx, String(n), 230, 470, t, undefined, { size: 110, color: WHITE }); line(ctx, 'NUITS', 230, 570, t, S('s07'), { size: 50, dx: 0 });
        big(ctx, '≈ 4,04 CHF', 640, 480, t, f('s07', 0.55), { size: 72 }); line(ctx, 'PAR AN', 640, 570, t, f('s07', 0.6), { size: 46, dx: 0 });
        coins(ctx, t, f('s07', 0.6), 5, 220, 780, 780, '');
      });
      // s08 : le collègue se cogne
      block(ctx, t, S('s08'), S('s09'), () => { card(ctx, 520);
        CHR.emo(ctx, 'person_facepalming', 330, 560, 280, t, S('s08'));
        CHR.emo(ctx, 'collision', 470, 450, 170, t, f('s08', 0.35));
        big(ctx, '4 CHF', 720, 520, t, f('s08', 0.5), { size: 100 }); line(ctx, 'PAR AN', 720, 620, t, f('s08', 0.55), { size: 46, dx: 0 });
        tag(ctx, 'ÉCONOMISÉS DANS LE NOIR', 500, 770, t, f('s08', 0.6), { size: 36 });
      });
      // s09 : surprise, durée de vie annoncée
      block(ctx, t, S('s09'), S('s10'), () => { card(ctx, 520);
        stamp(ctx, 'SURPRISE', 500, 380, t, S('s09'), { size: 48 });
        big(ctx, '25 000 h', 500, 520, t, f('s09', 0.15), { size: 120, color: WARM });
        line(ctx, '÷ (8 h × 365)', 500, 640, t, f('s09', 0.45), { size: 54, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '≈ 8,5 ANS', 500, 750, t, f('s09', 0.65), { size: 96 });
      });
      // s10 : l'ancêtre 60 W
      block(ctx, t, S('s10'), S('s11'), () => { card(ctx, 520);
        pop(ctx, t, S('s10'), 280, 800, () => oldBulb(ctx, 0, 0, 0.8, t));
        big(ctx, '60 W', 280, 375, t, S('s10') + 0.15, { size: 90, color: RED });
        line(ctx, 'MÊME LUMIÈRE', 670, 470, t, f('s10', 0.3), { size: 54, dx: 0 });
        big(ctx, '806 lm', 670, 570, t, f('s10', 0.4), { size: 90, color: WARM });
        tag(ctx, 'RÈGL. (CE) 244/2009', 670, 700, t, f('s10', 0.6), { size: 36 });
      });
      // s11 : × 12
      block(ctx, t, S('s11'), S('s12'), () => { card(ctx, 520);
        bars(ctx, [{ label: 'LED 5 W · 14,6 kWh', v: 4.04 / 48.53, value: '4,04 CHF', color: GOLD, t0: S('s11') }, { label: 'Ancienne 60 W · 175,2 kWh', v: 1, value: '48,53 CHF', color: RED, t0: S('s11') + 0.35 }], 120, 370, 760, t, { rh: 180 });
        stamp(ctx, '× 12', 500, 755, t, f('s11', 0.45), { size: 90, color: RED });
      });
      // s12 : conseil, lumens sur la boîte
      block(ctx, t, S('s12'), S('s13'), () => { card(ctx, 520);
        tag(ctx, "À L'ACHAT", 500, 365, t, S('s12'), { size: 38, color: GOLD });
        pop(ctx, t, S('s12') + 0.1, 500, 590, () => { roundRect(ctx, -300, -190, 600, 380, 24); ctx.fillStyle = '#f3efe6'; ctx.fill();
          text(ctx, '806 lm', 0, -40, { size: 140, weight: 900, color: '#1a1a22' }); text(ctx, '5 W', 0, 100, { size: 56, weight: 800, color: '#55586a' }); });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 790, 470, 170, t, f('s12', 0.4));
        stamp(ctx, 'LES LUMENS', 690, 760, t, f('s12', 0.55), { size: 44, color: GREEN });
      });
      // s13 : commentaire
      block(ctx, t, S('s13'), S('s14'), () => comment(ctx, t, S('s13'), ['Une lumière', 'allumée la nuit,', 'toi ?'], { y: 560, size: 62, color: WARM }));
      // s14 : retour au duel, verdict
      block(ctx, t, S('s14'), S('s15'), () => { duelCard(ctx, t, {
        left: () => big(ctx, '≈ 4 CHF / an', 285, 730, t, S('s14') + 0.1, { size: 54 }),
        right: () => { big(ctx, '0 CHF', 715, 730, t, f('s14', 0.4), { size: 60, color: GREEN }); CHR.emo(ctx, 'collision', 830, 470, 120, t, f('s14', 0.6)); } });
        line(ctx, 'VERDICT', 500, 872, t, undefined, { size: 60, weight: 900, color: GOLD, dx: 0, stroke: 'rgba(0,0,0,0.7)' });
      });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['Téléphone 200 Mpx :', 'photos de 12 Mpx ?'] }));
      ctx.restore();
      brand(ctx, t);
      captions(ctx, t, { y: 1385, size: 64, maxWidth: 800, x: 515, fromZero: true });
    }
  };
})();
