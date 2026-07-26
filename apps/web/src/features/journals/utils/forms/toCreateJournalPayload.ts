import type { JournalForm } from "@/features/journals/types/journal";
import type { CreateJournalPayload } from "@/features/journals/types";

const toIntOrNull = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

const toFloatOrNull = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export function toCreateJournalPayload(form: JournalForm): CreateJournalPayload {
  return {
    date: form.date,
    weight: form.weight.trim() ? toFloatOrNull(form.weight) : null,
    steps: form.steps.trim() ? toIntOrNull(form.steps) : null,
    calories: form.calories.trim() ? toIntOrNull(form.calories) : null,
    notes: form.notes?.trim() || null,
  };
}