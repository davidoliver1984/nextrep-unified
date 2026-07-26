import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkoutTemplate } from "@/features/journals/api/journals";
import { queryKeys } from "@/lib/query/queryKeys";

export function useDeleteWorkoutTemplate(journalId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkoutTemplate,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.journalTemplates(journalId),
      }),
  });
}
