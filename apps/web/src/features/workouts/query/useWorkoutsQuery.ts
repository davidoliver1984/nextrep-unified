// /src/features/workouts/query/useWorkoutsQuery.ts
import { useQuery } from "@tanstack/react-query";
import type { Workout } from "@/features/workouts/types/workout";
import { fetchWorkouts } from "@/features/workouts/api/workouts.api";
import { queryKeys } from "@/lib/query/queryKeys";

export function useWorkoutsQuery() {
  return useQuery<Workout[], Error>({
    queryKey: queryKeys.workouts(),
    queryFn: ({ signal }) => fetchWorkouts(signal),
    staleTime: 10_000,
  });
}