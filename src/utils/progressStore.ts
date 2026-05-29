import { supabase } from '@/integrations/supabase/client';

export interface SessionRecord {
  operation: string;
  difficulty: string;
  mode: string;
  score: number;
  correct_count: number;
  total_count: number;
  accuracy: number;
  avg_time_ms: number;
  max_streak: number;
  played_at: string;
}

const LS_KEY = 'mathgame_history';

const readLocal = (): SessionRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeLocal = (rows: SessionRecord[]) =>
  localStorage.setItem(LS_KEY, JSON.stringify(rows));

export const saveSession = async (
  userId: string | null,
  record: Omit<SessionRecord, 'played_at'> & { played_at?: string }
) => {
  const row: SessionRecord = {
    played_at: new Date().toISOString(),
    ...record,
  };
  if (userId) {
    await supabase.from('game_sessions').insert({ ...row, user_id: userId });
  } else {
    const all = readLocal();
    all.push(row);
    writeLocal(all);
  }
};

export const loadSessions = async (
  userId: string | null
): Promise<SessionRecord[]> => {
  if (userId) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('operation, difficulty, mode, score, correct_count, total_count, accuracy, avg_time_ms, max_streak, played_at')
      .order('played_at', { ascending: false })
      .limit(200);
    if (error) return [];
    return (data || []) as SessionRecord[];
  }
  return readLocal().slice().reverse();
};

/** Push any local guest sessions to the cloud once the user signs in. */
export const migrateGuestHistory = async (userId: string) => {
  const local = readLocal();
  if (!local.length) return;
  const rows = local.map(r => ({ ...r, user_id: userId }));
  const { error } = await supabase.from('game_sessions').insert(rows);
  if (!error) localStorage.removeItem(LS_KEY);
};
