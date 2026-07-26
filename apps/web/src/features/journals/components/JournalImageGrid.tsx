import type { JournalImage } from "@/features/journals/types";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

type Props = {
  images: JournalImage[];
  onDelete: (image: JournalImage) => void;
  deletingId?: number | null;
  viewerPath?: (image: JournalImage) => string;
};

export function JournalImageGrid({ images, onDelete, deletingId, viewerPath }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {images.map((image) => (
        <article key={image.id} className="overflow-hidden rounded-lg border bg-card">
          {viewerPath ? (
            <Link to={viewerPath(image)} aria-label="View original image">
              <GalleryThumbnail image={image} />
            </Link>
          ) : (
            <a href={image.url} target="_blank" rel="noreferrer" aria-label="View original image">
              <GalleryThumbnail image={image} />
            </a>
          )}
          <div className="p-2 text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={deletingId === image.id}
              onClick={() => onDelete(image)}
            >
              Delete ×
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function GalleryThumbnail({ image }: { image: JournalImage }) {
  return (
    <img
      src={image.thumbnail_url || image.url}
      alt="Journal progress"
      className="aspect-square w-full object-cover transition-opacity hover:opacity-90"
      loading="lazy"
    />
  );
}
