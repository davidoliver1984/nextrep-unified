// src/features/journals/query/useCreateJournalWorkoutFromTemplate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import { createJournalWorkoutFromTemplate } from "@/features/journals/api/journals";

export function useCreateJournalWorkoutFromTemplate(journalId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: { templateId: number }) =>
      createJournalWorkoutFromTemplate(args.templateId, journalId),

    onSuccess: () => {
      // new workout now exists for that journal
      void qc.invalidateQueries({ queryKey: queryKeys.journalWorkouts(journalId) });

    },
  });
}
