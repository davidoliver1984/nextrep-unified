// src/features/journals/query/useJournalsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { fetchJournals, type FetchJournalsParams } from "@/features/journals/api/journals";
import type { Paginated, Journal } from "@/features/journals/types/journal";
import { queryKeys } from "@/lib/query/queryKeys";

export function useJournalsQuery(params: FetchJournalsParams) {
  return useQuery<Paginated<Journal>, Error>({
    queryKey: [...queryKeys.journalLists(), params],
    queryFn: ({ signal }) => fetchJournals(params, signal),
    staleTime: 10_000,
    // keepPreviousData: true,
  });
}
