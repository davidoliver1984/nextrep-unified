import { format, parseISO } from "date-fns";
import { Link, Navigate, useParams } from "react-router-dom";
import { QueryStatus } from "@/components/query/QueryStatus";
import { Button } from "@/components/ui/Button";
import { useJournalImage } from "@/features/journals/query/useJournalImages";
import { toAppError } from "@/lib/http";

export default function GalleryImagePage() {
  const imageId = Number(useParams<{ imageId: string }>().imageId);
  const imageQuery = useJournalImage(imageId);

  if (!Number.isInteger(imageId) || imageId <= 0) {
    return <Navigate to="/gallery" replace />;
  }

  if (imageQuery.isLoading || imageQuery.isError) {
    return (
      <div className="space-y-6">
        <BackToGallery />
        <QueryStatus
          isLoading={imageQuery.isLoading}
          isError={imageQuery.isError}
          errorMessage={imageQuery.isError ? toAppError(imageQuery.error).message : null}
          loadingText="Loading image…"
          onRetry={() => void imageQuery.refetch()}
        />
      </div>
    );
  }

  const image = imageQuery.data;

  if (!image) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Progress image</h1>
          {image.journal_date ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {format(parseISO(image.journal_date), "do MMMM yyyy")}
            </p>
          ) : null}
        </div>
        <BackToGallery />
      </div>

      <div className="flex min-h-[50vh] items-center justify-center overflow-hidden rounded-xl border bg-card p-4 sm:p-6">
        <img
          src={image.url}
          alt="Journal progress original"
          className="max-h-[75vh] max-w-full rounded-lg object-contain"
        />
      </div>
    </div>
  );
}

function BackToGallery() {
  return (
    <Button asChild variant="outline">
      <Link to="/gallery">← Back to gallery</Link>
    </Button>
  );
}
