// Vidéo 28 — format A : la casserole balance ce que son couvercle fait gagner. Chiffres : days/day28/facts.md.
// Personnage : casserole dessinée dans le moteur (formes simples + CHR.face), décor IA decor_cuisine (bibliothèque).
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, coin, comment, clock, toggle } = KIT;
  const HOT = '#ff6a3d', STEAM = 'rgba(235,240,250,', COOL = '#58b7ff';
  const END = E('s14') + 0.6;
  const IDS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12','s13'];
  const PUNCH = [[f('s01', 0.6), 0.05], [f('s04', 0.6), 0.08], [f('s06', 0.7), 0.05], [f('s07', 0.35), 0.07], [f('s09', 0.5), 0.06], [S('s13'), 0.05]];
  const NB = ' ';

  function card(ctx, h = 520, o = {}) { panel(ctx, 70, 310, 860, h, { bg: 'rgba(14,14,20,0.9)', border: o.border || 'rgba(255,106,61,0.6)' }); }

  // vapeur : volutes qui montent depuis (x, y) ; amount 0..1
  function steam(ctx, x, y, w, t, amount, o = {}) {
    if (amount <= 0.01) return;
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const ph = (t * 0.7 + i * 0.27) % 1, xx = x + (i - 1.5) * w * 0.24;
      const a = Math.sin(ph * Math.PI) * 0.7 * amount;
      ctx.strokeStyle = STEAM + a.toFixed(3) + ')'; ctx.lineWidth = (o.lw || 16) * (1 - ph * 0.4);
      ctx.beginPath();
      for (let k = 0; k <= 12; k++) {
        const u = k / 12, yy = y - u * (o.h || 220) - ph * 40;
        const dx = Math.sin(u * 5 + t * 2 + i) * w * 0.05;
        if (k === 0) ctx.moveTo(xx + dx, yy); else ctx.lineTo(xx + dx, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  // plaque de cuisson (vue de 3/4) : heat 0..1 = rougeoiement
  function hob(ctx, x, y, w, heat) {
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x, y, w * 0.62, w * 0.13, 0, 0, Math.PI * 2); ctx.fillStyle = '#15171d'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = '#3a3f4b'; ctx.stroke();
    if (heat > 0.01) {
      const g = ctx.createRadialGradient(x, y, 4, x, y, w * 0.6);
      g.addColorStop(0, `rgba(255,80,40,${0.85 * heat})`); g.addColorStop(1, 'rgba(255,60,30,0)');
      ctx.beginPath(); ctx.ellipse(x, y, w * 0.6, w * 0.12, 0, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    }
    ctx.restore();
  }
  // casserole : (x, y) = milieu de la base ; s = échelle (1 = 300 px de large) ; o.lid = 1 posé, 0 enlevé ;
  // o.face = options de CHR.face (sinon pas de visage) ; o.bulge = fond bombé (schéma s11)
  function pot(ctx, x, y, s, t, o = {}) {
    const w = 300 * s, h = 180 * s, lid = o.lid ?? 1;
    ctx.save(); ctx.translate(x, y + (o.sq || 0) * 20);
    // poignées
    ctx.fillStyle = '#2b2f38';
    roundRect(ctx, -w / 2 - 54 * s, -h + 34 * s, 64 * s, 26 * s, 12 * s); ctx.fill();
    roundRect(ctx, w / 2 - 10 * s, -h + 34 * s, 64 * s, 26 * s, 12 * s); ctx.fill();
    // corps
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    g.addColorStop(0, '#8d97a8'); g.addColorStop(0.35, '#e9eef5'); g.addColorStop(0.6, '#c3cbd8'); g.addColorStop(1, '#6f7889');
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h);
    ctx.lineTo(-w / 2, -18 * s);
    if (o.bulge) ctx.quadraticCurveTo(0, 26 * s, w / 2, -18 * s); else ctx.quadraticCurveTo(-w / 2, 0, -w / 2 + 18 * s, 0), ctx.lineTo(w / 2 - 18 * s, 0), ctx.quadraticCurveTo(w / 2, 0, w / 2, -18 * s);
    ctx.lineTo(w / 2, -h); ctx.closePath();
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 4 * s; ctx.strokeStyle = '#4a5262'; ctx.stroke();
    // bord
    ctx.beginPath(); ctx.ellipse(0, -h, w / 2 + 6 * s, 20 * s, 0, 0, Math.PI * 2); ctx.fillStyle = '#d9dee8'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -h, w / 2 - 8 * s, 13 * s, 0, 0, Math.PI * 2); ctx.fillStyle = '#2a3140'; ctx.fill();
    // reflet
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; roundRect(ctx, -w * 0.36, -h * 0.85, w * 0.06, h * 0.62, 6 * s); ctx.fill();
    // vapeur (sans couvercle)
    if (o.steam !== false) steam(ctx, 0, -h - 10 * s, w, t, clamp(1 - lid) * (o.steamAmt ?? 1), { h: 200 * s, lw: 14 * s });
    // couvercle (descend de 160 px quand lid passe de 0 à 1)
    if (lid > 0.01) {
      ctx.save(); ctx.globalAlpha *= clamp(lid * 3); ctx.translate(0, -h - (1 - lid) * 160 * s); ctx.rotate((1 - lid) * -0.25);
      ctx.beginPath(); ctx.ellipse(0, 0, w / 2 + 10 * s, 22 * s, 0, 0, Math.PI * 2); ctx.fillStyle = '#9aa4b5'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, -6 * s, w / 2 + 2 * s, 52 * s, 0, Math.PI, 0); ctx.closePath();
      const lg = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); lg.addColorStop(0, '#a9b3c2'); lg.addColorStop(0.4, '#f2f5fa'); lg.addColorStop(1, '#8792a4');
      ctx.fillStyle = lg; ctx.fill(); ctx.lineWidth = 4 * s; ctx.strokeStyle = '#4a5262'; ctx.stroke();
      roundRect(ctx, -26 * s, -78 * s, 52 * s, 26 * s, 10 * s); ctx.fillStyle = '#2b2f38'; ctx.fill();
      ctx.restore();
    }
    if (o.face) CHR.face(ctx, 0, -h * 0.5, 0.95 * s, t, { lid: '#c9d0dc', ...o.face });
    ctx.restore();
  }
  // le personnage : rebond à chaque phrase, petit écrasement sur les mots forts
  function potAt(t) {
    let y = 1205, sq = 0; const x = 500 + 18 * Math.sin(t * 0.7);
    IDS.forEach(id => { const d = t - S(id); if (d >= 0 && d < 0.34) { y -= 18 * Math.sin(Math.PI * d / 0.34); } });
    PUNCH.forEach(([tp]) => { const d = t - tp; if (d >= 0 && d < 0.5) sq += 0.4 * Math.sin(d * 18) * Math.exp(-d * 6); });
    return [x, y, sq];
  }
  // humeur et couvercle du personnage selon le moment
  function moodAt(t) {
    if (t < S('s02')) return { mood: 'malin', look: [-0.4, -0.6] };
    if (t < S('s04')) return { mood: 'neutre', look: [0, -0.8] };
    if (t < S('s06')) return { mood: 'content', look: [0, -0.7] };
    if (t < S('s08')) return { mood: 'surpris', look: [0, -0.8] };
    if (t < S('s10')) return { mood: 'malin', look: [0.2, -0.8] };
    if (t < S('s12')) return { mood: 'neutre', look: [0, -0.7] };
    return { mood: 'content', look: [0, -0.6] };
  }
  function lidAt(t) {
    // sans couvercle jusqu'à s04 ; le couvercle tombe à 30 % de s04 ; reste posé ensuite
    return ease.out(prog(t, f('s04', 0.25), 0.4));
  }
  function wattmeter(ctx, x, y, r, frac, label) {
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); ctx.lineTo(r, 16); ctx.lineTo(-r, 16); ctx.closePath(); ctx.fillStyle = '#0a1322'; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = GOLD; ctx.stroke();
    for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; ctx.save(); ctx.rotate(a); ctx.fillStyle = C.fg; ctx.fillRect(r - 26, -3, 18, 6); ctx.restore(); }
    const a = Math.PI + Math.PI * clamp(frac);
    ctx.strokeStyle = frac > 0.5 ? HOT : GREEN; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (r - 34), Math.sin(a) * (r - 34)); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fillStyle = WHITE; ctx.fill();
    text(ctx, label, 0, 70, { size: 72, family: F.mono, weight: 700, color: WHITE });
    ctx.restore();
  }
  function duelCard(ctx, t, o = {}) {
    card(ctx, 520);
    ctx.save(); ctx.setLineDash([14, 14]); ctx.strokeStyle = 'rgba(230,198,106,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 330); ctx.lineTo(500, 810); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 285, 362, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 715, 362, { color: WHITE, size: 36 });
    hob(ctx, 285, 700, 210, 0.9); hob(ctx, 715, 700, 210, 0.9);
    pot(ctx, 285, 700, 0.62, t, { lid: 0 }); pot(ctx, 715, 700, 0.62, t, { lid: 1 });
    text(ctx, 'SANS COUVERCLE', 285, 770, { size: 40, weight: 900, color: WHITE, maxWidth: 390 });
    text(ctx, 'AVEC COUVERCLE', 715, 770, { size: 40, weight: 900, color: WHITE, maxWidth: 390 });
  }

  window.SCENE = {
    duration: END,
    load: () => Promise.all([CHR.loadArt(['decor_cuisine']), CHR.load(['stopwatch', 'high_voltage', 'check_mark_button', 'cross_mark', 'warning'])]),
    draw(ctx, t) {
      CHR.backdrop(ctx, t, 'decor_cuisine', { blur: 2.5, z0: 1.12, z1: 1.2, focus: [0.62, 0.62], dur: END, dim: t >= S('s14') ? 0.72 : 0.42 });
      CHR.camera(ctx, t, PUNCH, { cy: 900 });
      // personnage au premier plan (sauf carte de fin)
      if (t < S('s14')) {
        const [x, y, sq] = potAt(t);
        const heat = t >= f('s10', 0.4) && t < S('s11') ? lerp(0.9, 0.15, prog(t, f('s10', 0.4), 1.2)) : 0.9;
        hob(ctx, x, y, 330, heat);
        pot(ctx, x, y, 1.05, t, { lid: lidAt(t), face: moodAt(t), sq, bulge: t >= S('s11') && t < S('s12') });
      }

      block(ctx, t, 0, S('s02'), () => { duelCard(ctx, t);
        line(ctx, 'QUI PAIE MOINS ?', 500, 885, t, undefined, { size: 72, weight: 900, color: GOLD, dx: 0, stroke: 'rgba(0,0,0,0.75)' });
      });
      block(ctx, t, S('s02'), S('s03'), () => { card(ctx, 520);
        text(ctx, 'À LA FIN', 500, 400, { size: 64, weight: 900, color: WHITE });
        const sp = Math.cos((t - S('s02')) * 3.2);
        ctx.save(); ctx.translate(500, 580); ctx.scale(Math.max(0.05, Math.abs(sp)), 1); coin(ctx, 0, 0, 120, 'CHF'); ctx.restore();
        tag(ctx, 'LE COUVERCLE EN FRANCS', 500, 760, t, f('s02', 0.4), { color: GOLD });
      });
      block(ctx, t, S('s03'), S('s04'), () => { card(ctx, 520);
        text(ctx, 'SANS COUVERCLE', 500, 400, { size: 70, weight: 900, color: WHITE });
        steam(ctx, 500, 760, 560, t, 1, { h: 280, lw: 26 });
        for (let i = 0; i < 3; i++) {
          const ph = ((t - S('s03')) * 0.8 + i / 3) % 1, x = 300 + i * 200, y = lerp(740, 480, ph);
          ctx.save(); ctx.globalAlpha *= Math.sin(ph * Math.PI); text(ctx, '⚡', x, y, { size: 70, family: F.emoji, weight: 400 }); ctx.restore();
        }
        tag(ctx, 'L\'ÉNERGIE PART AVEC LA VAPEUR', 500, 790, t, f('s03', 0.4), { color: HOT });
      });
      block(ctx, t, S('s04'), S('s05'), () => { card(ctx, 520);
        tag(ctx, 'SUISSEENERGIE · OFEN', 500, 370, t, S('s04'), { color: GOLD });
        const k = ease.inOut(prog(t, f('s04', 0.45), 0.6));
        // jauge 100 → 70
        roundRect(ctx, 150, 450, 700, 90, 22); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
        roundRect(ctx, 150, 450, 700 * lerp(1, 0.7, k), 90, 22); ctx.fillStyle = k > 0.5 ? GREEN : HOT; ctx.fill();
        text(ctx, 'ÉNERGIE', 210, 497, { size: 40, weight: 900, color: '#071018', align: 'left' });
        big(ctx, `−${NB}30${NB}%`, 500, 660, t, f('s04', 0.55), { size: 150, color: GREEN });
        tag(ctx, 'AVEC LE COUVERCLE', 500, 780, t, f('s04', 0.6), { color: WHITE });
      });
      block(ctx, t, S('s05'), S('s06'), () => { duelCard(ctx, t);
        stamp(ctx, 'PAIE MOINS', 715, 560, t, S('s05') + 0.1, { size: 54, color: GREEN });
      });
      block(ctx, t, S('s06'), S('s07'), () => { card(ctx, 520);
        tag(ctx, 'POUR GARDER 1,5 l EN ÉBULLITION', 500, 370, t, S('s06'), { color: WHITE });
        const k = ease.out(prog(t, f('s06', 0.45), 0.7));
        wattmeter(ctx, 500, 630, 200, lerp(0, 0.75, k), k > 0.6 ? `750${NB}W` : '');
        tag(ctx, 'SANS COUVERCLE', 500, 790, t, f('s06', 0.3), { color: HOT });
      });
      block(ctx, t, S('s07'), S('s08'), () => { card(ctx, 520, { border: 'rgba(88,214,141,0.6)' });
        tag(ctx, 'AVEC COUVERCLE', 500, 370, t, S('s07'), { color: GREEN });
        const k = ease.inOut(prog(t, S('s07') + 0.05, 0.6));
        wattmeter(ctx, 330, 600, 150, lerp(0.75, 0.19, k), k > 0.6 ? `<${NB}200${NB}W` : '');
        big(ctx, `≈${NB}4×`, 730, 560, t, f('s07', 0.35), { size: 130, color: GREEN });
        text(ctx, 'MOINS', 730, 660, { size: 54, weight: 900, color: WHITE, alpha: clamp((t - f('s07', 0.4)) * 4) });
        tag(ctx, 'SERVICES CANTONAUX DE L\'ÉNERGIE', 500, 790, t, f('s07', 0.55), { color: GOLD });
      });
      block(ctx, t, S('s08'), S('s09'), () => { card(ctx, 520);
        stamp(ctx, 'EXEMPLE', 210, 385, t, S('s08'), { size: 44, color: WHITE });
        CHR.emo(ctx, 'stopwatch', 520, 390, 110, t, S('s08') + 0.1);
        line(ctx, '20 min', 720, 390, t, S('s08') + 0.15, { size: 60, family: F.mono, weight: 700, dx: 0 });
        line(ctx, '0,75 kW × 1/3 h × 27,7 ct', 500, 490, t, f('s08', 0.3), { size: 44, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '6,9 ct', 280, 610, t, f('s08', 0.45), { size: 84, color: HOT, maxWidth: 380 });
        big(ctx, `<${NB}1,9 ct`, 720, 610, t, f('s08', 0.75), { size: 84, color: GREEN, maxWidth: 380 });
        text(ctx, 'sans couvercle', 280, 700, { size: 38, weight: 800, color: C.fg, alpha: clamp((t - f('s08', 0.5)) * 4) });
        text(ctx, 'avec couvercle', 720, 700, { size: 38, weight: 800, color: C.fg, alpha: clamp((t - f('s08', 0.8)) * 4) });
        tag(ctx, 'MÉDIANE ELCOM 2026, HORS TVA', 500, 785, t, f('s08', 0.5), { size: 36 });
      });
      block(ctx, t, S('s09'), S('s10'), () => { card(ctx, 520);
        stamp(ctx, 'EXEMPLE', 210, 385, t, S('s09'), { size: 44, color: WHITE });
        line(ctx, 'CHAQUE JOUR · 365 FOIS', 640, 385, t, S('s09') + 0.1, { size: 40, dx: 0, maxWidth: 480 });
        for (let i = 0; i < 28; i++) {
          const on = t >= S('s09') + 0.15 + i * 0.03;
          roundRect(ctx, 150 + (i % 14) * 50, 445 + Math.floor(i / 14) * 50, 40, 40, 8); ctx.fillStyle = on ? GREEN : 'rgba(255,255,255,0.1)'; ctx.fill();
        }
        big(ctx, `>${NB}18 CHF`, 500, 650, t, f('s09', 0.45), { size: 130, color: GOLD });
        tag(ctx, 'PAR AN · 5,08 ct × 365', 500, 780, t, f('s09', 0.55), { size: 36 });
      });
      block(ctx, t, S('s10'), S('s11'), () => { card(ctx, 520, { border: 'rgba(88,214,141,0.6)' });
        stamp(ctx, 'CONSEIL', 500, 380, t, S('s10'), { size: 56, color: GREEN });
        toggle(ctx, 300, 540, 1 - ease.inOut(prog(t, f('s10', 0.35), 0.4)), { w: 200, color: HOT });
        line(ctx, 'QUELQUES MINUTES', 650, 515, t, f('s10', 0.3), { size: 44, dx: 0, maxWidth: 420 });
        line(ctx, 'AVANT LA FIN', 650, 570, t, f('s10', 0.4), { size: 44, dx: 0, maxWidth: 420 });
        tag(ctx, 'LA CHALEUR RESTANTE FINIT LA CUISSON', 500, 680, t, f('s10', 0.55), { color: HOT });
        tag(ctx, 'PLAQUE CLASSIQUE · PAS À INDUCTION', 500, 770, t, f('s10', 0.2), { color: WHITE });
      });
      block(ctx, t, S('s11'), S('s12'), () => { card(ctx, 520);
        tag(ctx, 'SCHÉMA', 500, 370, t, S('s11'), { size: 36 });
        // fond bombé (à gauche) contre fond plat (à droite)
        hob(ctx, 285, 640, 220, 0.8); pot(ctx, 285, 622, 0.62, t, { lid: 1, bulge: true, steam: false });
        hob(ctx, 715, 640, 220, 0.8); pot(ctx, 715, 640, 0.62, t, { lid: 1, steam: false });
        CHR.emo(ctx, 'cross_mark', 140, 560, 80, t, f('s11', 0.3)); CHR.emo(ctx, 'check_mark_button', 860, 560, 80, t, f('s11', 0.5));
        text(ctx, 'FOND BOMBÉ', 285, 720, { size: 40, weight: 900, color: HOT });
        text(ctx, 'FOND PLAT', 715, 720, { size: 40, weight: 900, color: GREEN });
        tag(ctx, 'CHALEUR PERDUE', 285, 790, t, f('s11', 0.5), { color: HOT });
      });
      block(ctx, t, S('s12'), S('s13'), () => comment(ctx, t, S('s12'), ['Couvercle', 'ou pas ?'], { y: 560, color: HOT }));
      block(ctx, t, S('s13'), S('s14'), () => { duelCard(ctx, t);
        stamp(ctx, 'EN VAPEUR', 285, 560, t, S('s13') + 0.15, { size: 50, color: HOT });
        stamp(ctx, `−${NB}30${NB}%`, 715, 560, t, f('s13', 0.5), { size: 64, color: GREEN });
      });
      block(ctx, t, S('s14'), END + 1, () => followCTA(ctx, t, S('s14'), { when: 'DEMAIN', next: ['montre « étanche 50 m » :', 'tu peux plonger ?'] }));
      ctx.restore();
      brand(ctx, t);
      captions(ctx, t, { y: 1385, size: 64, maxWidth: 800, x: 515, fromZero: true });
    }
  };
})();
