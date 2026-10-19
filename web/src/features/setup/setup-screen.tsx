"use client";

import { useState } from "react";
import type {
  CurrentWorkoutFrequency,
  EquipmentOption,
  FitnessProfile,
  MovementId,
  TrainingGoal,
  Weekday,
} from "@/lib/fitness-types";

interface SetupScreenProps {
  initialProfile?: FitnessProfile;
  isEditing?: boolean;
  onSave: (profile: FitnessProfile) => void;
  onCancel?: () => void;
}

const GOALS: { id: TrainingGoal; title: string; description: string }[] = [
  { id: "strength", title: "Build strength", description: "Feel stronger in everyday movements." },
  { id: "muscle", title: "Build muscle", description: "Use a steady, progressive routine." },
  { id: "fitness", title: "Improve fitness", description: "Build a little more energy and stamina." },
  { id: "mobility", title: "Move more easily", description: "Make room for mobility and core work." },
];

const EQUIPMENT: { id: EquipmentOption; title: string }[] = [
  { id: "bodyweight", title: "Bodyweight only" },
  { id: "dumbbells", title: "Dumbbells" },
  { id: "bands", title: "Resistance bands" },
  { id: "gym", title: "Gym machines and weights" },
];

const DAYS: { id: Weekday; title: string }[] = [
  { id: "mon", title: "Mon" }, { id: "tue", title: "Tue" }, { id: "wed", title: "Wed" },
  { id: "thu", title: "Thu" }, { id: "fri", title: "Fri" }, { id: "sat", title: "Sat" }, { id: "sun", title: "Sun" },
];

const AVOID_MOVEMENTS: { id: MovementId; title: string }[] = [
  { id: "squat", title: "Squats" }, { id: "hinge", title: "Hip hinges" }, { id: "lunge", title: "Lunges" },
  { id: "push-up", title: "Push-ups" }, { id: "row", title: "Rows" }, { id: "overhead-press", title: "Overhead press" },
  { id: "plank", title: "Planks" }, { id: "glute-bridge", title: "Glute bridges" }, { id: "band-row", title: "Band rows" },
  { id: "cat-cow", title: "Cat-cow" }, { id: "thoracic-rotation", title: "Thoracic rotations" },
  { id: "dead-bug", title: "Dead bugs" }, { id: "worlds-greatest-stretch", title: "World’s greatest stretch" },
];

const FREQUENCIES: { id: CurrentWorkoutFrequency; title: string; description: string }[] = [
  { id: "none", title: "I’m just getting started", description: "No regular routine right now." },
  { id: "1-2", title: "1–2 days a week", description: "A couple of sessions most weeks." },
  { id: "3-4", title: "3–4 days a week", description: "Training is part of my routine." },
  { id: "5+", title: "5 or more days", description: "I’m used to a frequent schedule." },
];

const EMPTY_PROFILE: FitnessProfile = {
  trainingGoal: "strength",
  experienceLevel: "beginner",
  equipment: ["bodyweight"],
  trainingDays: ["mon", "wed", "fri"],
  sessionDurationMinutes: 30,
  currentWorkoutFrequency: "none",
  workoutHistory: "",
  healthContext: "",
  injuryHistory: "",
  movementsToAvoid: [],
};

const STEP_TITLES = ["Your focus", "Your setup", "Your experience", "Your comfort", "Your week"];

