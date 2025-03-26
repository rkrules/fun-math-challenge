
export type Operation = 'addition' | 'subtraction' | 'multiplication';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
}

interface DifficultyRange {
  min: number;
  max: number;
}

const difficultyRanges: Record<Difficulty, DifficultyRange> = {
  easy: { min: 1, max: 10 },
  medium: { min: 5, max: 20 },
  hard: { min: 10, max: 50 },
};

export const generateQuestion = (operation: Operation, difficulty: Difficulty): Question => {
  const { min, max } = difficultyRanges[difficulty];
  
  // Generate random numbers within the range for the specified difficulty
  let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  let num2 = Math.floor(Math.random() * (max - min + 1)) + min;

  // For subtraction, ensure num1 is greater than or equal to num2 to avoid negative results
  if (operation === 'subtraction' && num1 < num2) {
    [num1, num2] = [num2, num1];
  }
  
  // For multiplication, adjust the numbers for harder difficulties
  if (operation === 'multiplication') {
    if (difficulty === 'medium') {
      num1 = Math.min(num1, 12);
      num2 = Math.min(num2, 15);
    } else if (difficulty === 'hard') {
      num1 = Math.min(num1, 25);
      num2 = Math.min(num2, 15);
    }
  }

  // Calculate the correct answer based on the operation
  let correctAnswer: number;
  switch (operation) {
    case 'addition':
      correctAnswer = num1 + num2;
      break;
    case 'subtraction':
      correctAnswer = num1 - num2;
      break;
    case 'multiplication':
      correctAnswer = num1 * num2;
      break;
    default:
      correctAnswer = 0;
  }

  return { num1, num2, operation, correctAnswer };
};

export const getOperationSymbol = (operation: Operation): string => {
  switch (operation) {
    case 'addition':
      return '+';
    case 'subtraction':
      return '−';
    case 'multiplication':
      return '×';
    default:
      return '';
  }
};

export const calculatePoints = (
  isCorrect: boolean, 
  timeTaken: number, 
  streak: number, 
  difficulty: Difficulty
): number => {
  if (!isCorrect) return 0;
  
  // Base points by difficulty
  const basePoints = {
    easy: 10,
    medium: 20,
    hard: 30
  }[difficulty];
  
  // Time bonus (max 15 seconds, faster = more points)
  const maxTimeBonus = 25;
  const timeBonus = Math.max(0, maxTimeBonus - timeTaken);
  
  // Streak multiplier (every 5 correct answers increases multiplier)
  const streakMultiplier = 1 + Math.floor(streak / 5) * 0.5;
  
  // Calculate total points
  return Math.round((basePoints + timeBonus) * streakMultiplier);
};
