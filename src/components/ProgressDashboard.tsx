import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadSessions, SessionRecord } from '@/utils/progressStore';
import { getOperationName, Operation } from '@/utils/mathUtils';
import BadgesGrid from './BadgesGrid';
import { computeStats } from '@/utils/badges';

interface Props {
  onBack: () => void;
}

const ProgressDashboard = ({ onBack }: Props) => {
  const { user } = useAuth();
  const [rows, setRows] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions(user?.id ?? null).then(r => {
      setRows(r);
      setLoading(false);
    });
  }, [user]);

  const totalGames = rows.length;
  const totalCorrect = rows.reduce((s, r) => s + r.correct_count, 0);
  const totalQuestions = rows.reduce((s, r) => s + r.total_count, 0);
  const lifetimeAccuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const bestStreak = rows.reduce((m, r) => Math.max(m, r.max_streak), 0);

  const perOp = rows.reduce<Record<string, { correct: number; total: number }>>((acc, r) => {
    const k = r.operation;
    if (!acc[k]) acc[k] = { correct: 0, total: 0 };
    acc[k].correct += r.correct_count;
    acc[k].total += r.total_count;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Progress</h2>
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </button>
      </div>

      {!user && (
        <p className="text-xs text-muted-foreground text-center">
          Playing as guest — progress is saved on this device. <a href="/auth" className="text-primary">Sign in</a> to sync.
        </p>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground text-sm">Loading…</p>
      ) : totalGames === 0 ? (
        <p className="text-center text-muted-foreground text-sm">No games yet — play one to see your stats!</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Games" value={totalGames} />
            <Stat label="Accuracy" value={`${lifetimeAccuracy}%`} />
            <Stat label="Best streak" value={bestStreak} />
          </div>

          <BadgesGrid stats={computeStats(rows)} />


          <div className="space-y-2">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">By operation</h3>
            <div className="space-y-1.5">
              {Object.entries(perOp).map(([op, v]) => {
                const acc = v.total ? Math.round((v.correct / v.total) * 100) : 0;
                return (
                  <div key={op} className="flex items-center justify-between text-sm bg-muted/50 rounded-lg px-3 py-2">
                    <span>{getOperationName(op as Operation)}</span>
                    <span className="text-muted-foreground">{acc}% · {v.total} q</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Recent sessions</h3>
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {rows.slice(0, 10).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-muted/30 rounded-lg px-3 py-2">
                  <div>
                    <div className="font-medium">{getOperationName(r.operation as Operation)}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.difficulty} · {new Date(r.played_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{r.score} pts</div>
                    <div className="text-xs text-muted-foreground">
                      {r.correct_count}/{r.total_count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-card border rounded-xl p-3 text-center">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
  </div>
);

export default ProgressDashboard;
