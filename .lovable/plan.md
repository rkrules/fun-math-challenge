

## Plan: Add Timer Toggle and Custom Duration

### Changes

**`src/components/GameControls.tsx`**
- Add a toggle switch (using the existing Switch component) to enable/disable the timer, placed between difficulty selector and Start button
- Add a slider (using the existing Slider component) to set custom time per question (5-60 seconds), shown only when timer is enabled
- Pass new props: `timerEnabled`, `onToggleTimer`, `timePerQuestion`, `onChangeTime`

**`src/components/MathGame.tsx`**
- Add state: `timerEnabled` (default true), `timePerQuestion` (default 15)
- Skip timer countdown logic when `timerEnabled` is false (no timeout handling)
- Pass `timerEnabled` to `GameStats` so it can hide/adjust the timer bar
- Use `timePerQuestion` instead of `MAX_TIME_PER_QUESTION` constant

**`src/components/GameStats.tsx`**
- Accept optional `timerEnabled` prop
- When timer is off, replace the timer bar with a simple "No Timer" label or hide the time column, keeping the 3-column grid intact (use a relaxed icon or infinity symbol instead)

### UI Layout
The timer settings sit neatly below difficulty buttons as a compact row: a Switch labeled "Timer" on the left, and a small slider for seconds on the right (conditionally visible). Clean and minimal.

