// /src/features/journals/query/useDeleteWorkoutEntryFromJournalWorkouts.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkoutEntry } from "@/features/workouts/api/workoutEntries.api";
import { queryKeys } from "@/lib/query/queryKeys";
import type { Workout } from "@/features/workouts/types/workout";
import { toast } from "@/components/toast/toast.store";
import { toAppError } from "@/lib/http/";

/**
 * Deletes a workout entry (by entryId) while optimistically updating
 * the cached ["journalWorkouts", journalId] list (Workouts with nested entries).
 *
 * Cache shape assumed:
 *   queryKeys.journalWorkouts(journalId) => Workout[]
 * where each Workout may have entries?: WorkoutEntry[]
 */
export function useDeleteWorkoutEntryFromJournalWorkouts(journalId: number) {
  const qc = useQueryClient();
  const key = queryKeys.journalWorkouts(journalId);

  return useMutation({
    mutationFn: (entryId: number) => deleteWorkoutEntry(entryId),

    onMutate: async (entryId) => {
      // cancel in-flight refetches so they don't overwrite our optimistic update
      await qc.cancelQueries({ queryKey: key });

      // snapshot for rollback
      const prev = qc.getQueryData<Workout[]>(key) ?? [];

      // optimistic remove (nested)
      qc.setQueryData<Workout[]>(key, (curr = []) =>
        curr.map((w) => ({
          ...w,
          entries: (w.entries ?? []).filter((e) => e.id !== entryId),
        }))
      );

      return { prev };
    },

    onError: (err, _entryId, ctx) => {
      // rollback
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);

      // UX
      const appErr = toAppError(err);
      toast.error("Delete failed", appErr.message);
    },

    onSettled: () => {
      // ensure server-truth
      void qc.invalidateQueries({ queryKey: key });
    },
  });
}