// Vidéo 82 — frigo « classe B » : la nouvelle étiquette énergie (UE 2019/2016, OEEE, SuisseEnergie). Chiffres : days/day82/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, head, comment } = KIT;
  const END = E('s14') + 0.6;
  const LET = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const COL = ['#00a651', '#50b848', '#bed630', '#fff200', '#fdb913', '#f37021', '#ed1c24'];
  const OLD = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const OLDC = ['#00a651', '#2db34a', '#6cbd45', '#a8cf3b', '#d7df23', '#fff200', '#fdb913', '#f8961d', '#f37021', '#ed1c24'];
  // frigo dessiné
  function fridge(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    roundRect(ctx, -150, -300, 300, 600, 30); ctx.fillStyle = '#dfe4ec'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#9aa3b2'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-150, -90); ctx.lineTo(150, -90); ctx.strokeStyle = '#9aa3b2'; ctx.lineWidth = 6; ctx.stroke();
    roundRect(ctx, 100, -250, 18, 120, 9); ctx.fillStyle = '#7d8696'; ctx.fill();
    roundRect(ctx, 100, -40, 18, 200, 9); ctx.fill();
    if (o.letter) { roundRect(ctx, -110, 20, 150, 150, 18); ctx.fillStyle = o.color || COL[1]; ctx.fill();
      text(ctx, o.letter, -35, 98, { size: 120, weight: 900, color: '#ffffff', stroke: 'rgba(0,0,0,0.35)' }); }
    ctx.restore();
  }
  // étiquette A–G : barres colorées ; hi = index en évidence ; dim = indices grisés
  function label(ctx, x, y, w, t, t0, o = {}) {
    const n = o.letters || LET, cols = o.cols || COL, rh = o.rh || 62, gap = 10;
    n.forEach((L, i) => {
      const k = t0 === undefined ? 1 : ease.out(prog(t, t0 + i * 0.06, 0.3)); if (k <= 0.01) return;
      const bw = (w * 0.45 + w * 0.55 * i / (n.length - 1)) * k, yy = y + i * (rh + gap);
      ctx.save(); ctx.globalAlpha *= (o.dim && o.dim.includes(i)) ? 0.25 : 1;
      ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + bw - 26, yy); ctx.lineTo(x + bw, yy + rh / 2); ctx.lineTo(x + bw - 26, yy + rh); ctx.lineTo(x, yy + rh); ctx.closePath();
      ctx.fillStyle = cols[i]; ctx.fill();
      text(ctx, L, x + 22, yy + rh / 2 + 2, { size: rh * 0.72, weight: 900, color: '#ffffff', align: 'left', stroke: 'rgba(0,0,0,0.45)' });
      if (o.hi === i) { ctx.lineWidth = 7; ctx.strokeStyle = WHITE; ctx.stroke(); text(ctx, '◀', x + bw + 50, yy + rh / 2, { size: 56, weight: 900, color: WHITE }); }
      ctx.restore();
    });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face', 'label', 'magnifying_glass_tilted_left', 'cross_mark', 'check_mark_button', 'money_bag', 'warning', 'electric_plug']),
    draw(ctx, t) {
      background(ctx, t);
      // s01 : image 0 — frigo + B en très gros + ?
      block(ctx, t, 0, S('s02'), () => {
        head(ctx, 'TON FRIGO NEUF', 360, t, undefined, { size: 56 });
        fridge(ctx, 290, 790, 1.0 + 0.015 * Math.sin(t * 2), { letter: 'B' });
        big(ctx, 'B', 690, 720, t, undefined, { size: 300, color: COL[1] });
        big(ctx, '?', 870, 760, t, undefined, { size: 180, color: RED });
        line(ctx, "C'EST MOYEN ?", 500, 1130, t, 0.6, { size: 60, weight: 900, color: GOLD, dx: 0 });
      });
      // s02 : NON + classe A vide
      block(ctx, t, S('s02'), S('s03'), () => {
        stamp(ctx, 'NON', 500, 400, t, S('s02'), { size: 110 });
        label(ctx, 200, 560, 520, t, S('s02') + 0.2, { rh: 56, dim: [2, 3, 4, 5, 6] });
        pop(ctx, t, f('s02', 0.55), 800, 600, () => { text(ctx, 'VIDE', 0, 0, { size: 60, weight: 900, color: GREEN }); });
        line(ctx, 'au départ (Commission UE)', 500, 1140, t, f('s02', 0.6), { size: 44, weight: 800, color: C.muted, dx: 0 });
      });
      // s03 : promesse
      block(ctx, t, S('s03'), S('s04'), () => {
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 500, 560, 240, t, S('s03'));
        line(ctx, 'À LA FIN :', 500, 800, t, f('s03', 0.2), { size: 58, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'LES LETTRES DISPARUES', 500, 890, t, f('s03', 0.35), { size: 62, weight: 900, dx: 0 });
        line(ctx, 'DES FRIGOS NEUFS', 500, 970, t, f('s03', 0.45), { size: 62, weight: 900, dx: 0 });
      });
      // s04 : ancienne échelle
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'AVANT 2021', 500, 360, t, S('s04'), { size: 44, color: GOLD });
        label(ctx, 250, 440, 460, t, S('s04') + 0.1, { letters: OLD, cols: OLDC, rh: 54 });
      });
      // s05 : nouvelle échelle A–G
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'DEPUIS LE 1ER MARS 2021', 500, 360, t, S('s05'), { size: 42, color: GREEN });
        label(ctx, 220, 460, 520, t, S('s05') + 0.1, { rh: 66 });
        line(ctx, 'Règlement UE 2019/2016', 500, 1060, t, f('s05', 0.5), { size: 44, weight: 800, color: C.muted, dx: 0 });
      });
      // s06 : A+++ → C
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'COMMISSION EUROPÉENNE', 500, 360, t, S('s06'), { size: 40, color: GOLD });
        pop(ctx, t, S('s06') + 0.1, 290, 640, () => { roundRect(ctx, -170, -100, 340, 200, 24); ctx.fillStyle = OLDC[0]; ctx.fill(); text(ctx, 'A+++', 0, 6, { size: 110, weight: 900, color: WHITE, stroke: 'rgba(0,0,0,0.4)' }); });
        line(ctx, '→', 500, 640, t, f('s06', 0.3), { size: 110, weight: 900, color: WHITE, dx: -30 });
        pop(ctx, t, f('s06', 0.45), 720, 640, () => { roundRect(ctx, -130, -100, 260, 200, 24); ctx.fillStyle = COL[2]; ctx.fill(); text(ctx, 'C', 0, 6, { size: 140, weight: 900, color: WHITE, stroke: 'rgba(0,0,0,0.4)' }); });
        line(ctx, 'MÊME EFFICACITÉ, AUTRE LETTRE', 500, 860, t, f('s06', 0.6), { size: 48, weight: 900, color: GOLD, dx: 0 });
      });
      // s07 : Suisse
      block(ctx, t, S('s07'), S('s08'), () => {
        pop(ctx, t, S('s07'), 500, 560, () => { roundRect(ctx, -110, -110, 220, 220, 20); ctx.fillStyle = '#d52b1e'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-26, -76, 52, 152); ctx.fillRect(-76, -26, 152, 52); });
        line(ctx, 'OEEE (RS 730.02)', 500, 790, t, f('s07', 0.3), { size: 60, weight: 900, color: WHITE, dx: 0 });
        line(ctx, 'mêmes exigences que l\'UE · OFEN', 500, 880, t, f('s07', 0.5), { size: 44, weight: 800, color: C.muted, dx: 0 });
      });
      // s08 : depuis mars 2024, au moins E
      block(ctx, t, S('s08'), S('s09'), () => {
        stamp(ctx, 'SURPRISE', 500, 380, t, S('s08'), { size: 64, color: GOLD });
        tag(ctx, 'DEPUIS LE 1ER MARS 2024', 500, 500, t, f('s08', 0.2), { size: 40 });
        label(ctx, 220, 570, 520, t, f('s08', 0.25), { rh: 58, hi: 4 });
        line(ctx, 'au moins E', 500, 1130, t, f('s08', 0.6), { size: 52, weight: 900, color: GREEN, dx: 0 });
      });
      // s09 : F et G barrés
      block(ctx, t, S('s09'), S('s10'), () => {
        label(ctx, 220, 420, 520, undefined, undefined, { rh: 58, dim: [5, 6] });
        [5, 6].forEach((i, j) => pop(ctx, t, S('s09') + 0.3 + j * 0.25, 810, 420 + i * 68 + 29, () => CHR.emo(ctx, 'cross_mark', 0, 0, 90, t, S('s09'))));
        line(ctx, 'pas pour un frigo neuf classique', 500, 1000, t, f('s09', 0.5), { size: 46, weight: 900, color: RED, dx: 0 });
        line(ctx, '(exceptions : cave à vin, minibar)', 500, 1070, t, f('s09', 0.6), { size: 38, weight: 700, color: C.muted, dx: 0 });
      });
      // s10 : C jusqu'à +40 % vs A
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, 'SUISSEENERGIE', 500, 360, t, S('s10'), { size: 42, color: CYAN });
        const k = ease.out(prog(t, f('s10', 0.2), 0.6));
        roundRect(ctx, 200, 520, 230, 300 * k, 18); ctx.fillStyle = COL[0]; ctx.fill();
        roundRect(ctx, 570, 520, 230, 420 * k, 18); ctx.fillStyle = COL[2]; ctx.fill();
        text(ctx, 'A', 315, 470, { size: 80, weight: 900, color: COL[0] }); text(ctx, 'C', 685, 470, { size: 80, weight: 900, color: COL[2] });
        big(ctx, "jusqu'à +40 %", 500, 1050, t, f('s10', 0.5), { size: 96, color: GOLD });
      });
      // s11 : exemple en francs
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'EXEMPLE · 27,7 ct./kWh hors TVA', 500, 360, t, S('s11'), { size: 40, color: GOLD });
        calc(ctx, ['150 kWh/an × 0,277', '≈ 41 CHF'], 500, 500, t, [S('s11') + 0.05, f('s11', 0.25)], { lastSize: 120, color: GREEN });
        calc(ctx, ['+40 % : 210 kWh/an', '≈ 58 CHF'], 500, 800, t, [f('s11', 0.55), f('s11', 0.7)], { lastSize: 120, color: RED });
        line(ctx, 'valeurs d\'exemple', 500, 1130, t, S('s11') + 0.1, { size: 42, weight: 800, color: 'rgba(255,255,255,0.8)', dx: 0 });
      });
      // s12 : conseil
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s12'), { size: 44, color: GREEN });
        pop(ctx, t, S('s12') + 0.15, 500, 700, () => { panel(ctx, -360, -220, 720, 440); text(ctx, 'SUR L\'ÉTIQUETTE', 0, -140, { size: 44, weight: 800, color: C.muted });
          text(ctx, 'XYZ kWh/an', 0, -20, { size: 92, weight: 900, family: F.mono, color: GOLD }); text(ctx, 'pas seulement la lettre', 0, 120, { size: 50, weight: 800, color: WHITE }); });
      });
      // s13 : commentaire
      block(ctx, t, S('s13'), S('s14'), () => { comment(ctx, t, S('s13'), ['Ton frigo :', 'quelle lettre ?'], { color: GOLD }); });
      block(ctx, t, S('s14'), END + 1, () => followCTA(ctx, t, S('s14'), { when: 'CE SOIR', next: ['le SSD à 7 000 Mo/s…', 'seulement au début ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
