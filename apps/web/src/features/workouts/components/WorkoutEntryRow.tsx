import { memo, useEffect, useMemo, useState } from "react";
import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";
import type { Exercise } from "@/features/exercises/types/exercise";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ExerciseCombobox } from "@/components/ExerciseComboBox";
import { WeightSelect } from "@/components/WeightSelect";

import { CircleCheckBig, Pencil, Trash2, Check, X, Dumbbell } from "lucide-react";
import { toAppError } from "@/lib/http";
import { toast } from "@/components/toast/toast.store";
import { cn } from "@/lib/utils";

type Props = {
  entry: WorkoutEntry;
  exercises: Exercise[];
  onPatch: (id: number, patch: Partial<WorkoutEntry>) => void | Promise<void>;
  onRemove: (id: number) => void;
};

const onlyInt = (s: string) => s.replace(/[^\d]/g, "");
const toIntOr = (fallback: number, raw: string) => {
  const n = Number(raw.trim());
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

function entryLabel(entry: WorkoutEntry) {
  return (
    entry.exercise_name ??
    entry.exercise?.exercise_name ??
    "Deleted exercise"
  );
}

export const WorkoutEntryRow = memo(function WorkoutEntryRow({
  entry,
  exercises,
  onPatch,
  onRemove,
}: Props) {
  const label = useMemo(() => entryLabel(entry), [entry]);

  const [isEditing, setIsEditing] = useState(false);
  const [savingCompletion, setSavingCompletion] = useState(false);

  // inline edit state
  const [sets, setSets] = useState(String(entry.sets ?? 0));
  const [reps, setReps] = useState(String(entry.reps ?? 0));

  // exercise change dialog
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [nextExerciseId, setNextExerciseId] = useState<number | null>(
    entry.exercise_id ?? null
  );
  const [savingExercise, setSavingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState<string | null>(null);

  useEffect(() => {
    setSets(String(entry.sets ?? 0));
    setReps(String(entry.reps ?? 0));
    setNextExerciseId(entry.exercise_id ?? null);
  }, [entry.id, entry.sets, entry.reps, entry.exercise_id]);

  const canSaveExercise =
    nextExerciseId != null &&
    Number.isFinite(nextExerciseId) &&
    nextExerciseId !== entry.exercise_id;

  function openExerciseDialog() {
    setNextExerciseId(entry.exercise_id ?? null);
    setExerciseError(null);
    setExerciseOpen(true);
  }

  async function saveExercise() {
    if (nextExerciseId == null || !canSaveExercise) return;

    setSavingExercise(true);
    setExerciseError(null);
    try {
      await onPatch(entry.id, { exercise_id: nextExerciseId });
      setExerciseOpen(false);
    } catch (error) {
      setExerciseError(toAppError(error).message);
    } finally {
      setSavingExercise(false);
    }
  }

  async function toggleCompletion() {
    setSavingCompletion(true);
    try {
      await onPatch(entry.id, { completed: !entry.completed });
      toast.success(entry.completed ? "Exercise marked incomplete" : "Exercise completed");
    } catch (error) {
      toast.error("Completion failed", toAppError(error).message);
    } finally {
      setSavingCompletion(false);
    }
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 transition-colors before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-full",
        entry.completed
          ? "bg-emerald-500/[0.04] before:bg-emerald-500"
          : "bg-amber-500/[0.07] before:bg-amber-400"
      )}
    >
      {/* LEFT: name (flexes) */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn(
            "truncate text-sm font-medium leading-5",
            entry.completed && "text-muted-foreground line-through decoration-emerald-500/60"
          )}>{label}</div>

          {!entry.completed ? (
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
              To do
            </span>
          ) : null}

          {/* change exercise */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={openExerciseDialog}
            aria-label="Change exercise"
            title="Change exercise"
          >
            <Dumbbell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* MIDDLE: stats OR inputs (never wraps under buttons) */}
      {!isEditing ? (
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="font-mono text-[11px]">
            {entry.sets ?? "—"}×{entry.reps ?? "—"}
          </Badge>
          <Badge variant="outline" className="font-mono text-[11px]">
            {entry.weight ?? "—"}kg
          </Badge>
        </div>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <input
            className="h-9 w-[72px] rounded-md border bg-background px-2 text-sm"
            value={sets}
            inputMode="numeric"
            onChange={(e) => setSets(onlyInt(e.target.value))}
            onBlur={() =>
              onPatch(entry.id, { sets: toIntOr(entry.sets, sets) })
            }
          />
          <input
            className="h-9 w-[72px] rounded-md border bg-background px-2 text-sm"
            value={reps}
            inputMode="numeric"
            onChange={(e) => setReps(onlyInt(e.target.value))}
            onBlur={() =>
              onPatch(entry.id, { reps: toIntOr(entry.reps, reps) })
            }
          />

          {/* IMPORTANT: fixed width so it stays inline */}
          <div className="w-[170px]">
            <WeightSelect
              value={entry.weight ?? 0}
              onChange={(next) => onPatch(entry.id, { weight: next })}
              minWhole={0}
              maxWhole={300}
            />
          </div>
        </div>
      )}

      {/* RIGHT: actions (always right aligned, small icons) */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8",
            entry.completed
              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
              : "text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
          )}
          onClick={() => void toggleCompletion()}
          disabled={savingCompletion}
          aria-label={entry.completed ? "Mark exercise incomplete" : "Mark exercise complete"}
          title={entry.completed ? "Mark incomplete" : "Mark complete"}
        >
          <CircleCheckBig className={cn("h-4 w-4", savingCompletion && "animate-pulse")} />
        </Button>

        {!isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
            aria-label="Edit entry"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditing(false)}
            aria-label="Done editing"
            title="Done"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onRemove(entry.id)}
          aria-label="Delete entry"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Exercise dialog */}
      <Dialog
        open={exerciseOpen}
        onOpenChange={(open) => {
          setExerciseOpen(open);
          if (!open) setExerciseError(null);
        }}
      >
        <DialogContent className="overflow-visible">
          <DialogHeader>
            <DialogTitle>Change exercise</DialogTitle>
            <DialogDescription>
              Type at least two characters, then select an exercise.
            </DialogDescription>
          </DialogHeader>

          <ExerciseCombobox
            exercises={exercises}
            value={nextExerciseId}
            onChange={(id) => setNextExerciseId(id)}
            placeholder="Search exercises…"
          />

          {exerciseError ? (
            <p className="text-sm font-semibold text-destructive">{exerciseError}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={savingExercise}
              onClick={() => {
                setNextExerciseId(entry.exercise_id ?? null);
                setExerciseOpen(false);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <Button
              type="button"
              disabled={!canSaveExercise || savingExercise}
              onClick={() => void saveExercise()}
            >
              <Check className="h-4 w-4 mr-2" />
              {savingExercise ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
