// Vidéo 81 — clé « USB 3.2 » : peut-être 5 Gbit/s seulement (USB-IF, Kingston DataTraveler Kyson). Chiffres : days/day81/facts.md.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, roundRect } = ENG;
  const { RED, GOLD, GREEN, BLUE, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, calc, bars, head, comment } = KIT;
  const END = E('s15') + 0.6;
  // clé USB dessinée (sans logo), connecteur à gauche
  function stick(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    roundRect(ctx, -250, -50, 110, 100, 8); ctx.fillStyle = '#b9c2d3'; ctx.fill();
    ctx.fillStyle = '#5a6578'; ctx.fillRect(-225, -25, 26, 18); ctx.fillRect(-180, -25, 26, 18);
    roundRect(ctx, -150, -75, 380, 150, 34); ctx.fillStyle = o.body || '#2b3446'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = '#59657e'; ctx.stroke();
    ctx.beginPath(); ctx.arc(190, 0, 18, 0, 7); ctx.fillStyle = '#060b14'; ctx.fill();
    if (o.label) text(ctx, o.label, 20, 4, { size: 52, weight: 900, family: F.mono, color: GOLD, maxWidth: 300 });
    ctx.restore();
  }
  // compteur de débit (barre horizontale)
  function gauge(ctx, x, y, w, frac, col, label, t, t0) {
    const k = ease.out(prog(t, t0, 0.6));
    roundRect(ctx, x, y, w, 56, 28); ctx.fillStyle = '#0a1120'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#3a4560'; ctx.stroke();
    const iw = Math.max(0, (w - 12) * frac * k); if (iw > 4) { roundRect(ctx, x + 6, y + 6, iw, 44, 22); ctx.fillStyle = col; ctx.fill(); }
    if (label) text(ctx, label, x + w / 2, y + 100, { size: 44, weight: 900, color: col });
  }
  const L = '#58d68d', R = '#ff5a5f';
  function split(ctx, lt, rt) {
    ctx.save(); ctx.globalAlpha *= 0.14; ctx.fillStyle = L; ctx.fillRect(0, 440, 500, 760); ctx.fillStyle = R; ctx.fillRect(500, 440, 580, 760); ctx.restore();
    ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 450); ctx.lineTo(500, 1190); ctx.stroke(); ctx.restore();
    chip(ctx, 'TOI', 275, 500, { color: WHITE, size: 38 }); chip(ctx, 'TON COLLÈGUE', 725, 500, { color: WHITE, size: 36 });
    if (lt) chip(ctx, lt, 275, 575, { color: L, size: 36 });
    if (rt) chip(ctx, rt, 725, 575, { color: R, size: 36 });
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
  // trottinette dessinée (sans logo), centrée sur le plateau
  function scooter(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const spin = o.spin || 0;
    ctx.lineCap = 'round';
    // plateau
    roundRect(ctx, -170, -18, 330, 36, 18); ctx.fillStyle = '#2b3446'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#4a5670'; ctx.stroke();
    // garde-boue arrière + colonne
    ctx.strokeStyle = '#8c97ad'; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(150, 0); ctx.lineTo(200, -30); ctx.lineTo(160, -330); ctx.stroke();
    ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(105, -335); ctx.lineTo(215, -325); ctx.stroke();
    // lampe avant
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(176, -250, 9, 0, 7); ctx.fill();
    // roues
    for (const wx of [-180, 210]) {
      ctx.save(); ctx.translate(wx, 40);
      ctx.beginPath(); ctx.arc(0, 0, 58, 0, 7); ctx.fillStyle = '#0d121c'; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = '#3b455a'; ctx.stroke();
      ctx.rotate(spin); ctx.lineWidth = 6; ctx.strokeStyle = '#7d889f';
      for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-32, 0); ctx.lineTo(32, 0); ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
  }
  function road(ctx, y, t, speed = 1) {
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 6; ctx.setLineDash([60, 40]); ctx.lineDashOffset = t * 300 * speed;
    ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(1000, y); ctx.stroke(); ctx.restore();
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['thinking_face', 'magnifying_glass_tilted_left', 'package', 'label', 'warning', 'stopwatch', 'laptop', 'link', 'check_mark_button', 'clipboard']),
    draw(ctx, t) {
      background(ctx, t);
      // s01-s02 — image 0 : duel « 20 Gbit/s ? » : toi tu y crois, ton collègue lit la fiche
      block(ctx, t, 0, S('s03'), () => {
        text(ctx, 'MÊME CLÉ « USB 3.2 »', 500, 335, { size: 46, family: F.display, weight: 900, color: WHITE });
        const b = 1 + 0.07 * Math.sin(t * 5);
        ctx.save(); ctx.translate(500, 408); ctx.scale(b, b); text(ctx, '20 Gbit/s ?', 0, 0, { size: 72, family: F.mono, weight: 900, color: GOLD, stroke: 'rgba(0,0,0,0.6)' }); ctx.restore();
        split(ctx, 'TU Y CROIS', 'IL LIT LA FICHE');
        stick(ctx, 285, 760, 0.8 + 0.01 * Math.sin(t * 2), { label: 'USB 3.2' });
        stick(ctx, 740, 760, 0.8 + 0.01 * Math.sin(t * 2 + 1), { label: 'USB 3.2' });
        CHR.emo(ctx, 'thinking_face', 265, 1000, 170, t, -1);
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 735, 1000, 170, t, -1);
        if (t >= S('s02')) head(ctx, 'QUI A RAISON ?', 1195, t, S('s02') + 0.3, { size: 52 });
      });
      // s03 — promesse
      block(ctx, t, S('s03'), S('s04'), () => {
        tag(ctx, 'À LA FIN', 500, 380, t, S('s03'), { size: 46, color: GOLD });
        CHR.emo(ctx, 'package', 500, 660, 280, t, S('s03') + 0.1);
        CHR.emo(ctx, 'magnifying_glass_tilted_left', 700, 780, 170, t, f('s03', 0.35));
        line(ctx, 'QUOI CHERCHER SUR LA BOÎTE', 500, 980, t, f('s03', 0.45), { size: 54, weight: 900, color: GOLD, dx: 0 });
        line(ctx, "AVANT D'ACHETER", 500, 1070, t, f('s03', 0.6), { size: 50, weight: 900, color: CYAN, dx: 0 });
      });
      // s04 — USB-IF : 3 vitesses
      block(ctx, t, S('s04'), S('s05'), () => {
        tag(ctx, "USB-IF · L'ORGANISME DE LA NORME", 500, 360, t, S('s04'), { size: 40, color: GOLD });
        big(ctx, 'USB 3.2', 500, 560, t, S('s04') + 0.1, { size: 130, color: WHITE });
        big(ctx, '= 3 VITESSES', 500, 760, t, f('s04', 0.5), { size: 100, color: CYAN });
      });
      // s05 — Gen 1 / Gen 2 / Gen 2x2
      block(ctx, t, S('s05'), S('s06'), () => {
        tag(ctx, 'USB 3.2 · SELON USB-IF', 500, 360, t, S('s05'), { size: 42, color: GOLD });
        [['Gen 1', '5 Gbit/s', 0.25, RED, 0.0], ['Gen 2', '10 Gbit/s', 0.5, GOLD, 0.33], ['Gen 2x2', '20 Gbit/s', 1, GREEN, 0.62]].forEach(([g, v, fr, col, u], i) => {
          const t0 = f('s05', u), y = 500 + i * 200;
          line(ctx, g, 220, y + 28, t, t0, { size: 52, weight: 900, color: WHITE, dx: 0 });
          if (t >= t0) gauge(ctx, 360, y, 560, fr, col, null, t, t0);
          line(ctx, v, 640, y + 110, t, t0 + 0.2, { size: 50, weight: 900, color: col, dx: 0 });
        });
      });
      // s06 — pas pour les boîtes
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'USB-IF (GUIDE, JANV. 2024)', 500, 360, t, S('s06'), { size: 40, color: C.muted });
        pop(ctx, t, S('s06') + 0.1, 500, 640, () => { panel(ctx, -380, -170, 760, 340);
          text(ctx, '« USB 3.2 »', 0, -60, { size: 90, weight: 900, family: F.mono, color: WHITE });
          text(ctx, 'pas fait pour les boîtes', 0, 50, { size: 48, weight: 800, color: RED });
          text(ctx, 'ni la pub', 0, 115, { size: 48, weight: 800, color: RED }); });
        CHR.emo(ctx, 'warning', 500, 960, 170, t, f('s06', 0.55));
      });
      // s07 — exemple Kingston Kyson
      block(ctx, t, S('s07'), S('s08'), () => {
        tag(ctx, 'KINGSTON DATATRAVELER KYSON', 500, 360, t, S('s07'), { size: 40, color: GOLD });
        stick(ctx, 500, 600, 1, { body: '#3a3f4a' });
        pop(ctx, t, f('s07', 0.45), 500, 900, () => { panel(ctx, -360, -80, 720, 160);
          text(ctx, 'FICHE : USB 3.2 Gen 1', 0, 4, { size: 54, weight: 900, color: WHITE }); });
      });
      // s08 — 5 Gbit/s max
      block(ctx, t, S('s08'), S('s09'), () => {
        tag(ctx, 'Gen 1 = SIGNAL MAXIMUM', 500, 380, t, S('s08'), { size: 46, color: CYAN });
        big(ctx, '5 Gbit/s', 500, 620, t, S('s08') + 0.1, { size: 150, color: RED });
        line(ctx, 'AU MAXIMUM', 500, 790, t, f('s08', 0.5), { size: 60, weight: 900, color: WHITE, dx: 0 });
        gauge(ctx, 220, 900, 640, 0.25, RED, 'sur 20', t, f('s08', 0.4));
      });
      // s09 — lecture 200 Mo/s
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, 'LECTURE · FICHE KINGSTON', 500, 360, t, S('s09'), { size: 42, color: GOLD });
        CHR.emo(ctx, 'stopwatch', 500, 560, 200, t, S('s09') + 0.05);
        line(ctx, "JUSQU'À", 500, 740, t, f('s09', 0.35), { size: 50, weight: 900, color: C.muted, dx: 0 });
        big(ctx, '200 Mo/s', 500, 880, t, f('s09', 0.4), { size: 140, color: WHITE });
      });
      // s10 — × 8 = 1,6 Gbit/s
      block(ctx, t, S('s10'), S('s11'), () => {
        calc(ctx, ['200 Mo/s × 8', '= 1,6 Gbit/s'], 500, 540, t, [S('s10') + 0.05, f('s10', 0.3)], { lastSize: 110, color: GOLD });
        gauge(ctx, 220, 780, 640, 1.6 / 20, GOLD, 'loin de 20 Gbit/s', t, f('s10', 0.3));
        pop(ctx, t, f('s10', 0.5), 500, 1040, () => { panel(ctx, -400, -70, 800, 140, { border: GREEN }); text(ctx, 'TON COLLÈGUE A RAISON ✓', 0, -12, { size: 48, weight: 900, color: GREEN }); text(ctx, 'sur cette clé : 5 max., pas 20', 0, 40, { size: 38, weight: 800, color: WHITE }); });
      });
      // s11 — écriture 60 Mo/s
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, 'ÉCRITURE · DÈS 128 Go', 500, 360, t, S('s11'), { size: 44, color: CYAN });
        tag(ctx, "JUSQU'À", 500, 470, t, S('s11') + 0.1, { size: 44 });
        big(ctx, '60 Mo/s', 500, 620, t, S('s11') + 0.15, { size: 150, color: CYAN });
        line(ctx, 'lecture : 200 Mo/s', 500, 820, t, f('s11', 0.5), { size: 50, weight: 900, color: C.muted, dx: 0 });
      });
      // s12 — 2e piège : port plus lent
      block(ctx, t, S('s12'), S('s13'), () => {
        stamp(ctx, '2e PIÈGE', 500, 380, t, S('s12'), { size: 80, color: GOLD });
        CHR.emo(ctx, 'laptop', 300, 700, 240, t, S('s12') + 0.1);
        stick(ctx, 700, 700, 0.6, { body: '#3a3f4a' });
        line(ctx, 'PORT PLUS LENT', 500, 920, t, f('s12', 0.4), { size: 56, weight: 900, color: WHITE, dx: 0 });
        line(ctx, '→ ELLE SUIT LE PLUS LENT', 500, 1020, t, f('s12', 0.6), { size: 52, weight: 900, color: RED, dx: 0 });
      });
      // s13 — conseil
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 360, t, S('s13'), { size: 46, color: GREEN });
        pop(ctx, t, S('s13') + 0.1, 500, 720, () => { panel(ctx, -380, -230, 760, 460);
          text(ctx, 'CHERCHE LES Mo/s', 0, -140, { size: 50, weight: 900, color: GOLD }); });
        line(ctx, '✓ LECTURE', 500, 700, t, f('s13', 0.35), { size: 60, weight: 900, color: WHITE, dx: 0 });
        line(ctx, '✓ ÉCRITURE', 500, 810, t, f('s13', 0.5), { size: 60, weight: 900, color: WHITE, dx: 0 });
      });
      block(ctx, t, S('s14'), S('s15'), () => { comment(ctx, t, S('s14'), ['Ta clé', 'écrit à combien', 'de Mo/s ?'], { color: GOLD }); });
      block(ctx, t, S('s15'), END + 1, () => igEnd(ctx, t, S('s15')));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
