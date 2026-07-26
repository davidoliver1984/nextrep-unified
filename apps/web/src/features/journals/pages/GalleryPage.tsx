import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { QueryStatus } from "@/components/query/QueryStatus";
import { toast } from "@/components/toast/toast.store";
import { toAppError } from "@/lib/http";
import { useDeleteJournalImage, useGalleryImages } from "@/features/journals/query/useJournalImages";
import type { JournalImage } from "@/features/journals/types";
import { JournalImageGrid } from "@/features/journals/components/JournalImageGrid";
import { ImagePagination } from "@/features/journals/components/ImagePagination";

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [imageToDelete, setImageToDelete] = useState<JournalImage | null>(null);
  const galleryQuery = useGalleryImages(page);
  const deleteImage = useDeleteJournalImage();
  const images = useMemo(() => galleryQuery.data?.data ?? [], [galleryQuery.data?.data]);

  const groups = useMemo(() => {
    const grouped = new Map<string, JournalImage[]>();
    for (const image of images) {
      if (!image.journal_date) continue;
      const existing = grouped.get(image.journal_date) ?? [];
      existing.push(image);
      grouped.set(image.journal_date, existing);
    }
    return Array.from(grouped.entries());
  }, [images]);

  async function confirmDelete() {
    if (!imageToDelete) return;
    try {
      await deleteImage.mutateAsync({
        imageId: imageToDelete.id,
        journalId: imageToDelete.journal_id,
      });
      setImageToDelete(null);
      toast.success("Image deleted");
    } catch (error) {
      toast.error("Image deletion failed", toAppError(error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Progress images grouped by journal date.
        </p>
      </div>

      {galleryQuery.isLoading || galleryQuery.isError ? (
        <QueryStatus
          isLoading={galleryQuery.isLoading}
          isError={galleryQuery.isError}
          errorMessage={galleryQuery.isError ? toAppError(galleryQuery.error).message : null}
          loadingText="Loading gallery…"
          onRetry={() => void galleryQuery.refetch()}
        />
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No journal images yet.</p>
      ) : (
        <div className="space-y-8">
          {groups.map(([date, dateImages]) => (
            <section key={date} className="space-y-4">
              <div className="border-b pb-2">
                <h2 className="text-xl font-semibold">
                  {format(parseISO(date), "do MMMM yyyy")}
                </h2>
              </div>
              <JournalImageGrid
                images={dateImages}
                onDelete={setImageToDelete}
                deletingId={deleteImage.isPending ? imageToDelete?.id : null}
                viewerPath={(image) => `/gallery/images/${image.id}`}
              />
            </section>
          ))}
          {galleryQuery.data?.meta ? (
            <ImagePagination meta={galleryQuery.data.meta} onPageChange={setPage} />
          ) : null}
        </div>
      )}

      <ConfirmDialog
        open={imageToDelete != null}
        title="Delete image?"
        message="This image will be permanently removed from its journal."
        confirmText="Delete image"
        danger
        pending={deleteImage.isPending}
        onConfirm={() => void confirmDelete()}
        onClose={() => setImageToDelete(null)}
      />
    </div>
  );
}
