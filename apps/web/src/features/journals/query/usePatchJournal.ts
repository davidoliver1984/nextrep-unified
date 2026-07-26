import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchJournal } from "@/features/journals/api/journals";
import { queryKeys } from "@/lib/query/queryKeys";
import { toPatchJournalPayload } from "@/features/journals/utils/forms";
import type { JournalForm } from "@/features/journals/types/journal";

type Vars = { id: number; form: JournalForm };

export function usePatchJournal() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: Vars) => {
      const payload = toPatchJournalPayload(form);
      return patchJournal(id, payload);
    },

    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.journalDetail(updated.id), updated);
      void qc.invalidateQueries({ queryKey: queryKeys.journalLists() });
    },
  });
}
