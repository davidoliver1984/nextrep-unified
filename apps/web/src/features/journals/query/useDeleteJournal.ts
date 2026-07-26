import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteJournal } from "@/features/journals/api/journals";
import { queryKeys } from "@/lib/query/queryKeys";

export function useDeleteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (journalId: number) => deleteJournal(journalId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.journalLists() });
    },
  });
}
