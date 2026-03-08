

## Plan: Expand Math Game with 3rd Grade Concepts

### New Operations/Modes to Add

1. **Division** -- whole number division, no remainders (ensure divisible pairs)
2. **Multiplication Table** -- dedicated mode to practice times tables (1-12)
3. **Rounding** -- round numbers to nearest 10 or 100
4. **Comparing Numbers** -- which number is greater/less, using inequality symbols
5. **Fractions (basic)** -- identify equivalent fractions, compare simple fractions (halves, thirds, quarters)

### Files to Change

**`src/utils/mathUtils.ts`**
- Expand `Operation` type: add `'division' | 'multiplication_table' | 'rounding' | 'comparing' | 'fractions'`
- Update `generateQuestion` to handle each new operation:
  - **Division**: generate num2 first, then multiply to get num1, so `num1 / num2` is always a whole number
  - **Multiplication table**: pick a table (1-12) and a multiplier (1-12)
  - **Rounding**: show a number, ask to round to nearest 10 or 100; question displays as "Round 347 to the nearest 100 = ?"
  - **Comparing**: show two numbers, answer is -1, 0, or 1 (handled with special UI)
  - **Fractions**: show a fraction, ask for equivalent (e.g., "1/2 = ?/4", answer is 2)
- Extend `Question` interface with optional fields: `displayText` (for non-standard question formats like rounding), `options` (for comparing/multiple choice)
- Update `getOperationSymbol` and `calculatePoints`

**`src/components/OperationSelector.tsx`**
- Redesign grid from 3 columns to a responsive layout (2x3 or 3x2) showing all 6 operation modes
- Add icons for each: Divide, Grid3x3 (times table), Circle (rounding), ArrowLeftRight (comparing), Slice (fractions)

**`src/components/QuestionCard.tsx`**
- Handle different question display formats:
  - Standard arithmetic: `num1 ○ num2 = ?`
  - Rounding: text-based prompt with number input
  - Comparing: show two numbers with 3 buttons (`<`, `=`, `>`)
  - Fractions: display fraction notation with a blank to fill

**`src/components/MathGame.tsx`**
- Update operation type references
- No major structural changes needed

**`src/components/GameSummary.tsx`**
- Add display names for new operations

### Design Approach
- Keep the same clean UI style; the operation selector becomes a 2-row grid
- Comparing questions use button-based answers instead of number input
- Rounding and fraction questions use a text prompt above the input
- All new operations support easy/medium/hard difficulty scaling

