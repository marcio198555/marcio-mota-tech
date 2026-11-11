// Turns a level number (or a date) into the recipe for its board.

import { hash32, RNG } from './rng';
import { generate } from './gen';
import type { GenParams } from './gen';
import type { Difficulty, Level, ShapeName } from './types';

const SHAPES_EARLY: readonly ShapeName[] = ['rect', 'round', 'diamond', 'plus'];
const SHAPES_ALL: readonly ShapeName[] = [
  'rect', 'round', 'diamond', 'ellipse', 'heart', 'plus', 'ring', 'hexagon',
  'triangle', 'hourglass', 'star', 'frame', 'cross', 'arrow', 'blob',
];

/** Largest boards a phone screen shows comfortably. */
export const MAX_W = 16;
export const MAX_H = 24;

export function difficultyOf(n: number): Difficulty {
  if (n <= 6) return 'easy';
  if (n % 10 === 0) return 'expert';
  if (n % 5 === 0) return 'hard';
  return 'normal';
}

export function levelParams(n: number): GenParams {
  const seed = hash32(n, 0xa77011);
  const rng = new RNG(seed);
  const difficulty = difficultyOf(n);

  // Board width grows fast at first, then slowly.
  let w: number;
  if (n <= 2) w = 4;
  else if (n <= 5) w = 5;
  else if (n <= 9) w = 6;
  else if (n <= 15) w = 7;
  else if (n <= 24) w = 8;
  else if (n <= 36) w = 9;
  else if (n <= 52) w = 10;
  else if (n <= 75) w = 11;
  else if (n <= 110) w = 12;
  else if (n <= 160) w = 13;
  else w = 14;
  let h = Math.round(w * (1.25 + rng.next() * 0.2));
  if (n <= 2) h = w;

  if (difficulty === 'expert') {
    w += 2;
    h += 3;
  } else if (difficulty === 'hard') {
    w += 1;
    h += 1;
  }
  w = Math.min(w, MAX_W);
  h = Math.min(h, MAX_H);

  let shape: ShapeName = 'rect';
  if (n > 4 && n <= 14) shape = rng.chance(0.5) ? 'rect' : rng.pick(SHAPES_EARLY);
  else if (n > 14) shape = rng.chance(0.3) ? 'rect' : rng.pick(SHAPES_ALL);
  // Fancy silhouettes need room to be recognisable.
  if (w < 8 && (shape === 'heart' || shape === 'star' || shape === 'ring' || shape === 'arrow' || shape === 'frame')) {
    shape = 'round';
  }

  // The later the level, the fewer arrows are free at the start.
  const ramp = Math.min(1, n / 80);
  let freeTarget = 0.42 - 0.2 * ramp;
  if (n <= 2) freeTarget = 0.6;
  if (difficulty === 'hard') freeTarget -= 0.07;
  if (difficulty === 'expert') freeTarget -= 0.1;
  freeTarget = Math.max(0.08, freeTarget);

  const lenMin = 2;
  const lenMax = Math.min(14, 3 + Math.round(w * 0.75));
  const straight = 0.35 + rng.next() * 0.4;

  return { n, w, h, shape, difficulty, lenMin, lenMax, freeTarget, straight, seed };
}

export function makeLevel(n: number): Level {
  return generate(levelParams(n));
}

/** Days since 1 January 2026 for a local calendar date. */
export function dayIndex(year: number, month: number, day: number): number {
  const ms = Date.UTC(year, month - 1, day) - Date.UTC(2026, 0, 1);
  return Math.round(ms / 86400000);
}

/** The daily challenge: one large board per calendar day, the same for everyone. */
export function dailyParams(day: number): GenParams {
  const seed = hash32(day, 0xda117);
  const rng = new RNG(seed);
  const shapes: readonly ShapeName[] = [
    'heart', 'star', 'ring', 'hexagon', 'diamond', 'ellipse', 'cross', 'arrow',
    'hourglass', 'blob', 'frame', 'round', 'plus', 'triangle',
  ];
  const w = 13 + rng.int(3);
  const h = Math.min(MAX_H, Math.round(w * 1.45));
  return {
    n: 0,
    w,
    h,
    shape: shapes[((day % shapes.length) + shapes.length) % shapes.length],
    difficulty: 'hard',
    lenMin: 2,
    lenMax: 13,
    freeTarget: 0.14,
    straight: 0.4 + rng.next() * 0.3,
    seed,
  };
}

export function makeDaily(day: number): Level {
  return generate(dailyParams(day));
}
