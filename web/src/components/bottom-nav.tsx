"use client";

export type AppTab = "home" | "workouts";

interface BottomNavProps {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button className={activeTab === "home" ? "bottom-nav-item is-active" : "bottom-nav-item"} aria-current={activeTab === "home" ? "page" : undefined} onClick={() => onChange("home")}><span aria-hidden="true">⌂</span>Home</button>
      <button className={activeTab === "workouts" ? "bottom-nav-item is-active" : "bottom-nav-item"} aria-current={activeTab === "workouts" ? "page" : undefined} onClick={() => onChange("workouts")}><span aria-hidden="true">↗</span>Workouts</button>
    </nav>
  );
}
