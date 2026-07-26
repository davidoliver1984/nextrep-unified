import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteWorkout } from "@/features/workouts/api/workouts.api";
import { queryKeys } from "@/lib/query/queryKeys";

export function useDeleteJournalWorkout(journalId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutId: number) => deleteWorkout(workoutId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.journalWorkouts(journalId),
      });
    },
  });
}
