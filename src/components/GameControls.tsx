
import { Difficulty } from '../utils/mathUtils';

interface GameControlsProps {
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onStartGame: () => void;
  onEndGame: () => void;
  isGameActive: boolean;
}

const GameControls = ({ 
  difficulty, 
  onChangeDifficulty, 
  onStartGame, 
  onEndGame, 
  isGameActive 
}: GameControlsProps) => {
  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      {!isGameActive ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wider text-muted-foreground text-center">
              Select Difficulty
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onChangeDifficulty('easy')}
                data-active={difficulty === 'easy'}
                className="operation-button"
              >
                Easy
              </button>
              
              <button
                onClick={() => onChangeDifficulty('medium')}
                data-active={difficulty === 'medium'}
                className="operation-button"
              >
                Medium
              </button>
              
              <button
                onClick={() => onChangeDifficulty('hard')}
                data-active={difficulty === 'hard'}
                className="operation-button"
              >
                Hard
              </button>
            </div>
          </div>
          
          <button
            onClick={onStartGame}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-lg font-medium 
                     shadow-lg hover:shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            Start Game
          </button>
        </div>
      ) : (
        <button
          onClick={onEndGame}
          className="w-full bg-muted hover:bg-muted/70 text-muted-foreground py-2 rounded-xl 
                   text-sm font-medium transition-all mt-4"
        >
          End Game
        </button>
      )}
    </div>
  );
};

export default GameControls;
