"use client";

import { useState } from "react";
import type { FitnessState, Weekday, WorkoutLog } from "@/lib/fitness-types";
import { createWorkoutLog, localDateISO, weekdayForDate, weekDatesFor } from "@/lib/workout-utils";
import { SessionDetail } from "./session-detail";

interface WorkoutsScreenProps {
  state: FitnessState;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onLogChange: (log: WorkoutLog) => void;
  onEditPlan: () => void;
}

const DAY_LABELS: Record<Weekday, string> = { sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat" };

function moveDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function WorkoutsScreen({ state, selectedDate, onSelectDate, onLogChange, onEditPlan }: WorkoutsScreenProps) {
  const [activeLog, setActiveLog] = useState<WorkoutLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const dates = weekDatesFor(selectedDate);
  const selectedISO = localDateISO(selectedDate);
  const template = state.plan.templates.find((item) => item.dayOfWeek === weekdayForDate(selectedDate));
  const savedLog = state.logs.find((log) => log.dateISO === selectedISO);
  const openLog = savedLog ?? activeLog;

  function selectDate(date: Date) {
    onSelectDate(date);
    setActiveLog(null);
    setIsDetailOpen(false);
  }

  function startWorkout() {
    if (savedLog) {
      setActiveLog(savedLog);
      setIsDetailOpen(true);
      return;
    }
    if (!template) return;
    const nextLog = createWorkoutLog(template, selectedISO);
    setActiveLog(nextLog);
    setIsDetailOpen(true);
    onLogChange(nextLog);
  }

  function updateLog(nextLog: WorkoutLog) {
    setActiveLog(nextLog);
    onLogChange(nextLog);
  }

  if (isDetailOpen && openLog) {
    return <SessionDetail template={template} log={openLog} onBack={() => setIsDetailOpen(false)} onChange={updateLog} onEditPlan={onEditPlan} />;
  }

  return (
    <main className="main-content workouts-page">
      <section className="workouts-title-row">
        <div><p className="date-label">Make a little room for you</p><h1>Your workouts</h1><p className="intro-copy">Choose a day to see what’s planned.</p></div>
        <button className="text-button edit-schedule-button" onClick={onEditPlan}>Edit my plan <span aria-hidden="true">↗</span></button>
      </section>

      <section className="week-selector-panel" aria-label="Choose a day">
        <div className="week-selector-heading"><button className="week-arrow" aria-label="Previous week" onClick={() => selectDate(moveDays(selectedDate, -7))}>←</button><h2>{dates[0].toLocaleDateString(undefined, { month: "long" })}{dates[0].getMonth() !== dates[6].getMonth() ? ` – ${dates[6].toLocaleDateString(undefined, { month: "long" })}` : ""}</h2><button className="week-arrow" aria-label="Next week" onClick={() => selectDate(moveDays(selectedDate, 7))}>→</button></div>
        <div className="workout-week-strip">
          {dates.map((date) => {
            const iso = localDateISO(date);
            const isCurrent = iso === selectedISO;
            const hasWorkout = state.plan.templates.some((item) => item.dayOfWeek === weekdayForDate(date));
            const isComplete = state.logs.some((log) => log.dateISO === iso && log.completedAt);
            return <button key={iso} className={isCurrent ? "workout-day is-selected" : "workout-day"} aria-current={isCurrent ? "date" : undefined} aria-label={`${DAY_LABELS[weekdayForDate(date)]}, ${date.toLocaleDateString(undefined, { month: "long", day: "numeric" })}${hasWorkout ? ", workout planned" : ", rest day"}${isComplete ? ", completed" : ""}`} onClick={() => selectDate(date)}><span>{DAY_LABELS[weekdayForDate(date)]}</span><strong>{date.getDate()}</strong><i className={isComplete ? "workout-day-dot is-complete" : hasWorkout ? "workout-day-dot is-planned" : "workout-day-dot"} aria-hidden="true" /></button>;
          })}
        </div>
      </section>

      <section className="selected-workout-section">
        <div className="section-heading"><div><p className="eyebrow">{selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p><h2>{savedLog ? (savedLog.completedAt ? "Session complete" : "Session in progress") : template ? "Your session" : "A day to rest"}</h2></div></div>
        {template || savedLog ? <article className="workout-session-card panel">
          <div className="session-card-top"><div className="session-swatch" aria-hidden="true">{savedLog?.completedAt ? "✓" : "✳"}</div><div><p className="eyebrow">{savedLog?.completedAt ? "Completed" : savedLog ? "In progress" : "Planned for you"}</p><h3>{savedLog?.title ?? template?.title}</h3><p>{savedLog?.durationMinutes ?? template?.durationMinutes} min · {savedLog ? savedLog.exercises.length : template?.exercises.length} exercises</p></div></div>
          <div className="session-card-exercises">{(template?.exercises ?? []).slice(0, 4).map((exercise) => <span key={exercise.id}>{exercise.name}</span>)}{template && template.exercises.length > 4 ? <span>+{template.exercises.length - 4} more</span> : null}</div>
          {!savedLog?.completedAt ? <button className="primary-button" onClick={startWorkout}>{savedLog ? "Continue workout" : "Start workout"}<span aria-hidden="true">↗</span></button> : <button className="secondary-button" onClick={startWorkout}>Review workout</button>}
        </article> : <article className="rest-day-card panel"><span className="rest-illustration" aria-hidden="true">☁</span><h3>No workout planned today.</h3><p>Rest is part of a good routine. Pick another day or update your weekly plan if your schedule has changed.</p><button className="secondary-button" onClick={onEditPlan}>Change workout days</button></article>}
      </section>

      <section className="workout-note"><span className="note-dot" aria-hidden="true" /><p>Your schedule is flexible. Update your workout days whenever you need.</p><button className="text-button" onClick={onEditPlan}>Edit plan</button></section>
    </main>
  );
}
