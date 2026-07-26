import { useQuery } from "@tanstack/react-query";
import type { Exercise } from "@/features/exercises/types/exercise";
import { fetchExercises } from "@/features/exercises/api/exercises.api";
import { toQueryErrorMessage } from "@/lib/http/queryError";

export function useExercises() {
  const q = useQuery<Exercise[], unknown>({
    queryKey: ["exercises"],
    queryFn: ({ signal }) => fetchExercises(signal),
    retry: 2,
    staleTime: 30_000,
  });

  return {
    ...q,
    errorMessage: q.error ? toQueryErrorMessage(q.error) : null,
  };
}