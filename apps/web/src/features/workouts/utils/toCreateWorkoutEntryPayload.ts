import type { WorkoutEntryFieldValues } from "./validateWorkoutEntryFields";
import type { CreateWorkoutEntryPayload } from "../types/workoutEntryApi";

function toInt(value: string) {
  return Number(value.trim());
}

function toFloat(value: string) {
  return Number(value.trim());
}

export function toCreateWorkoutEntryPayload(
  form: WorkoutEntryFieldValues,
  workoutId: number
): CreateWorkoutEntryPayload {
  return {
    workout_id: workoutId,
    exercise_id: toInt(form.exerciseId),
    sets: toInt(form.sets),
    reps: toInt(form.reps),
    weight: toFloat(form.weight),
    completed: false, // fine (or omit and let DB default)
  };
}
