

## Plan: Add Multiple Choice Answer Mode

Add a toggle that lets users choose between typing answers and selecting from multiple choice options.

### How It Works
- When enabled, questions will display 4 answer options (correct answer + 3 distractors)
- Distractors are generated based on the correct answer (nearby values, common mistakes)
- Applies to all standard arithmetic operations (addition, subtraction, multiplication, division, etc.)

### Changes

| File | Change |
|------|--------|
| `src/utils/mathUtils.ts` | Add `generateMultipleChoiceOptions(correctAnswer)` function that creates 4 shuffled options |
| `src/components/MathGame.tsx` | Add `multipleChoiceEnabled` state, pass to `generateQuestion` wrapper and down to components |
| `src/components/GameControls.tsx` | Add "Multiple Choice" toggle switch in the settings |
| `src/components/QuestionCard.tsx` | Already supports `options` - just need the options to be generated |

### Option Generation Logic
Generate 3 distractors based on the correct answer:
- `correctAnswer ± 1-3` (nearby values)
- `correctAnswer ± 10` (place value errors)
- Avoid duplicates and negative numbers

