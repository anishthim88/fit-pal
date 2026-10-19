import assert from "node:assert/strict";
import test from "node:test";
import { createWorkoutLog } from "../src/lib/workout-utils.ts";

test("new workout log starts with the template's empty set rows", () => {
  const template = {
    id: "plan-1-mon",
    dayOfWeek: "mon",
    title: "Full body A",
    focus: "strength",
    experienceLevel: "beginner",
    durationMinutes: 30,
    exercises: [{ id: "squat", name: "Squat", targetSets: 2, targetReps: 8, equipment: ["bodyweight"] }],
  };

  const log = createWorkoutLog(template, "2026-10-19", new Date("2026-10-19T08:00:00.000Z"));

  assert.equal(log.title, "Full body A");
  assert.equal(log.completedAt, null);
  assert.deepEqual(log.exercises[0].sets, [
    { reps: 8, loadKg: null, completed: false },
    { reps: 8, loadKg: null, completed: false },
  ]);
});
