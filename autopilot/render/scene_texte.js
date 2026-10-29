// Format T « texte seul » (sans voix, en boucle) : ce qui est écrit EN GROS → ce qui est écrit EN PETIT.
// Scène générique : le contenu et les instants viennent de la timeline produite par tools/texte_cues.py
// (window.TL.spec = days/dayNN/texte.json, window.TL.times = instants calculés).
// Mise en page : titre lisible dès l'image 0 avec la 1re ligne « en gros » ; une ligne de plus toutes les ~2,4 s ;
// chaque « en petit » arrive par un balayage avec un astérisque rouge ; la source est dans le bandeau du haut.
(function () {
  const { C, F, clamp, lerp, ease, prog, background, text, roundRect, chip, brand, font, TL } = ENG;
  const SP = TL.spec, TM = TL.times;
  const X0 = 110, XMAX = 920;               // à gauche de la zone des boutons TikTok (x > 940)
  const W80 = 'rgba(255,255,255,0.8)';
  const n = SP.rows.length;
  const SZ = SP.size || 46;                  // taille des lignes (≥ 40 px)
  const LH = Math.round(SZ * 1.2);
  const maxLines = Math.max(...SP.rows.map(r => r.petit.split('|').length));
  const Y0 = SP.y0 || 660, DY = SP.dy || (maxLines > 1 ? 212 : 160);  // 4 lignes max si « en petit » tient sur 2 lignes

  function row(ctx, t, r, i) {
    const y = Y0 + i * DY;
    const [te, tt] = TM.rows[i];
    const ka = i === 0 ? 1 : ease.out(prog(t, te, 0.28));
    if (ka <= 0.001) return;
    // la ligne la plus récente reste vive, les précédentes s'atténuent un peu ; tout revient à la fin
    const newest = TM.rows.reduce((m, rr, j) => (t >= rr[0] ? j : m), 0);
    const dim = (i < newest && t < TM.cta) ? 0.72 : 1;
    const kt = ease.out(prog(t, tt, 0.32));

    // « en gros » : étiquette dorée
    ctx.save(); ctx.globalAlpha *= ka * dim; ctx.translate((1 - ka) * -40, 0);
    ctx.font = font(700, SZ, F.mono);
    const w = Math.min(XMAX - X0, ctx.measureText(r.gros + '*').width + 56);
    roundRect(ctx, X0, y - SZ * 0.82, w, SZ * 1.64, 20); ctx.fillStyle = 'rgba(201,168,76,0.13)'; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.stroke();
    text(ctx, r.gros, X0 + 28, y + 1, { size: SZ, family: F.mono, weight: 700, color: C.gold2, align: 'left', maxWidth: w - 56 });
    if (kt > 0.001) {
      ctx.font = font(700, SZ, F.mono);
      const gx = X0 + 28 + Math.min(ctx.measureText(r.gros).width, w - 56);
      const ks = ease.back(prog(t, tt, 0.3));
      ctx.save(); ctx.translate(gx + 14, y - 6); ctx.scale(ks, ks);
      text(ctx, '*', 0, 0, { size: SZ + 10, family: F.mono, weight: 700, color: C.red2 });
      ctx.restore();
    }
    ctx.restore();

    // « en petit » : balayage de gauche à droite
    if (kt > 0.001) {
      const lines = r.petit.split('|').map(s => s.trim());
      ctx.save(); ctx.globalAlpha *= dim;
      ctx.beginPath(); ctx.rect(X0 - 12, y + SZ * 0.9, (XMAX - X0 + 24) * clamp(kt * 1.12), LH * lines.length + 24); ctx.clip();
      text(ctx, '*', X0 + 4, y + SZ * 0.9 + LH * 0.5 + 6, { size: SZ, family: F.mono, weight: 700, color: C.red2, align: 'left' });
      lines.forEach((ln, j) => text(ctx, ln, X0 + 40, y + SZ * 0.9 + LH * (j + 0.5) + 6,
        { size: SZ, weight: 800, color: C.white, align: 'left', maxWidth: XMAX - X0 - 40 }));
      ctx.restore();
    }
  }

  window.SCENE = {
    duration: TM.end,
    draw(ctx, t) {
      background(ctx, t);
      brand(ctx, t);
      chip(ctx, SP.chip, 540, 365, { color: C.gold, size: 34 });   // le bandeau porte la source (« SOURCE : … »)
      // accroche : complète dès l'image 0, léger zoom pendant 3 s
      const z = 1 + 0.035 * ease.inOut(prog(t, 0, 3));
      ctx.save(); ctx.translate(540, 470); ctx.scale(z, z);
      text(ctx, SP.title[0], 0, 0, { size: SP.titleSize || 92, weight: 900, color: C.white, maxWidth: 880 });
      ctx.restore();
      if (SP.title[1]) text(ctx, SP.title[1], 540, 552, { size: 40, weight: 700, color: C.gold2, maxWidth: 800 });

      SP.rows.forEach((r, i) => row(ctx, t, r, i));

      // appel à enregistrer, sous la dernière ligne (au-dessus de la zone des légendes TikTok, y < 1540)
      const yb = Y0 + (n - 1) * DY + SZ * 0.9 + LH * maxLines + 6 + 60;
      const kc = ease.back(prog(t, TM.cta, 0.35));
      if (kc > 0.001 && SP.cta) {
        ctx.save(); ctx.translate(540, Math.min(yb, 1505)); ctx.scale(kc, kc);
        text(ctx, SP.cta, 0, 0, { size: 42, weight: 800, color: C.gold2, maxWidth: 820 });
        ctx.restore();
      }
    }
  };
})();
