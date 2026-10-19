import type { Weekday, WorkoutLog, WorkoutTemplate } from "./fitness-types";

export function localDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function weekdayForDate(date: Date): Weekday {
  return (["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const)[date.getDay()];
}

export function weekDatesFor(date: Date): Date[] {
  const mondayOffset = (date.getDay() + 6) % 7;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return day;
  });
}

export function createWorkoutLog(
  template: WorkoutTemplate,
  dateISO: string,
  startedAt = new Date(),
): WorkoutLog {
  return {
    id: `workout-${template.id}-${dateISO}`,
    templateId: template.id,
    title: template.title,
    durationMinutes: template.durationMinutes,
    dateISO,
    startedAt: startedAt.toISOString(),
    completedAt: null,
    exercises: template.exercises.map((exercise) => ({
      exerciseId: exercise.id,
      completed: false,
      sets: Array.from({ length: exercise.targetSets }, () => ({
        reps: exercise.targetReps,
        loadKg: null,
        completed: false,
      })),
    })),
  };
}
