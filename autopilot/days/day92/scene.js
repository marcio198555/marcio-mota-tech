// Vidéo 92 — SSD « jusqu'à 7 000 Mo/s » : seulement au début (fiche Kingston KC3000, Sabrent, Sandisk). Chiffres : days/day92/facts.md.
// Thème : sarcelle / cyan « circuit imprimé ». Duel toi (512 Go) / ton collègue (2 To), réponse au milieu, chute après le cache à la fin.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, background, text, chip, captions, brand, block, followCTA, roundRect } = ENG;
  const { RED, GOLD, GREEN, CYAN, WHITE, f, pop, stamp, panel, big, line, tag, comment } = KIT;
  const END = E('s15') + 0.6;
  const TEAL = '#2ee6c8', TEAL2 = '#0f6f68', PCB = '#0d3b3a';
  const N = ' ';
  // teinte du thème par-dessus le fond commun + pistes de circuit
  function theme(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, 'rgba(8,70,72,0.30)'); g.addColorStop(1, 'rgba(2,20,28,0.15)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); ctx.strokeStyle = 'rgba(46,230,200,0.08)'; ctx.lineWidth = 3;
    for (let i = 0; i < 7; i++) {
      const y = 260 + i * 150, x0 = (i * 173) % 300;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 220, y); ctx.lineTo(x0 + 270, y + 50); ctx.lineTo(x0 + 520, y + 50); ctx.stroke();
      const px = x0 + ((t * 120 + i * 90) % 520); ctx.fillStyle = 'rgba(46,230,200,0.25)'; ctx.beginPath(); ctx.arc(Math.min(px, x0 + 520), px < x0 + 220 ? y : y + 50, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // barrette M.2 générique (sans marque)
  function ssd(ctx, x, y, w, o = {}) {
    const h = w * 0.3; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    roundRect(ctx, -w / 2, -h / 2, w, h, 10); ctx.fillStyle = PCB; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = TEAL2; ctx.stroke();
    for (let i = 0; i < 9; i++) { ctx.fillStyle = '#d9b44a'; ctx.fillRect(-w / 2 + 4, -h / 2 + 8 + i * (h - 16) / 9, w * 0.05, (h - 16) / 9 - 4); }
    roundRect(ctx, -w * 0.36, -h * 0.32, w * 0.2, h * 0.64, 6); ctx.fillStyle = '#1a1d24'; ctx.fill();
    for (let k = 0; k < 2; k++) { roundRect(ctx, -w * 0.1 + k * w * 0.24, -h * 0.34, w * 0.2, h * 0.68, 6); ctx.fillStyle = '#20242c'; ctx.fill(); }
    ctx.beginPath(); ctx.arc(w / 2 - 14, 0, 8, 0, Math.PI * 2); ctx.fillStyle = '#071a1a'; ctx.fill(); ctx.strokeStyle = '#9aa'; ctx.lineWidth = 2; ctx.stroke();
    if (o.label) text(ctx, o.label, 0, h / 2 + 62, { size: o.size || 72, weight: 900, color: o.color || WHITE });
    if (o.glow) { ctx.globalAlpha *= 0.4 + 0.3 * Math.sin(o.glow * 6); roundRect(ctx, -w / 2 - 8, -h / 2 - 8, w + 16, h + 16, 14); ctx.strokeStyle = TEAL; ctx.lineWidth = 5; ctx.stroke(); }
    ctx.restore();
  }
  // compteur qui monte vers une valeur sourcée (7 000, fiche Kingston)
  function counter(t, t0, d, from, to) { const k = ease.out(prog(t, t0, d)); return Math.round(lerp(from, to, k) / 50) * 50; }
  const fmt = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, N);
  // barre de vitesse étiquetée
  function speedBar(ctx, x, y, w, frac, label, val, col, t, t0) {
    const k = ease.out(prog(t, t0, 0.6)); if (prog(t, t0, 0.01) <= 0) return;
    text(ctx, label, x, y, { size: 44, weight: 900, color: WHITE, align: 'left' });
    roundRect(ctx, x, y + 34, w, 70, 18); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
    roundRect(ctx, x, y + 34, Math.max(20, w * frac * k), 70, 18); ctx.fillStyle = col; ctx.fill();
    if (k > 0.6) text(ctx, val, x + w, y, { size: 50, family: F.mono, weight: 700, color: col, align: 'right' });
  }
  // grille de cellules mémoire : part = proportion en mode rapide
  function cells(ctx, x, y, cols, rows, sz, part, t, t0) {
    const nFast = Math.round(cols * rows * part);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, k = ease.out(prog(t, t0 + i * 0.008, 0.25)); if (k <= 0.01) continue;
      const fast = i < nFast;
      roundRect(ctx, x + c * (sz + 8), y + r * (sz + 8), sz, sz, 8); ctx.fillStyle = fast ? TEAL : '#23415a'; ctx.globalAlpha = k; ctx.fill(); ctx.globalAlpha = 1;
      text(ctx, fast ? '1' : '3', x + c * (sz + 8) + sz / 2, y + r * (sz + 8) + sz / 2 + 2, { size: sz * 0.5, family: F.mono, weight: 700, color: fast ? '#032' : '#8fb0c8' });
    }
  }
  function duelImage(ctx, t, o = {}) {
    KIT.duelFrame(ctx, { y0: o.y0 || 520, y1: o.y1 || 1060 });
    ssd(ctx, 275, o.sy || 760, 360, { label: '512 Go', glow: o.glowL ? t : 0 });
    ssd(ctx, 725, o.sy || 760, 360, { label: '2 To', glow: o.glowR ? t : 0, color: TEAL });
  }
  window.SCENE = {
    duration: END,
    load: () => CHR.load(['package', 'sparkles', 'magnifying_glass_tilted_left', 'warning', 'stopwatch', 'check_mark_button', 'hourglass_done']),
    draw(ctx, t) {
      background(ctx, t); theme(ctx, t);
      // s01–s02 : image 0 — compteur « 7 000 Mo/s ? » qui monte + duel 512 Go / 2 To + question
      block(ctx, t, 0, S('s03'), () => {
        const v = counter(t, 0, 1.1, 5000, 7000);
        const z = 1 + 0.03 * Math.sin(t * 3);
        ctx.save(); ctx.translate(500, 345); ctx.scale(z, z);
        text(ctx, `${fmt(v)} Mo/s`, -50, 0, { size: 112, weight: 900, family: F.mono, color: GOLD, stroke: 'rgba(0,0,0,0.6)', shadow: GOLD + '66', shadowBlur: 30 });
        text(ctx, '?', 385, 0, { size: 140, weight: 900, color: RED });
        ctx.restore();
        text(ctx, '« jusqu\'à » sur la boîte', 500, 445, { size: 42, weight: 800, color: 'rgba(255,255,255,0.85)' });
        duelImage(ctx, t, { glowR: t > S('s02') });
        KIT.head(ctx, 'QUI COPIE LE PLUS VITE ?', 1135, t, undefined, { size: 56, color: TEAL, bg: 'rgba(46,230,200,0.16)' });
        if (t > S('s02')) stamp(ctx, 'ATTENDS', 790, 610, t, S('s02'), { size: 46, color: GOLD, rot: 0.06 });
      });
      // s03 : promesse — barre de copie, zone rapide, puis « ? »
      block(ctx, t, S('s03'), S('s04'), () => {
        line(ctx, 'À LA FIN :', 500, 380, t, S('s03'), { size: 64, weight: 900, color: GOLD, dx: 0 });
        line(ctx, 'quand la zone rapide', 500, 470, t, f('s03', 0.2), { size: 60, weight: 900, dx: 0 });
        line(ctx, 'est pleine…', 500, 545, t, f('s03', 0.3), { size: 60, weight: 900, dx: 0 });
        const k = ease.inOut(prog(t, f('s03', 0.25), 1.6));
        roundRect(ctx, 120, 700, 760, 110, 24); ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(46,230,200,0.4)'; ctx.stroke();
        roundRect(ctx, 120, 700, 500 * k + 20, 110, 24); ctx.fillStyle = TEAL; ctx.fill();
        text(ctx, 'ZONE RAPIDE', 330, 755, { size: 44, weight: 900, color: '#032', alpha: clamp(k * 3) });
        text(ctx, '?', 760, 758, { size: 100, weight: 900, color: RED, alpha: clamp((k - 0.8) * 5) });
        CHR.emo(ctx, 'hourglass_done', 500, 990, 190, t, f('s03', 0.5));
      });
      // s04 : fiche Kingston — lecture 7 000
      block(ctx, t, S('s04'), S('s06'), () => {
        tag(ctx, 'FICHE OFFICIELLE KINGSTON · KC3000', 500, 330, t, S('s04'), { size: 38, color: TEAL });
        pop(ctx, t, S('s04') + 0.1, 500, 690, () => {
          panel(ctx, -410, -300, 820, 600, { border: 'rgba(46,230,200,0.55)' });
          ssd(ctx, 0, -195, 300, {});
          text(ctx, '512 Go', 0, -70, { size: 64, weight: 900, color: WHITE });
        });
        speedBar(ctx, 140, 830 - 110, 720, 1, 'LECTURE', `7${N}000 Mo/s`, GREEN, t, f('s04', 0.4));
        // s05 : écriture 3 900
        if (t >= S('s05')) {
          speedBar(ctx, 140, 860, 720, 3900 / 7000, 'ÉCRITURE', `3${N}900 Mo/s`, RED, t, S('s05') + 0.1);
          stamp(ctx, `≠ 7${N}000`, 700, 1120, t, f('s05', 0.55), { size: 64 });
          line(ctx, 'Et ce n\'est pas tout', 330, 1120, t, S('s05'), { size: 40, weight: 800, color: GOLD, dx: 0 });
        }
      });
      // s06 : réponse — 2 To écrit à 7 000, presque ×2 sur la fiche
      block(ctx, t, S('s06'), S('s07'), () => {
        tag(ctx, 'ÉCRITURE · FICHE KINGSTON', 500, 330, t, S('s06'), { size: 40, color: GOLD });
        chip(ctx, 'TOI · 512 Go', 140, 450, { size: 38, color: WHITE, align: 'left' });
        speedBar(ctx, 140, 500, 760, 3900 / 7000, '', `3${N}900 Mo/s`, RED, t, S('s06') + 0.15);
        chip(ctx, 'TON COLLÈGUE · 2 To', 140, 700, { size: 38, color: WHITE, align: 'left' });
        speedBar(ctx, 140, 750, 760, 1, '', `7${N}000 Mo/s`, TEAL, t, f('s06', 0.3));
        big(ctx, 'presque ×2', 500, 1030, t, f('s06', 0.6), { size: 120, color: TEAL, family: F.display });
        line(ctx, '(sur la fiche)', 500, 1135, t, f('s06', 0.7), { size: 42, weight: 800, color: 'rgba(255,255,255,0.8)', dx: 0 });
      });
      // s07 : mesuré sur un disque neuf
      block(ctx, t, S('s07'), S('s08'), () => {
        CHR.emo(ctx, 'package', 500, 560, 280, t, S('s07'));
        CHR.emo(ctx, 'sparkles', 680, 440, 130, t, S('s07') + 0.2);
        line(ctx, 'MESURÉ SUR UN', 500, 820, t, S('s07') + 0.1, { size: 64, weight: 900, dx: 0 });
        line(ctx, 'DISQUE NEUF', 500, 910, t, S('s07') + 0.2, { size: 80, weight: 900, color: GOLD, dx: 0 });
        tag(ctx, 'note Kingston : « out-of-box »', 500, 1040, t, f('s07', 0.5), { size: 38 });
      });
      // s08 : le secret
      block(ctx, t, S('s08'), S('s09'), () => {
        line(ctx, 'LE SECRET :', 500, 470, t, S('s08'), { size: 64, weight: 900, color: GOLD, dx: 0 });
        stamp(ctx, 'CACHE SLC', 500, 660, t, S('s08') + 0.2, { size: 120, color: TEAL, rot: -0.04 });
        ssd(ctx, 500, 930, 420, { glow: t });
      });
      // s09 : une partie de la mémoire en mode rapide (1 bit / cellule) — Sabrent
      block(ctx, t, S('s09'), S('s10'), () => {
        tag(ctx, 'SELON SABRENT', 500, 330, t, S('s09'), { size: 40, color: TEAL });
        cells(ctx, 170, 430, 7, 5, 86, 0.3, t, S('s09') + 0.1);
        chip(ctx, '1 = mode rapide (1 bit/cellule)', 140, 950, { size: 38, color: TEAL, align: 'left', alpha: clamp((t - f('s09', 0.5)) * 4) });
        chip(ctx, '3 = mémoire TLC (3 bits/cellule)', 140, 1025, { size: 38, color: '#8fb0c8', align: 'left', alpha: clamp((t - f('s09', 0.65)) * 4) });
      });
      // s10 : surprise — une partie du cache rétrécit quand le disque se remplit (Sandisk), schéma sans échelle
      block(ctx, t, S('s10'), S('s11'), () => {
        stamp(ctx, 'SURPRISE', 500, 350, t, S('s10'), { size: 64, color: GOLD });
        tag(ctx, 'SELON SANDISK (nCache 4.0)', 500, 470, t, S('s10') + 0.1, { size: 38, color: TEAL });
        const k = ease.inOut(prog(t, f('s10', 0.25), 2.2));
        const fill = lerp(0.15, 0.75, k), cache = lerp(0.42, 0.12, k);
        roundRect(ctx, 120, 600, 760, 150, 26); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.stroke();
        roundRect(ctx, 120, 600, 760 * fill, 150, 26); ctx.fillStyle = '#5a6f8a'; ctx.fill();
        roundRect(ctx, 120 + 760 * fill, 600, 760 * cache, 150, 18); ctx.fillStyle = TEAL; ctx.fill();
        text(ctx, 'tes fichiers', 120 + 380 * fill, 675, { size: 40, weight: 800, color: WHITE, maxWidth: 760 * fill - 20 });
        text(ctx, 'cache', 120 + 760 * fill + 380 * cache, 565, { size: 44, weight: 900, color: TEAL });
        line(ctx, 'disque qui se remplit →', 500, 830, t, f('s10', 0.3), { size: 46, weight: 800, dx: 0 });
        line(ctx, 'une partie du cache rétrécit', 500, 910, t, f('s10', 0.55), { size: 52, weight: 900, color: TEAL, dx: 0 });
        tag(ctx, 'schéma, sans échelle', 500, 1030, t, f('s10', 0.4), { size: 36, color: 'rgba(255,255,255,0.8)' });
      });
      // s11 : conseil
      block(ctx, t, S('s11'), S('s12'), () => {
        tag(ctx, "AVANT D'ACHETER", 500, 340, t, S('s11'), { size: 44, color: GREEN });
        pop(ctx, t, S('s11') + 0.15, 500, 700, () => {
          panel(ctx, -390, -250, 780, 500, { border: 'rgba(88,214,141,0.6)' });
          text(ctx, 'COMPARE', 0, -165, { size: 50, weight: 900, color: C.muted });
          text(ctx, 'ÉCRITURE', -40, -40, { size: 96, weight: 900, color: GREEN });
          text(ctx, 'pas seulement', 0, 70, { size: 50, weight: 800, color: WHITE });
          text(ctx, 'la lecture', 0, 150, { size: 64, weight: 900, color: 'rgba(255,255,255,0.7)' });
        });
        CHR.emo(ctx, 'check_mark_button', 790, 610, 120, t, f('s11', 0.4));
      });
      // s12 : commentaire
      block(ctx, t, S('s12'), S('s13'), () => { comment(ctx, t, S('s12'), ['Ton SSD :', 'combien de Go ?'], { color: TEAL }); });
      // s13 : promesse tenue — copie : zone rapide puis chute (schéma sans chiffre)
      block(ctx, t, S('s13'), S('s14'), () => {
        tag(ctx, 'CACHE PLEIN ? · SELON SABRENT', 500, 330, t, S('s13'), { size: 38, color: GOLD });
        const x0 = 140, x1 = 880, yTop = 520, yLow = 820, xc = 520, yb = 960;
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, 440); ctx.lineTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke(); ctx.restore();
        text(ctx, 'vitesse', x0 + 10, 420, { size: 38, weight: 800, color: C.muted, align: 'left' });
        text(ctx, 'données copiées →', x1, yb + 50, { size: 38, weight: 800, color: C.muted, align: 'right' });
        const k = clamp(prog(t, S('s13') + 0.2, 2.0));
        const xe = lerp(x0, x1, k);
        ctx.save(); ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.strokeStyle = TEAL; ctx.beginPath(); ctx.moveTo(x0, yTop); ctx.lineTo(Math.min(xe, xc), yTop); ctx.stroke();
        if (xe > xc) { ctx.strokeStyle = RED; ctx.beginPath(); ctx.moveTo(xc, yTop); ctx.lineTo(Math.min(xe, xc + 40), lerp(yTop, yLow, clamp((xe - xc) / 40))); if (xe > xc + 40) ctx.lineTo(xe, yLow); ctx.stroke(); }
        ctx.restore();
        text(ctx, 'cache', (x0 + xc) / 2, yTop - 45, { size: 44, weight: 900, color: TEAL });
        if (xe > xc + 60) { text(ctx, 'vitesse de base,', 715, yLow + 55, { size: 44, weight: 900, color: RED }); text(ctx, 'plus lente', 715, yLow + 108, { size: 44, weight: 900, color: RED }); }
        tag(ctx, 'schéma, sans échelle', 500, 1060, t, S('s13') + 0.3, { size: 36, color: 'rgba(255,255,255,0.8)' });
      });
      // s14 : retour au duel — la fiche ne dit pas laquelle ; au repos, elle revient
      block(ctx, t, S('s14'), S('s15'), () => {
        duelImage(ctx, t, { glowL: true, glowR: true, sy: 700, y0: 470, y1: 900 });
        stamp(ctx, 'VITESSE APRÈS LE CACHE : ?', 500, 360, t, S('s14'), { size: 50, color: RED, rot: -0.03 });
        line(ctx, 'pas sur la fiche', 500, 960, t, f('s14', 0.2), { size: 50, weight: 900, color: WHITE, dx: 0 });
        line(ctx, 'AU REPOS : ELLE REVIENT', 500, 1080, t, f('s14', 0.55), { size: 56, weight: 900, color: GREEN, dx: 0 });
      });
      block(ctx, t, S('s15'), END + 1, () => followCTA(ctx, t, S('s15'), { when: 'DEMAIN', next: [`la lampe à 10${N}000 lumens…`, 'mesurés comment ?'] }));
      brand(ctx, t);
      captions(ctx, t, { y: 1335, size: 64, maxWidth: 800, x: 515 });
    }
  };
})();
