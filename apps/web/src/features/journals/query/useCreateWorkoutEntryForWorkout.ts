// useCreateWorkoutEntryForWorkout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkoutEntry } from "@/features/workouts/api/workoutEntries.api";
import { queryKeys } from "@/lib/query/queryKeys";
import { toCreateWorkoutEntryPayload } from "@/features/workouts/utils/toCreateWorkoutEntryPayload";
import type { WorkoutEntryFieldValues } from "@/features/workouts/utils/validateWorkoutEntryFields";

export function useQuickAddWorkoutEntry(journalId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { workoutId: number; form: WorkoutEntryFieldValues }) => {
      const payload = toCreateWorkoutEntryPayload(vars.form, vars.workoutId);
      return createWorkoutEntry(payload);
    },
    onSuccess: (_created, vars) => {
      void qc.invalidateQueries({ queryKey: queryKeys.workoutEntries(vars.workoutId) });
      void qc.invalidateQueries({ queryKey: queryKeys.journalWorkouts(journalId) });
    },
  });
}
