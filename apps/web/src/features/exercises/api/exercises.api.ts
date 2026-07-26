import api from "@/api/api";
import type { Exercise } from "@/features/exercises/types/exercise";

// supports Laravel Resource::collection shape or raw arrays
function unwrapList<T>(resData: unknown): T[] {
  if (resData && typeof resData === "object" && "data" in resData) {
    const data = (resData as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  if (Array.isArray(resData)) return resData;
  return [];
}

/**
 * Fetch all exercises.
 * - Uses AbortSignal for cancellation
 * - Accepts either `{ data: [...] }` or `[...]`
 */
export async function fetchExercises(signal?: AbortSignal): Promise<Exercise[]> {
  const res = await api.get("/exercises", { signal });
  return unwrapList<Exercise>(res.data);
}
