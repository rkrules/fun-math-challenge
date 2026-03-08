
import { Difficulty } from '../utils/mathUtils';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

interface GameControlsProps {
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onStartGame: () => void;
  onEndGame: () => void;
  isGameActive: boolean;
  timerEnabled: boolean;
  onToggleTimer: (enabled: boolean) => void;
  timePerQuestion: number;
  onChangeTime: (time: number) => void;
}

const GameControls = ({ 
  difficulty, 
  onChangeDifficulty, 
  onStartGame, 
  onEndGame, 
  isGameActive,
  timerEnabled,
  onToggleTimer,
  timePerQuestion,
  onChangeTime,
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground uppercase tracking-wider">
                Timer
              </label>
              <Switch checked={timerEnabled} onCheckedChange={onToggleTimer} />
            </div>
            {timerEnabled && (
              <div className="flex items-center gap-3">
                <Slider
                  min={5}
                  max={60}
                  step={5}
                  value={[timePerQuestion]}
                  onValueChange={([v]) => onChangeTime(v)}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-muted-foreground w-10 text-right">
                  {timePerQuestion}s
                </span>
              </div>
            )}
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
