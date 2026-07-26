import api from "@/api/api";
import { unwrapList, unwrapOne } from "@/lib/http";
import type { CreateWorkoutPayload } from "../types/workoutCreate";
import type { Workout } from "@/features/workouts/types/workout";

export async function createWorkout(payload: CreateWorkoutPayload) {
  const res = await api.post("/workouts", payload);
  return unwrapOne<Workout>(res.data);
}

export async function fetchWorkouts(signal?: AbortSignal): Promise<Workout[]> {
  const res = await api.get("/workouts", { signal });
  return unwrapList<Workout>(res.data);
}

export async function fetchWorkoutDetail(
  workoutId: number,
  signal?: AbortSignal
): Promise<Workout> {
  const res = await api.get(`/workouts/${workoutId}`, { signal });
  return unwrapOne<Workout>(res.data);
}

export async function deleteWorkout(id: number): Promise<void> {
  await api.delete(`/workouts/${id}`);
}
