// WorkoutQuickAdd.tsx
import * as React from "react";
import { Loader2 } from "lucide-react";

import type { Exercise } from "@/features/exercises/types/exercise";
import type { QuickAddForm } from "./WorkoutCard";

import { ExerciseCombobox } from "@/components/ExerciseComboBox";
import { WeightSelect } from "@/components/WeightSelect";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { validateWorkoutEntryFields } from "@/features/workouts/utils/validateWorkoutEntryFields";

const INITIAL: QuickAddForm = {
  exerciseId: "",
  sets: "3",
  reps: "10",
  weight: "0",
};

type Props = {
  exercises: Exercise[];
  onCreate: (form: QuickAddForm) => Promise<void>;
  onClose?: () => void;
};

export function WorkoutQuickAdd({ exercises, onCreate, onClose }: Props) {
  const [form, setForm] = React.useState<QuickAddForm>(INITIAL);
  const [busy, setBusy] = React.useState(false);
  const [touched, setTouched] = React.useState<
    Partial<Record<keyof QuickAddForm, boolean>>
  >({});
  const errors = React.useMemo(() => validateWorkoutEntryFields(form), [form]);

  function setField<K extends keyof QuickAddForm>(key: K, value: QuickAddForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  const canAdd = Object.keys(errors).length === 0;

  const weightNumber = Number(form.weight);
  const safeWeight = Number.isFinite(weightNumber) ? weightNumber : 0;

  async function handleAdd() {
    setTouched({ exerciseId: true, sets: true, reps: true, weight: true });
    if (!canAdd) {
      return;
    }

    try {
      setBusy(true);
      await onCreate(form);
      setForm((p) => ({ ...INITIAL, sets: p.sets, reps: p.reps }));
      setTouched({});
    } catch {
      // The parent mutation displays the API error toast.
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-muted/40 p-3",
        "backdrop-blur supports-[backdrop-filter]:bg-muted/30"
      )}
    >
      <div className="grid gap-4">
        <div>
          <ExerciseCombobox
            exercises={exercises}
            value={form.exerciseId ? Number(form.exerciseId) : null}
            onChange={(nextId) =>
              setField("exerciseId", nextId == null ? "" : String(nextId))
            }
            onBlur={() => setTouched((p) => ({ ...p, exerciseId: true }))}
            error={touched.exerciseId ? errors.exerciseId : null}
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
            error={touched.sets ? errors.sets : null}
          />

          <TextInput
            label="Reps"
            value={form.reps}
            onChange={(e) => setField("reps", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, reps: true }))}
            inputMode="numeric"
            style={{ width: "100%" }}
            error={touched.reps ? errors.reps : null}
          />

          <WeightSelect
            label="Weight"
            value={safeWeight}
            onChange={(next) => setField("weight", String(next))}
            onBlur={() => setTouched((p) => ({ ...p, weight: true }))}
            error={touched.weight ? errors.weight : null}
            disabled={busy}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAdd} disabled={!canAdd || busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add
          </Button>

          {onClose ? (
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
