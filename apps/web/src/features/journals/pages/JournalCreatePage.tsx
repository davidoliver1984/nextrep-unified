import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toAppError, toLaravelFieldErrors } from "@/lib/http";

import { useFormState } from "@/lib/forms";
import { resolveQueryError } from "@/lib/http";
import { toId } from "@/lib/numbers/toId";

import { Button } from "@/components/ui";
import { FormInput } from "@/components/ui/FormInput";
import { DatePickerField } from "@/components/ui/DatePickerField";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { QueryStatus } from "@/components/query/QueryStatus";
import { toast } from "@/components/toast/toast.store";

import type { JournalForm } from "@/features/journals/types";
import { useWorkoutTabParam, useWorkoutTabs } from "@/features/journals/hooks";

import {
  useJournalDetailQuery,
  useJournalWorkouts,
  useCreateJournal,
  usePatchJournal,
} from "@/features/journals/query";

import {
  toEmptyJournalForm,
  toJournalFormValues,
} from "@/features/journals/utils/forms";

import {
  NewWorkoutTab,
  JournalImagesTab,
  SavedTemplatesTab,
  SavedWorkoutsTab,
  Tabs,
} from "@/features/journals/components";

export default function JournalCreatePage() {
  const navigate = useNavigate();
  // grab id from url params, why do I use {} here
  // params
  const { id: idParam } = useParams();
  const id = toId(idParam);
  const isEditing = id != null;
  const journalId = useMemo(() => id ?? NaN, [id]);

  const journalQuery = useJournalDetailQuery(journalId);
  const workoutsQuery = useJournalWorkouts(journalId);

  const initialJournalForm = useMemo(() => toEmptyJournalForm(), []);
  const formState = useFormState<JournalForm>({
    initial: initialJournalForm,
  });
  const { form, setField, markTouched, showError, reset, setServerErrors } =
    formState;

  const hasHydratedRef = useRef(false);

  const savedCount = workoutsQuery.data?.length ?? 0;
  const tabItems = useWorkoutTabs(savedCount);
  const { tab, setTab } = useWorkoutTabParam("saved");

  const createJournal = useCreateJournal();
  const patchJournal = usePatchJournal();
  const isSaving = createJournal.isPending || patchJournal.isPending;

  async function handleSubmit() {
    try {
      setServerErrors({}); // optional clear

      if (isEditing) {
        await patchJournal.mutateAsync({ id: journalId, form });
        toast.success("Journal updated");
      } else {
        const created = await createJournal.mutateAsync(form);
        toast.success("Journal created");
        navigate(`/journals/${created.id}/edit?tab=saved`, { replace: true });
      }
    } catch (err) {
      const fieldErrors = toLaravelFieldErrors(err);
      setServerErrors(fieldErrors);

      if (Object.keys(fieldErrors).length > 0) {
        toast.error("Save failed", "Please fix the highlighted fields.");
      } else {
        toast.error("Save failed", toAppError(err).message);
      }
    }
  }

  // IMPORTANT: if your hook expects number, pass a safe number:
  // when switching between create/edit or changing id, allow hydration again

  useEffect(() => {
    hasHydratedRef.current = false;

    if (!isEditing) {
      const empty = toEmptyJournalForm();
      reset(empty);
      hasHydratedRef.current = true;
    }
  }, [isEditing, idParam, reset]);

  // hydrate from query data ONCE
  useEffect(() => {
    if (!isEditing) return;
    if (!journalQuery.data) return;
    if (hasHydratedRef.current) return;

    const next = toJournalFormValues(journalQuery.data);
    reset(next);

    hasHydratedRef.current = true;
  }, [isEditing, journalQuery.data, reset]);

  if (isEditing && (journalQuery.isLoading || journalQuery.isError)) {
    return (
      <QueryStatus
        isLoading={journalQuery.isLoading}
        isError={journalQuery.isError}
        errorMessage={resolveQueryError(
          journalQuery.isError,
          journalQuery.error,
          "Journal entry not found (it may have been deleted)."
        )}
        loadingText="Loading journal entry…"
        onRetry={journalQuery.refetch}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-semibold">
          {isEditing ? "Edit journal entry" : "New journal entry"}
        </h4>

        <Button type="button" onClick={handleSubmit} disabled={isSaving}>
          {isSaving
            ? isEditing
              ? "Updating…"
              : "Creating…"
            : isEditing
            ? "Update"
            : "Create"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <DatePickerField
            label="Date"
            value={form.date}
            onChange={(v) => setField("date", v)}
            onBlur={() => markTouched("date")}
            error={showError("date")}
          />

          <FormInput
            label="Weight (optional)"
            value={form.weight}
            onChange={(v) => setField("weight", v)}
            onBlur={() => markTouched("weight")}
            error={showError("weight")}
            placeholder="(in lbs)"
          />

          <FormInput
            label="Steps"
            value={form.steps}
            onChange={(v) => setField("steps", v)}
            onBlur={() => markTouched("steps")}
            error={showError("steps")}
            placeholder="e.g. 12000"
            inputMode="numeric"
          />

          <FormInput
            label="Calories (optional)"
            value={form.calories}
            onChange={(v) => setField("calories", v)}
            onBlur={() => markTouched("calories")}
            error={showError("calories")}
            placeholder="e.g. 3000"
            inputMode="numeric"
          />

          <FormInput
            label="Notes"
            value={form.notes}
            onChange={(v) => setField("notes", v)}
            onBlur={() => markTouched("notes")}
            error={showError("notes")}
            placeholder="Optional notes…"
          />
        </CardContent>
      </Card>

      {isEditing ? (
        <Card>
          <CardContent className="pt-6">
            <Tabs value={tab} items={tabItems} onChange={setTab} />
            <div className="mt-4">
              {tab === "saved" && <SavedWorkoutsTab journalId={journalId} />}
              {tab === "templates" && (
                <SavedTemplatesTab
                  journalId={journalId}
                  onTemplateApplied={() => setTab("saved")}
                />
              )}
              {tab === "new" && <NewWorkoutTab journalId={journalId} />}
              {tab === "images" && <JournalImagesTab journalId={journalId} />}
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">
          Create the journal entry before adding workouts or applying templates.
        </p>
      )}
    </div>
  );
}
