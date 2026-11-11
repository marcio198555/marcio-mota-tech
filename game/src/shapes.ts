// Board silhouettes. Each one is a formula on coordinates normalised to [-1, 1],
// so the same shape works at any board size.

import { RNG } from './rng';
import type { ShapeName } from './types';

type Inside = (u: number, v: number) => boolean;

function starRadius(theta: number): number {
  // Five-pointed star: radius swings between an outer and an inner value.
  const k = 5;
  const a = ((theta % ((2 * Math.PI) / k)) + (2 * Math.PI) / k) % ((2 * Math.PI) / k);
  const half = Math.PI / k;
  const t = Math.abs(a - half) / half; // 1 at a tip, 0 in a notch
  return 0.52 + 0.56 * t;
}

function shapeFn(name: ShapeName, rng: RNG): Inside {
  switch (name) {
    case 'rect':
      return () => true;
    case 'round':
      return (u, v) => Math.pow(Math.abs(u), 4) + Math.pow(Math.abs(v), 4) <= 1.02;
    case 'diamond':
      return (u, v) => Math.abs(u) + Math.abs(v) <= 1.12;
    case 'ellipse':
      return (u, v) => u * u + v * v <= 1.04;
    case 'heart':
      return (u, v) => {
        const x = u * 1.22;
        const y = -v * 1.18 + 0.12;
        const a = x * x + y * y - 1;
        return a * a * a - x * x * y * y * y <= 0;
      };
    case 'plus':
      return (u, v) => Math.abs(u) <= 0.44 || Math.abs(v) <= 0.44;
    case 'ring':
      return (u, v) => {
        const r = u * u + v * v;
        return r <= 1.04 && r >= 0.16;
      };
    case 'hexagon':
      return (u, v) => Math.abs(v) <= 1 && Math.abs(u) + Math.abs(v) * 0.5 <= 1.02;
    case 'triangle':
      return (u, v) => Math.abs(u) <= (v + 1) / 2 + 0.08;
    case 'hourglass':
      return (u, v) => Math.abs(u) <= 0.26 + 0.78 * Math.abs(v);
    case 'star':
      return (u, v) => {
        const r = Math.sqrt(u * u + v * v);
        const theta = Math.atan2(u, -v); // 0 at the top
        return r <= starRadius(theta);
      };
    case 'frame':
      return (u, v) => !(Math.abs(u) < 0.34 && Math.abs(v) < 0.34);
    case 'cross':
      return (u, v) => Math.abs(Math.abs(u) - Math.abs(v)) <= 0.5;
    case 'arrow':
      // A big arrow pointing up: a triangular head on a shaft.
      return (u, v) => (v < 0 ? Math.abs(u) <= (v + 1) * 1.02 + 0.06 : Math.abs(u) <= 0.42);
    case 'blob': {
      // Soft random island: a circle whose radius wobbles with the angle.
      const p1 = rng.next() * Math.PI * 2;
      const p2 = rng.next() * Math.PI * 2;
      const a1 = 0.1 + rng.next() * 0.1;
      const a2 = 0.05 + rng.next() * 0.08;
      return (u, v) => {
        const r = Math.sqrt(u * u + v * v);
        const th = Math.atan2(v, u);
        return r <= 0.86 + a1 * Math.sin(2 * th + p1) + a2 * Math.sin(3 * th + p2);
      };
    }
  }
}

/** Keeps the largest group of cells that touch each other by a side. */
function largestComponent(mask: Uint8Array, w: number, h: number): Uint8Array {
  const seen = new Int32Array(w * h).fill(-1);
  let best = -1;
  let bestSize = 0;
  let comp = 0;
  const stack: number[] = [];
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || seen[i] >= 0) continue;
    let size = 0;
    stack.push(i);
    seen[i] = comp;
    while (stack.length) {
      const c = stack.pop() as number;
      size++;
      const x = c % w;
      const y = (c - x) / w;
      if (x > 0 && mask[c - 1] && seen[c - 1] < 0) { seen[c - 1] = comp; stack.push(c - 1); }
      if (x < w - 1 && mask[c + 1] && seen[c + 1] < 0) { seen[c + 1] = comp; stack.push(c + 1); }
      if (y > 0 && mask[c - w] && seen[c - w] < 0) { seen[c - w] = comp; stack.push(c - w); }
      if (y < h - 1 && mask[c + w] && seen[c + w] < 0) { seen[c + w] = comp; stack.push(c + w); }
    }
    if (size > bestSize) { bestSize = size; best = comp; }
    comp++;
  }
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = seen[i] === best ? 1 : 0;
  return out;
}

/** Builds the mask of a shape: 1 where a cell belongs to the board. */
export function buildMask(name: ShapeName, w: number, h: number, rng: RNG): Uint8Array {
  const fn = shapeFn(name, rng);
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = w === 1 ? 0 : ((x + 0.5) / w) * 2 - 1;
      const v = h === 1 ? 0 : ((y + 0.5) / h) * 2 - 1;
      mask[y * w + x] = fn(u, v) ? 1 : 0;
    }
  }
  const out = largestComponent(mask, w, h);
  // A shape that came out too thin to be fun falls back to a full rectangle.
  let count = 0;
  for (let i = 0; i < out.length; i++) count += out[i];
  if (count < Math.max(8, w * h * 0.35)) out.fill(1);
  return out;
}

export const ALL_SHAPES: readonly ShapeName[] = [
  'rect', 'round', 'diamond', 'ellipse', 'heart', 'plus', 'ring', 'hexagon',
  'triangle', 'hourglass', 'star', 'frame', 'cross', 'arrow', 'blob',
];
