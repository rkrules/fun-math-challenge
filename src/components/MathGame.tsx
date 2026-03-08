
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import QuestionCard from './QuestionCard';
import GameStats from './GameStats';
import GameControls from './GameControls';
import GameSummary from './GameSummary';
import OperationSelector from './OperationSelector';
import { 
  Operation, Difficulty, Question, GameMode,
  generateQuestion, calculatePoints 
} from '../utils/mathUtils';

const MathGame = () => {
  // Game configuration
  const [operation, setOperation] = useState<Operation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(10 * 60); // seconds
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

  // Game progress
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const getRandomOperation = useCallback((): Operation => {
    if (gameMode === 'practice' && selectedOperations.length > 0) {
      return selectedOperations[Math.floor(Math.random() * selectedOperations.length)];
    }
    return operation;
  }, [gameMode, selectedOperations, operation]);

  const generateNewQuestion = useCallback(() => {
    const op = getRandomOperation();
    const table = op === 'multiplication_table' ? selectedTable : undefined;
    const newQuestion = generateQuestion(op, difficulty, table);
    setCurrentQuestion(newQuestion);
    setTimeLeft(timePerQuestion);
    setIsAnswerCorrect(null);
    setShowFeedback(false);
  }, [getRandomOperation, difficulty, timePerQuestion, selectedTable]);

  // Init game
  useEffect(() => {
    if (isGameActive && !isGameOver) {
      generateNewQuestion();
    }
  }, [isGameActive, isGameOver, generateNewQuestion]);

  // Per-question timer
  useEffect(() => {
    let timer: number | undefined;
    const shouldRunTimer = gameMode === 'single' && timerEnabled;
    if (shouldRunTimer && isGameActive && !isGameOver && !showFeedback && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isGameActive, isGameOver, showFeedback, timeLeft, timerEnabled, gameMode]);

  // Session timer (practice mode)
  useEffect(() => {
    let timer: number | undefined;
    if (gameMode === 'practice' && isGameActive && !isGameOver && sessionTimeLeft > 0) {
      timer = window.setInterval(() => {
        setSessionTimeLeft(prev => {
          if (prev <= 0.1) {
            clearInterval(timer);
            handleEndGame();
            toast.info("Time's up! Practice round complete.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [gameMode, isGameActive, isGameOver, sessionTimeLeft]);

  const handleTimeout = () => {
    if (!currentQuestion) return;
    setShowFeedback(true);
    setIsAnswerCorrect(false);
    setStreak(0);
    setTotalQuestions(prev => prev + 1);
    setTotalTime(prev => prev + timePerQuestion);
    toast.error("Time's up!");
    setTimeout(() => generateNewQuestion(), 2000);
  };

  const handleStartGame = () => {
    setIsGameActive(true);
    setIsGameOver(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setTotalTime(0);
    if (gameMode === 'practice') {
      setSessionTimeLeft(sessionDuration);
    }
    toast.success(gameMode === 'practice' ? "Practice round started!" : "Game started! Good luck!");
  };

  const handleEndGame = () => {
    setIsGameActive(false);
    setIsGameOver(true);
  };

  const handleAnswer = (answer: number) => {
    if (!currentQuestion || showFeedback) return;
    const isCorrect = answer === currentQuestion.correctAnswer;
    const timeTaken = (gameMode === 'single' && timerEnabled) ? timePerQuestion - timeLeft : 0;
    
    setIsAnswerCorrect(isCorrect);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    setTotalTime(prev => prev + timeTaken);
    
    if (isCorrect) {
      const newStreak = streak + 1;
      const points = calculatePoints(true, timeTaken, newStreak, difficulty);
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      if (newStreak > 0 && newStreak % 5 === 0) {
        toast.success(`${newStreak} streak! Multiplier increased!`);
      } else {
        toast.success(`Correct! +${points} points`);
      }
    } else {
      setStreak(0);
      toast.error(`Incorrect! The answer is ${currentQuestion.correctAnswer}`);
    }
    setTimeout(() => generateNewQuestion(), 2000);
  };

  const getAverageTime = () => totalQuestions > 0 ? totalTime / totalQuestions : 0;

  const handleToggleOperation = (op: Operation) => {
    setSelectedOperations(prev =>
      prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op]
    );
  };

  const canStart = gameMode === 'single' || selectedOperations.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Math Practice</h1>
      
      {!isGameActive && !isGameOver && (
        <OperationSelector 
          selectedOperation={operation} 
          onSelectOperation={setOperation}
          gameMode={gameMode}
          onChangeGameMode={setGameMode}
          selectedOperations={selectedOperations}
          onToggleOperation={handleToggleOperation}
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          sessionDuration={sessionDuration}
          onChangeSessionDuration={setSessionDuration}
        />
      )}
      
      {isGameActive && !isGameOver && currentQuestion && (
        <div className="space-y-6">
          <GameStats 
            score={score} 
            streak={streak} 
            timeLeft={timeLeft} 
            maxTime={timePerQuestion}
            timerEnabled={gameMode === 'single' && timerEnabled}
            sessionTimeLeft={gameMode === 'practice' ? sessionTimeLeft : null}
          />
          <QuestionCard 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
            isAnswerCorrect={isAnswerCorrect} 
            showFeedback={showFeedback} 
          />
        </div>
      )}
      
      {isGameOver && (
        <GameSummary 
          score={score}
          totalQuestions={totalQuestions}
          correctAnswers={correctAnswers}
          maxStreak={maxStreak}
          averageTime={getAverageTime()}
          difficulty={difficulty}
          operation={operation}
          gameMode={gameMode}
          selectedOperations={selectedOperations}
          onPlayAgain={() => {
            setIsGameOver(false);
            handleStartGame();
          }}
        />
      )}
      
      <GameControls 
        difficulty={difficulty}
        onChangeDifficulty={setDifficulty}
        onStartGame={handleStartGame}
        onEndGame={handleEndGame}
        isGameActive={isGameActive}
        timerEnabled={timerEnabled}
        onToggleTimer={setTimerEnabled}
        timePerQuestion={timePerQuestion}
        onChangeTime={setTimePerQuestion}
        gameMode={gameMode}
        canStart={canStart}
      />
    </div>
  );
};

export default MathGame;
