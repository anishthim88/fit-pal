import type { WorkoutLog, WorkoutTemplate } from "@/lib/fitness-types";
import { SetRow } from "./set-row";

interface SessionDetailProps {
  template: WorkoutTemplate | undefined;
  log: WorkoutLog;
  onBack: () => void;
  onChange: (log: WorkoutLog) => void;
  onEditPlan: () => void;
}

const MOVEMENT_NAMES: Record<string, string> = {
  "push-up": "Incline push-up", row: "One-arm row", squat: "Squat", hinge: "Hip hinge", lunge: "Reverse lunge",
  "overhead-press": "Shoulder press", plank: "Plank", "glute-bridge": "Glute bridge", "band-row": "Band row",
  "cat-cow": "Cat-cow", "thoracic-rotation": "Thoracic rotation", "dead-bug": "Dead bug", "worlds-greatest-stretch": "World’s greatest stretch",
};

export function SessionDetail({ template, log, onBack, onChange, onEditPlan }: SessionDetailProps) {
  const date = new Date(`${log.dateISO}T12:00:00`);
  const templateExercises = template?.exercises ?? [];

  function updateSet(exerciseIndex: number, setIndex: number, nextSet: WorkoutLog["exercises"][number]["sets"][number]) {
    const exercises = log.exercises.map((exercise, index) => {
      if (index !== exerciseIndex) return exercise;
      const sets = exercise.sets.map((set, currentIndex) => currentIndex === setIndex ? nextSet : set);
      return { ...exercise, sets, completed: sets.length > 0 && sets.every((set) => set.completed) };
    });
    onChange({ ...log, exercises });
  }

  function toggleSessionComplete() {
    onChange({ ...log, completedAt: log.completedAt ? null : new Date().toISOString() });
  }

  return (
    <main className="main-content session-page">
      <button className="back-link" onClick={onBack}><span aria-hidden="true">←</span> Back to week</button>
      <section className="session-heading">
        <div><p className="date-label">{date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p><h1>{log.title}</h1><p className="intro-copy">{log.durationMinutes} minutes · {log.exercises.length} exercises</p></div>
        {log.completedAt ? <span className="completed-pill">Workout complete</span> : <span className="duration-pill">In progress</span>}
      </section>

      {log.exercises.length === 0 ? <section className="no-movements panel"><span className="plan-preview-icon" aria-hidden="true">✳</span><h2>No matching movements yet</h2><p>Your equipment and movement preferences leave this session empty. You can adjust your plan to add exercises that feel suitable.</p><button className="primary-button" onClick={onEditPlan}>Edit my plan</button></section> : <>
        <section className="session-intro panel"><div><h2>Take it at your pace.</h2><p>Adjust reps and load to match how you feel today. You can leave load blank for bodyweight work.</p></div><span aria-hidden="true">☁</span></section>
        <div className="exercise-list">
          {log.exercises.map((exercise, index) => {
            const prescription = templateExercises.find((item) => item.id === exercise.exerciseId);
            const name = prescription?.name ?? MOVEMENT_NAMES[exercise.exerciseId] ?? "Workout movement";
            return <article className="exercise-card" key={`${exercise.exerciseId}-${index}`}>
              <div className="exercise-card-heading"><div className="exercise-index">{String(index + 1).padStart(2, "0")}</div><div><h2>{name}</h2><p>{prescription ? `${prescription.targetSets} sets · ${prescription.targetReps} reps` : `${exercise.sets.length} sets`}</p></div><span className={exercise.completed ? "exercise-status is-done" : "exercise-status"}>{exercise.completed ? "Done" : ""}</span></div>
              <div className="set-table-head"><span>Set</span><span>Reps</span><span>Load</span><span>Complete</span></div>
              <div className="set-list">{exercise.sets.map((set, setIndex) => <SetRow key={`${exercise.exerciseId}-set-${setIndex}`} exerciseName={name} setNumber={setIndex + 1} value={set} onChange={(next) => updateSet(index, setIndex, next)} />)}</div>
            </article>;
          })}
        </div>
        <section className="finish-session-panel">
          <div><h2>{log.completedAt ? "You showed up for yourself." : "That’s your session."}</h2><p>{log.completedAt ? `Completed ${new Date(log.completedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Mark it complete when you’re ready to wrap up."}</p></div>
          <button className={log.completedAt ? "secondary-button" : "primary-button"} onClick={toggleSessionComplete}>{log.completedAt ? "Reopen workout" : "Finish workout"}</button>
        </section>
      </>}
      <p className="session-privacy">Workout details are saved in this browser.</p>
    </main>
  );
}
