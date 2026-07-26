import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";

import { QueryStatus } from "@/components/query/QueryStatus";
import { toAppError } from "@/lib/http/";

import { useWorkoutDetailQuery } from "@/features/workouts/query/useWorkoutDetailQuery";

export default function WorkoutDetailPage() {
  const params = useParams();
  const workoutId = Number(params.id);

  const q = useWorkoutDetailQuery(workoutId);

  const errorMessage = useMemo(() => {
    if (!q.isError) return null;
    return toAppError(q.error).message;
  }, [q.isError, q.error]);

  if (q.data) {
    return (
      <Navigate
        to={
          q.data.journal_id
            ? `/journals/${q.data.journal_id}/edit?tab=saved`
            : "/journals"
        }
        replace
      />
    );
  }

  return (
    <div>
      <QueryStatus
        isLoading={q.isLoading}
        isError={q.isError}
        errorMessage={errorMessage}
        onRetry={() => void q.refetch()}
        loadingText="Loading workout…"
        isEmpty={!q.isLoading && !q.isError && !q.data}
        emptyText="Workout not found."
      />
    </div>
  );
}
