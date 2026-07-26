// useJournalTab.ts (or rename to useWorkoutTabParam.ts)
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { WorkoutTab } from "@/features/journals/hooks/useWorkoutTabs";

const WORKOUT_TABS: readonly WorkoutTab[] = ["saved", "new", "templates", "images"];

function isWorkoutTab(v: string | null): v is WorkoutTab {
  return v != null && (WORKOUT_TABS as readonly string[]).includes(v);
}

export function useWorkoutTabParam(defaultTab: WorkoutTab = "saved") {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab: WorkoutTab = useMemo(() => {
    const raw = searchParams.get("tab");
    return isWorkoutTab(raw) ? raw : defaultTab;
  }, [searchParams, defaultTab]);

  const setTab = useCallback(
    (next: WorkoutTab) => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("tab", next);
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return { tab, setTab };
}
