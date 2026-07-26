import { useMemo, useState } from "react";
import type { Exercise } from "@/features/exercises/types/exercise";
import type { WorkoutEntryDraft } from "../types/workoutCreate";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { WeightSelect } from "@/components/WeightSelect";
import { ExerciseCombobox } from "@/components/ExerciseComboBox";
import { validateWorkoutEntryFields } from "../utils/validateWorkoutEntryFields";

type Props = {
  exercises: Exercise[];
  onAdd: (entry: WorkoutEntryDraft) => void;
  disabled?: boolean;
};

const INITIAL: WorkoutEntryDraft = {
  exerciseId: "",
  sets: "",
  reps: "",
  weight: "",
};

export function WorkoutEntryDraftForm({ exercises, onAdd, disabled }: Props) {
  const [form, setForm] = useState<WorkoutEntryDraft>(INITIAL);
  const [touched, setTouched] = useState<
    Partial<Record<keyof WorkoutEntryDraft, boolean>>
  >({});

  const errors = useMemo(() => validateWorkoutEntryFields(form), [form]);

  const isValid = Object.keys(errors).length === 0;

  function setField<K extends keyof WorkoutEntryDraft>(
    key: K,
    value: WorkoutEntryDraft[K]
  ) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function showError<K extends keyof WorkoutEntryDraft>(key: K) {
    return touched[key] ? errors[key] ?? null : null;
  }

  function markAllTouched() {
    setTouched({ exerciseId: true, sets: true, reps: true, weight: true });
  }

  const weightNumber = Number(form.weight);
  const safeWeight = Number.isFinite(weightNumber) ? weightNumber : 0;

  function submit() {
    markAllTouched();
    if (!isValid) return;
    onAdd(form);
    setForm(INITIAL);
    setTouched({});
  }

  return (
    <Card className="p-6">
      <div className="grid gap-4">
        <h3 className="text-base font-semibold">Add exercises to your workout</h3>

        <div>
          <ExerciseCombobox
            exercises={exercises}
            value={form.exerciseId ? Number(form.exerciseId) : null}
            onChange={(nextId) =>
              setField("exerciseId", nextId == null ? "" : String(nextId))
            }
            onBlur={() => setTouched((e) => ({ ...e, exerciseId: true }))}
            error={showError("exerciseId")}
            placeholder="Search exercises…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10.5rem] sm:items-start">
          <TextInput
            label="Sets"
            value={form.sets}
            onChange={(e) => setField("sets", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, sets: true }))}
            inputMode="numeric"
            style={{ width: "100%" }}
            error={showError("sets")}
          />

          <TextInput
            label="Reps"
            value={form.reps}
            onChange={(e) => setField("reps", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, reps: true }))}
            inputMode="numeric"
            style={{ width: "100%" }}
            error={showError("reps")}
          />

          <WeightSelect
            label="Weight"
            value={safeWeight}
            onChange={(next) => setField("weight", String(next))}
            onBlur={() => setTouched((p) => ({ ...p, weight: true }))}
            error={showError("weight")}
          />
        </div>

        <div>
          <Button
            type="button"
            onClick={submit}
            disabled={!isValid || disabled}
          >
            Add entry
          </Button>
        </div>
      </div>
    </Card>
  );
}
