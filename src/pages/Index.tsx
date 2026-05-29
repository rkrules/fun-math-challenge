import { useState } from 'react';
import MathGame from '../components/MathGame';
import AuthButton from '../components/AuthButton';
import ProgressDashboard from '../components/ProgressDashboard';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'game' | 'progress'>('game');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-6">
      <div className="container max-w-4xl">
        <header className="flex items-center justify-between mb-6 px-2">
          <button
            onClick={() => setView('progress')}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border hover:bg-muted transition"
          >
            <BarChart3 size={14} /> Progress
          </button>
          <AuthButton />
        </header>

        {view === 'game' ? (
          <MathGame />
        ) : (
          <div className="max-w-md mx-auto bg-card/50 backdrop-blur rounded-2xl p-6 border">
            <ProgressDashboard onBack={() => setView('game')} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
