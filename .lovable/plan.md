

## Plan: Times Table Selector + Timed Practice Round Mode

### Feature 1: Times Table Selector
When "Times Tables" is selected, show a sub-selector (grid of buttons 1-12) so the user can pick which specific table to practice. Store as `selectedTable` state in MathGame.

**Files:**
- **`src/components/OperationSelector.tsx`** -- Add an optional `selectedTable` / `onSelectTable` prop. When operation is `multiplication_table`, render a row of numbered buttons (1-12) below the main grid.
- **`src/components/MathGame.tsx`** -- Add `selectedTable` state (default null = random). Pass to OperationSelector and to `generateQuestion`.
- **`src/utils/mathUtils.ts`** -- Update `generateQuestion` for `multiplication_table` to accept an optional `table` parameter. If provided, fix `num1` to that table number instead of random.

### Feature 2: Timed Practice Round (10/15 min mixed categories)
Add a "Practice Round" game mode where the user picks a session duration (10 or 15 min) and selects multiple categories. Questions rotate randomly among selected categories for the full duration.

**Files:**
- **`src/components/OperationSelector.tsx`** -- Add a toggle/tab at the top: "Single Mode" vs "Practice Round". In Practice Round mode, allow multi-select on operations (checkboxes/toggle style). Add duration picker (10 min / 15 min buttons).
- **`src/components/MathGame.tsx`** -- Add state: `gameMode` ('single' | 'practice'), `selectedOperations: Operation[]`, `sessionDuration` (in seconds), `sessionTimeLeft`. Add a session-level countdown timer. When generating questions in practice mode, randomly pick from `selectedOperations`. Auto-end game when session timer reaches 0.
- **`src/components/GameStats.tsx`** -- In practice mode, show a session timer (mm:ss countdown) in addition to or instead of the per-question timer.
- **`src/components/GameControls.tsx`** -- Pass through game mode; hide per-question timer config in practice mode (use session timer instead). Show duration selector.
- **`src/components/GameSummary.tsx`** -- Handle practice mode: show "Practice Round" instead of single operation name, list which categories were practiced.

### UI Approach
- The operation selector gains a small tab bar: "Single" | "Practice Round"
- In single mode, behavior is unchanged (pick one operation)
- In practice mode, operations become multi-select (togglable), a duration picker appears (10min/15min pills), and per-question timer settings remain available
- Session countdown displayed prominently during practice games

