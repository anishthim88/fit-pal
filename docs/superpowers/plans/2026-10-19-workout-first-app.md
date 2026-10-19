# Workout-First Fitness App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first mobile-first slice of the personal fitness app, focused on Home and workout planning/logging.

**Architecture:** A Next.js App Router client experience holds the profile, generated starter schedule, and workout records in browser storage. Small feature components render setup, Home, the weekly schedule, and session detail; a typed local data layer keeps UI components independent of storage details.

**Tech Stack:** Next.js App Router, TypeScript, React, CSS/Tailwind from the official starter, browser `localStorage`.

**Spec:** [2026-10-19-workout-first-design.md](../specs/2026-10-19-workout-first-design.md)

## Global Constraints

- This milestone includes only Home and Workouts; Nutrition remains a later phase.
- Use the six design tokens in the spec: Paper `#F7F8F5`, White `#FFFFFF`, Ink `#28332E`, Mint `#CDEBDD`, Lilac `#DDD7F4`, Peach `#F5DDCC`.
- Collect workout focus, experience, equipment, preferred training days, session duration, workout history, and optional relevant health/injury context; never copy health measurements or targets from reference screenshots.
- Keep health and injury questions optional and limited to exercise-relevant context. Explain that details stay in this browser's unencrypted local storage, are not sent externally, do not diagnose or provide clinical advice, and only omit movements the user explicitly flags to avoid.
- Persist the profile, plan, and workout log in the current browser; do not add accounts, backend, AI, wearable sync, or external services.
- Keep tap targets comfortable on small phones, maintain visible keyboard focus, and respect reduced-motion preferences.

## Review Focus

- First visit with no saved data: show setup before Home and allow the user to save a complete profile.
- Malformed or unavailable browser storage: keep the app usable in the current session and explain that changes may not persist.
- Editing workout preferences after setup: update future scheduled sessions while preserving completed workout history.
- Optional health details: leaving them blank must still produce a complete plan, and diagnosis text must not trigger inferred medical advice or exercise changes; clearly disclose local unencrypted storage.
- User-marked movement restrictions: exclude explicitly avoided movements from future sessions while retaining workout history.
- Session edits and refresh: preserve set values and completion state after reload.
- Small viewport and keyboard use: keep schedule navigation, set controls, and primary actions reachable and visibly focused.

---

### Task 1: Create the Next.js app shell and pastel visual foundation

**Files:**
- Create: `fitness-app/web/package.json` and Next.js App Router starter files
- Create: `fitness-app/web/src/app/layout.tsx`
- Create: `fitness-app/web/src/app/globals.css`
- Create: `fitness-app/web/src/app/page.tsx`

**Interfaces:**
- Produces: a runnable app shell with global pastel tokens, responsive page frame, and initial Home/Workouts navigation entry points.

- [ ] Scaffold `fitness-app/web` with `create-next-app --yes`, TypeScript, ESLint, Tailwind, and App Router.
- [ ] Replace starter page styling with the spec's Paper/White/Ink/Mint/Lilac/Peach tokens, sentence-case typography, neutral dividers, and reduced-motion handling.
- [ ] Run `npm run build` from `fitness-app/web`; expected result: a successful production build with the starter route.

### Task 2: Define the profile, starter plan, and browser storage boundary

**Files:**
- Create: `fitness-app/web/src/lib/fitness-types.ts`
- Create: `fitness-app/web/src/lib/plan-builder.ts`
- Create: `fitness-app/web/src/lib/local-storage.ts`
- Test: `fitness-app/web/test/plan-builder.test.mjs`
- Test: `fitness-app/web/test/local-storage.test.mjs`

**Interfaces:**
- Produces: `FitnessProfile` (including training preferences, workout history, optional exercise-relevant health context, and explicit movements to avoid), `WorkoutPlan`, `WorkoutSession`, and `FitnessState` types.
- Produces: `buildStarterPlan(profile: FitnessProfile): WorkoutPlan`.
- Produces: `loadFitnessState(): FitnessState | null` and `saveFitnessState(state: FitnessState): boolean`.

