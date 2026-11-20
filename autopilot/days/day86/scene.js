// Vidéo 86 — sèche-cheveux 2 000 W : combien de francs par an ? (BaByliss Power Pro 2000, notice Expert 2000, médiane ElCom 2026).
// Chiffres : days/day86/facts.md. Durées 5 et 15 min = valeurs d'exemple (puce « exemple » à l'écran).
// Palette « air chaud » : orange, corail, rose ; schéma : deux sèche-cheveux face à face, minuteries, calcul, barres.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect, readout } = ENG;
  const { RED, GOLD, GREEN, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment, coin } = KIT;
  const END = E('s14') + 0.6;
  const HOT = '#ff8a3d', CORAL = '#ff6b6b', PINK = '#ff5fa2', CREAM = '#ffe2c4';
  const N = ' ';

  // voile chaud par-dessus le fond
  function warm(ctx, t) {
    const g = ctx.createRadialGradient(540, 760, 80, 540, 760, 900);
    g.addColorStop(0, 'rgba(255,138,61,0.16)'); g.addColorStop(1, 'rgba(255,95,162,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
  }
  // sèche-cheveux dessiné ; dir = 1 : buse vers la droite ; hot = 0..1 (air chaud qui sort)
  function dryer(ctx, x, y, s, t, o = {}) {
    const dir = o.dir || 1, hot = o.hot ?? 1, col = o.color || PINK;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
    // air chaud
    if (hot > 0.01) {
      for (let i = 0; i < 4; i++) {
        const k = ((t * 1.4 + i * 0.25) % 1);
        ctx.save(); ctx.globalAlpha *= hot * (1 - k) * 0.9; ctx.strokeStyle = i % 2 ? HOT : CORAL; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath(); const x0 = 170 + k * 170;
        ctx.moveTo(x0, -40 + i * 26); ctx.quadraticCurveTo(x0 + 40, -60 + i * 26, x0 + 80, -40 + i * 26); ctx.stroke(); ctx.restore();
      }
    }
    // poignée
    roundRect(ctx, -70, 20, 80, 190, 30); ctx.fillStyle = '#2a2f3d'; ctx.fill();
    roundRect(ctx, -52, 70, 44, 26, 8); ctx.fillStyle = col; ctx.fill();
    // corps
    roundRect(ctx, -170, -85, 290, 170, 85); ctx.fillStyle = col; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.stroke();
    // grille arrière
    ctx.beginPath(); ctx.arc(-130, 0, 62, 0, Math.PI * 2); ctx.fillStyle = '#1b1f2a'; ctx.fill();
    ctx.save(); ctx.translate(-130, 0); ctx.rotate(t * 8);
    for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.fillStyle = '#5b6375'; ctx.fillRect(-4, -54, 8, 50); }
    ctx.restore();
    // buse
    ctx.beginPath(); ctx.moveTo(110, -62); ctx.lineTo(180, -46); ctx.lineTo(180, 46); ctx.lineTo(110, 62); ctx.closePath(); ctx.fillStyle = '#2a2f3d'; ctx.fill();
    // reflet
    roundRect(ctx, -90, -66, 170, 18, 9); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
    ctx.restore();
  }
  // minuterie : anneau qui se remplit, valeur au centre
  function timer(ctx, x, y, r, frac, label, col) {
    ctx.save(); ctx.lineWidth = 16;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(frac)); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke();
    ctx.restore();
    text(ctx, label, x, y + 4, { size: r * 0.62, weight: 900, family: F.mono, color: WHITE });
  }
  // le duel (image 0 et retour avant la fin)
  function duel(ctx, t, o = {}) {
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(255,138,61,0.5)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(500, 500); ctx.lineTo(500, 1150); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 270, 530, { color: WHITE, size: 40 });
    chip(ctx, 'TON COLLÈGUE', 730, 530, { color: o.hiRight ? HOT : WHITE, size: 36 });
    CHR.emo(ctx, 'woman_technologist', 270, 670, 160, t, undefined, { phase: 0.3 });
    CHR.emo(ctx, 'man_technologist', 730, 670, 160, t, undefined, { phase: 1.4 });
    dryer(ctx, 290, 850, 0.5, t, { dir: 1, color: PINK });
    dryer(ctx, 710, 850, 0.5, t, { dir: -1, color: HOT });
    const a = o.left ?? 5, b = o.right ?? 15;
    // anneaux animés, mais valeurs finales (5 et 15) lisibles dès l'image 0
    timer(ctx, 270, 1035, 72, a / 15, '5', PINK);
    timer(ctx, 730, 1035, 72, b / 15, '15', HOT);
    text(ctx, 'MIN/JOUR', 270, 1140, { size: 36, weight: 800, color: CREAM });
    text(ctx, 'MIN/JOUR', 730, 1140, { size: 36, weight: 800, color: CREAM });
    if (o.ex !== false) chip(ctx, 'exemple', 500, 1205, { color: CREAM, size: 36 });
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['woman_technologist', 'man_technologist', 'stopwatch', 'electric_plug', 'high_voltage', 'magnifying_glass_tilted_left',
      'money_bag', 'package', 'warning', 'check_mark_button', 'cross_mark', 'receipt']),
    draw(ctx, t) {
      background(ctx, t); warm(ctx, t);

      // s01–s02 : image 0 — objet + question + duel ; minuteries qui montent vers 5 et 15 min (valeurs d'exemple)
      block(ctx, t, 0, S('s03'), () => {
        head(ctx, `SÈCHE-CHEVEUX 2${N}000 W`, 362, t, undefined, { size: 52, color: HOT, bg: 'rgba(255,138,61,0.18)' });
        const q = t >= S('s02') ? 1 + 0.06 * Math.sin((t - S('s02')) * 9) * (1 - clamp((t - S('s02')) / 1.2)) : 1;
        ctx.save(); ctx.translate(500, 452); ctx.scale(q, q);
        text(ctx, 'COMBIEN DE PLUS PAR AN ?', 0, 0, { size: 54, weight: 900, color: t >= S('s02') ? PINK : WHITE, maxWidth: 860 });
        ctx.restore();
        const l = lerp(0, 5, ease.out(clamp(t / 2.2)));
        const r = lerp(0, 15, ease.out(clamp(t / Math.max(3, S('s02') + 1.5))));
        duel(ctx, t, { left: l, right: r, hiRight: t >= S('s02') });
      });
      // s03 : relance + promesse
      block(ctx, t, S('s03'), S('s04'), () => {
        stamp(ctx, 'ATTENDS', 500, 420, t, S('s03'), { size: 90, color: HOT });
        pop(ctx, t, f('s03', 0.35), 500, 720, () => { coin(ctx, 0, 0, 130, 'CHF'); });
        text(ctx, '?', 660, 640, { size: 150, weight: 900, color: PINK, alpha: clamp((t - f('s03', 0.45)) * 5) });
        line(ctx, 'À LA FIN :', 500, 950, t, f('s03', 0.4), { size: 56, weight: 900, color: CREAM, dx: 0 });
        line(ctx, "L'ÉCART EN FRANCS", 500, 1040, t, f('s03', 0.5), { size: 70, weight: 900, color: WHITE, dx: 0 });
      });
      // s04 : la fiche — 2 000 W = 2 kW
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'EXEMPLE · FICHE BABYLISS POWER PRO 2000', 500, 360, t, S('s04'), { size: 36, color: CREAM });
        pop(ctx, t, S('s04') + 0.1, 470, 640, () => dryer(ctx, 0, 0, 1.05, t, { color: PINK }));
        big(ctx, `2${N}000 W`, 500, 950, t, f('s04', 0.45), { size: 150, color: HOT });
        line(ctx, '= 2 kW', 500, 1100, t, f('s04', 0.78), { size: 80, weight: 900, family: F.mono, color: WHITE, dx: 0 });
      });
      // s05 : relance — le prix du courant
      block(ctx, t, S('s05'), S('s06'), () => {
        stamp(ctx, "ET CE N'EST PAS TOUT", 500, 420, t, S('s05'), { size: 62, color: PINK });
        CHR.emo(ctx, 'electric_plug', 380, 760, 260, t, f('s05', 0.3));
        CHR.emo(ctx, 'high_voltage', 640, 760, 230, t, f('s05', 0.45));
        line(ctx, 'LE PRIX DU COURANT', 500, 1060, t, f('s05', 0.55), { size: 60, weight: 900, color: CREAM, dx: 0 });
      });
      // s06 : tarif médian ElCom
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'MÉDIANE ELCOM 2026 · MÉNAGE H4', 500, 380, t, S('s06'), { size: 38, color: CYAN });
        pop(ctx, t, S('s06') + 0.2, 500, 700, () => readout(ctx, 'PRIX DU kWh', '27,7 ct.', 0, 0, { w: 700, h: 260, size: 130, color: GOLD }));
        line(ctx, 'hors TVA', 500, 960, t, f('s06', 0.7), { size: 56, weight: 900, color: WHITE, dx: 0 });
        line(ctx, 'le tarif de ta commune peut différer', 500, 1050, t, f('s06', 0.8), { size: 38, weight: 700, color: C.muted, dx: 0 });
      });
      // s07 : toi, 5 min/jour → 16,85 CHF
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'EXEMPLE · TOI · MAXIMUM, À FOND', 500, 360, t, S('s07'), { size: 36, color: PINK });
        calc(ctx, ['2 kW × 5 min × 365', '= 60,8 kWh/an', '≈ 16,85 CHF'], 500, 520, t,
          [S('s07') + 0.1, f('s07', 0.35), f('s07', 0.72)], { lastSize: 130, color: PINK, gap: 120 });
        tag(ctx, 'maximum (à fond) · exemple', 500, 1130, t, S('s07') + 0.1, { size: 40, color: WHITE });
      });
      // s08 : ton collègue, 15 min/jour → 50,55 CHF, barres
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'EXEMPLE · TON COLLÈGUE · 3 × PLUS LONG', 500, 360, t, S('s08'), { size: 36, color: HOT });
        KIT.bars(ctx, [
          { label: 'Toi · 5 min/jour', v: 16.85 / 50.55, value: '16,85 CHF', color: PINK, t0: S('s08') + 0.05 },
          { label: 'Ton collègue · 15 min/jour', v: 1, value: '50,55 CHF', color: HOT, t0: f('s08', 0.45) },
        ], 120, 520, 760, t, { rh: 220, size: 44 });
        tag(ctx, 'exemple · maximum · hors TVA', 500, 1060, t, S('s08') + 0.1, { size: 38, color: WHITE });
      });
      // s09 : 2e surprise
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, '2E SURPRISE', 500, 420, t, S('s09'), { size: 80, color: GOLD });
        pop(ctx, t, f('s09', 0.3), 500, 760, () => { CHR.box(ctx, 0, 0, 1.0, `2${N}000`, 'sur la boîte', { rot: -0.04, subSize: 36 }); });
        line(ctx, 'pas toujours des watts consommés', 500, 1100, t, f('s09', 0.6), { size: 46, weight: 900, color: CORAL, dx: 0 });
      });
      // s10 : notice Expert 2000 — 2 000 DryWatts / 1 400 W
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, 'NOTICE BABYLISS EXPERT 2000', 500, 360, t, S('s10'), { size: 38, color: CREAM });
        pop(ctx, t, S('s10') + 0.15, 500, 560, () => { panel(ctx, -390, -105, 780, 210, { border: GOLD });
          text(ctx, `2${N}000`, -165, 0, { size: 116, weight: 900, family: F.mono, color: GOLD }); text(ctx, '« DryWatts »', 215, 4, { size: 48, weight: 900, color: WHITE }); });
        line(ctx, '↓', 500, 760, t, f('s10', 0.5), { size: 90, weight: 900, color: WHITE, dx: 0 });
        pop(ctx, t, f('s10', 0.6), 500, 930, () => { panel(ctx, -390, -105, 780, 210, { border: CORAL });
          text(ctx, `1${N}400 W`, -90, 0, { size: 120, weight: 900, family: F.mono, color: CORAL }); text(ctx, 'réels', 290, 4, { size: 54, weight: 900, color: WHITE }); });
        line(ctx, 'consommation d\'énergie réelle (notice)', 500, 1110, t, f('s10', 0.75), { size: 38, weight: 700, color: C.muted, dx: 0 });
      });
      // s11 : conseil
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'CONSEIL', 500, 360, t, S('s11'), { size: 46, color: GREEN });
        pop(ctx, t, S('s11') + 0.15, 500, 620, () => { panel(ctx, -380, -130, 760, 260, { border: GREEN });
          text(ctx, 'SUR LA BOÎTE', 0, -70, { size: 42, weight: 800, color: C.muted }); text(ctx, 'PUISSANCE : … W', 0, 30, { size: 72, weight: 900, family: F.mono, color: GREEN }); });
        CHR.emo(ctx, 'check_mark_button', 500, 820, 110, t, f('s11', 0.3));
        line(ctx, 'pas des « DryWatts »', 500, 940, t, f('s11', 0.6), { size: 60, weight: 900, color: CORAL, dx: 0 });
        CHR.emo(ctx, 'cross_mark', 500, 1060, 100, t, f('s11', 0.7));
      });
      // s12 : commentaire
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Toi : combien', 'de minutes ?'], { color: HOT }); });
      // s13 : retour au duel + promesse tenue
      block(ctx, t, S('s13'), S('s14'), () => {
        duel(ctx, t, { left: 5, right: 15, hiRight: true, ex: false });
        pop(ctx, t, f('s13', 0.3), 500, 400, () => {
          roundRect(ctx, -420, -95, 840, 190, 30); ctx.fillStyle = 'rgba(8,10,20,0.92)'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = HOT; ctx.stroke();
          text(ctx, "L'ÉCART ≈ 33,70 CHF/an", 0, 4, { size: 70, weight: 900, family: F.mono, color: HOT, maxWidth: 800 });
        });
        tag(ctx, 'exemple · maximum · hors TVA', 500, 1205, t, f('s13', 0.4), { size: 36, color: CREAM });
      });
      block(ctx, t, S('s14'), END + 1, () => followCTA(ctx, t, S('s14'), { when: 'DEMAIN', next: ['chargeur sans fil « 15 W »…', 'ton téléphone en prend moins ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
