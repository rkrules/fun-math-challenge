

## Bug: Same question repeating + root cause

The init `useEffect` (line 61-65) has `generateNewQuestion` in its dependency array. This means any time `generateNewQuestion`'s reference changes (due to its own deps changing), the effect re-fires and overwrites whatever question was set — potentially causing repeated or stuck questions. The `setTimeout` calls on lines 113 and 165 also call `generateNewQuestion`, creating a race condition where the effect and timeout both try to set the question.

### Fix

**`src/components/MathGame.tsx`**

1. **Remove the init useEffect entirely** (lines 61-65). Instead, call `generateNewQuestion()` directly inside `handleStartGame` after resetting state, using a microtask (`setTimeout(..., 0)`) so state is flushed first. This eliminates the re-fire issue.

2. Alternatively (simpler): keep the effect but add a `questionCount` ref or `hasStarted` ref to ensure it only fires once per game session, not on every `generateNewQuestion` reference change. 

**Chosen approach**: Move question generation into `handleStartGame` using a short timeout, and remove the `useEffect`. The `setTimeout` calls in `handleAnswer`/`handleTimeout` already handle subsequent questions correctly.

```
// In handleStartGame, after state resets:
setTimeout(() => {
  const op = gameMode === 'practice' && selectedOperations.length > 0
    ? selectedOperations[Math.floor(Math.random() * selectedOperations.length)]
    : operation;
  const table = op === 'multiplication_table' ? selectedTable : undefined;
  setCurrentQuestion(generateQuestion(op, difficulty, table));
  setTimeLeft(timePerQuestion);
  setIsAnswerCorrect(null);
  setShowFeedback(false);
}, 0);
```

Remove the useEffect on lines 61-65.

This is a small, focused fix — one file change in `MathGame.tsx`.

