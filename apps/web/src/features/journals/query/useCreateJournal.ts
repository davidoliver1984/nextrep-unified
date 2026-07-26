import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJournal } from "@/features/journals/api/journals";
import { queryKeys } from "@/lib/query/queryKeys";
import { toCreateJournalPayload } from "@/features/journals/utils/forms";
import type { JournalForm } from "@/features/journals/types/";

export function useCreateJournal() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (form: JournalForm) => {
      const payload = toCreateJournalPayload(form);
      return createJournal(payload);
    },
    onSuccess: (created) => {
      qc.setQueryData(queryKeys.journalDetail(created.id), created);
      void qc.invalidateQueries({ queryKey: queryKeys.journalLists() });
    },
  });
}
