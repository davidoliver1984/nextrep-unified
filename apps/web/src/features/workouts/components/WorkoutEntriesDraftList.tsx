import type { WorkoutEntryDraft } from "../types/workoutCreate";
import type { Exercise } from "@/features/exercises/types/exercise";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type EntryField = "exerciseId" | "sets" | "reps" | "weight";
type EntryErrors = Array<Partial<Record<EntryField, string>>>;

type Props = {
  entries: WorkoutEntryDraft[];
  exercises: Exercise[];
  onRemove: (index: number) => void;

  errors?: EntryErrors;
  showErrors?: boolean;
};

function exerciseLabel(exercises: Exercise[], idStr: string) {
  const id = Number(idStr);
  const exercise = exercises.find((item) => item.id === id);
  return exercise?.exercise_name ?? `#${id}`;
}

export function WorkoutEntriesDraftList({
  entries,
  exercises,
  onRemove,
  errors = [],
  showErrors = false,
}: Props) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No entries yet.</p>;
  }

  return (
    <div className="divide-y divide-border/60 rounded-lg border bg-card">
      {entries.map((e, i) => {
        const rowErr = errors[i] ?? {};
        const hasAnyErr = showErrors && Object.keys(rowErr).length > 0;

        return (
          <div key={`${e.exerciseId}-${i}`} className={cn("grid gap-2 p-3", hasAnyErr && "bg-destructive/5")}>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1 truncate text-sm font-medium">
                {exerciseLabel(exercises, e.exerciseId)}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary" className="font-mono text-[11px]">
                  {e.sets}×{e.reps}
                </Badge>
                <Badge variant="outline" className="font-mono text-[11px]">
                  {e.weight}kg
                </Badge>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                onClick={() => onRemove(i)}
                aria-label="Remove exercise"
                title="Remove exercise"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {showErrors ? (
              <div className="grid gap-1 text-xs text-destructive">
                {rowErr.exerciseId ? <div>Exercise: {rowErr.exerciseId}</div> : null}
                {rowErr.sets ? <div>Sets: {rowErr.sets}</div> : null}
                {rowErr.reps ? <div>Reps: {rowErr.reps}</div> : null}
                {rowErr.weight ? <div>Weight: {rowErr.weight}</div> : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
