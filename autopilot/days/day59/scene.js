// Vidéo 59 — la veille de ta télé, en francs. Chiffres : days/day59/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect, phone } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, calc, bars, clock, toggle, duelFrame, head, comment, tv, wifi } = KIT;
  const VIOLET = '#a98bff';
  const END = E('s15') + 0.6;
  function remote(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.25 + Math.sin(t * 1.5) * 0.03); ctx.scale(s, s);
    roundRect(ctx, -46, -130, 92, 260, 26); ctx.fillStyle = '#1b2230'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#46546e'; ctx.stroke();
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -92, 18, 0, 7); ctx.fill();
    ctx.fillStyle = '#7f8ca6'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-24 + (i % 3) * 24, -44 + Math.floor(i / 3) * 32, 8, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  function plug(ctx, x, y, off, t) { // prise murale + fiche qui sort (off 0..1)
    roundRect(ctx, x - 62, y - 62, 124, 124, 22); ctx.fillStyle = '#e9edf5'; ctx.fill();
    ctx.fillStyle = '#3a4458'; ctx.beginPath(); ctx.arc(x - 22, y, 9, 0, 7); ctx.arc(x + 22, y, 9, 0, 7); ctx.fill();
    const py = y + lerp(10, 120, off);
    ctx.save(); ctx.strokeStyle = '#cfd6e4'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, py + 40); ctx.quadraticCurveTo(x + 100, py + 130, x + 120, py + 200); ctx.stroke(); ctx.restore();
    roundRect(ctx, x - 44, py - 30, 88, 74, 16); ctx.fillStyle = '#c0c8d8'; ctx.fill();
  }
  function duel(ctx, t, o = {}) {
    duelFrame(ctx, { y0: 500 });
    tv(ctx, 275, 720, 340, { on: 0, pulse: 2 + 2 * Math.sin(t * 5) });
    tv(ctx, 725, 720, 340, { on: 0, led: false });
    if (o.left) o.left(); else remote(ctx, 275, 1020, 0.85, t);
    if (o.right) o.right(); else plug(ctx, 725, 985, clamp(0.5 + 0.5 * Math.sin(t * 2.2)), t);
  }
  function fiche(ctx, t, t0, rows) {
    pop(ctx, t, t0, 500, 690, () => {
      panel(ctx, -390, -300, 780, 600, { bg: '#f3f4f7', border: '#cfd3dc' });
      text(ctx, 'FICHE D\'INFORMATION · UE', 0, -240, { size: 36, family: F.mono, weight: 700, color: '#25304a' });
      text(ctx, 'Samsung QE55LS03HAU', 0, -170, { size: 50, weight: 900, color: '#10182a' });
      text(ctx, '55 pouces', 0, -112, { size: 38, weight: 700, color: '#4a5570' });
      rows.forEach((r, i) => { const a = ease.out(prog(t, r[3], 0.25)); ctx.save(); ctx.globalAlpha *= a;
        roundRect(ctx, -350, -60 + i * 112, 700, 96, 18); ctx.fillStyle = r[2] ? r[2] : '#e3e6ee'; ctx.fill();
        text(ctx, r[0], -326, -12 + i * 112, { size: 38, weight: 800, color: '#10182a', align: 'left', maxWidth: 400 });
        text(ctx, r[1], 326, -12 + i * 112, { size: 54, family: F.mono, weight: 700, color: '#10182a', align: 'right' }); ctx.restore(); });
    }, 0.28);
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['television', 'man_technologist', 'woman_technologist', 'gear', 'magnifying_glass_tilted_left', 'warning', 'electric_plug', 'person_shrugging', 'stopwatch']),
    draw(ctx, t) {
      background(ctx, t);
      // accroche : duel + question, complet à l'image 0
      block(ctx, t, 0, S('s03'), () => {
        big(ctx, '? CHF / AN', 500, 360, t, undefined, { size: 112, color: GOLD });
        duel(ctx, t);
        head(ctx, t < S('s02') ? 'QUI A RAISON ?' : 'UN RÉGLAGE CACHÉ', 1200, t, t < S('s02') ? undefined : S('s02'), { size: 58 });
        if (t >= S('s02')) CHR.emo(ctx, 'gear', 500, 700, 200, t, S('s02') + 0.1);
      });
      // veille
      block(ctx, t, S('s03'), S('s04'), () => {
        const k = ease.inOut(prog(t, f('s03', 0.2), 0.7));
        tv(ctx, 500, 650, 720, { on: 1 - k, pulse: k * (3 + 3 * Math.sin(t * 5)) });
        if (k > 0.8) { [[0, 0], [70, -70], [150, -130]].forEach(([dx, dy], i) => text(ctx, 'Z', 730 + dx, 470 + dy + Math.sin(t * 2 + i) * 8, { size: 60 + i * 20, weight: 900, color: VIOLET, alpha: clamp((t - f('s03', 0.35) - i * 0.15) * 3) })); }
        stamp(ctx, 'PAS ÉTEINTE', 500, 1110, t, f('s03', 0.55), { size: 72 });
      });
      // fiche : 0,5 W
      block(ctx, t, S('s04'), S('s05'), () => {
        fiche(ctx, t, S('s04'), [['Veille', '0,5 W', '#ffe9a8', f('s04', 0.62)], ['Veille connectée', '…', null, f('s04', 0.3)]]);
        big(ctx, '0,5 W', 500, 1130, t, f('s04', 0.72), { size: 130 });
      });
      // 4,4 kWh
      block(ctx, t, S('s05'), S('s06'), () => {
        clock(ctx, 250, 590, 170, (t - S('s05')) * 14);
        line(ctx, '24 h / 24', 610, 500, t, S('s05') + 0.1, { size: 60 });
        line(ctx, '365 jours', 610, 590, t, S('s05') + 0.4, { size: 60 });
        line(ctx, '= 8 760 h', 610, 680, t, S('s05') + 0.7, { size: 60, color: GOLD });
        line(ctx, '0,5 W × 8 760 h', 500, 880, t, S('s05') + 1.0, { size: 62, family: F.mono, weight: 700 });
        big(ctx, '4,38 kWh', 500, 1040, t, S('s05') + 1.4, { size: 124 });
      });
      // 1 fr 20
      block(ctx, t, S('s06'), S('s07'), () => {
        calc(ctx, ['4,38 kWh × 27,7 ct', '1,21 CHF'], 500, 470, t, [S('s06'), f('s06', 0.45)], { gap: 130, lastSize: 170 });
        tag(ctx, 'PAR AN · TARIF MÉDIAN ELCOM 2026, HORS TVA', 500, 800, t, f('s06', 0.55), { size: 28 });
        KIT.coin(ctx, 310, 985, 92, '1'); KIT.coin(ctx, 500, 985, 62, '20');
        tag(ctx, '1 fr. 20', 720, 985, t, f('s06', 0.7), { size: 50, color: GOLD });
      });
      // 365 fois
      block(ctx, t, S('s07'), S('s08'), () => {
        const n = Math.round(lerp(1, 365, ease.inOut(prog(t, S('s07') + 0.1, Math.max(0.5, E('s07') - S('s07') - 0.5)))));
        big(ctx, String(n), 500, 480, t, undefined, { size: 210 });
        line(ctx, 'FOIS DANS L\'ANNÉE', 500, 620, t, S('s07') + 0.15, { size: 56 });
        plug(ctx, 660, 880, clamp(0.5 + 0.5 * Math.sin(t * 7)), t);
        CHR.emo(ctx, 'man_technologist', 300, 960, 330, t, S('s07'), { rot: 0.28 });
      });
      // 2 W
      block(ctx, t, S('s08'), S('s09'), () => {
        fiche(ctx, t, S('s08'), [['Veille', '0,5 W', null, S('s08')], ['Veille connectée', '2,0 W', '#ffc9cd', f('s08', 0.55)]]);
        wifi(ctx, 820, 395, 130, BLUE, t);
        stamp(ctx, 'SURPRISE', 230, 1130, t, S('s08') + 0.05, { size: 50 });
        big(ctx, '2 W', 680, 1130, t, f('s08', 0.72), { size: 130, color: RED });
      });
      // × 4
      block(ctx, t, S('s09'), S('s10'), () => {
        bars(ctx, [{ label: 'Veille simple · 4,38 kWh', v: 0.25, value: '1,21 CHF', color: GOLD, t0: S('s09') }, { label: 'Veille connectée · 17,52 kWh', v: 1, value: '4,85 CHF', color: RED, t0: S('s09') + 0.45 }], 110, 460, 780, t, { rh: 200 });
        stamp(ctx, '× 4', 500, 930, t, f('s09', 0.35), { size: 130, color: RED });
        tag(ctx, 'PAR AN, SUR CETTE FICHE', 500, 1090, t, f('s09', 0.6));
      });
      // LG + Sony
      block(ctx, t, S('s10'), S('s11'), () => {
        pop(ctx, t, S('s10'), 500, 500, () => { panel(ctx, -410, -130, 820, 260, {});
          text(ctx, 'LG · Q-Start+', 0, -70, { size: 44, weight: 900, color: GOLD });
          text(ctx, '« may increase', 0, 0, { size: 50, weight: 700, color: WHITE }); text(ctx, 'energy consumption »', 0, 60, { size: 50, weight: 700, color: WHITE }); });
        pop(ctx, t, f('s10', 0.3), 500, 800, () => { panel(ctx, -410, -130, 820, 260, { border: BLUE });
          text(ctx, 'SONY · Quick start', 0, -70, { size: 44, weight: 900, color: BLUE });
          text(ctx, '« can increase power', 0, 0, { size: 50, weight: 700, color: WHITE }); text(ctx, 'consumption in Standby »', 0, 60, { size: 46, weight: 700, color: WHITE }); });
        CHR.emo(ctx, 'warning', 500, 1060, 170, t, f('s10', 0.6));
      });
      // réglages
      block(ctx, t, S('s11'), S('s12'), () => {
        phone(ctx, 500, 720, 460, 830, { draw: (x, y, w, h) => {
          text(ctx, 'RÉGLAGES', x + w / 2, y + 130, { size: 46, weight: 900, color: WHITE });
          ['Image', 'Son', 'Démarrage rapide', 'Général'].forEach((s, i) => { const yy = y + 240 + i * 120;
            if (i === 2) { roundRect(ctx, x + 14, yy - 50, w - 28, 100, 16); ctx.fillStyle = 'rgba(230,198,106,0.2)'; ctx.fill(); }
            if (i === 2) { text(ctx, 'Démarrage', x + 34, yy - 18, { size: 30, weight: 800, color: GOLD, align: 'left' }); text(ctx, 'rapide', x + 34, yy + 20, { size: 30, weight: 800, color: GOLD, align: 'left' }); } else text(ctx, s, x + 34, yy, { size: 34, weight: 800, color: '#aeb8cc', align: 'left', maxWidth: 260 });
            if (i === 2) toggle(ctx, x + w - 90, yy, 1 - prog(t, f('s11', 0.5), 0.3), { w: 100 }); });
        } });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 780, 660, 190, t, S('s11') + 0.1);
      });
      // 57 h
      block(ctx, t, S('s12'), S('s13'), () => {
        line(ctx, '1 AN DE VEILLE SIMPLE', 500, 400, t, S('s12'), { size: 58 });
        big(ctx, '=', 500, 500, t, f('s12', 0.2), { size: 100, color: WHITE });
        tv(ctx, 500, 730, 520, { on: 1, led: false });
        big(ctx, '57 h', 500, 730, t, f('s12', 0.45), { size: 150, color: WHITE });
        line(ctx, '4 380 Wh ÷ 77 W', 500, 1010, t, f('s12', 0.55), { size: 56, family: F.mono, weight: 700, color: GOLD });
        tag(ctx, 'SUR CETTE TÉLÉ, ALLUMÉE', 500, 1110, t, f('s12', 0.65));
      });
      // commentaire
      block(ctx, t, S('s13'), S('s14'), () => {
        comment(ctx, t, S('s13'), ['Démarrage rapide', 'activé ?', 'OUI ou NON']);
      });
      // retour au duel
      block(ctx, t, S('s14'), S('s15'), () => {
        duel(ctx, t, { left: () => big(ctx, '1,21 CHF', 275, 1020, t, S('s14') + 0.1, { size: 70 }), right: () => { big(ctx, '0 CHF', 725, 960, t, f('s14', 0.3), { size: 70, color: GREEN }); line(ctx, '365 trajets', 725, 1050, t, f('s14', 0.55), { size: 48, color: RED }); } });
        head(ctx, 'QUI A RAISON ?', 370, t, undefined, { size: 58 });
      });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['lave-linge à 30 ou 60 °C :', 'qui paie quoi ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
