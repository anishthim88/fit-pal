import assert from "node:assert/strict";
import test from "node:test";
import { loadFitnessState, saveFitnessState } from "../src/lib/local-storage.ts";

const state = {
  profile: {
    trainingGoal: "strength",
    experienceLevel: "beginner",
    equipment: ["bodyweight"],
    trainingDays: ["mon"],
    sessionDurationMinutes: 30,
    currentWorkoutFrequency: "none",
    workoutHistory: "",
    healthContext: "",
    injuryHistory: "",
    movementsToAvoid: [],
  },
  plan: { id: "plan-1", createdAt: "2026-10-19T12:00:00.000Z", templates: [] },
  logs: [],
};

function useStorage(initialValue = null) {
  const values = new Map();
  if (initialValue !== null) values.set("fit-pal:v1", initialValue);
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  };
  return values;
}

test("save and load round-trip fitness state", () => {
  const values = useStorage();

  assert.equal(saveFitnessState(state), true);
  assert.deepEqual(loadFitnessState(), state);
  assert.ok(values.has("fit-pal:v1"));
});

test("load returns null for malformed saved data", () => {
  useStorage("not-json");

  assert.equal(loadFitnessState(), null);
});

test("load rejects workout logs with invalid reps or load values", () => {
  const log = {
    id: "workout-1", templateId: "template-1", title: "Full body", durationMinutes: 30,
    dateISO: "2026-10-19", startedAt: "2026-10-19T12:00:00.000Z", completedAt: null,
    exercises: [{ exerciseId: "squat", completed: false, sets: [{ reps: 0, loadKg: null, completed: false }] }],
  };
  const values = useStorage(JSON.stringify({ ...state, logs: [log] }));
  assert.equal(loadFitnessState(), null);

  values.set("fit-pal:v1", JSON.stringify({ ...state, logs: [{ ...log, exercises: [{ ...log.exercises[0], sets: [{ reps: 8, loadKg: -1, completed: false }] }] }] }));
  assert.equal(loadFitnessState(), null);
});

test("save reports unavailable storage without throwing", () => {
  delete globalThis.window;

  assert.equal(saveFitnessState(state), false);
  assert.equal(loadFitnessState(), null);
});
