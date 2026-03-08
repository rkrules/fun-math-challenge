
## Plan: Implement Coach Tobias AI Review

To bring Coach Tobias to life, we'll replace the placeholder with a real connection to the Lovable AI Gateway using a Supabase Edge Function to stream his funny and encouraging feedback token-by-token.

### 1. Create the Backend Edge Function
**File: `supabase/functions/math-coach/index.ts`**
*   Create a new edge function that receives the user's `wrongAnswers`.
*   Set up the system prompt to establish the persona: *"You are Coach Tobias, a hilarious and encouraging math tutor. You use jokes, puns, and silly analogies to explain math. Review the following wrong answers, explain why they are wrong in a funny way, and show how to get the right answer."*
*   Call the Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) and return the streaming response back to the client.

### 2. Create the Frontend Component
**File: `src/components/CoachReview.tsx`**
*   Build a new React component that takes `wrongAnswers` as a prop.
*   Implement the SSE (Server-Sent Events) streaming logic to read tokens from the edge function in real-time.
*   Display the streamed response in a nice chat bubble UI, showing Coach Tobias's feedback typing out progressively.
*   Include loading states and error handling (e.g., if rate limits are hit).

### 3. Update the Game Summary UI
**File: `src/components/GameSummary.tsx`**
*   Change the review button text from "Review with Coach Mathlete" to **"Review with Coach Tobias 🤓"**.
*   Remove the `(Coach Mathlete feature coming soon!)` placeholder.
*   Render the new `<CoachReview wrongAnswers={wrongAnswers} />` component when the button is clicked.

*Note: For the AI connection to work, Lovable Cloud will need to be enabled on your project to automatically provide the required `LOVABLE_API_KEY` for the AI gateway.*
