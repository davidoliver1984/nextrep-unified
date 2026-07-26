import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { QueryStatus } from "@/components/query/QueryStatus";
import { toAppError } from "@/lib/http/";

import { useWorkoutsQuery } from "@/features/workouts/query/useWorkoutsQuery";
import type { Workout } from "@/features/workouts/types/workout";

type SortMode = "dateDesc" | "dateAsc" | "newestId";

function sortWorkouts(workouts: Workout[], sortMode: SortMode) {
  const copy = [...workouts];

  if (sortMode === "newestId") {
    copy.sort((a, b) => b.id - a.id);
    return copy;
  }

  const toTime = (d: string | null) => (d ? new Date(d).getTime() : 0);

  if (sortMode === "dateDesc") copy.sort((a, b) => toTime(b.date) - toTime(a.date));
  if (sortMode === "dateAsc") copy.sort((a, b) => toTime(a.date) - toTime(b.date));

  return copy;
}

export default function WorkoutsPage() {
  const q = useWorkoutsQuery();
  const [sortMode, setSortMode] = useState<SortMode>("dateDesc");

  const sorted = useMemo(() => sortWorkouts(q.data ?? [], sortMode), [q.data, sortMode]);

  const errorMessage = useMemo(() => {
    if (!q.isError) return null;
    return toAppError(q.error).message;
  }, [q.isError, q.error]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Workouts</h1>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Sort:
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
            <option value="dateDesc">Date (new → old)</option>
            <option value="dateAsc">Date (old → new)</option>
            <option value="newestId">Newest created</option>
          </select>
        </label>
      </div>

      <QueryStatus
        isLoading={q.isLoading}
        isError={q.isError}
        errorMessage={errorMessage}
        onRetry={() => void q.refetch()}
        loadingText="Loading workouts…"
        isEmpty={!q.isLoading && !q.isError && sorted.length === 0}
        emptyText="No workouts yet."
      />

      {!q.isLoading && !q.isError && sorted.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          {sorted.map((w) => (
            <li key={w.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "grid" }}>
                  <strong>{w.title}</strong>
                  <span style={{ fontSize: 12, opacity: 0.75 }}>
                    {w.date ?? "No date"}
                  </span>
                </div>

                <Link
                  to={
                    w.journal_id
                      ? `/journals/${w.journal_id}/edit?tab=saved`
                      : "/journals"
                  }
                >
                  View →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
