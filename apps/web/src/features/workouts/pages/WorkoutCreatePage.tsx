import { useMemo, useState } from "react";
import { useExercises } from "@/features/exercises/hooks/useExercises";
import { toast } from "@/components/toast/toast.store";
import { toAppError, toLaravelFieldErrors } from "@/lib/http";


import type { WorkoutCreateDraft } from "../types/workoutCreate";
import { validateWorkoutCreateDraft } from "../utils/validateWorkoutCreateDraft";
import { toCreateWorkoutPayload } from "../utils/toCreateWorkoutPayload";


import { createWorkout } from "../api/workouts.api";
import { Card, TextInput, Button } from "@/components/ui";

import { WorkoutEntryDraftForm } from "../components/WorkoutEntryDraftForm";
import { WorkoutEntriesDraftList } from "../components/WorkoutEntriesDraftList";


import { SkeletonStack } from "@/components/ui/SkeletonStack";

const INITIAL: WorkoutCreateDraft = {
  title: "",
  date: "",
  journalId: "",
  entries: [],
};
type FormFieldKey = "title" | "date" | "journalId";
type EntryField = "exerciseId" | "sets" | "reps" | "weight";
type EntryErrors = Array<Partial<Record<EntryField, string>>>;

function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, character) => character.toUpperCase());
}

function mapServerErrorsToEntryErrors(
  serverErrors: Record<string, string>,
  entryCount: number
): EntryErrors {
  const output: EntryErrors = Array.from({ length: entryCount }, () => ({}));

  for (const [key, message] of Object.entries(serverErrors)) {
    const match = key.match(/^entries\.(\d+)\.(.+)$/);
    if (!match) continue;

    const index = Number(match[1]);
    if (!Number.isFinite(index) || index < 0 || index >= entryCount) continue;

    const field = snakeToCamelKey(match[2]);
    const mapped =
      field === "exerciseId" || field === "sets" || field === "reps" || field === "weight"
        ? field
        : null;

    if (mapped) output[index][mapped] = message;
  }

  return output;
}

function mergeEntryErrors(first: EntryErrors, second: EntryErrors): EntryErrors {
  const length = Math.max(first.length, second.length);
  return Array.from({ length }, (_, index) => ({
    ...(first[index] ?? {}),
    ...(second[index] ?? {}),
  }));
}

export default function WorkoutCreatePage({ journalId } : { journalId?: number }) {
  const exercisesQuery = useExercises();

  const [draft, setDraft] = useState<WorkoutCreateDraft>(INITIAL);
  const [touched, setTouched] = useState<
    Partial<Record<keyof WorkoutCreateDraft, boolean>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const [serverErrors, setServerErrors] = useState<
    Partial<Record<string, string>>
  >({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const { formErrors, entryErrors } = useMemo(
    () => validateWorkoutCreateDraft(draft),
    [draft]
  );
  function setField<K extends keyof WorkoutCreateDraft>(
    key: K,
    value: WorkoutCreateDraft[K]
  ) {
    setDraft((p) => ({ ...p, [key]: value }));
    // clear server error for that field if present
    setServerErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function addEntry(entry: WorkoutCreateDraft["entries"][number]) {
    setDraft((p) => ({ ...p, entries: [entry, ...p.entries] }));
  }

  function removeEntry(index: number) {
    setDraft((p) => ({
      ...p,
      entries: p.entries.filter((_, i) => i !== index),
    }));
  }

  function showFormError(key: FormFieldKey) {
    // serverErrors is Record<string,string> so it can hold nested keys like "entries.0.exerciseId"
    const server = serverErrors[key];
    if (server) return server;

    if (!touched[key]) return null;
    return formErrors[key] ?? null;
  }

  const serverEntryErrors = useMemo(
    () =>
      mapServerErrorsToEntryErrors(
        serverErrors as Record<string, string>,
        draft.entries.length
      ),
    [serverErrors, draft.entries.length]
  );

  const combinedEntryErrors = useMemo(
    () => mergeEntryErrors(entryErrors, serverEntryErrors),
    [entryErrors, serverEntryErrors]
  );

  async function onSave() {
    setTouched({ title: true, date: true, journalId: true, entries: true });
    setServerErrors({});
    setServerMessage(null);

    // block if client validation fails
    const anyEntryFieldErrors = entryErrors.some(
      (e) => Object.keys(e).length > 0
    );
    if (Object.keys(formErrors).length > 0 || anyEntryFieldErrors) {
      toast.error("Fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      const safeJournalId = Number.isFinite(journalId) ? journalId : undefined;
      const payload = toCreateWorkoutPayload(draft, safeJournalId);
      const created = await createWorkout(payload);

      toast.success("Workout saved");

      // For now just reset:
      setDraft(INITIAL);
      setTouched({});
      return created;
    } catch (err) {
      // Laravel 422: entries.0.exercise_id, title, etc.
      const laravel = toLaravelFieldErrors(err);
      if (laravel) {
        setServerErrors(laravel);
        setServerMessage("Please fix the highlighted fields");
        return;
      }

      const appErr = toAppError(err);
      toast.error("Save failed", appErr.message);
      setServerMessage(appErr.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* <h1 style={{ margin: 0 }}>Create Workout</h1> */}
      {serverMessage ? (
        <div className="font-semibold text-destructive">{serverMessage}</div>
      ) : null}
      <Card className="p-6">
        <div className="grid gap-4">
          <TextInput
            label="title"
            value={draft.title}
            onChange={(e) => setField("title", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, title: true }))}
            error={showFormError("title")}
            placeholder="e.g. Push Day – Heavy"
          />

          <TextInput
            label="journalId (optional)"
            value={journalId}
            onChange={(e) => setField("journalId", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, journalId: true }))}
            error={showFormError("journalId")}
            placeholder="e.g. 12"
            inputMode="numeric"
          />

        </div>
      </Card>

      <div>
        {exercisesQuery.isLoading ? (
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">Loading exercises…</p>
            <SkeletonStack rows={4} />
          </div>
        ) : null}

        {exercisesQuery.isError ? (
          <div className="flex items-center gap-3">
            <p className="font-semibold text-destructive">
            {exercisesQuery.errorMessage ?? "Failed to load exercises."}
            </p>
            <button type="button" onClick={() => exercisesQuery.refetch()}>
              Retry
            </button>
          </div>
        ) : null}
      </div>

      <WorkoutEntryDraftForm
        exercises={exercisesQuery.data ?? []}
        onAdd={addEntry}
        disabled={submitting}
      />
      <WorkoutEntriesDraftList
        exercises={exercisesQuery.data ?? []}
        entries={draft.entries}
        onRemove={removeEntry}
        errors={combinedEntryErrors}
        showErrors={!!touched.entries}
      />
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => void onSave()}
          disabled={submitting}
        >
          {submitting ? "Saving…" : "Save workout"}
        </Button>

        <Button
          type="button"
          onClick={() => {
            setDraft(INITIAL);
            setTouched({});
          }}
          disabled={submitting}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
