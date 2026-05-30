import { BADGES, BadgeStats } from '@/utils/badges';
import { cn } from '@/lib/utils';

interface Props {
  stats: BadgeStats;
}

const BadgesGrid = ({ stats }: Props) => {
  const earnedCount = BADGES.filter(b => b.earned(stats)).length;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Badges</h3>
        <span className="text-xs text-muted-foreground">{earnedCount} / {BADGES.length}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {BADGES.map(b => {
          const earned = b.earned(stats);
          return (
            <div
              key={b.id}
              title={`${b.name} — ${b.description}`}
              className={cn(
                'flex flex-col items-center text-center rounded-xl border p-2 transition',
                earned
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-muted/30 border-border opacity-40 grayscale'
              )}
            >
              <div className="text-2xl leading-none mb-1">{b.icon}</div>
              <div className="text-[11px] font-medium leading-tight">{b.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesGrid;
