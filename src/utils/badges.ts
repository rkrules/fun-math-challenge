import { SessionRecord } from './progressStore';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: (s: BadgeStats) => boolean;
}

export interface BadgeStats {
  totalGames: number;
  totalCorrect: number;
  totalQuestions: number;
  bestStreak: number;
  bestAccuracy: number;
  perfectRounds: number;
  fastestAvgMs: number;
  operationsPlayed: Set<string>;
  correctByOp: Record<string, number>;
}

export const computeStats = (rows: SessionRecord[]): BadgeStats => {
  const stats: BadgeStats = {
    totalGames: rows.length,
    totalCorrect: 0,
    totalQuestions: 0,
    bestStreak: 0,
    bestAccuracy: 0,
    perfectRounds: 0,
    fastestAvgMs: Infinity,
    operationsPlayed: new Set(),
    correctByOp: {},
  };
  for (const r of rows) {
    stats.totalCorrect += r.correct_count;
    stats.totalQuestions += r.total_count;
    stats.bestStreak = Math.max(stats.bestStreak, r.max_streak);
    stats.bestAccuracy = Math.max(stats.bestAccuracy, r.accuracy);
    if (r.accuracy >= 1 && r.total_count >= 5) stats.perfectRounds += 1;
    if (r.avg_time_ms > 0) stats.fastestAvgMs = Math.min(stats.fastestAvgMs, r.avg_time_ms);
    stats.operationsPlayed.add(r.operation);
    stats.correctByOp[r.operation] = (stats.correctByOp[r.operation] || 0) + r.correct_count;
  }
  return stats;
};

export const BADGES: Badge[] = [
  { id: 'first_game', name: 'First Steps', description: 'Play your first game', icon: '🎯', earned: s => s.totalGames >= 1 },
  { id: 'games_10', name: 'Getting Warmed Up', description: 'Play 10 games', icon: '🔥', earned: s => s.totalGames >= 10 },
  { id: 'games_50', name: 'Math Marathoner', description: 'Play 50 games', icon: '🏃', earned: s => s.totalGames >= 50 },
  { id: 'correct_100', name: 'Century Club', description: '100 correct answers', icon: '💯', earned: s => s.totalCorrect >= 100 },
  { id: 'correct_500', name: 'Math Wizard', description: '500 correct answers', icon: '🧙', earned: s => s.totalCorrect >= 500 },
  { id: 'streak_10', name: 'On Fire', description: 'Get a 10-streak', icon: '⚡', earned: s => s.bestStreak >= 10 },
  { id: 'streak_25', name: 'Unstoppable', description: 'Get a 25-streak', icon: '🚀', earned: s => s.bestStreak >= 25 },
  { id: 'perfect_1', name: 'Flawless', description: 'Complete a perfect round', icon: '✨', earned: s => s.perfectRounds >= 1 },
  { id: 'perfect_5', name: 'Perfectionist', description: '5 perfect rounds', icon: '🌟', earned: s => s.perfectRounds >= 5 },
  { id: 'speedy', name: 'Speed Demon', description: 'Avg under 3 seconds', icon: '💨', earned: s => s.fastestAvgMs < 3000 },
  { id: 'all_ops', name: 'Well Rounded', description: 'Try every operation', icon: '🎲', earned: s => s.operationsPlayed.size >= 4 },
];

const SEEN_KEY = 'mathgame_seen_badges';

export const getSeenBadges = (): string[] => {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { return []; }
};

export const markBadgesSeen = (ids: string[]) => {
  const seen = new Set([...getSeenBadges(), ...ids]);
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
};

export const findNewBadges = (rows: SessionRecord[]): Badge[] => {
  const stats = computeStats(rows);
  const seen = new Set(getSeenBadges());
  return BADGES.filter(b => b.earned(stats) && !seen.has(b.id));
};
