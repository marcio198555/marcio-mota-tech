// Vidéo 87 — montre connectée « 14 jours » : sans GPS ni écran toujours allumé (fiches Amazfit Bip 6 et Huawei Watch GT 5).
// Chiffres : days/day87/facts.md. Palette « sport » : turquoise, vert citron, violet ; schéma : deux montres face à face,
// semainier GPS, barres d'autonomie, deux boîtiers 46/41 mm.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, head, comment } = KIT;
  const END = E('s15') + 0.6;
  const TEAL = '#2ee6c9', LIME = '#c6f432', VIOLET = '#a78bfa', ICE = '#d9fbff';

  function tint(ctx) {
    const g = ctx.createRadialGradient(540, 700, 60, 540, 700, 950);
    g.addColorStop(0, 'rgba(46,230,201,0.13)'); g.addColorStop(1, 'rgba(167,139,250,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
  }
  // montre : boîtier rond, bracelet, anneau d'autonomie (ring 0..1), texte au centre
  function watch(ctx, x, y, r, o = {}) {
    const col = o.color || TEAL;
    ctx.save(); ctx.translate(x, y);
    roundRect(ctx, -r * 0.55, -r * 1.75, r * 1.1, r * 3.5, r * 0.3); ctx.fillStyle = o.strap || '#263247'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r * 1.06, 0, Math.PI * 2); ctx.fillStyle = '#8c97ab'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = '#05080f'; ctx.fill();
    roundRect(ctx, r * 1.0, -r * 0.18, r * 0.14, r * 0.36, 6); ctx.fillStyle = '#8c97ab'; ctx.fill();
    if (o.ring !== undefined) {
      ctx.lineWidth = r * 0.1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, r * 0.84, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(o.ring)); ctx.strokeStyle = col; ctx.stroke();
    }
    if (o.label) text(ctx, o.label, 0, o.sub ? -r * 0.1 : 4, { size: o.size || r * 0.5, weight: 900, family: F.mono, color: o.labelColor || WHITE, maxWidth: r * 1.5 });
    if (o.sub) text(ctx, o.sub, 0, r * 0.38, { size: Math.max(36, r * 0.22), weight: 800, color: ICE, maxWidth: r * 1.6 });
    ctx.restore();
  }
  // satellite qui émet (GPS)
  function gps(ctx, x, y, t, on) {
    CHR.emo(ctx, 'satellite_antenna', x, y, 100, t, undefined, { phase: 0.7 });
    if (!on) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 50, y - 50); ctx.lineTo(x + 50, y + 50); ctx.stroke(); ctx.restore(); return; }
    for (let i = 0; i < 3; i++) {
      const k = (t * 1.2 + i / 3) % 1;
      ctx.save(); ctx.globalAlpha *= (1 - k); ctx.strokeStyle = LIME; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(x, y, 50 + k * 60, -Math.PI * 0.9, -Math.PI * 0.1); ctx.stroke(); ctx.restore();
    }
  }
  function duel(ctx, t, o = {}) {
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(46,230,201,0.45)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(500, 590); ctx.lineTo(500, 1190); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 270, 605, { color: o.hiLeft ? LIME : WHITE, size: 40 });
    chip(ctx, 'TON COLLÈGUE', 730, 605, { color: o.hiRight ? TEAL : WHITE, size: 36 });
    gps(ctx, 270, 715, t, true); gps(ctx, 730, 715, t, false);
    text(ctx, 'GPS ON', 270, 805, { size: 40, weight: 900, family: F.mono, color: LIME });
    text(ctx, 'SANS GPS', 730, 805, { size: 40, weight: 900, family: F.mono, color: C.muted });
    watch(ctx, 270, 1030, 100, { ring: o.lRing ?? 1, color: LIME, label: o.lLabel || '?', size: o.lSize || 90 });
    watch(ctx, 730, 1030, 100, { ring: o.rRing ?? 1, color: TEAL, label: o.rLabel || '?', size: o.rSize || 90 });
  }

  window.SCENE = {
    duration: END,
    load: () => CHR.load(['satellite_antenna', 'stopwatch', 'magnifying_glass_tilted_left', 'battery', 'low_battery', 'warning',
      'check_mark_button', 'red_question_mark', 'hourglass_done', 'eyes']),
    draw(ctx, t) {
      background(ctx, t); tint(ctx);

      // s01–s02 : image 0 — « 14 JOURS » qui monte (valeur de la fiche), duel GPS / sans GPS, question
      block(ctx, t, 0, S('s03'), () => {
        const n = Math.round(lerp(2, 14, ease.out(clamp(t / 1.8))));
        text(ctx, 'MONTRE CONNECTÉE', 500, 340, { size: 46, weight: 900, color: ICE, letter: 2 });
        text(ctx, `« ${n} JOURS »`, 500, 432, { size: 110, weight: 900, family: F.mono, color: LIME, shadow: 'rgba(198,244,50,0.4)', shadowBlur: 24 });
        const q = t >= S('s02') ? 1 + 0.07 * Math.sin((t - S('s02')) * 9) * (1 - clamp((t - S('s02')) / 1.2)) : 1;
        ctx.save(); ctx.translate(500, 530); ctx.scale(q, q);
        text(ctx, 'QUI RECHARGE EN PREMIER ?', 0, 0, { size: 54, weight: 900, color: t >= S('s02') ? TEAL : WHITE, maxWidth: 860 });
        ctx.restore();
        const ring = 1 - 0.08 * Math.sin(t * 2) ** 2;
        duel(ctx, t, { lRing: ring, rRing: ring, hiLeft: t < S('s02'), hiRight: t >= S('s02') });
      });
      // s03 : relance + promesse
      block(ctx, t, S('s03'), S('s04'), () => {
        stamp(ctx, 'ATTENDS', 500, 420, t, S('s03'), { size: 90, color: LIME });
        pop(ctx, t, f('s03', 0.3), 500, 780, () => watch(ctx, 0, 0, 120, { ring: 0.5, color: LIME, label: '? h', size: 110 }));
        CHR.emo(ctx, 'satellite_antenna', 760, 700, 130, t, f('s03', 0.4));
        line(ctx, 'À LA FIN :', 500, 1050, t, f('s03', 0.45), { size: 56, weight: 900, color: ICE, dx: 0 });
        line(ctx, 'SES HEURES DE GPS', 500, 1135, t, f('s03', 0.55), { size: 68, weight: 900, color: WHITE, dx: 0 });
      });
      // s04 : la fiche Amazfit Bip 6 — 14 jours en usage typique
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, 'EXEMPLE · FICHE AMAZFIT BIP 6', 500, 370, t, S('s04'), { size: 38, color: ICE });
        pop(ctx, t, S('s04') + 0.1, 500, 680, () => watch(ctx, 0, 0, 165, { ring: 1, color: LIME, label: '14', sub: 'JOURS', size: 150 }));
        line(ctx, 'en usage « typique »', 500, 1050, t, f('s04', 0.6), { size: 62, weight: 900, color: LIME, dx: 0 });
      });
      // s05 : relance — typique ?
      block(ctx, t, S('s05'), S('s06'), () => {
        stamp(ctx, "ET CE N'EST PAS TOUT", 500, 420, t, S('s05'), { size: 62, color: VIOLET });
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 380, 740, 260, t, f('s05', 0.3));
        big(ctx, '« TYPIQUE » ?', 560, 1000, t, f('s05', 0.5), { size: 96, color: TEAL, family: F.display });
      });
      // s06 : conditions (note 2) : cadran fixe, écran 5 min/jour
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'NOTE DE LA FICHE AMAZFIT', 500, 370, t, S('s06'), { size: 38, color: ICE });
        pop(ctx, t, S('s06') + 0.1, 290, 640, () => watch(ctx, 0, 0, 120, { ring: 1, color: LIME, label: '10:08', size: 60 }));
        line(ctx, 'cadran fixe', 640, 600, t, f('s06', 0.2), { size: 56, weight: 900, color: WHITE, dx: 20 });
        pop(ctx, t, f('s06', 0.5), 500, 930, () => { panel(ctx, -380, -110, 760, 220, { border: TEAL });
          text(ctx, 'écran allumé', 0, -45, { size: 48, weight: 800, color: ICE }); text(ctx, '5 min/jour', 0, 45, { size: 70, weight: 900, family: F.mono, color: TEAL }); });
        line(ctx, '(+ poignet levé 100 fois/jour)', 500, 1120, t, f('s06', 0.7), { size: 38, weight: 700, color: C.muted, dx: 0 });
      });
      // s07 : GPS 3 × 30 min par semaine — semainier
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'GPS DANS LES « 14 JOURS »', 500, 370, t, S('s07'), { size: 38, color: LIME });
        const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'], on = [0, 2, 4];
        days.forEach((d, i) => {
          const x = 140 + i * 120, k = ease.back(prog(t, S('s07') + 0.1 + i * 0.07, 0.3)); if (k <= 0.01) return;
          ctx.save(); ctx.translate(x, 640); ctx.scale(k, k);
          roundRect(ctx, -50, -70, 100, 140, 18); ctx.fillStyle = on.includes(i) ? 'rgba(198,244,50,0.9)' : 'rgba(255,255,255,0.08)'; ctx.fill();
          text(ctx, d, 0, -28, { size: 44, weight: 900, color: on.includes(i) ? '#10200a' : ICE });
          if (on.includes(i)) text(ctx, '30′', 0, 34, { size: 40, weight: 900, family: F.mono, color: '#10200a' });
          ctx.restore();
        });
        big(ctx, '3 × 30 min', 500, 900, t, f('s07', 0.5), { size: 110, color: LIME });
        line(ctx, 'par semaine · le reste : GPS éteint', 500, 1040, t, f('s07', 0.65), { size: 42, weight: 800, color: ICE, dx: 0 });
      });
      // s08 : usage intensif 6 jours
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'MÊME FICHE AMAZFIT', 500, 370, t, S('s08'), { size: 38, color: ICE });
        KIT.bars(ctx, [
          { label: 'Usage typique', v: 1, value: '14 jours', color: LIME, t0: S('s08') + 0.05 },
          { label: 'Usage intensif', v: 6 / 14, value: '6 jours', color: VIOLET, t0: f('s08', 0.35) },
        ], 120, 500, 760, t, { rh: 220, size: 46 });
        line(ctx, 'maximums « jusqu\'à », tests du fabricant', 500, 1010, t, f('s08', 0.6), { size: 38, weight: 700, color: C.muted, dx: 0 });
      });
      // s09 : 2e surprise — Huawei Watch GT 5 46 mm
      block(ctx, t, S('s09'), S('s10'), () => {
        stamp(ctx, '2E SURPRISE', 500, 420, t, S('s09'), { size: 80, color: GOLD });
        pop(ctx, t, f('s09', 0.3), 500, 760, () => watch(ctx, 0, 0, 170, { ring: 1, color: TEAL, label: '46 mm', size: 84 }));
        line(ctx, 'HUAWEI WATCH GT 5', 500, 1080, t, f('s09', 0.4), { size: 62, weight: 900, color: WHITE, dx: 0 });
      });
      // s10 : 14 jours optimal → 5 jours écran toujours allumé
      block(ctx, t, S('s10'), S('s11'), () => {
        tag(ctx, 'FICHE HUAWEI · WATCH GT 5 · 46 mm', 500, 370, t, S('s10'), { size: 36, color: ICE });
        KIT.bars(ctx, [
          { label: 'Usage optimal', v: 1, value: '14 jours', color: TEAL, t0: S('s10') + 0.05 },
          { label: 'Écran toujours allumé', v: 5 / 14, value: '5 jours', color: RED, t0: f('s10', 0.5) },
        ], 120, 500, 760, t, { rh: 220, size: 46 });
        line(ctx, 'tests de laboratoire Huawei', 500, 1010, t, f('s10', 0.6), { size: 38, weight: 700, color: C.muted, dx: 0 });
      });
      // s11 : 41 mm → 7 jours
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'MÊME MODÈLE, EN 41 mm', 500, 370, t, S('s11'), { size: 38, color: ICE });
        pop(ctx, t, S('s11') + 0.05, 290, 700, () => watch(ctx, 0, 0, 150, { ring: 1, color: TEAL, label: '14 j', sub: '46 mm', size: 78 }));
        pop(ctx, t, f('s11', 0.45), 720, 720, () => watch(ctx, 0, 0, 120, { ring: 0.5, color: VIOLET, label: '7 j', sub: '41 mm', size: 76 }));
        line(ctx, 'au mieux · usage optimal', 500, 1060, t, f('s11', 0.6), { size: 46, weight: 900, color: VIOLET, dx: 0 });
      });
      // s12 : conseil
      block(ctx, t, S('s12'), S('s13'), () => {
        tag(ctx, 'CONSEIL', 500, 370, t, S('s12'), { size: 46, color: GREEN });
        pop(ctx, t, S('s12') + 0.1, 500, 660, () => { panel(ctx, -390, -170, 780, 340, { border: GREEN });
          text(ctx, 'AUTONOMIE : 14 JOURS*', 0, -80, { size: 56, weight: 900, family: F.mono, color: WHITE, maxWidth: 740 });
          text(ctx, '* usage typique : cadran fixe,', 0, 20, { size: 40, weight: 700, color: ICE, maxWidth: 740 });
          text(ctx, 'GPS 3 × 30 min/semaine…', 0, 80, { size: 40, weight: 700, color: ICE, maxWidth: 740 }); });
        CHR.emo(ctx, 'eyes', 500, 960, 150, t, f('s12', 0.4));
        line(ctx, 'lis la note sous le chiffre', 500, 1100, t, f('s12', 0.55), { size: 52, weight: 900, color: GREEN, dx: 0 });
      });
      // s13 : commentaire
      block(ctx, t, S('s13'), S('s14'), () => { comment(ctx, t, S('s13'), ['Tu recharges', 'tous les combien ?'], { color: TEAL }); });
      // s14 : retour au duel + promesse tenue (GPS en continu jusqu'à 32 h, fiche Amazfit)
      block(ctx, t, S('s14'), S('s15'), () => {
        const k = ease.out(prog(t, f('s14', 0.25), 0.8));
        duel(ctx, t, { lRing: lerp(1, 32 / 336, k), rRing: 1, lLabel: k > 0.5 ? '32 h' : '?', rLabel: '14 j', lSize: 64, rSize: 64, hiLeft: true });
        pop(ctx, t, f('s14', 0.3), 500, 445, () => {
          roundRect(ctx, -420, -110, 840, 220, 30); ctx.fillStyle = 'rgba(6,12,20,0.94)'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = LIME; ctx.stroke();
          text(ctx, 'GPS EN CONTINU', 0, -50, { size: 48, weight: 900, color: ICE });
          text(ctx, "JUSQU'À 32 h", 0, 30, { size: 84, weight: 900, family: F.mono, color: LIME, maxWidth: 800 });
        });
        tag(ctx, 'fiche Amazfit Bip 6 · < 1,5 jour', 500, 1210, t, f('s14', 0.5), { size: 36, color: ICE });
      });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: ['trottinette « 40 km »…', 'dans les conditions du test'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
