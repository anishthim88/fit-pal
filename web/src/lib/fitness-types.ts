export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export type TrainingGoal = "strength" | "muscle" | "fitness" | "mobility";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type EquipmentOption = "bodyweight" | "dumbbells" | "bands" | "gym";
export type CurrentWorkoutFrequency = "none" | "1-2" | "3-4" | "5+";
export type MovementId =
  | "push-up"
  | "row"
  | "squat"
  | "hinge"
  | "lunge"
  | "overhead-press"
  | "plank"
  | "glute-bridge"
  | "band-row"
  | "cat-cow"
  | "thoracic-rotation"
  | "dead-bug"
  | "worlds-greatest-stretch";

export interface FitnessProfile {
  trainingGoal: TrainingGoal;
  experienceLevel: ExperienceLevel;
  equipment: EquipmentOption[];
  trainingDays: Weekday[];
  sessionDurationMinutes: 20 | 30 | 45 | 60;
  currentWorkoutFrequency: CurrentWorkoutFrequency;
  workoutHistory: string;
  healthContext: string;
  injuryHistory: string;
  movementsToAvoid: MovementId[];
}

export interface ExercisePrescription {
  id: MovementId;
  name: string;
  targetSets: number;
  targetReps: number;
  equipment: EquipmentOption[];
}

export interface WorkoutTemplate {
  id: string;
  dayOfWeek: Weekday;
  title: string;
  focus: TrainingGoal;
  experienceLevel: ExperienceLevel;
  durationMinutes: number;
  exercises: ExercisePrescription[];
}

export interface WorkoutPlan {
  id: string;
  createdAt: string;
  templates: WorkoutTemplate[];
}

export interface SetLog {
  reps: number;
  loadKg: number | null;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: MovementId;
  sets: SetLog[];
  completed: boolean;
}

export interface WorkoutLog {
  id: string;
  templateId: string;
  title: string;
  durationMinutes: number;
  dateISO: string;
  startedAt: string;
  completedAt: string | null;
  exercises: ExerciseLog[];
}

export interface FitnessState {
  profile: FitnessProfile;
  plan: WorkoutPlan;
  logs: WorkoutLog[];
}
