
## Plan: Add Config Flag to Disable AI Coach

Currently, AI Coach can only be toggled via UI. You're asking for a build-level config flag to disable it entirely (e.g., for deployments where AI shouldn't be available).

### Approach

Create a simple config file that controls feature flags at the build/product level. When the AI Coach is disabled via config, the toggle won't appear in the UI and the feature is completely hidden.

### Changes

| File | Change |
|------|--------|
| `src/config/features.ts` (new) | Create a feature flags config with `AI_COACH_ENABLED` boolean |
| `src/components/MathGame.tsx` | Import config, initialize `aiCoachEnabled` based on config flag |
| `src/components/GameControls.tsx` | Only render AI Coach toggle if feature flag is enabled |
| `src/components/GameSummary.tsx` | Check config flag before showing Coach Tobias button |

### Example Config

```typescript
// src/config/features.ts
export const FEATURES = {
  AI_COACH_ENABLED: true, // Set to false to disable AI Coach entirely
} as const;
```

This gives you a single place to flip the switch without touching multiple components.