export function SetupScreen({ initialProfile, isEditing = false, onSave, onCancel }: SetupScreenProps) {
  const [profile, setProfile] = useState<FitnessProfile>(() => initialProfile ?? EMPTY_PROFILE);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  function update<K extends keyof FitnessProfile>(key: K, value: FitnessProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function toggle<T extends string>(key: "equipment" | "trainingDays" | "movementsToAvoid", value: T) {
    setProfile((current) => {
      const values = current[key] as string[];
      const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      return { ...current, [key]: next } as FitnessProfile;
    });
  }

  function toggleEquipment(value: EquipmentOption) {
    setProfile((current) => {
      if (value === "bodyweight") return { ...current, equipment: ["bodyweight"] };
      const selected = current.equipment.filter((item) => item !== "bodyweight");
      const next = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
      return { ...current, equipment: ["bodyweight", ...next] };
    });
  }

  function continueSetup() {
    if (step === 1 && profile.equipment.length === 0) {
      setError("Choose at least one equipment option so we can build your sessions.");
      return;
    }
    if (step === 4 && profile.trainingDays.length === 0) {
      setError("Choose at least one day for your workouts.");
      return;
    }
    setError("");
    if (step === STEP_TITLES.length - 1) onSave(profile);
    else setStep((current) => current + 1);
  }

  return (
    <main className="setup-page">
      <section className="setup-card" aria-labelledby="setup-title">
        <div className="setup-topline">
          <a className="wordmark" href="#top" aria-label="Fit Pal"><span className="brand-mark" aria-hidden="true">f</span><span>fit pal</span></a>
          {isEditing && onCancel ? <button className="quiet-button" onClick={onCancel}>Close</button> : <span className="setup-private">Your plan stays yours</span>}
        </div>
        <div className="setup-progress" aria-label={`Step ${step + 1} of ${STEP_TITLES.length}`}>
          <div className="setup-progress-track"><span style={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }} /></div>
          <p>Step {step + 1} of {STEP_TITLES.length}<span>{STEP_TITLES[step]}</span></p>
        </div>

        {step === 0 && (
          <div className="setup-step">
            <p className="eyebrow">Start with what matters to you</p>
            <h1 id="setup-title">What would you like to work on?</h1>
            <p className="setup-intro">We’ll use your answers to shape a practical first week. You can change your plan any time.</p>
            <div className="choice-grid">
              {GOALS.map((goal) => <button key={goal.id} className={profile.trainingGoal === goal.id ? "choice-card is-selected" : "choice-card"} aria-pressed={profile.trainingGoal === goal.id} onClick={() => update("trainingGoal", goal.id)}><span className="choice-radio" aria-hidden="true" /><strong>{goal.title}</strong><small>{goal.description}</small></button>)}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="setup-step">
            <p className="eyebrow">Make it work where you are</p>
            <h1 id="setup-title">What can you train with?</h1>
            <p className="setup-intro">Select everything you have access to. We’ll use only exercises that fit your equipment.</p>
            <div className="equipment-grid">
              {EQUIPMENT.map((item) => { const selected = item.id === "bodyweight" ? profile.equipment.length === 1 : profile.equipment.includes(item.id); return <button key={item.id} className={selected ? "equipment-option is-selected" : "equipment-option"} aria-pressed={selected} onClick={() => toggleEquipment(item.id)}><span className="check-box" aria-hidden="true">{selected ? "✓" : ""}</span>{item.title}</button>; })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="setup-step">
            <p className="eyebrow">A little context helps</p>
            <h1 id="setup-title">What has training looked like for you?</h1>
            <p className="setup-intro">There’s no right answer. This helps us set a sensible starting pace.</p>
            <div className="frequency-list">
              {FREQUENCIES.map((item) => <button key={item.id} className={profile.currentWorkoutFrequency === item.id ? "frequency-option is-selected" : "frequency-option"} aria-pressed={profile.currentWorkoutFrequency === item.id} onClick={() => update("currentWorkoutFrequency", item.id)}><span className="choice-radio" aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.description}</small></span></button>)}
            </div>
            <label className="field-label" htmlFor="workout-history">Anything else about your workout history? <span>Optional</span></label>
            <textarea id="workout-history" className="text-field" rows={3} maxLength={500} placeholder="Types of training you’ve tried, what you enjoyed, or what you’d like to do differently" value={profile.workoutHistory} onChange={(event) => update("workoutHistory", event.target.value)} />
          </div>
        )}

        {step === 3 && (
          <div className="setup-step">
            <p className="eyebrow">Move in a way that feels right</p>
            <h1 id="setup-title">Anything we should keep in mind?</h1>
            <p className="setup-intro">These questions are optional. Share only what you’re comfortable storing in this browser.</p>
            <label className="field-label" htmlFor="injury-history">Current or past injuries, or movement limitations <span>Optional</span></label>
            <textarea id="injury-history" className="text-field" rows={3} maxLength={500} placeholder="For example, a past shoulder injury or movements that don’t feel comfortable" value={profile.injuryHistory} onChange={(event) => update("injuryHistory", event.target.value)} />
            <p className="field-label">Which movements should we leave out?</p>
            <div className="avoid-grid">
              {AVOID_MOVEMENTS.map((item) => <label className="check-option" key={item.id}><input type="checkbox" checked={profile.movementsToAvoid.includes(item.id)} onChange={() => toggle("movementsToAvoid", item.id)} /><span>{item.title}</span></label>)}
            </div>
            <label className="field-label" htmlFor="health-context">Medical conditions or clinician guidance relevant to exercise <span>Optional</span></label>
            <textarea id="health-context" className="text-field" rows={3} maxLength={500} placeholder="Only details you want to keep with your plan" value={profile.healthContext} onChange={(event) => update("healthContext", event.target.value)} />
            <div className="privacy-note"><strong>Your information stays in this browser.</strong> It is stored in unencrypted browser storage and is not sent to an external service. Fit Pal doesn’t diagnose conditions or give medical advice. If you’re unsure what exercise is suitable, follow guidance from your clinician.</div>
          </div>
        )}

        {step === 4 && (
          <div className="setup-step">
            <p className="eyebrow">Build a week you can keep</p>
            <h1 id="setup-title">When do you want to train?</h1>
            <p className="setup-intro">Pick the days that usually work. Your schedule stays flexible.</p>
            <div className="day-picker" role="group" aria-label="Preferred workout days">
              {DAYS.map((day) => <button key={day.id} className={profile.trainingDays.includes(day.id) ? "day-choice is-selected" : "day-choice"} aria-pressed={profile.trainingDays.includes(day.id)} onClick={() => toggle("trainingDays", day.id)}><span>{day.title}</span><span className="day-choice-check" aria-hidden="true">{profile.trainingDays.includes(day.id) ? "✓" : ""}</span></button>)}
            </div>
            <fieldset className="duration-fieldset"><legend>How long should a workout take?</legend><div className="duration-options">{([20, 30, 45, 60] as const).map((minutes) => <button type="button" key={minutes} className={profile.sessionDurationMinutes === minutes ? "duration-choice is-selected" : "duration-choice"} aria-pressed={profile.sessionDurationMinutes === minutes} onClick={() => update("sessionDurationMinutes", minutes)}>{minutes} min</button>)}</div></fieldset>
            <fieldset className="experience-fieldset"><legend>How experienced are you with strength training?</legend><div className="duration-options">{(["beginner", "intermediate", "advanced"] as const).map((level) => <button type="button" key={level} className={profile.experienceLevel === level ? "duration-choice is-selected" : "duration-choice"} aria-pressed={profile.experienceLevel === level} onClick={() => update("experienceLevel", level)}>{level[0].toUpperCase() + level.slice(1)}</button>)}</div></fieldset>
            <div className="plan-preview"><span className="plan-preview-icon" aria-hidden="true">✳</span><span><strong>Your first week will be ready to edit.</strong><small>{profile.trainingDays.length} training days · {profile.sessionDurationMinutes} minutes each · {GOALS.find((goal) => goal.id === profile.trainingGoal)?.title}</small></span></div>
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="setup-actions">
          {step > 0 ? <button className="back-button" onClick={() => { setError(""); setStep((current) => current - 1); }}>Back</button> : <span />}
          <button className="primary-button" onClick={continueSetup}>{step === STEP_TITLES.length - 1 ? (isEditing ? "Save my plan" : "Create my plan") : "Continue"}<span aria-hidden="true">↗</span></button>
        </div>
      </section>
    </main>
  );
}
