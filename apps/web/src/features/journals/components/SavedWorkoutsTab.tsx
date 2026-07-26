import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { QueryStatus } from "@/components/query/QueryStatus";
import { WorkoutCard } from "@/features/journals/components/WorkoutCard";

import { useExercises } from "@/features/exercises/hooks/useExercises";
import { useQuickAddWorkoutEntry } from "@/features/journals/query/useCreateWorkoutEntryForWorkout";
import { useJournalWorkouts } from "@/features/journals/query/useJournalWorkoutsQuery";

import { useDeleteWorkoutEntryFromJournalWorkouts } from "@/features/journals/query/useDeleteWorkoutEntryFromJournalWorkouts";
import { useDeleteJournalWorkout } from "@/features/journals/query/useDeleteJournalWorkout";
import { useCompleteJournalWorkoutEntries } from "@/features/journals/query/useCompleteJournalWorkoutEntries";
import { patchWorkoutEntry } from "@/features/workouts/api/workoutEntries.api";

import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";
import { toPatchWorkoutEntryPayload } from "@/features/workouts/utils/toPatchWorkoutEntryPayload";
import { queryKeys } from "@/lib/query/queryKeys";
import { toAppError } from "@/lib/http";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/toast/toast.store";

export function SavedWorkoutsTab({ journalId }: { journalId: number }) {
  const queryClient = useQueryClient();
  const [workoutToDeleteId, setWorkoutToDeleteId] = useState<number | null>(null);

  const journalWorkoutsQuery = useJournalWorkouts(journalId);
  //console.log("journalWorkoutsQuery.data", journalWorkoutsQuery.data);
  const workouts = journalWorkoutsQuery.data ?? [];

  const exercisesQuery = useExercises();
  const exercises = useMemo(
    () => exercisesQuery.data ?? [],
    [exercisesQuery.data]
  );

  const quickAdd = useQuickAddWorkoutEntry(journalId);

  const deleteEntry = useDeleteWorkoutEntryFromJournalWorkouts(journalId);
  const deleteWorkout = useDeleteJournalWorkout(journalId);
  const completeEntries = useCompleteJournalWorkoutEntries(journalId);

  const workoutToDelete = workouts.find((workout) => workout.id === workoutToDeleteId);

  async function confirmDeleteWorkout() {
    if (workoutToDeleteId == null) return;

    try {
      await deleteWorkout.mutateAsync(workoutToDeleteId);
      toast.success("Workout deleted");
      setWorkoutToDeleteId(null);
    } catch (err) {
      toast.error("Delete failed", toAppError(err).message);
    }
  }

  const handlePatchEntry = async (entryId: number, patch: Partial<WorkoutEntry>) => {
    await patchWorkoutEntry(entryId, toPatchWorkoutEntryPayload(patch));
    await queryClient.invalidateQueries({
      queryKey: queryKeys.journalWorkouts(journalId),
    });
  };

  const handleRemoveEntry = (entryId: number) =>
    deleteEntry.mutateAsync(entryId);

  // status gate for workouts (and optionally exercises too)
  if (journalWorkoutsQuery.isLoading || journalWorkoutsQuery.isError) {
    const msg = journalWorkoutsQuery.isError
      ? toAppError(journalWorkoutsQuery.error).message
      : null;

    return (
      <QueryStatus
        isLoading={journalWorkoutsQuery.isLoading}
        isError={journalWorkoutsQuery.isError}
        errorMessage={msg}
        loadingText="Loading saved workouts…"
        onRetry={() => journalWorkoutsQuery.refetch()}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {workouts.map((w) => (
        <WorkoutCard
          key={w.id}
          workout={w}
          exercises={exercises}
          onPatch={handlePatchEntry}
          onRemove={handleRemoveEntry}
          onQuickAddCreate={async (workoutId, form) => {
            try {
              await quickAdd.mutateAsync({ workoutId, form });
              toast.success("Workout entry added");
            } catch (err) {
              toast.error("Add entry failed", toAppError(err).message);
              throw err;
            }
          }}
          onDeleteWorkout={setWorkoutToDeleteId}
          onCompleteAll={async (workoutId) => {
            try {
              await completeEntries.mutateAsync(workoutId);
              toast.success("Workout marked complete");
            } catch (err) {
              toast.error("Completion failed", toAppError(err).message);
            }
          }}
          completingAll={completeEntries.isPending}

        />
      ))}

      <ConfirmDialog
        open={workoutToDeleteId != null}
        title="Delete workout?"
        message={`This will permanently delete${workoutToDelete ? ` “${workoutToDelete.title}”` : " this workout"} and all of its entries.`}
        confirmText="Delete workout"
        danger
        pending={deleteWorkout.isPending}
        onConfirm={() => void confirmDeleteWorkout()}
        onClose={() => setWorkoutToDeleteId(null)}
      />
    </div>
  );
}
