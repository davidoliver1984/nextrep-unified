import { Button } from "@/components/ui/Button";
import type { LaravelPaginationMeta } from "@/features/journals/types";

type Props = {
  meta: LaravelPaginationMeta;
  onPageChange: (page: number) => void;
};

export function ImagePagination({ meta, onPageChange }: Props) {
  if (meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <Button
        type="button"
        variant="secondary"
        disabled={meta.current_page <= 1}
        onClick={() => onPageChange(meta.current_page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {meta.current_page} of {meta.last_page}
      </span>
      <Button
        type="button"
        variant="secondary"
        disabled={meta.current_page >= meta.last_page}
        onClick={() => onPageChange(meta.current_page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
