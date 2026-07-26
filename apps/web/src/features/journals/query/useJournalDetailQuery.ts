// /src/features/workouts/query/useWorkoutDetailQuery.ts
import { useQuery } from "@tanstack/react-query";
import type { Journal } from "@/features/journals/types/journal";
import { fetchJournalDetail } from "@/features/journals/api/journals";
import { queryKeys } from "@/lib/query/queryKeys";
import { toAppError } from "@/lib/http/";

export function useJournalDetailQuery(journalId: number) {
  return useQuery<Journal, Error>({
    queryKey: queryKeys.journalDetail(journalId),
    queryFn: ({ signal }) => fetchJournalDetail(journalId, signal),
    enabled: Number.isFinite(journalId) && journalId > 0,
    staleTime: 10_000,
    retry: (failureCount, err) => {
      // no retries for 404
      const appErr = toAppError(err);
      if (appErr.status === 404) return false;
      return failureCount < 2;
    },
  });
}
