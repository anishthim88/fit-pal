import type { FitnessState, Weekday } from "@/lib/fitness-types";
import { localDateISO, weekdayForDate, weekDatesFor } from "@/lib/workout-utils";
import { WeekSummary } from "./week-summary";

interface HomeScreenProps {
  state: FitnessState;
  today: Date;
  onOpenWorkout: (date: Date) => void;
  onEditPlan: () => void;
}

const DAY_LABELS: Record<Weekday, string> = { sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat" };

function dateForOffset(date: Date, offset: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

export function HomeScreen({ state, today, onOpenWorkout, onEditPlan }: HomeScreenProps) {
  const todayISO = localDateISO(today);
  const todayLog = state.logs.find((log) => log.dateISO === todayISO && log.completedAt);
  const nextWorkout = Array.from({ length: 7 }, (_, offset) => dateForOffset(today, offset))
    .map((date) => ({ date, template: state.plan.templates.find((template) => template.dayOfWeek === weekdayForDate(date)) }))
    .find(({ date, template }) => template && !state.logs.some((log) => log.dateISO === localDateISO(date) && log.completedAt));
  const recentLog = [...state.logs].filter((log) => log.completedAt).sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))[0];
  const dates = weekDatesFor(today);
  const completedDates = new Set(state.logs.filter((log) => log.completedAt).map((log) => log.dateISO));

  return (
    <main className="main-content">
      <section className="welcome-row">
        <div>
          <p className="date-label">{today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1>Make today count.</h1>
          <p className="intro-copy">A steady week is built one good session at a time.</p>
        </div>
        <div className="week-count"><span className="week-count-value">{state.plan.templates.length}<span> days</span></span><span className="week-count-label">planned this week</span></div>
      </section>

      <section className="week-strip" aria-label="This week's workout schedule">
        {dates.map((date) => {
          const iso = localDateISO(date);
          const isToday = iso === todayISO;
          const hasWorkout = state.plan.templates.some((template) => template.dayOfWeek === weekdayForDate(date));
          return <div className={isToday ? "week-day is-today" : "week-day"} key={iso} aria-label={`${DAY_LABELS[weekdayForDate(date)]} ${date.getDate()}${hasWorkout ? ", workout planned" : ", rest day"}`}><span className="week-day-label">{DAY_LABELS[weekdayForDate(date)]}</span><span className="week-date">{date.getDate()}</span><span className={completedDates.has(iso) ? "day-dot is-done" : "day-dot"} aria-hidden="true" /></div>;
        })}
      </section>

      <section className="feature-grid">
        <article className="next-workout panel">
          {todayLog ? <>
            <div className="panel-heading"><div><p className="eyebrow">Today</p><h2>Nice work.</h2></div><span className="duration-pill">Done</span></div>
            <p className="panel-copy">You finished {todayLog.title}. Your next session is ready whenever you are.</p>
            <button className="primary-button" onClick={() => onOpenWorkout(today)}>Review workout <span aria-hidden="true">↗</span></button>
          </> : nextWorkout ? <>
            <div className="panel-heading"><div><p className="eyebrow">{nextWorkout.date.toDateString() === today.toDateString() ? "Up next · today" : `Up next · ${nextWorkout.date.toLocaleDateString(undefined, { weekday: "long" })}`}</p><h2>{nextWorkout.template?.title}</h2></div><span className="duration-pill">{nextWorkout.template?.durationMinutes} min</span></div>
            <p className="panel-copy">A session shaped around your goals, available equipment, and time.</p>
            {nextWorkout.template?.exercises.length ? <div className="exercise-preview">{nextWorkout.template.exercises.slice(0, 3).map((exercise) => <span key={exercise.id}>{exercise.name}</span>)}</div> : <p className="small-note">No exercises match your current equipment and movement preferences.</p>}
            <button className="primary-button" onClick={() => onOpenWorkout(nextWorkout.date)}>View workout <span aria-hidden="true">↗</span></button>
          </> : <>
            <div className="panel-heading"><div><p className="eyebrow">Your plan</p><h2>A little breathing room.</h2></div><span className="duration-pill">Rest day</span></div>
            <p className="panel-copy">You’ve checked off this week’s sessions. Take a rest day or adjust your plan to fit your routine.</p>
            <button className="primary-button" onClick={onEditPlan}>Edit my plan <span aria-hidden="true">↗</span></button>
          </>}
          <div className="panel-illustration" aria-hidden="true"><span className="sun-shape" /><span className="hill-shape hill-one" /><span className="hill-shape hill-two" /></div>
        </article>
        <div className="side-stack">
          <WeekSummary state={state} today={today} />
          <article className="recent-activity panel">
            {recentLog ? <><p className="eyebrow">Last session</p><h2>{recentLog.title}</h2><p>{new Date(recentLog.completedAt ?? recentLog.startedAt).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} · {recentLog.durationMinutes} min</p><span className="activity-check" aria-label="Completed">✓</span></> : <><p className="eyebrow">Your activity</p><h2>It starts here.</h2><p>Your completed sessions will show up here.</p></>}
          </article>
        </div>
      </section>

      <section className="schedule-section">
        <div className="section-heading"><div><p className="eyebrow">A plan that fits</p><h2>Your week at a glance</h2></div><button className="text-button" onClick={() => onOpenWorkout(today)}>Open workouts <span aria-hidden="true">↗</span></button></div>
        <div className="schedule-list">
          {state.plan.templates.length ? state.plan.templates.map((template) => <article className="schedule-item" key={template.id}><div className="schedule-date"><span>{DAY_LABELS[template.dayOfWeek]}</span><strong>{template.dayOfWeek.toUpperCase()}</strong></div><div className="schedule-info"><h3>{template.title}</h3><p>{template.durationMinutes} minutes · {template.exercises.length} exercises</p></div><button className="quiet-button" onClick={() => { const target = dates.find((date) => weekdayForDate(date) === template.dayOfWeek) ?? today; onOpenWorkout(target); }}>View</button></article>) : <div className="empty-week"><p>No sessions in your plan yet.</p><button className="text-button" onClick={onEditPlan}>Choose workout days</button></div>}
        </div>
      </section>
    </main>
  );
}
