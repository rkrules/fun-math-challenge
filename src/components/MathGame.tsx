
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import QuestionCard from './QuestionCard';
import GameStats from './GameStats';
import GameControls from './GameControls';
import GameSummary from './GameSummary';
import OperationSelector from './OperationSelector';
import { 
  Operation, 
  Difficulty, 
  Question, 
  generateQuestion, 
  calculatePoints 
} from '../utils/mathUtils';

const MathGame = () => {
  // Game configuration state
  const [operation, setOperation] = useState<Operation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState(15);

  // Game progress state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Game summary data
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Generate a new question
  const generateNewQuestion = useCallback(() => {
    const newQuestion = generateQuestion(operation, difficulty);
    setCurrentQuestion(newQuestion);
    setTimeLeft(timePerQuestion);
    setIsAnswerCorrect(null);
    setShowFeedback(false);
  }, [operation, difficulty, timePerQuestion]);

  // Initialize game when started
  useEffect(() => {
    if (isGameActive && !isGameOver) {
      generateNewQuestion();
    }
  }, [isGameActive, isGameOver, generateNewQuestion]);

  // Timer for each question
  useEffect(() => {
    let timer: number | undefined;
    
    if (timerEnabled && isGameActive && !isGameOver && !showFeedback && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prevTime - 0.1;
        });
      }, 100);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameActive, isGameOver, showFeedback, timeLeft, timerEnabled]);

  // Handle timeout when timer reaches zero
  const handleTimeout = () => {
    if (!currentQuestion) return;
    
    setShowFeedback(true);
    setIsAnswerCorrect(false);
    setStreak(0);
    setTotalQuestions(prev => prev + 1);
    setTotalTime(prev => prev + timePerQuestion);
    toast.error("Time's up!");
    
    setTimeout(() => {
      generateNewQuestion();
    }, 2000);
  };

  // Start the game
  const handleStartGame = () => {
    setIsGameActive(true);
    setIsGameOver(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setTotalTime(0);
    toast.success("Game started! Good luck!");
  };

  // End the game
  const handleEndGame = () => {
    setIsGameActive(false);
    setIsGameOver(true);
  };

  // Handle player's answer
  const handleAnswer = (answer: number) => {
    if (!currentQuestion || showFeedback) return;
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    const timeTaken = timerEnabled ? timePerQuestion - timeLeft : 0;
    
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
    
    setTimeout(() => {
      generateNewQuestion();
    }, 2000);
  };

  // Calculate average time per question
  const getAverageTime = () => {
    return totalQuestions > 0 ? totalTime / totalQuestions : 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Math Practice</h1>
      
      {!isGameActive && !isGameOver && (
        <OperationSelector 
          selectedOperation={operation} 
          onSelectOperation={setOperation} 
        />
      )}
      
      {isGameActive && !isGameOver && currentQuestion && (
        <div className="space-y-6">
          <GameStats 
            score={score} 
            streak={streak} 
            timeLeft={timeLeft} 
            maxTime={timePerQuestion}
            timerEnabled={timerEnabled}
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
      />
    </div>
  );
};

export default MathGame;
