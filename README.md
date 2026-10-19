# Fit Pal

Fit Pal is a personal, local-first workout planner. The first milestone focuses on onboarding, a weekly Home summary, and workout logging. Nutrition can be added in a later milestone.

## Run locally

```sh
cd web
npm install
npm run dev
```

Open `http://localhost:3000`. The app is a Next.js App Router project in [`web/`](web/). The design and implementation notes are in [`docs/`](docs/).

## Current scope

- Onboarding tailors a starter week to training goal, experience, equipment, workout history, preferred days, and session length.
- Injury and exercise-relevant health context are optional. The app only excludes movements the user explicitly selects; it does not diagnose or provide medical advice.
- Profile and workout data are stored in the current browser's unencrypted local storage and are not sent to an external service.
- Home and Workouts are included. Nutrition, accounts, cloud sync, and wearables are later decisions.
