import assert from "node:assert/strict";
import test from "node:test";
import { buildStarterPlan } from "../src/lib/plan-builder.ts";

const profile = {
  trainingGoal: "strength",
  experienceLevel: "beginner",
  equipment: ["bodyweight", "dumbbells"],
  trainingDays: ["mon", "fri"],
  sessionDurationMinutes: 30,
  currentWorkoutFrequency: "1-2",
  workoutHistory: "I enjoy short strength sessions.",
  healthContext: "",
  injuryHistory: "",
  movementsToAvoid: ["push-up"],
};

test("starter plan follows selected days and excludes user-avoided moves", () => {
  const plan = buildStarterPlan(profile, new Date("2026-10-19T12:00:00.000Z"));

  assert.deepEqual(plan.templates.map((template) => template.dayOfWeek), ["mon", "fri"]);
  assert.ok(plan.templates.every((template) => template.durationMinutes === 30));
  assert.ok(plan.templates.every((template) => template.exercises.every((exercise) => exercise.id !== "push-up")));
  assert.ok(plan.templates.every((template) => template.exercises.every((exercise) =>
    exercise.equipment.every((item) => profile.equipment.includes(item)),
  )));
});

test("starter plan preserves training goal and experience in template labels", () => {
  const plan = buildStarterPlan(profile, new Date("2026-10-19T12:00:00.000Z"));

  assert.ok(plan.templates.every((template) => template.focus === "strength"));
  assert.ok(plan.templates.every((template) => template.experienceLevel === "beginner"));
});

test("training history sets a conservative volume when someone is returning", () => {
  const returningProfile = { ...profile, experienceLevel: "intermediate", currentWorkoutFrequency: "none" };
  const regularProfile = { ...profile, experienceLevel: "intermediate", currentWorkoutFrequency: "3-4" };
  const returningPlan = buildStarterPlan(returningProfile, new Date("2026-10-19T12:00:00.000Z"));
  const regularPlan = buildStarterPlan(regularProfile, new Date("2026-10-19T12:00:00.000Z"));

  assert.ok(returningPlan.templates.every((template) => template.exercises.every((exercise) => exercise.targetSets === 2)));
  assert.ok(regularPlan.templates.every((template) => template.exercises.every((exercise) => exercise.targetSets === 3)));
});

test("mobility goal selects mobility-focused exercises", () => {
  const mobilityProfile = { ...profile, trainingGoal: "mobility", movementsToAvoid: [] };
  const plan = buildStarterPlan(mobilityProfile, new Date("2026-10-19T12:00:00.000Z"));
  const mobilityMoves = new Set(["cat-cow", "thoracic-rotation", "dead-bug", "worlds-greatest-stretch"]);

  assert.ok(plan.templates.every((template) => template.exercises.length > 0));
  assert.ok(plan.templates.every((template) => template.exercises.every((exercise) => mobilityMoves.has(exercise.id))));
});

test("plan can be empty when all compatible movements are explicitly avoided", () => {
  const restrictedProfile = {
    ...profile,
    equipment: ["bodyweight"],
    movementsToAvoid: ["squat", "lunge", "hinge", "push-up", "plank", "glute-bridge"],
  };

  const plan = buildStarterPlan(restrictedProfile, new Date("2026-10-19T12:00:00.000Z"));

  assert.ok(plan.templates.every((template) => template.exercises.length === 0));
});
