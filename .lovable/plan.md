

## Plan: AI Math Coach for Wrong Answers

### Overview
After a round ends, if there were wrong answers, show a button: "Want to review your mistakes with Coach Mathlete? 🤓" When clicked, an AI coach (funny, encouraging personality) walks through each wrong question with explanations and tips.

### Prerequisites
This requires Lovable Cloud to be enabled (for the AI gateway). No backend is currently connected.

**Step 0: Enable Lovable Cloud** — needed to access the Lovable AI Gateway (`LOVABLE_API_KEY`).

### Implementation

**1. Track wrong answers during gameplay**
- **`src/components/MathGame.tsx`**: Add a `wrongAnswers` state array that stores `{ question: Question, userAnswer: number }` for each incorrect/timed-out answer. Pass it to `GameSummary`. Reset on game start.

**2. Create AI Coach edge function**
- **`supabase/functions/math-coach/index.ts`**: Edge function that receives the list of wrong questions and calls the Lovable AI Gateway with a system prompt like:
  > "You are Coach Mathlete, a hilarious and encouraging math tutor for kids. You use jokes, puns, and silly analogies to explain math. Review each wrong answer, explain WHY it's wrong in a funny way, then show how to get the right answer. Keep it short and fun per question. Use emojis liberally."
- Returns streamed response.

**3. Create CoachReview component**
- **`src/components/CoachReview.tsx`**: New component shown in `GameSummary` when user clicks "Review with Coach". Displays:
  - List of wrong questions with user's wrong answer vs correct answer
  - A chat-style bubble where the AI coach's streamed explanation appears (rendered with markdown)
  - A "Got it, thanks Coach!" dismiss button

**4. Update GameSummary**
- **`src/components/GameSummary.tsx`**: Add a "Review mistakes with Coach Mathlete" button (only shown when there are wrong answers). Toggles the `CoachReview` component.

### Files to change/create

| File | Action |
|------|--------|
| `src/components/MathGame.tsx` | Add `wrongAnswers` state, populate on wrong/timeout, pass to GameSummary |
| `src/components/GameSummary.tsx` | Add coach review button + render CoachReview component |
| `src/components/CoachReview.tsx` | **New** — streams AI coach explanation for wrong answers |
| `supabase/functions/math-coach/index.ts` | **New** — edge function calling Lovable AI with funny coach persona |

