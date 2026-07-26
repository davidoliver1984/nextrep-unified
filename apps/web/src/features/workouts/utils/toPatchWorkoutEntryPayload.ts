import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";
import type { PatchWorkoutEntryPayload } from "@/features/workouts/types/workoutEntryApi";

export function toPatchWorkoutEntryPayload(
  patch: Partial<WorkoutEntry>
): PatchWorkoutEntryPayload {
  const next: PatchWorkoutEntryPayload = {};

  if (patch.exercise_id !== undefined) next.exercise_id = patch.exercise_id;
  if (patch.sets !== undefined) next.sets = patch.sets;
  if (patch.reps !== undefined) next.reps = patch.reps;
  if (patch.weight !== undefined) next.weight = patch.weight;
  if (patch.completed !== undefined) next.completed = patch.completed;

  return next;
}
