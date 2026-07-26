// /src/features/workouts/query/useWorkoutDetailQuery.ts
import { useQuery } from "@tanstack/react-query";
import type { Workout } from "@/features/workouts/types/workout";
import { fetchWorkoutDetail } from "@/features/workouts/api/workouts.api";
import { queryKeys } from "@/lib/query/queryKeys";

export function useWorkoutDetailQuery(workoutId: number) {
  return useQuery<Workout, Error>({
    queryKey: queryKeys.workoutDetail(workoutId),
    queryFn: ({ signal }) => fetchWorkoutDetail(workoutId, signal),
    enabled: Number.isFinite(workoutId) && workoutId > 0,
    staleTime: 10_000,
  });
}