import type {
  EquipmentOption,
  FitnessProfile,
  FitnessState,
  MovementId,
  TrainingGoal,
  WorkoutPlan,
} from "./fitness-types";

const STORAGE_KEY = "fit-pal:v1";
const TRAINING_GOALS: TrainingGoal[] = ["strength", "muscle", "fitness", "mobility"];
const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"];
const EQUIPMENT_OPTIONS: EquipmentOption[] = ["bodyweight", "dumbbells", "bands", "gym"];
const MOVEMENT_IDS: MovementId[] = [
  "push-up", "row", "squat", "hinge", "lunge", "overhead-press", "plank", "glute-bridge", "band-row",
  "cat-cow", "thoracic-rotation", "dead-bug", "worlds-greatest-stretch",
];
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const listeners = new Set<() => void>();
let currentSnapshot: FitnessState | null | undefined;

const getHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function subscribeToHydration(): () => void {
  return () => {};
}

export function hasHydrated(): boolean {
  return getHydrationSnapshot();
}

export function hasHydratedOnServer(): boolean {
  return getServerHydrationSnapshot();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isProfile(value: unknown): value is FitnessProfile {
  if (!isRecord(value)) return false;
  return TRAINING_GOALS.includes(value.trainingGoal as TrainingGoal)
    && EXPERIENCE_LEVELS.includes(value.experienceLevel as string)
    && Array.isArray(value.equipment)
    && value.equipment.every((item) => EQUIPMENT_OPTIONS.includes(item as EquipmentOption))
    && Array.isArray(value.trainingDays)
    && value.trainingDays.every((item) => WEEKDAYS.includes(item as string))
    && [20, 30, 45, 60].includes(value.sessionDurationMinutes as number)
    && ["none", "1-2", "3-4", "5+"].includes(value.currentWorkoutFrequency as string)
    && typeof value.workoutHistory === "string"
    && typeof value.healthContext === "string"
    && typeof value.injuryHistory === "string"
    && Array.isArray(value.movementsToAvoid)
    && value.movementsToAvoid.every((item) => MOVEMENT_IDS.includes(item as MovementId));
}

function isPlan(value: unknown): value is WorkoutPlan {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.createdAt !== "string" || !Array.isArray(value.templates)) {
    return false;
  }
  return value.templates.every((template) => {
    if (!isRecord(template) || typeof template.id !== "string" || !WEEKDAYS.includes(template.dayOfWeek as string)
      || typeof template.title !== "string" || !TRAINING_GOALS.includes(template.focus as TrainingGoal)
      || !EXPERIENCE_LEVELS.includes(template.experienceLevel as string)
      || typeof template.durationMinutes !== "number" || !Array.isArray(template.exercises)) return false;
    return template.exercises.every((exercise) => isRecord(exercise)
      && MOVEMENT_IDS.includes(exercise.id as MovementId)
      && typeof exercise.name === "string"
      && typeof exercise.targetSets === "number"
      && typeof exercise.targetReps === "number"
      && isStringArray(exercise.equipment));
  });
}

function isFitnessState(value: unknown): value is FitnessState {
  if (!isRecord(value) || !isProfile(value.profile) || !isPlan(value.plan) || !Array.isArray(value.logs)) {
    return false;
  }
  return value.logs.every((log) => isRecord(log)
    && typeof log.id === "string"
    && typeof log.templateId === "string"
    && typeof log.title === "string"
    && typeof log.durationMinutes === "number"
    && typeof log.dateISO === "string"
    && typeof log.startedAt === "string"
    && (typeof log.completedAt === "string" || log.completedAt === null)
    && Array.isArray(log.exercises)
    && log.exercises.every((exercise) => isRecord(exercise)
      && MOVEMENT_IDS.includes(exercise.exerciseId as MovementId)
      && typeof exercise.completed === "boolean"
      && Array.isArray(exercise.sets)
      && exercise.sets.every((set) => isRecord(set)
        && typeof set.reps === "number"
        && Number.isInteger(set.reps) && set.reps >= 1 && set.reps <= 100
        && (set.loadKg === null || (typeof set.loadKg === "number" && Number.isFinite(set.loadKg) && set.loadKg >= 0))
        && typeof set.completed === "boolean")));
}

export function loadFitnessState(): FitnessState | null {
  try {
    if (typeof window === "undefined") return null;
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    const value: unknown = JSON.parse(serialized);
    return isFitnessState(value) ? value : null;
  } catch {
    return null;
  }
}

export function getFitnessStateSnapshot(): FitnessState | null {
  if (currentSnapshot === undefined) currentSnapshot = loadFitnessState();
  return currentSnapshot;
}

export function subscribeToFitnessState(listener: () => void): () => void {
  listeners.add(listener);
  const handleStorage = () => {
    currentSnapshot = undefined;
    listeners.forEach((notify) => notify());
  };
  if (typeof window !== "undefined") window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", handleStorage);
  };
}

export function saveFitnessState(state: FitnessState): boolean {
  let saved = false;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      saved = true;
    }
  } catch {
    saved = false;
  }
  currentSnapshot = state;
  listeners.forEach((notify) => notify());
  return saved;
}
