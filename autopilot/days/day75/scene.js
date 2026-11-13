// Vidéo 75 — format A : le robot aspirateur (fictif) balance ce qu'il coûte en francs par an. Chiffres : days/day75/facts.md.
// Personnage : assets/ai/perso_robot.png (repères dans assets/ai/SOURCES.md). Aucune marque reçue par Marcio.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, WHITE, f, pop, stamp, panel, big, line, tag, coin, comment, battery } = KIT;
  const ROBOT = { mouth: [0.454, 0.615, 0.12], eyes: [[0.336, 0.496, 0.066, 0.083], [0.607, 0.52, 0.067, 0.087]], skin: '#f6f3f1', lid: '#eeeae8', lip: '#55586a' };
  const END = E('s16') + 0.6;
  const IDS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12','s13','s14','s15'];
  const PUNCH = [[f('s01',0.6),0.05],[f('s03',0.4),0.06],[f('s06',0.6),0.06],[f('s07',0.6),0.07],[f('s08',0.3),0.06],[f('s10',0.6),0.05],[S('s15'),0.05]];
  function card(ctx, h = 520, o = {}) { panel(ctx, 70, 310, 860, h, { bg: 'rgba(10,16,28,0.9)', border: o.border || 'rgba(90,169,255,0.6)' }); }
  function robotAt(t) {
    let y = 1290, sq = 0; const x = 500 + 40 * Math.sin(t * 0.7);
    IDS.forEach(id => { const d = t - S(id); if (d >= 0 && d < 0.34) { y -= 18 * Math.sin(Math.PI * d / 0.34); sq -= 0.03 * Math.sin(Math.PI * d / 0.34); } });
    PUNCH.forEach(([tp]) => { const d = t - tp; if (d >= 0 && d < 0.5) sq += 0.05 * Math.sin(d * 18) * Math.exp(-d * 6); });
    return [x, y, sq];
  }
  // aspirateur traîneau générique (corps, flexible, tube, brosse)
  function canister(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = '#8a95ab'; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(60, -40); ctx.bezierCurveTo(160, -160, 220, -60, 230, -200); ctx.stroke();
    ctx.lineWidth = 12; ctx.strokeStyle = '#c7cedb'; ctx.beginPath(); ctx.moveTo(230, -200); ctx.lineTo(300, 40); ctx.stroke();
    roundRect(ctx, 255, 30, 110, 26, 10); ctx.fillStyle = '#39445a'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, 120, 80, 0, 0, 7); ctx.fillStyle = '#d64552'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#8e2430'; ctx.stroke();
    ctx.fillStyle = '#1b2230'; ctx.beginPath(); ctx.arc(-70, 60, 28, 0, 7); ctx.arc(60, 60, 28, 0, 7); ctx.fill();
    ctx.restore();
  }
  function fiche(ctx, t, t0, title, sub, rows) {
    pop(ctx, t, t0, 500, 570, () => {
      panel(ctx, -400, -250, 800, 500, { bg: '#f3f4f7', border: '#cfd3dc' });
      text(ctx, title, 0, -190, { size: 38, family: F.mono, weight: 700, color: '#25304a', maxWidth: 740 });
      text(ctx, sub, 0, -128, { size: 44, weight: 900, color: '#10182a', maxWidth: 740 });
      rows.forEach((r, i) => { const a = ease.out(prog(t, r[3], 0.25)); ctx.save(); ctx.globalAlpha *= a;
        roundRect(ctx, -360, -70 + i * 120, 720, 100, 18); ctx.fillStyle = r[2] || '#e3e6ee'; ctx.fill();
        text(ctx, r[0], -336, -20 + i * 120, { size: 38, weight: 800, color: '#10182a', align: 'left', maxWidth: 380 });
        text(ctx, r[1], 336, -20 + i * 120, { size: 54, family: F.mono, weight: 700, color: '#10182a', align: 'right' }); ctx.restore(); });
    }, 0.28);
  }
  function duelCard(ctx, t, o = {}) {
    card(ctx, 520, { border: 'rgba(230,198,106,0.6)' });
    ctx.save(); ctx.setLineDash([14, 14]); ctx.strokeStyle = 'rgba(230,198,106,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 330); ctx.lineTo(500, 810); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 285, 362, { color: WHITE, size: 36 }); chip(ctx, 'TON COLLÈGUE', 715, 362, { color: WHITE, size: 36 });
    CHR.emo(ctx, 'woman_technologist', 205, 480, 150, t, undefined, { phase: 0.3 }); canister(ctx, 330, 520, 0.45);
    CHR.emo(ctx, 'man_technologist', 640, 480, 150, t, undefined, { phase: 1.4 }); CHR.emo(ctx, 'robot', 790, 490, 120, t, undefined, { phase: 2 });
    if (!o.noLabels) {
      text(ctx, 'À LA MAIN', 285, 625, { size: 42, weight: 900, color: WHITE, maxWidth: 390 });
      text(ctx, 'ROBOT CHAQUE JOUR', 715, 625, { size: 38, weight: 900, color: WHITE, maxWidth: 400 });
    }
  }
  window.SCENE = {
    duration: END,
    load: () => Promise.all([CHR.loadArt(['decor_salon', 'perso_robot']), CHR.load(['man_technologist', 'woman_technologist', 'robot', 'high_voltage', 'check_mark_button', 'battery', 'thinking_face'])]),
    draw(ctx, t) {
      CHR.backdrop(ctx, t, 'decor_salon', { blur: 2.5, z0: 1.1, z1: 1.2, focus: [0.5, 0.7], dur: END, dim: t >= S('s16') ? 0.72 : 0.4 });
      CHR.camera(ctx, t, PUNCH, { cy: 900 });
      if (t < S('s16')) { const [x, y, sq] = robotAt(t); CHR.art(ctx, 'perso_robot', x, y, 300, t, { ...ROBOT, squash: sq }); }
      // accroche : duel + question, complet à l'image 0
      block(ctx, t, 0, S('s03'), () => { duelCard(ctx, t);
        line(ctx, 'QUI PAIE LE PLUS ?', 500, 730, t, undefined, { size: 62, weight: 900, color: GOLD, dx: 0, stroke: 'rgba(0,0,0,0.7)' });
        if (t >= S('s02')) pop(ctx, t, S('s02') + 0.1, 500, 900, () => { panel(ctx, -260, -60, 520, 120, { border: GOLD }); text(ctx, '1 PASSAGE = ? CHF', 0, 2, { size: 50, weight: 900, color: WHITE }); });
      });
      block(ctx, t, S('s03'), S('s04'), () => { card(ctx, 520);
        stamp(ctx, 'ROBOT FICTIF', 500, 450, t, S('s03') + 0.1, { size: 84, color: GOLD });
        line(ctx, 'CHIFFRES : VRAIS MODÈLES', 500, 610, t, f('s03', 0.4), { size: 50, dx: 0 });
        tag(ctx, 'XIAOMI · ECOVACS · UE', 500, 720, t, f('s03', 0.6), { size: 40, color: BLUE });
      });
      block(ctx, t, S('s04'), S('s05'), () => {
        fiche(ctx, t, S('s04'), 'FICHE FABRICANT', 'Xiaomi Robot Vacuum S40', [['Tension', '14,4 V', '#cfe4ff', f('s04', 0.3)], ['Batterie', '5 200 mAh', '#cfe4ff', f('s04', 0.55)]]);
      });
      block(ctx, t, S('s05'), S('s06'), () => { card(ctx, 520);
        line(ctx, '14,4 V × 5,2 Ah', 500, 400, t, S('s05'), { size: 62, family: F.mono, weight: 700, dx: 0 });
        battery(ctx, 270, 600, 260, ease.out(prog(t, S('s05') + 0.2, 0.8)), { color: GREEN, label: 'PLEINE', size: 46 });
        big(ctx, '≈ 75 Wh', 680, 600, t, f('s05', 0.4), { size: 88 });
        tag(ctx, '74,88 Wh', 680, 720, t, f('s05', 0.6), { size: 38 });
      });
      block(ctx, t, S('s06'), S('s07'), () => { card(ctx, 520);
        tag(ctx, 'SCHÉMA · BATTERIE VIDÉE', 500, 370, t, S('s06'), { size: 38 });
        line(ctx, '0,0749 kWh × 27,7 ct', 500, 470, t, S('s06') + 0.15, { size: 56, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '≥ 2,07 ct', 500, 610, t, f('s06', 0.45), { size: 130 });
        tag(ctx, 'SANS LES PERTES DE CHARGE', 500, 760, t, f('s06', 0.6), { size: 38, color: GOLD });
      });
      block(ctx, t, S('s07'), S('s08'), () => { card(ctx, 520);
        const n = Math.round(lerp(1, 365, ease.inOut(prog(t, S('s07') + 0.1, 1.2))));
        line(ctx, n + ' JOURS', 500, 400, t, S('s07'), { size: 64, family: F.mono, weight: 700, dx: 0 });
        line(ctx, '27,33 kWh × 27,7 ct', 500, 490, t, f('s07', 0.2), { size: 54, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '≥ 7,57 CHF', 500, 630, t, f('s07', 0.4), { size: 120 });
        tag(ctx, 'PAR AN · ELCOM 2026, HORS TVA', 500, 770, t, f('s07', 0.65), { size: 36 });
      });
      block(ctx, t, S('s08'), S('s09'), () => { card(ctx, 520, { border: 'rgba(255,77,90,0.6)' });
        stamp(ctx, 'SURPRISE', 500, 390, t, S('s08'), { size: 60 });
        [[0, 0], [70, -60], [150, -110]].forEach(([dx, dy], i) => text(ctx, 'Z', 740 + dx, 640 + dy + Math.sin(t * 2 + i) * 8, { size: 60 + i * 22, weight: 900, color: '#a98bff', alpha: clamp((t - f('s08', 0.25) - i * 0.15) * 3) }));
        line(ctx, 'SUR LA STATION', 340, 600, t, f('s08', 0.2), { size: 56, dx: 0 });
        line(ctx, '= ÇA CONSOMME', 340, 700, t, f('s08', 0.5), { size: 56, color: RED, dx: 0 });
      });
      block(ctx, t, S('s09'), S('s10'), () => {
        fiche(ctx, t, S('s09'), 'NOTICE · DEEBOT OZMO T8', 'Ecovacs', [['Veille en réseau', '< 2,00 W', '#ffc9cd', f('s09', 0.3)], ['Arrêt', '< 0,50 W', null, f('s09', 0.6)]]);
      });
      block(ctx, t, S('s10'), S('s11'), () => { card(ctx, 520, { border: 'rgba(255,77,90,0.6)' });
        line(ctx, '2 W × 8 760 h', 500, 400, t, S('s10'), { size: 60, family: F.mono, weight: 700, dx: 0 });
        line(ctx, '= 17,52 kWh max.', 500, 490, t, f('s10', 0.25), { size: 56, family: F.mono, weight: 700, color: GOLD, dx: 0 });
        big(ctx, '≤ 4,85 CHF', 500, 630, t, f('s10', 0.5), { size: 120, color: RED });
        tag(ctx, 'PAR AN · AU MAXIMUM', 500, 770, t, f('s10', 0.6), { size: 38 });
      });
      block(ctx, t, S('s11'), S('s12'), () => { card(ctx, 520, { border: 'rgba(230,198,106,0.6)' });
        canister(ctx, 230, 640, 0.8); CHR.emo(ctx, 'thinking_face', 200, 430, 120, t, S('s11') + 0.1);
        big(ctx, '35 kWh', 690, 520, t, f('s11', 0.35), { size: 90 });
        line(ctx, 'PAR AN', 690, 610, t, f('s11', 0.5), { size: 48, dx: 0 });
        tag(ctx, 'ESTIMATION UE · MOYENNE 2020', 500, 760, t, f('s11', 0.6), { size: 36 });
      });
      block(ctx, t, S('s12'), S('s13'), () => { card(ctx, 520, { border: 'rgba(230,198,106,0.6)' });
        line(ctx, '35 kWh × 27,7 ct', 500, 420, t, S('s12'), { size: 60, family: F.mono, weight: 700, dx: 0 });
        big(ctx, '≈ 9,70 CHF', 500, 580, t, S('s12') + 0.35, { size: 130 });
        tag(ctx, 'USAGE NORMALISÉ (50 h / AN)', 500, 740, t, f('s12', 0.5), { size: 36 });
      });
      block(ctx, t, S('s13'), S('s14'), () => { card(ctx, 520, { border: 'rgba(88,214,141,0.6)' });
        [['LES JOURS UTILES', 0.05], ['VACANCES : ÉTEINT', 0.45]].forEach(([s, u], i) =>
          pop(ctx, t, f('s13', u), 500, 430 + i * 150, () => { panel(ctx, -380, -60, 760, 120, { border: GREEN }); text(ctx, s, 0, 2, { size: 58, weight: 900, color: WHITE, maxWidth: 720 }); }));
        tag(ctx, 'ARRÊT < 0,5 W (NOTICE ECOVACS)', 500, 760, t, f('s13', 0.6), { size: 36, color: GREEN });
      });
      block(ctx, t, S('s14'), S('s15'), () => comment(ctx, t, S('s14'), ['Ton robot passe', 'tous les jours ?'], { y: 560, color: BLUE }));
      block(ctx, t, S('s15'), S('s16'), () => { duelCard(ctx, t, { noLabels: true });
        big(ctx, '≈ 9,70', 285, 640, t, S('s15') + 0.1, { size: 74 });
        text(ctx, 'CHF (TRAÎNEAU, UE)', 285, 715, { size: 36, weight: 800, color: '#cfd6e4', maxWidth: 390 });
        big(ctx, '7,57–12,42', 715, 640, t, f('s15', 0.25), { size: 64 });
        text(ctx, 'CHF (HORS PERTES)', 715, 715, { size: 36, weight: 800, color: '#cfd6e4', maxWidth: 390 });
        stamp(ctx, 'UNE DIZAINE CHACUN', 500, 900, t, f('s15', 0.5), { size: 58, color: GOLD });
      });
      block(ctx, t, S('s16'), END + 1, () => followCTA(ctx, t, S('s16'), { when: 'À SUIVRE', next: ["d'autres objets", 'vont tout balancer'] }));
      ctx.restore();
      brand(ctx, t);
      captions(ctx, t, { y: 1385, size: 64, maxWidth: 800, x: 515, fromZero: true });
    }
  };
})();
