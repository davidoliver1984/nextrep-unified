import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteJournalImage,
  fetchGalleryImages,
  fetchJournalImage,
  fetchJournalImages,
  uploadJournalImage,
} from "@/features/journals/api/journalImages";
import { queryKeys } from "@/lib/query/queryKeys";

export function useJournalImages(journalId: number, page: number) {
  return useQuery({
    queryKey: queryKeys.journalImages(journalId, page),
    queryFn: ({ signal }) => fetchJournalImages(journalId, page, signal),
  });
}

export function useGalleryImages(page: number) {
  return useQuery({
    queryKey: queryKeys.galleryImages(page),
    queryFn: ({ signal }) => fetchGalleryImages(page, signal),
  });
}

export function useJournalImage(imageId: number) {
  return useQuery({
    queryKey: queryKeys.journalImageDetail(imageId),
    queryFn: ({ signal }) => fetchJournalImage(imageId, signal),
    enabled: Number.isInteger(imageId) && imageId > 0,
  });
}

export function useUploadJournalImage(journalId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: File) => uploadJournalImage(journalId, image),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.journalImageLists(journalId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.galleryImageLists() }),
      ]);
    },
  });
}

export function useDeleteJournalImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId }: { imageId: number; journalId: number }) =>
      deleteJournalImage(imageId),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.journalImageLists(variables.journalId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.galleryImageLists() }),
      ]);
    },
  });
}
