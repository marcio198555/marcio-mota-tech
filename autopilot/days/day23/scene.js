// Vidéo 23 — format A « Les objets balancent » : le robot aspirateur balance ce qu'on écrit sur sa boîte (« 25 000 Pa »).
// Robot et boîte fictifs (personnage) ; 25 000 Pa = ordre de grandeur des valeurs annoncées en 2026 (TechRadar : jusqu'à 35 000 Pa).
// Sources : TechRadar, Ruth Hamilton, 23.01.2026, « The 3 biggest lies robot vacuum brands are telling us » :
// chiffres d'aspiration en Pa ; la valeur annoncée correspond au réglage le plus fort ; le nettoyage n'a pas progressé
// au même rythme ; « 10,000Pa was plenty for a really capable clean » ; la brosse et la navigation comptent.
// Le pascal (Pa) est l'unité de pression du Système international.
(function () {
  const { C, F, clamp, lerp, ease, prog, S, E, segById, text, roundRect, chip, captions, brand, block, followCTA } = ENG;
  const { load, emo, room, camera, robotVacuum, SIDE_BRUSH, box, bubble, seriesChip, gauge } = CHR;
  const END = E('s07') + 0.6;
  const W80 = 'rgba(255,255,255,0.85)';
  function wordAt(id, word, frac) {
    const sg = segById(id) || {}; const w = (sg.words || []).find(x => x[2] && x[2].replace(/[.,!?  :]/g, '').toLowerCase().startsWith(word));
    return w ? w[0] : S(id) + (E(id) - S(id)) * frac;
  }
  const t8000 = wordAt('s01', '25', 0.3), tEnorme = wordAt('s01', 'énorme', 0.8), tBoite = wordAt('s01', 'boîte', 0.6);
  const tPression = wordAt('s02', 'pression', 0.35), tPropre = wordAt('s02', 'propre', 0.9);
  const tMax = wordAt('s03', 'maximum', 0.4), tJours = wordAt('s03', 'jours', 0.9);
  const tExplosent = wordAt('s04', 'explosent', 0.55), tPas = wordAt('s04', 'pas', 0.85);
  const t10000 = wordAt('s05', '10', 0.15), tAssez = wordAt('s05', 'assez', 0.6);
  const tBrosse = wordAt('s06', 'brosse', 0.4), tNav = wordAt('s06', 'navigation', 0.8);
  const PUNCH = [[t8000, 0.07], [tEnorme, 0.1], [tPression, 0.05], [tMax, 0.07], [tExplosent, 0.09], [t10000, 0.07], [tBrosse, 0.05]];

  function outline(ctx, str, x, y, o) {
    text(ctx, str, x, y, { stroke: 'rgba(10,12,20,0.92)', strokeWidth: 16, ...o });
  }
  function modes(ctx, t, t0) {
    const k = ease.back(prog(t, t0, 0.4)); if (k <= 0.001) return;
    ctx.save(); ctx.translate(700, 650); ctx.scale(k, k);
    roundRect(ctx, -220, -250, 440, 500, 40); ctx.fillStyle = 'rgba(11,18,32,0.92)'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(230,198,106,0.6)'; ctx.stroke();
    text(ctx, 'MODES', 0, -200, { size: 40, family: F.mono, weight: 700, color: C.gold2 });
    [['Silencieux', 0], ['Standard', 1], ['Turbo', 2], ['MAX', 3]].forEach(([lb, i]) => {
      const y = -120 + i * 100;
      const isMax = i === 3, isStd = i === 1;
      const on = (isMax && t >= tMax - 0.1) || (isStd && t >= tJours - 0.4);
      roundRect(ctx, -200, y - 38, 400, 76, 22);
      ctx.fillStyle = on ? (isMax ? 'rgba(200,32,48,0.95)' : 'rgba(63,180,122,0.95)') : 'rgba(255,255,255,0.08)'; ctx.fill();
      text(ctx, lb, -178, y + 2, { size: 40, weight: 800, color: C.white, align: 'left' });
      if (isMax && on) text(ctx, '25\u202f000\u202fPa', 182, y + 2, { size: 40, family: F.mono, weight: 700, color: C.white, align: 'right' });
    });
    ctx.restore();
    if (t >= tJours - 0.4) outline(ctx, 'tous les jours ?', 715, 945, { size: 46, weight: 900, color: '#7fe0a8', alpha: clamp((t - tJours + 0.4) * 4) });
  }
  function quoteCard(ctx, t, t0) {
    const k = ease.back(prog(t, t0, 0.4)); if (k <= 0.001) return;
    ctx.save(); ctx.translate(600, 640); ctx.scale(k, k);
    roundRect(ctx, -330, -250, 660, 500, 36); ctx.fillStyle = '#ffffff'; ctx.fill();
    text(ctx, "D'APRÈS TECHRADAR", 0, -205, { size: 44, weight: 900, color: '#2a2f3a', maxWidth: 620 });
    text(ctx, '23.01.2026', 0, -156, { size: 40, family: F.mono, weight: 700, color: '#5a6170' });
    // illustration : chiffres annoncés contre nettoyage (pas de valeurs)
    const x0 = -280, y0 = 140, w = 560, h = 220;
    ctx.strokeStyle = '#c3c8d2'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y0 - h); ctx.lineTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.stroke();
    const kr = ease.inOut(prog(t, t0 + 0.4, 1.2)), kg = ease.inOut(prog(t, t0 + 0.8, 1.2));
    ctx.lineCap = 'round'; ctx.lineWidth = 12;
    ctx.strokeStyle = '#c82030'; ctx.beginPath(); ctx.moveTo(x0 + 10, y0 - 40);
    for (let i = 1; i <= 20; i++) { const u = i / 20; if (u > kr) break; ctx.lineTo(x0 + 10 + u * (w - 30), y0 - 40 - Math.pow(u, 1.8) * (h - 60)); } ctx.stroke();
    ctx.strokeStyle = '#3fb47a'; ctx.beginPath(); ctx.moveTo(x0 + 10, y0 - 40);
    for (let i = 1; i <= 20; i++) { const u = i / 20; if (u > kg) break; ctx.lineTo(x0 + 10 + u * (w - 30), y0 - 40 - u * 70); } ctx.stroke();
    if (kr > 0.9) text(ctx, 'chiffres annoncés', x0 + w - 40, y0 - h - 6, { size: 36, weight: 800, color: '#c82030', align: 'right' });
    if (kg > 0.9) text(ctx, 'nettoyage', x0 + w - 20, y0 - 62, { size: 36, weight: 800, color: '#2f9a63', align: 'right' });
    text(ctx, 'Illustration, pas des mesures', 0, 202, { size: 40, weight: 700, color: '#3a3f4b', maxWidth: 620 });
    ctx.restore();
  }
  function scanRays(ctx, t, x, y, k) {
    if (k <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= 0.55 * k; ctx.translate(x, y);
    for (let i = 0; i < 3; i++) {
      const a = t * 2.4 + i * 2.1;
      const gr = ctx.createRadialGradient(0, 0, 10, 0, 0, 520); gr.addColorStop(0, 'rgba(95,225,255,0.9)'); gr.addColorStop(1, 'rgba(95,225,255,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 520, a, a + 0.32); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function callout(ctx, label, x, y, tx, ty, k) {
    if (k <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= clamp(k * 1.5);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 7; ctx.setLineDash([2, 14]); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, tx, k), lerp(y, ty, k)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(tx, ty, 12, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    const kk = ease.back(clamp(k * 1.2));
    ctx.save(); ctx.translate(x, y); ctx.scale(kk, kk); chip(ctx, label, 0, 0, { color: C.white, size: 40, bg: 'rgba(200,32,48,0.95)', border: '#ffffff' }); ctx.restore();
  }

  // le robot roule sur le tapis (va-et-vient lent), tremble en mode MAX, sursaute sur « explosent »
  const RS = 1.15;
  function robotAt(t) {
    let x = 540 + 55 * Math.sin(t * 0.85 - 0.4), y = 1000;
    const lean = 0.03 * Math.cos(t * 0.85 - 0.4);
    const dm = t - (tMax - 0.1); if (dm >= 0 && dm < 0.8) x += Math.sin(dm * 70) * 7 * (1 - dm / 0.8);
    const de = t - (tExplosent - 0.1); if (de >= 0 && de < 0.4) y -= 45 * Math.sin(Math.PI * de / 0.4);
    return [x, y, lean];
  }

  window.SCENE = {
    duration: END,
    load: () => load(['person_raising_hand', 'red_question_mark', 'woman_technologist', 'check_mark_button', 'thumbs_up', 'exploding_head', 'megaphone']),
    draw(ctx, t) {
      const inEnd = t >= S('s07') - 0.05;
      camera(ctx, t, PUNCH, { cy: 1000, base: 0.04 * clamp(t / S('s07')) });   // lente avancée + zooms sur les mots forts
      room(ctx, t);
      const [RX, RY, lean] = robotAt(t);

      // humeur et regard du robot selon le moment (méfiant dès l'image 0 : il regarde sa boîte de travers)
      let mood = 'neutre', look = [0, 0], sq = 0;
      if (t < S('s02')) { look = t < tEnorme - 0.1 ? [-0.9, -0.7] : [0, 0]; mood = 'malin'; }
      else if (t < S('s03')) { look = t < tPropre - 0.3 ? [0.9, -0.6] : [0, 0]; mood = t > tPropre - 0.3 ? 'fache' : 'neutre'; }
      else if (t < S('s04')) { look = [0.9, -0.5]; mood = 'malin'; }
      else if (t < S('s05')) { look = [0.6, -0.8]; mood = t > tPas - 0.2 ? 'fache' : t > tExplosent - 0.15 ? 'surpris' : 'neutre'; }
      else if (t < S('s06')) { mood = 'content'; }
      else if (t < S('s07')) { mood = 'content'; look = t < tNav - 0.3 ? [-0.8, 0.6] : [0.7, -0.7]; }
      else { mood = 'content'; }
      PUNCH.forEach(([tp, a]) => { const d = t - tp; if (d >= 0 && d < 0.5) sq = Math.max(sq, 0.06 * Math.sin(d * 18) * Math.exp(-d * 6)); });

      // 1. la boîte « 25 000 Pa » (visible dès l'image 0)
      if (t < S('s02') + 0.15) {
        const kout = 1 - ease.in(prog(t, S('s02') - 0.1, 0.25));
        const wig = t > t8000 - 0.1 ? Math.sin((t - t8000) * 22) * Math.exp(-(t - t8000) * 4) * 0.12 : 0;
        const kz = 1 + (t > t8000 - 0.1 ? 0.12 * Math.exp(-Math.max(0, t - t8000) * 3) : 0);
        if (kout > 0.001) box(ctx, 220, 650, 0.86 * kout * kz, '25 000 Pa', 'ASPIRATION', { rot: -0.06 + wig, subSize: 46 });
      }
      // 2. la cliente demande ; le pascal mesure une pression
      if (t >= S('s02') - 0.05 && t < S('s03')) {
        emo(ctx, 'person_raising_hand', 880, 700, 240, t, S('s02') - 0.05);
        bubble(ctx, 830, 580, ['25 000 Pa', '= sol super propre ?'], t, S('s02') + 0.1, { side: 'droite', size: 42 });
        const kg = ease.back(prog(t, tPression - 0.15, 0.4));
        if (kg > 0.001) {
          ctx.save(); ctx.translate(250, 740); ctx.scale(kg, kg); gauge(ctx, 0, 0, 120, 0.15 + 0.7 * ease.out(prog(t, tPression, 0.8)), 'Pa'); ctx.restore();
          outline(ctx, 'PRESSION', 250, 575, { size: 56, weight: 900, color: C.white, alpha: clamp(kg) });
        }
      }
      // 3. modes : MAX = le chiffre de la boîte
      if (t >= S('s03') && t < S('s04')) modes(ctx, t, S('s03') + 0.05);
      // 4. la testeuse : illustration chiffres contre nettoyage
      if (t >= S('s04') && t < S('s05')) {
        quoteCard(ctx, t, S('s04') + 0.05);
        emo(ctx, 'woman_technologist', 140, 520, 200, t, S('s04') + 0.25);
        if (t > tExplosent - 0.1) emo(ctx, 'exploding_head', 140, 760, 160, t, tExplosent - 0.1);
      }
      // 5. 10 000 Pa : déjà largement assez (selon TechRadar)
      if (t >= S('s05') && t < S('s06')) {
        const k = ease.back(prog(t, t10000 - 0.2, 0.4));
        if (k > 0.001) { ctx.save(); ctx.translate(540, 560); ctx.scale(k, k); outline(ctx, '10 000 Pa', 0, 0, { size: 150, weight: 900, color: C.gold2 }); ctx.restore(); }
        if (t > tAssez - 0.3) {
          const ka = clamp((t - tAssez + 0.3) * 4);
          outline(ctx, 'DÉJÀ LARGEMENT ASSEZ', 540, 720, { size: 64, weight: 900, color: '#7fe0a8', maxWidth: 900, alpha: ka });
          outline(ctx, 'selon TechRadar', 540, 805, { size: 46, weight: 800, color: C.white, alpha: ka });
          emo(ctx, 'check_mark_button', 880, 400, 170, t, tAssez - 0.3);
        }
        emo(ctx, 'woman_technologist', 140, 860, 170, t);
      }
      // 6. brosse et navigation (les flèches suivent le robot)
      if (t >= S('s06') && t < S('s07')) {
        scanRays(ctx, t, RX + 120 * RS, RY - 36 * RS - 30, prog(t, tNav - 0.3, 0.4));
        callout(ctx, 'BROSSE', 200, 1270, RX + SIDE_BRUSH[0] * RS, RY + SIDE_BRUSH[1] * RS, ease.out(prog(t, tBrosse - 0.25, 0.4)));
        callout(ctx, 'NAVIGATION', 760, 640, RX + 120 * RS, RY - 70 * RS, ease.out(prog(t, tNav - 0.35, 0.4)));
      }

      // le robot (personnage principal), penché dans le sens où il roule
      if (!inEnd) {
        ctx.save(); ctx.translate(RX, RY + 80); ctx.rotate(lean); ctx.translate(-RX, -RY - 80);
        robotVacuum(ctx, RX, RY, RS, t, { squash: sq, face: { mood, look } });
        ctx.restore();
      }
      ctx.restore(); // caméra

      if (inEnd) {
        // voile plein écran (hors caméra : aucun liseré), puis carton de fin ; une seule étiquette de série
        ctx.fillStyle = `rgba(3,4,8,${Math.min(0.8, (t - S('s07') + 0.05) * 3)})`; ctx.fillRect(0, 0, 1080, 1920);
        robotVacuum(ctx, 540, 1190, 0.62, t, { face: { mood, look: [0, -0.4] } });
        followCTA(ctx, t, S('s07'), { when: 'BIENTÔT', next: ["d'autres objets", 'vont tout balancer'] });
      } else {
        if (!(t >= S('s04') && t < S('s05'))) brand(ctx, t);   // pas de « JE MESURE TOUT » sur la carte TechRadar
        if (t < S('s02') - 0.05) seriesChip(ctx, t);              // disparaît avant la bulle de la cliente
        captions(ctx, t, { y: 1385, size: 62, maxWidth: 820, x: 540, fromZero: true });
      }
    }
  };
})();
