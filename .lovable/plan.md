

## Plan: Add AI Coach Disable Toggle

Yes — the AI coach feature (Coach Mathlete) will be completely optional. Here's how:

### Approach

The coach only appears as a **button on the Game Summary screen** after a round with wrong answers. The user must actively click "Review with Coach Mathlete" to trigger it — it never runs automatically.

Additionally, we'll add a **toggle in the setup screen** (alongside the Sound and Timer toggles in `GameControls.tsx`) labeled **"AI Coach"** so users can disable it entirely. When disabled, the review button won't appear at all on the summary screen.

### Changes

| File | Change |
|------|--------|
| `src/components/MathGame.tsx` | Add `aiCoachEnabled` state (default `true`), pass to `GameControls` and `GameSummary` |
| `src/components/GameControls.tsx` | Add an AI Coach on/off toggle (Switch component, similar to Timer toggle) |
| `src/components/GameSummary.tsx` | Only show the "Review with Coach" button when `aiCoachEnabled` is `true` AND there are wrong answers |

This will be implemented as part of the overall Coach Mathlete feature — the toggle will be ready from the start.

