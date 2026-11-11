declare const process: { argv: string[]; exit(code: number): never };
// Checks the generator: every level must be valid and solvable, the same
// number must always give the same board, and difficulty must rise.
// Run: tsx test/levels.test.ts [--show 1,7,30]

import { makeLevel, makeDaily, levelParams } from '../src/levels';
import { validateLevel, levelStats, Board } from '../src/board';
import type { Level } from '../src/types';

const HEAD = ['^', '>', 'v', '<'];

function ascii(level: Level): string {
  const g: string[] = new Array(level.w * level.h).fill(' ');
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (const a of level.arrows) {
    const ch = letters[a.id % letters.length];
    for (const c of a.cells) g[c] = ch;
    g[a.cells[a.cells.length - 1]] = HEAD[a.dir];
  }
  const rows: string[] = [];
  for (let y = 0; y < level.h; y++) rows.push(g.slice(y * level.w, (y + 1) * level.w).join(' '));
  return rows.join('\n');
}

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.log('FAIL ' + msg);
};

const showArg = process.argv.indexOf('--show');
const show = showArg >= 0 ? process.argv[showArg + 1].split(',').map(Number) : [];

const N = 400;
const t0 = Date.now();
let worst = 0;
const rows: string[] = [];
const buckets: Record<string, { n: number; free: number; arrows: number; depth: number; holes: number }> = {};
for (let n = 1; n <= N; n++) {
  const t = Date.now();
  const lvl = makeLevel(n);
  const dt = Date.now() - t;
  worst = Math.max(worst, dt);
  const problems = validateLevel(lvl);
  if (problems.length) fail(`level ${n}: ${problems.slice(0, 3).join('; ')}`);
  const st = levelStats(lvl);
  if (st.arrows < 2) fail(`level ${n}: only ${st.arrows} arrow(s)`);
  if (st.free < 1) fail(`level ${n}: no free arrow at the start`);
  const again = makeLevel(n);
  if (JSON.stringify(again.arrows) !== JSON.stringify(lvl.arrows)) fail(`level ${n}: not deterministic`);
  const key = n <= 10 ? '001-010' : n <= 30 ? '011-030' : n <= 80 ? '031-080' : n <= 160 ? '081-160' : '161-400';
  const b = (buckets[key] ??= { n: 0, free: 0, arrows: 0, depth: 0, holes: 0 });
  b.n++;
  b.free += st.freeRatio;
  b.arrows += st.arrows;
  b.depth += st.depth;
  b.holes += st.holes;
  if (n <= 12 || n % 25 === 0) {
    const p = levelParams(n);
    rows.push(
      `L${String(n).padStart(3)} ${String(lvl.w).padStart(2)}x${String(lvl.h).padEnd(2)} ${lvl.shape.padEnd(9)} ${lvl.difficulty.padEnd(6)} arrows ${String(st.arrows).padStart(3)} free ${String(st.free).padStart(2)} (${(st.freeRatio * 100).toFixed(0).padStart(2)}% / target ${(p.freeTarget * 100).toFixed(0)}%) depth ${String(st.depth).padStart(2)} avgLen ${st.avgLen.toFixed(1)} holes ${st.holes} ${dt}ms`,
    );
  }
  if (show.includes(n)) console.log(`\n--- level ${n} (${lvl.shape}, ${lvl.difficulty})\n${ascii(lvl)}\n`);
}
const total = Date.now() - t0;
console.log(rows.join('\n'));
console.log('\nrange    levels  avg arrows  avg free%  avg depth  avg holes');
for (const k of Object.keys(buckets).sort()) {
  const b = buckets[k];
  console.log(
    `${k}  ${String(b.n).padStart(6)}  ${(b.arrows / b.n).toFixed(1).padStart(10)}  ${((b.free / b.n) * 100).toFixed(1).padStart(9)}  ${(b.depth / b.n).toFixed(1).padStart(9)}  ${(b.holes / b.n).toFixed(2).padStart(9)}`,
  );
}
console.log(`\n${N} levels in ${total} ms (twice each), slowest single level ${worst} ms`);

// Daily challenges for a whole year.
for (let d = 300; d < 665; d++) {
  const lvl = makeDaily(d);
  const problems = validateLevel(lvl);
  if (problems.length) fail(`daily ${d}: ${problems.join('; ')}`);
}
console.log('365 daily challenges checked');

// The hint must always point at an arrow that can really leave.
for (const n of [3, 17, 60, 140]) {
  const lvl = makeLevel(n);
  const b = new Board(lvl);
  let guard = 0;
  while (b.remaining > 0 && guard++ < 5000) {
    const id = b.bestHint();
    if (id < 0 || !b.isFree(id)) {
      fail(`level ${n}: hint gave a blocked arrow`);
      break;
    }
    b.remove(id);
  }
  if (b.remaining !== 0) fail(`level ${n}: following hints did not clear the board`);
}
console.log('hints checked');

console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL OK');
process.exit(failures ? 1 : 0);
