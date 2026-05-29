import type { Difficulty } from './mathUtils';

const ORDER: Difficulty[] = ['easy', 'medium', 'hard'];

export interface RecentResult {
  correct: boolean;
  timeMs: number;
}

/**
 * Decide the difficulty for the next question based on recent performance.
 * - >=90% correct AND avg time < 4s -> step up
 * - <=50% correct OR avg time > 12s -> step down
 * - otherwise stay
 * Needs at least 5 results to adjust.
 */
export const nextDifficulty = (
  current: Difficulty,
  recent: RecentResult[]
): Difficulty => {
  if (recent.length < 5) return current;
  const window = recent.slice(-5);
  const correct = window.filter(r => r.correct).length / window.length;
  const avgMs = window.reduce((s, r) => s + r.timeMs, 0) / window.length;
  const idx = ORDER.indexOf(current);

  if (correct >= 0.9 && avgMs < 4000 && idx < ORDER.length - 1) {
    return ORDER[idx + 1];
  }
  if ((correct <= 0.5 || avgMs > 12000) && idx > 0) {
    return ORDER[idx - 1];
  }
  return current;
};
