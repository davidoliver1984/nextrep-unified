import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeWorkoutEntries } from "@/features/workouts/api/workoutEntries.api";
import { queryKeys } from "@/lib/query/queryKeys";

export function useCompleteJournalWorkoutEntries(journalId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeWorkoutEntries,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.journalWorkouts(journalId),
      }),
  });
}
