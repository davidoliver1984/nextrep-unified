import type { WorkoutCreateDraft } from "../types/workoutCreate";

export type WorkoutCreateErrors = Partial<Record<
  "title" | "date" | "journalId" | "entries",
  string
>>;

export type EntryErrors = Array<Partial<Record<
  "exerciseId" | "sets" | "reps" | "weight",
  string
>>>;

export function validateWorkoutCreateDraft(draft: WorkoutCreateDraft): {
  formErrors: WorkoutCreateErrors;
  entryErrors: EntryErrors;
} {
  const formErrors: WorkoutCreateErrors = {};
  const entryErrors: EntryErrors = draft.entries.map(() => ({}));

  const title = draft.title.trim();
  if (title.length < 5) formErrors.title = "Title must be at least 5 characters.";

  if (draft.entries.length < 1) formErrors.entries = "Add at least one entry.";

  draft.entries.forEach((e, i) => {
    const errs = entryErrors[i];

    if (!e.exerciseId.trim()) errs.exerciseId = "Choose an exercise.";

    const sets = Number.parseInt(e.sets.trim(), 10);
    if (!Number.isFinite(sets) || sets < 1) errs.sets = "Sets must be 1+.";

    const reps = Number.parseInt(e.reps.trim(), 10);
    if (!Number.isFinite(reps) || reps < 1) errs.reps = "Reps must be 1+.";

    const weight = Number.parseFloat(e.weight.trim());
    if (!Number.isFinite(weight) || weight < 0) errs.weight = "Weight must be 0+.";
  });

  return { formErrors, entryErrors };
}
