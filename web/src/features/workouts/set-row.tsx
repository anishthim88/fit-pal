import type { SetLog } from "@/lib/fitness-types";

interface SetRowProps {
  exerciseName: string;
  setNumber: number;
  value: SetLog;
  onChange: (value: SetLog) => void;
}

export function SetRow({ exerciseName, setNumber, value, onChange }: SetRowProps) {
  const label = `${exerciseName}, set ${setNumber}`;

  return (
    <div className={value.completed ? "set-row is-complete" : "set-row"}>
      <span className="set-number">{String(setNumber).padStart(2, "0")}</span>
      <label className="set-value-field"><span className="sr-only">{label} reps</span><input aria-label={`${label} reps`} type="number" min="1" max="100" inputMode="numeric" defaultValue={value.reps} onChange={(event) => { const reps = Number(event.target.value); if (Number.isInteger(reps) && reps >= 1 && reps <= 100) onChange({ ...value, reps }); }} onBlur={(event) => { if (!event.currentTarget.value || !Number.isInteger(Number(event.currentTarget.value)) || Number(event.currentTarget.value) < 1 || Number(event.currentTarget.value) > 100) event.currentTarget.value = String(value.reps); }} /><small>reps</small></label>
      <label className="set-value-field"><span className="sr-only">{label} load in kilograms</span><input aria-label={`${label} load in kilograms`} type="number" min="0" step="0.5" inputMode="decimal" placeholder="—" value={value.loadKg ?? ""} onChange={(event) => { if (event.target.value === "") onChange({ ...value, loadKg: null }); else { const loadKg = Number(event.target.value); if (Number.isFinite(loadKg) && loadKg >= 0) onChange({ ...value, loadKg }); } }} /><small>kg</small></label>
      <label className="set-complete-label"><input type="checkbox" checked={value.completed} onChange={(event) => onChange({ ...value, completed: event.target.checked })} /><span>{value.completed ? "Done" : "Mark done"}</span></label>
    </div>
  );
}
