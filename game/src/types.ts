// Shared types for the board logic.

/** 0 = up, 1 = right, 2 = down, 3 = left. */
export type Dir = 0 | 1 | 2 | 3;

export const DX: readonly number[] = [0, 1, 0, -1];
export const DY: readonly number[] = [-1, 0, 1, 0];

export interface Arrow {
  id: number;
  /** Cell indices (y * w + x) from the tail (first) to the head (last). */
  cells: number[];
  /** Direction the head points to. Always the direction of the last segment. */
  dir: Dir;
}

export type ShapeName =
  | 'rect'
  | 'round'
  | 'diamond'
  | 'ellipse'
  | 'heart'
  | 'plus'
  | 'ring'
  | 'hexagon'
  | 'triangle'
  | 'hourglass'
  | 'star'
  | 'frame'
  | 'cross'
  | 'arrow'
  | 'blob';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert';

export interface Level {
  /** Level number (1-based), or 0 for a daily challenge. */
  n: number;
  w: number;
  h: number;
  shape: ShapeName;
  difficulty: Difficulty;
  seed: number;
  arrows: Arrow[];
  /** Number of cells of the shape (filled or not). */
  cellCount: number;
}

export interface LevelStats {
  arrows: number;
  free: number;
  freeRatio: number;
  depth: number;
  holes: number;
  avgLen: number;
  maxDeps: number;
}
