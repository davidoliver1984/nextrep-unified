// useWorkoutTabs.ts
import { useMemo } from "react";
import type { TabItem } from "@/features/journals/components/Tabs";

export type WorkoutTab = "saved" | "new" | "templates" | "images";

export function useWorkoutTabs(savedCount: number) {
  return useMemo(
    () =>
      [
        { key: "saved", label: "Saved Workouts", count: savedCount },
        { key: "new", label: "New Workout" },
        { key: "templates", label: "Templates" },
        { key: "images", label: "Images" },
      ] satisfies readonly TabItem<WorkoutTab>[],
    [savedCount]
  );
}
