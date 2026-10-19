import type { FitnessState } from "@/lib/fitness-types";
import { localDateISO, weekDatesFor } from "@/lib/workout-utils";

interface WeekSummaryProps {
  state: FitnessState;
  today: Date;
}

export function WeekSummary({ state, today }: WeekSummaryProps) {
  const dates = weekDatesFor(today);
  const planned = state.plan.templates.length;
  const completed = state.logs.filter((log) => log.completedAt && dates.some((date) => localDateISO(date) === log.dateISO)).length;
  const completionPercent = planned === 0 ? 0 : Math.min(100, Math.round((completed / planned) * 100));

  return (
    <article className="week-summary panel">
      <div className="summary-title-row"><h2>This week</h2><span className="summary-icon" aria-hidden="true">✳</span></div>
      <p><strong>{completed} of {planned}</strong> sessions complete</p>
      <div className="progress-track" role="img" aria-label={`${completed} of ${planned} weekly sessions complete`}><span style={{ width: `${completionPercent}%` }} /></div>
      <p className="small-note">A little consistency goes a long way. Keep your week flexible.</p>
    </article>
  );
}
