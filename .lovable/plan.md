## Plan: Optional Login, Progress History & Adaptive Difficulty

Add an optional account system so players can sign in to save their game history across devices, plus an "Adaptive Difficulty" toggle that intelligently bumps difficulty up/down based on recent performance.

### 1. Optional Authentication
- **Email + password** (default) and **Google sign-in** via Lovable Cloud managed auth
- Auth is **fully optional** — guest play keeps working exactly as today (progress saved to `localStorage`)
- Header gets a small "Sign in" button; when signed in, shows email + "Sign out"
- No forced redirects — guests can play immediately

### 2. Progress Tracking
New table `game_sessions` stores one row per completed game:
- `operation`, `difficulty`, `mode` (single/practice), `score`, `correct_count`, `total_count`, `accuracy`, `avg_time_ms`, `played_at`
- RLS: users only see/insert their own rows
- Guests: same data shape saved in `localStorage` under `mathgame_history`
- On sign-in, local guest history is migrated up to the cloud (one-time merge)

A new **"Progress"** view (accessed from the start screen) shows:
- Total games played, lifetime accuracy, best streak
- Per-operation accuracy breakdown
- Last 10 sessions list

### 3. Adaptive Difficulty (opt-in toggle in GameControls)
When enabled, before each new question we look at the **last 5 questions** of the current session:
- ≥90% correct AND avg time < 4s → bump difficulty one step up (easy→medium→hard)
- ≤50% correct OR avg time > 12s → step down
- Otherwise stay
The user's chosen difficulty acts as the **starting** level; adaptive shifts from there. A small badge shows current adaptive level.

### Files

| File | Change |
|------|--------|
| `supabase/migrations/*` (new) | Create `game_sessions` table + RLS + grants |
| `src/contexts/AuthContext.tsx` (new) | Session state, sign-in/up/out, Google OAuth |
| `src/pages/Auth.tsx` (new) | Sign-in / sign-up page |
| `src/components/AuthButton.tsx` (new) | Header sign-in/out control |
| `src/components/ProgressDashboard.tsx` (new) | Stats + history view |
| `src/utils/progressStore.ts` (new) | Unified read/write (cloud if logged in, else localStorage) + migration |
| `src/utils/adaptiveDifficulty.ts` (new) | Pure function: recent stats → next difficulty |
| `src/components/GameControls.tsx` | Add "Adaptive difficulty" toggle + "View progress" button |
| `src/components/MathGame.tsx` | Use adaptive difficulty when generating questions; save session on game end |
| `src/App.tsx` | Wrap in `AuthProvider`, add `/auth` route |
| `src/pages/Index.tsx` | Show AuthButton + Progress entry point |

### Technical notes
- Use `supabase.auth.onAuthStateChange` + `getUser()` for trusted checks
- Google sign-in via `lovable.auth.signInWithOAuth("google", ...)` (managed)
- No email auto-confirm (users verify email)
- Adaptive logic stays client-side and pure for easy testing
