import type { WorkoutCreateDraft, CreateWorkoutPayload } from "../types/workoutCreate";

function toInt(raw: string): number {
  return Number.parseInt(raw.trim(), 10);
}
function toFloat(raw: string): number {
  return Number.parseFloat(raw.trim());
}
function toNullableDate(raw: string): string | null {
  const v = raw.trim();
  return v ? v : null;
}

export function toCreateWorkoutPayload(draft: WorkoutCreateDraft, journalId?: number): CreateWorkoutPayload {
  return {
    journal_id: journalId ?? null,
    title: draft.title.trim(),
    date: toNullableDate(draft.date),
    entries: draft.entries.map((e) => ({
      exercise_id: toInt(e.exerciseId),
      sets: toInt(e.sets),
      reps: toInt(e.reps),
      weight: toFloat(e.weight),
    })),
  };
}
