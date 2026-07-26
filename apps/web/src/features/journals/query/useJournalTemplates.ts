import { useQuery } from "@tanstack/react-query";
import type { Template } from "@/features/templates/types/template";
import { fetchJournalTemplates } from "@/features/journals/api/journals";
import { queryKeys } from "@/lib/query/queryKeys";
import { toAppError } from "@/lib/http/";

export function useJournalTemplates(journalId: number) {
    return useQuery<Template[], Error>({
      queryKey: queryKeys.journalTemplates(journalId),
      queryFn: ({ signal }) => fetchJournalTemplates(journalId, signal),
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