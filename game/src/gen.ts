// Level generator.
//
// Levels are built in the order they will be solved. At each step we pick a
// cell that is the last one still standing on its row or column in some
// direction: nothing remains in front of it, so an arrow whose head sits there
// can leave once the arrows built before it are gone. Its body is then drawn
// backwards through the cells that remain. Playing the arrows in the order
// they were built always clears the board, so every level is solvable.

import { RNG, hash32 } from './rng';
import { buildMask } from './shapes';
import { levelStats } from './board';
import { DX, DY } from './types';
import type { Arrow, Dir, Difficulty, Level, ShapeName } from './types';

export interface GenParams {
  n: number;
  w: number;
  h: number;
  shape: ShapeName;
  difficulty: Difficulty;
  lenMin: number;
  lenMax: number;
  /** Share of the arrows that should be free when the level starts. */
  freeTarget: number;
  /** 0..1: how much bodies prefer going straight over turning. */
  straight: number;
  seed: number;
}

interface Cand {
  head: number;
  dir: Dir;
  deps: number;
}

const ATTEMPTS = 10;

function generateOnce(p: GenParams, seed: number): Level {
  const { w, h } = p;
  const rng = new RNG(seed);
  const mask = buildMask(p.shape, w, h, rng);
  const rem = mask.slice();
  let remCount = 0;
  for (let i = 0; i < rem.length; i++) remCount += rem[i];
  const cellCount = remCount;
  const owner = new Int16Array(w * h).fill(-1);
  const arrows: Arrow[] = [];
  const avgLen = (p.lenMin + p.lenMax) / 2;
  const targetFree = Math.max(1, Math.round((p.freeTarget * cellCount) / avgLen));
  let freeCount = 0;
  const dirCount = [0, 0, 0, 0];
  const mark = new Int32Array(Math.max(8, cellCount)).fill(-1);
  let stamp = 0;

  const inb = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h;

  const remDegree = (c: number): number => {
    const x = c % w;
    const y = (c - x) / w;
    let d = 0;
    if (x > 0 && rem[c - 1]) d++;
    if (x < w - 1 && rem[c + 1]) d++;
    if (y > 0 && rem[c - w]) d++;
    if (y < h - 1 && rem[c + w]) d++;
    return d;
  };

  /** Number of arrows already built that sit in front of this head. */
  const countDeps = (head: number, dir: Dir): number => {
    stamp++;
    let x = head % w;
    let y = (head - x) / w;
    let n = 0;
    for (;;) {
      x += DX[dir];
      y += DY[dir];
      if (!inb(x, y)) break;
      const o = owner[y * w + x];
      if (o >= 0 && mark[o] !== stamp) {
        mark[o] = stamp;
        n++;
      }
    }
    return n;
  };

  const collect = (): Cand[] => {
    const out: Cand[] = [];
    for (let y = 0; y < h; y++) {
      let minX = -1;
      let maxX = -1;
      for (let x = 0; x < w; x++) {
        if (rem[y * w + x]) {
          if (minX < 0) minX = x;
          maxX = x;
        }
      }
      if (minX < 0 || minX === maxX) continue;
      if (rem[y * w + minX + 1]) out.push({ head: y * w + minX, dir: 3, deps: 0 });
      if (rem[y * w + maxX - 1]) out.push({ head: y * w + maxX, dir: 1, deps: 0 });
    }
    for (let x = 0; x < w; x++) {
      let minY = -1;
      let maxY = -1;
      for (let y = 0; y < h; y++) {
        if (rem[y * w + x]) {
          if (minY < 0) minY = y;
          maxY = y;
        }
      }
      if (minY < 0 || minY === maxY) continue;
      if (rem[(minY + 1) * w + x]) out.push({ head: minY * w + x, dir: 0, deps: 0 });
      if (rem[(maxY - 1) * w + x]) out.push({ head: maxY * w + x, dir: 2, deps: 0 });
    }
    for (const c of out) c.deps = countDeps(c.head, c.dir);
    return out;
  };

  while (remCount > 0) {
    const cands = collect();
    if (!cands.length) break;
    const freeC: Cand[] = [];
    const depC: Cand[] = [];
    for (const c of cands) (c.deps === 0 ? freeC : depC).push(c);

    let pool: Cand[];
    if (!depC.length) pool = freeC;
    else if (!freeC.length) pool = depC;
    else if (freeCount >= targetFree) pool = depC;
    else pool = rng.chance(0.5) ? freeC : depC;

    const total = arrows.length + 4;
    const weights = pool.map((c) => {
      // Favour arrows blocked by several others, and directions used less so far.
      const depW = 1 + Math.min(c.deps, 4) * 0.7;
      const dirW = 1 / (0.35 + dirCount[c.dir] / total);
      return depW * dirW;
    });
    const cand = pool[rng.weighted(weights)];

    // Draw the body backwards from the head.
    const back = ((cand.dir + 2) % 4) as Dir;
    const head = cand.head;
    const neck = head + DX[back] + DY[back] * w;
    const path: number[] = [head, neck];
    rem[head] = 0;
    rem[neck] = 0;
    remCount -= 2;
    let cur = neck;
    let heading: Dir = back;
    // Long arrows early on, when there is room; shorter ones to fill the gaps.
    const room = remCount / cellCount;
    const lenMax = Math.max(p.lenMin, Math.round(p.lenMin + (p.lenMax - p.lenMin) * (0.35 + 0.65 * room)));
    const want = rng.range(p.lenMin, lenMax);

    for (;;) {
      const cx = cur % w;
      const cy = (cur - cx) / w;
      const opts: number[] = [];
      const optDir: Dir[] = [];
      for (let d = 0; d < 4; d++) {
        const nx = cx + DX[d];
        const ny = cy + DY[d];
        if (!inb(nx, ny)) continue;
        const nc = ny * w + nx;
        if (rem[nc]) {
          opts.push(nc);
          optDir.push(d as Dir);
        }
      }
      if (!opts.length) break;
      // A neighbour with no other neighbour left would be stranded: take it now.
      let forced = -1;
      for (let i = 0; i < opts.length; i++) {
        if (remDegree(opts[i]) === 0) {
          forced = i;
          break;
        }
      }
      if (forced < 0 && path.length >= want) break;
      let pickIdx = forced;
      if (pickIdx < 0) {
        const ws = opts.map((nc, i) => {
          let wgt = optDir[i] === heading ? 1 + p.straight * 5 : 1;
          if (remDegree(nc) === 1) wgt *= 2.2; // thin corridors first
          return wgt;
        });
        pickIdx = rng.weighted(ws);
      }
      cur = opts[pickIdx];
      heading = optDir[pickIdx];
      rem[cur] = 0;
      remCount--;
      path.push(cur);
      if (path.length > p.lenMax + 6) break;
    }

    path.reverse();
    const id = arrows.length;
    for (const c of path) owner[c] = id;
    arrows.push({ id, cells: path, dir: cand.dir });
    dirCount[cand.dir]++;
    if (cand.deps === 0) freeCount++;
  }

  // Stranded single cells join the tail of a neighbouring arrow when they can.
  // No arrow's line of travel crosses a cell that stayed empty to the end, so
  // this never blocks anyone.
  if (remCount > 0) {
    for (let c = 0; c < w * h; c++) {
      if (!rem[c]) continue;
      const x = c % w;
      const y = (c - x) / w;
      for (let d = 0; d < 4; d++) {
        const nx = x + DX[d];
        const ny = y + DY[d];
        if (!inb(nx, ny)) continue;
        const o = owner[ny * w + nx];
        if (o < 0) continue;
        const a = arrows[o];
        if (a.cells[0] === ny * w + nx) {
          a.cells.unshift(c);
          owner[c] = o;
          rem[c] = 0;
          remCount--;
          break;
        }
      }
    }
  }

  return {
    n: p.n,
    w,
    h,
    shape: p.shape,
    difficulty: p.difficulty,
    seed,
    arrows,
    cellCount,
  };
}

/** Builds a few candidates for the level and keeps the one closest to its targets. */
export function generate(p: GenParams): Level {
  let best: Level | null = null;
  let bestScore = Infinity;
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const lvl = generateOnce(p, hash32(p.seed, attempt, 0x51ed));
    const st = levelStats(lvl);
    const short = lvl.arrows.filter((a) => a.cells.length <= 2).length / Math.max(1, lvl.arrows.length);
    const score =
      Math.abs(st.freeRatio - p.freeTarget) * 8 +
      (st.holes / Math.max(1, lvl.cellCount)) * 30 +
      short * 2;
    if (score < bestScore) {
      bestScore = score;
      best = lvl;
    }
    if (score < 0.35) break;
  }
  return best as Level;
}
