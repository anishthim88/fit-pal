# Workout-First Personal Fitness App — Design

## Intent

Build a personal fitness app that starts with daily training and workout tracking, then grows into nutrition tracking. Reshape is the product reference: its mobile screens combine a compact home dashboard, a week strip for sessions, detailed set entry, and progress views. The app will use those interaction patterns as evidence while keeping its own name, visual details, and behavior.

## First release

The first release is a mobile-first web app with two working destinations: **Home** and **Workouts**.

- An onboarding flow asks for the user's training focus, experience, available equipment, preferred training days, and usual session length. It also lets the user describe workout history, current or past injuries, and medical conditions or clinician guidance relevant to exercise. Health and injury details are optional. The answers shape an editable starter week and help the user flag movements to avoid; the app does not diagnose, prescribe treatment, or infer health or body measurements from reference screenshots.
- Home summarizes today's planned or completed session, the next workout, and this week's consistency. Quick actions open today's session or the schedule.
- Workouts shows a selectable week strip and scheduled sessions. A session detail view lists exercises and lets the user record sets, reps, and load, mark exercises complete, and finish the session.
- Changes persist in the current browser so a refresh does not lose a workout. The user can revise their schedule and logged sets.
- Profile details, including any optional health context, remain in this browser's local storage for this first release and are not sent to an external service. Onboarding says local storage is not encrypted and makes these questions optional.

Nutrition is a later milestone. It can add meal logging, servings, and daily nutrient totals after the training flow is useful on its own. Progress charts, wearable sync, cloud accounts, photo or voice meal analysis, social features, and an AI coach are later decisions rather than first-release requirements.

## Visual direction

Use the screenshots as references for information hierarchy and mobile flows only. Give the app a light, calm identity with a simple pastel palette:

| Token | Color | Use |
| --- | --- | --- |
| Paper | `#F7F8F5` | Main page background |
| White | `#FFFFFF` | Main cards and sheets |
| Ink | `#28332E` | Primary text and icons |
| Mint | `#CDEBDD` | Completed states and workout highlights |
| Lilac | `#DDD7F4` | Schedule and secondary highlights |
| Peach | `#F5DDCC` | Warm secondary accents |

Use a familiar system sans-serif, sentence-case labels, generous spacing, thin neutral dividers, and a small set of card shapes. Keep pastel fills light enough for dark text to remain legible. Avoid dark surfaces, neon/glow effects, dense gradients, and decorative labels. Build original branding, copy, icons, and components; do not reproduce Reshape's logo, assets, exact screen, or sample health values.

### Layout sketch

Home keeps the next action near the top and uses open space between a few useful sections:

```text
Today                                      profile
Monday, Oct 19

This week                 2 of 4 sessions
M   T   W   T   F   S   S

Next workout               43 min
Upper A                    View workout

Recent activity
Upper A · completed yesterday

Home                         Workouts
```

Workouts uses a horizontal date selector, one clear session card per day, and a focused session detail page. The exercise list keeps the movement name and target visible; each set row groups reps, load, and completion control. On narrow screens, the schedule can scroll horizontally while all editing controls remain full-width and easy to tap.

## Platform and data

Use a responsive Next.js App Router application with TypeScript. The first release is local-first and stores the user's profile, plan, and workout log in browser storage. No external service, account, AI provider, or wearable integration is needed for this milestone. Keep storage behind a small data layer so a future sync option can replace it without changing workout screens.

## Goals and limits

- Make the first app slice usable for planning and recording workouts from a phone.
- Let the user shape the schedule and exercises around their own goal and equipment.
- Keep the later nutrition phase compatible with the Home and Workouts navigation.
- Do not infer personal targets or workout capability from screenshots.
- Do not present automated calorie burn or medical recommendations as measured facts.
- Keep medical and injury questions optional, limited to context relevant to exercise, and do not use them to generate clinical advice.
- Make keyboard focus, touch targets, reduced motion, and narrow-screen layouts part of the interface from the start.

## Decisions left to the implementer

Choose the app's temporary name, implement a small curated starter exercise library, and pick a simple deterministic template rule that turns the setup answers into an editable starter week. Preserve uncertainty where the available profile does not determine a suitable workout; allow the user to edit or skip a session.
