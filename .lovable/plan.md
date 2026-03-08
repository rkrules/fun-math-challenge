

## Plan: Practice Timer + Sound Effects + Squishmallow Mode

### 1. Enable per-question timer in Practice mode

Currently the timer toggle/slider only shows when `gameMode === 'single'` (GameControls line 50). The per-question timer effect in MathGame also gates on `gameMode === 'single'` (line 67).

**Changes:**
- **`GameControls.tsx`**: Remove the `gameMode === 'single'` condition on the timer section (line 50) -- show it in both modes.
- **`MathGame.tsx`**: Change the per-question timer condition (line 67) from `gameMode === 'single' && timerEnabled` to just `timerEnabled`. Also update `timerEnabled` prop passed to GameStats (line 198) and the `timeTaken` calculation (line 136) similarly.

### 2. Sound effects (client-side, no API needed)

Use the Web Audio API to generate simple synthesized sounds -- no external service or files needed. Create a utility `src/utils/sounds.ts` with functions:

- **`playCorrectSound()`**: A pleasant ascending two-tone chime (e.g., 523Hz then 659Hz, short sine waves)
- **`playIncorrectSound()`**: A low buzzer tone (e.g., 200Hz sawtooth, 200ms)
- **`playStreakSound()`**: A three-note ascending fanfare for streak milestones
- **`playTimeoutSound()`**: A descending tone for timeout

Call these from `MathGame.tsx` in `handleAnswer` (correct/incorrect) and `handleTimeout`. Add a `soundEnabled` state (default true) with a small speaker toggle icon in GameControls.

### 3. Squishmallow mode (optional toggle)

Add a toggle in the setup screen for "Squishmallow Mode" that applies a cute pastel theme with bubbly styling. Since the question was dismissed, I'll go with a full pastel + cute approach:

**Implementation:**
- Add `squishmallowMode` state in `MathGame.tsx`, pass it down.
- Add a toggle button in `OperationSelector.tsx` (a cute pill/switch).
- When enabled, apply a CSS class `squishmallow` to the root container that overrides CSS variables:
  - Soft pastel pink/purple/mint color scheme
  - Larger border-radius (fully rounded buttons)
  - Playful font styling
- In `src/index.css`, add `.squishmallow` scoped CSS variable overrides (pastel pinks, purples, mints).
- In `QuestionCard.tsx` feedback area, show cute emoji reactions when in squishmallow mode (e.g., cute celebration emojis for correct, encouraging emojis for incorrect).
- Title changes to "Squishy Math" when mode is on.

### Files to change

| File | Changes |
|------|---------|
| `src/utils/sounds.ts` | **New file** -- Web Audio API sound functions + volume control |
| `src/index.css` | Add `.squishmallow` CSS variable overrides for pastel theme |
| `src/components/MathGame.tsx` | Add `soundEnabled`, `squishmallowMode` state; play sounds on answer/timeout; remove single-mode gate on timer; pass theme class |
| `src/components/GameControls.tsx` | Show timer toggle in both modes; add sound toggle icon |
| `src/components/OperationSelector.tsx` | Add Squishmallow Mode toggle |
| `src/components/QuestionCard.tsx` | Add cute emoji feedback when squishmallow mode is on |
| `src/components/GameStats.tsx` | No changes needed (already handles `timerEnabled` prop) |

