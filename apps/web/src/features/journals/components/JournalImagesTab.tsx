import { useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { QueryStatus } from "@/components/query/QueryStatus";
import { toast } from "@/components/toast/toast.store";
import { toAppError } from "@/lib/http";
import {
  useDeleteJournalImage,
  useJournalImages,
  useUploadJournalImage,
} from "@/features/journals/query/useJournalImages";
import type { JournalImage } from "@/features/journals/types";
import { JournalImageGrid } from "./JournalImageGrid";
import { ImagePagination } from "./ImagePagination";

export function JournalImagesTab({ journalId }: { journalId: number }) {
  const [page, setPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [imageToDelete, setImageToDelete] = useState<JournalImage | null>(null);
  const imagesQuery = useJournalImages(journalId, page);
  const uploadImage = useUploadJournalImage(journalId);
  const deleteImage = useDeleteJournalImage();

  async function handleUpload() {
    if (!file) return;
    try {
      await uploadImage.mutateAsync(file);
      setFile(null);
      setPage(1);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Image upload failed", toAppError(error).message);
    }
  }

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

  const images = imagesQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/20 p-4">
        <ImageUpload label="Add journal image" value={file} onChange={setFile} />
        <Button
          type="button"
          className="mt-4"
          disabled={!file || uploadImage.isPending}
          onClick={() => void handleUpload()}
        >
          {uploadImage.isPending ? "Uploading…" : "Upload image"}
        </Button>
      </div>

      {imagesQuery.isLoading || imagesQuery.isError ? (
        <QueryStatus
          isLoading={imagesQuery.isLoading}
          isError={imagesQuery.isError}
          errorMessage={imagesQuery.isError ? toAppError(imagesQuery.error).message : null}
          loadingText="Loading images…"
          onRetry={() => void imagesQuery.refetch()}
        />
      ) : images.length === 0 ? (
        <p className="text-sm text-muted-foreground">No images for this journal yet.</p>
      ) : (
        <>
          <JournalImageGrid
            images={images}
            onDelete={setImageToDelete}
            deletingId={deleteImage.isPending ? imageToDelete?.id : null}
          />
          {imagesQuery.data?.meta ? (
            <ImagePagination meta={imagesQuery.data.meta} onPageChange={setPage} />
          ) : null}
        </>
      )}

      <ConfirmDialog
        open={imageToDelete != null}
        title="Delete image?"
        message="This image will be permanently removed from the journal."
        confirmText="Delete image"
        danger
        pending={deleteImage.isPending}
        onConfirm={() => void confirmDelete()}
        onClose={() => setImageToDelete(null)}
      />
    </div>
  );
}