- [ ] Define the typed profile and workout record shapes used by setup, Home, and Workouts.
- [ ] Implement a deterministic template rule that maps selected days, focus, experience, equipment, and session duration to editable sessions using a small curated exercise list; exclude only movements the user explicitly marks to avoid, without inferring restrictions from medical-condition text.
- [ ] Implement versioned local storage with guarded access and JSON parsing; return `null` for absent/invalid saved state and `false` when saving is unavailable.
- [ ] Run `npm test`; expected result: plan customization, movement exclusions, and guarded storage behavior pass.
- [ ] Run `npm run build`; expected result: the app compiles with the new types and storage modules.

### Task 3: Add first-run setup, preference editing, and a shared app shell

**Files:**
- Create: `fitness-app/web/src/components/app-shell.tsx`
- Create: `fitness-app/web/src/components/bottom-nav.tsx`
- Create: `fitness-app/web/src/features/setup/setup-screen.tsx`
- Modify: `fitness-app/web/src/components/app-shell.tsx`
- Modify: `fitness-app/web/src/app/page.tsx`

**Interfaces:**
- Consumes: `FitnessState`, `buildStarterPlan`, `loadFitnessState`, and `saveFitnessState` from Task 2.
- Produces: first-run onboarding and editable workout preferences, plus Home/Workouts navigation and a storage-unavailable status message.

- [ ] Load saved state after client mount and show a brief neutral loading state until storage is checked.
- [ ] Show onboarding when there is no valid profile; collect focus, experience, equipment, training days, session duration, and current workout history.
- [ ] Add optional questions for exercise-relevant medical/clinician guidance, current or past injuries, and movements to avoid. Explain that the information stays in this browser and is not medical advice; allow skipping those questions without blocking plan creation.
- [ ] On save, build the starter plan, persist state, and open Home; if storage is unavailable, keep the created state in memory and explain the persistence limit.
- [ ] Add an Edit plan action that reuses the validated preference form; rebuilding a plan changes only future sessions and retains completed workout history.
- [ ] Manually check a clean browser profile, a saved profile after refresh, invalid storage, and editing preferences after a completed session; expected result: each reaches the appropriate app state without a crash or lost history.

### Task 4: Build Home around today's next workout

**Files:**
- Create: `fitness-app/web/src/features/home/home-screen.tsx`
- Create: `fitness-app/web/src/features/home/week-summary.tsx`
- Modify: `fitness-app/web/src/app/globals.css`

**Interfaces:**
- Consumes: `FitnessState` and the active date from the app shell.
- Produces: a Home screen with today's date, weekly session count, next workout card, recent completion, and a direct action to view/start a session.

- [ ] Render a selected-day summary and current week's scheduled/completed count from saved state.
- [ ] Show the next scheduled session with focus, duration, and a View workout action; show a clear empty state when today's rest day has no session.
- [ ] Apply the layout sketch from the spec with an airy pastel card hierarchy and original app label/icon treatment.
- [ ] Manually check a training day, a rest day, and a completed session; expected result: Home presents the correct next action and weekly count.

### Task 5: Build the weekly workout schedule and session logger

**Files:**
- Create: `fitness-app/web/src/features/workouts/workouts-screen.tsx`
- Create: `fitness-app/web/src/features/workouts/session-detail.tsx`
- Create: `fitness-app/web/src/features/workouts/set-row.tsx`
- Create: `fitness-app/web/src/lib/workout-utils.ts`
- Test: `fitness-app/web/test/workout-utils.test.mjs`
- Modify: `fitness-app/web/src/app/page.tsx`
- Modify: `fitness-app/web/src/app/globals.css`

**Interfaces:**
- Consumes: `WorkoutSession`, `FitnessState`, `saveFitnessState`, and navigation callbacks from Task 3.
- Produces: week-day selection, scheduled session cards, set/reps/load editing, per-set completion, session completion, and persisted workout history.

- [ ] Render a horizontally scrollable week selector and the sessions scheduled for the selected date.
- [ ] Open a focused session view with exercise names, set rows, reps/load inputs, and completion controls; allow the user to return to the week without losing edits.
- [ ] Persist each edit and completion action; preserve completed records when the user changes future schedule preferences.
- [ ] Manually check selecting dates, editing a set, refreshing, completing a session, and revisiting Home; expected result: values and completion state remain consistent.
- [ ] Run `npm test`; expected result: session log defaults and workout plan behaviors pass.
- [ ] Run `npm run build`; expected result: successful production build for the completed first slice.
