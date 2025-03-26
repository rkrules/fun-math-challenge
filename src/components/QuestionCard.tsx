
import { useState, useEffect, useRef } from 'react';
import { Question, getOperationSymbol } from '../utils/mathUtils';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: number) => void;
  isAnswerCorrect: boolean | null;
  showFeedback: boolean;
}

const QuestionCard = ({ 
  question, 
  onAnswer, 
  isAnswerCorrect, 
  showFeedback 
}: QuestionCardProps) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when a new question is presented
  useEffect(() => {
    setUserAnswer('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAnswer = parseInt(userAnswer, 10);
    if (!isNaN(numAnswer)) {
      onAnswer(numAnswer);
    }
  };

  const getBorderColor = () => {
    if (!showFeedback) return '';
    return isAnswerCorrect === true 
      ? 'ring-2 ring-green-400 border-green-400' 
      : isAnswerCorrect === false 
        ? 'ring-2 ring-red-400 border-red-400' 
        : '';
  };

  return (
    <div className={`question-card ${getBorderColor()} animate-scale-in`}>
      <div className="flex items-center justify-center text-4xl font-semibold mb-8">
        <span>{question.num1}</span>
        <span className="math-symbol mx-4">{getOperationSymbol(question.operation)}</span>
        <span>{question.num2}</span>
        <span className="math-symbol mx-4">=</span>
        <span>?</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="number-input"
          placeholder="Your answer"
          disabled={showFeedback}
          autoFocus
        />
        
        <button
          type="submit"
          disabled={!userAnswer || showFeedback}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl 
                   text-lg font-medium shadow-md hover:shadow-lg hover:bg-primary/90 
                   transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          Submit
        </button>
      </form>
      
      {showFeedback && (
        <div className="mt-4 text-center animate-fade">
          {isAnswerCorrect ? (
            <p className="text-green-500 font-medium">Correct!</p>
          ) : (
            <p className="text-red-500 font-medium">
              Incorrect. The answer is {question.correctAnswer}.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
