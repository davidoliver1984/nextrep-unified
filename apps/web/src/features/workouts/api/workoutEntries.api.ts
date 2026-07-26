import api from "@/api/api";
import { unwrapList, unwrapOne } from "@/lib/http";
import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";
import type {
  CreateWorkoutEntryPayload,
  PatchWorkoutEntryPayload,
} from "@/features/workouts/types/workoutEntryApi";

export async function createWorkoutEntry(
  payload: CreateWorkoutEntryPayload,
  signal?: AbortSignal
): Promise<WorkoutEntry> {
  const res = await api.post("/workout-entries", payload, { signal });
  return unwrapOne<WorkoutEntry>(res.data);
}

export async function patchWorkoutEntry(
  id: number,
  payload: PatchWorkoutEntryPayload,
  signal?: AbortSignal
): Promise<WorkoutEntry> {
  const res = await api.put(`/workout-entries/${id}`, payload, { signal });
  return unwrapOne<WorkoutEntry>(res.data);
}

export async function deleteWorkoutEntry(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  await api.delete(`/workout-entries/${id}`, { signal });
}

export async function completeWorkoutEntries(
  workoutId: number
): Promise<WorkoutEntry[]> {
  const res = await api.patch(`/workouts/${workoutId}/entries/complete`);
  return unwrapList<WorkoutEntry>(res.data);
}
