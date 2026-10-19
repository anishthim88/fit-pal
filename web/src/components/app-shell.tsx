"use client";

import { use } from "react";
import { io } from "next/cache";
import { useCallback, useState, useSyncExternalStore } from "react";
import { BottomNav, type AppTab } from "@/components/bottom-nav";
import { HomeScreen } from "@/features/home/home-screen";
import { SetupScreen } from "@/features/setup/setup-screen";
import { WorkoutsScreen } from "@/features/workouts/workouts-screen";
import type { FitnessProfile, FitnessState, WorkoutLog } from "@/lib/fitness-types";
import { getFitnessStateSnapshot, hasHydrated, hasHydratedOnServer, saveFitnessState, subscribeToFitnessState, subscribeToHydration } from "@/lib/local-storage";
import { buildStarterPlan } from "@/lib/plan-builder";

export function AppShell() {
  use(io());
  const state = useSyncExternalStore(subscribeToFitnessState, getFitnessStateSnapshot, () => null);
  const isHydrated = useSyncExternalStore(subscribeToHydration, hasHydrated, hasHydratedOnServer);
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [today] = useState(() => new Date());
  const [workoutDate, setWorkoutDate] = useState(() => new Date());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);

  const persistState = useCallback((nextState: FitnessState) => {
    setStorageWarning(!saveFitnessState(nextState));
  }, []);

  const handleProfileSave = useCallback((profile: FitnessProfile) => {
    const nextState: FitnessState = {
      profile,
      plan: buildStarterPlan(profile),
      logs: state?.logs ?? [],
    };
    persistState(nextState);
    setIsEditingProfile(false);
    setActiveTab("home");
  }, [persistState, state?.logs]);

  const handleLogChange = useCallback((log: WorkoutLog) => {
    if (!state) return;
    const nextLogs = state.logs.filter((existing) => existing.id !== log.id && existing.dateISO !== log.dateISO);
    persistState({ ...state, logs: [...nextLogs, log] });
  }, [persistState, state]);

  if (!isHydrated) return <main className="loading-screen" aria-live="polite">Getting your week ready…</main>;
  if (!state || isEditingProfile) return <SetupScreen initialProfile={isEditingProfile ? state?.profile : undefined} isEditing={isEditingProfile} onSave={handleProfileSave} onCancel={isEditingProfile ? () => setIsEditingProfile(false) : undefined} />;

  return (
    <div className="app-frame">
      <header className="topbar">
        <a className="wordmark" href="#home" onClick={() => setActiveTab("home")} aria-label="Fit Pal home"><span className="brand-mark" aria-hidden="true">f</span><span>fit pal</span></a>
        <nav className="top-nav" aria-label="Main navigation">
          <button className={activeTab === "home" ? "nav-link is-active" : "nav-link"} aria-current={activeTab === "home" ? "page" : undefined} onClick={() => setActiveTab("home")}>Home</button>
          <button className={activeTab === "workouts" ? "nav-link is-active" : "nav-link"} aria-current={activeTab === "workouts" ? "page" : undefined} onClick={() => setActiveTab("workouts")}>Workouts</button>
        </nav>
        <div className="header-actions"><button className="profile-link" onClick={() => setIsEditingProfile(true)}>Edit my plan</button><span className="avatar-button" aria-label="Your profile">F</span></div>
      </header>

      {storageWarning && <div className="storage-message" role="status">Your changes are saved for this session, but this browser couldn’t store them. They may be lost when you close or refresh this page.</div>}
      {activeTab === "home" ? <HomeScreen state={state} today={today} onOpenWorkout={(date) => { setWorkoutDate(date); setActiveTab("workouts"); }} onEditPlan={() => setIsEditingProfile(true)} /> : <WorkoutsScreen state={state} selectedDate={workoutDate} onSelectDate={setWorkoutDate} onLogChange={handleLogChange} onEditPlan={() => setIsEditingProfile(true)} />}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
