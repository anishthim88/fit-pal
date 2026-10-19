import type {
  EquipmentOption,
  ExercisePrescription,
  FitnessProfile,
  MovementId,
  TrainingGoal,
  Weekday,
  WorkoutPlan,
  WorkoutTemplate,
} from "./fitness-types";

interface ExerciseDefinition {
  id: MovementId;
  name: string;
  equipment: EquipmentOption[];
  goals: TrainingGoal[];
}

const STRENGTH_FITNESS_GOALS: TrainingGoal[] = ["strength", "muscle", "fitness"];

const EXERCISES: ExerciseDefinition[] = [
  { id: "squat", name: "Squat", equipment: ["bodyweight"], goals: STRENGTH_FITNESS_GOALS },
  { id: "hinge", name: "Hip hinge", equipment: ["bodyweight"], goals: STRENGTH_FITNESS_GOALS },
  { id: "push-up", name: "Incline push-up", equipment: ["bodyweight"], goals: STRENGTH_FITNESS_GOALS },
  { id: "row", name: "One-arm row", equipment: ["dumbbells", "gym"], goals: STRENGTH_FITNESS_GOALS },
  { id: "overhead-press", name: "Shoulder press", equipment: ["dumbbells", "gym"], goals: STRENGTH_FITNESS_GOALS },
  { id: "lunge", name: "Reverse lunge", equipment: ["bodyweight"], goals: STRENGTH_FITNESS_GOALS },
  { id: "plank", name: "Plank", equipment: ["bodyweight"], goals: STRENGTH_FITNESS_GOALS },
  { id: "glute-bridge", name: "Glute bridge", equipment: ["bodyweight"], goals: STRENGTH_FITNESS_GOALS },
  { id: "band-row", name: "Band row", equipment: ["bands"], goals: STRENGTH_FITNESS_GOALS },
  { id: "cat-cow", name: "Cat-cow", equipment: ["bodyweight"], goals: ["mobility"] },
  { id: "thoracic-rotation", name: "Thoracic rotation", equipment: ["bodyweight"], goals: ["mobility"] },
  { id: "dead-bug", name: "Dead bug", equipment: ["bodyweight"], goals: ["mobility"] },
  { id: "worlds-greatest-stretch", name: "World’s greatest stretch", equipment: ["bodyweight"], goals: ["mobility"] },
];

const TRAINING_WEEK: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function titleFor(goal: TrainingGoal, dayIndex: number, sessionCount: number): string {
  if (goal === "mobility") return dayIndex % 2 === 0 ? "Mobility and core" : "Easy movement";
  if (goal === "fitness") return dayIndex % 2 === 0 ? "Total body" : "Strength and stamina";
  if (sessionCount === 1) return goal === "strength" ? "Full body strength" : "Full body build";
  if (sessionCount === 2) return dayIndex === 0 ? "Full body A" : "Full body B";
  return ["Full body", "Upper body", "Lower body"][dayIndex % 3];
}

function exercisesFor(profile: FitnessProfile, dayIndex: number): ExercisePrescription[] {
  const avoided = new Set(profile.movementsToAvoid);
  const equipment = new Set(profile.equipment);
  const compatible = EXERCISES.flatMap((exercise) => {
    const selectedEquipment = exercise.equipment.find((item) => equipment.has(item));
    return exercise.goals.includes(profile.trainingGoal) && !avoided.has(exercise.id) && selectedEquipment
      ? [{ ...exercise, equipment: [selectedEquipment] }]
      : [];
  });
  const targetCount = Math.max(2, Math.min(5, Math.floor(profile.sessionDurationMinutes / 8)));
  const rotated = [...compatible.slice(dayIndex % Math.max(compatible.length, 1)), ...compatible.slice(0, dayIndex % Math.max(compatible.length, 1))];
  const selected = rotated.slice(0, targetCount);
  const hasRegularRecentTraining = profile.currentWorkoutFrequency === "3-4" || profile.currentWorkoutFrequency === "5+";
  const sets = profile.experienceLevel === "beginner" || !hasRegularRecentTraining ? 2 : 3;
  const reps = profile.trainingGoal === "strength" ? 8 : profile.trainingGoal === "fitness" ? 12 : 10;

  return selected.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    targetSets: sets,
    targetReps: reps,
    equipment: exercise.equipment,
  }));
}

export function buildStarterPlan(
  profile: FitnessProfile,
  createdAt = new Date(),
): WorkoutPlan {
  const planId = `plan-${createdAt.getTime()}`;
  const selectedDays = TRAINING_WEEK.filter((day) => profile.trainingDays.includes(day));
  const templates: WorkoutTemplate[] = selectedDays.map((dayOfWeek, index) => ({
    id: `${planId}-${dayOfWeek}`,
    dayOfWeek,
    title: titleFor(profile.trainingGoal, index, selectedDays.length),
    focus: profile.trainingGoal,
    experienceLevel: profile.experienceLevel,
    durationMinutes: profile.sessionDurationMinutes,
    exercises: exercisesFor(profile, index),
  }));

  return { id: planId, createdAt: createdAt.toISOString(), templates };
}
