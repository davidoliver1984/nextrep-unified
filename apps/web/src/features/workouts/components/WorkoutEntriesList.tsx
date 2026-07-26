import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";
import { WorkoutEntryRow } from "./WorkoutEntryRow";
import type { Exercise } from "@/features/exercises/types/exercise";


type WorkoutEntriesListProps = {
  entries: WorkoutEntry[];
  exercises: Exercise[];
  onPatch: (id: number, patch: Partial<WorkoutEntry>) => void | Promise<void>;
  onRemove: (id: number) => void;

};

export function WorkoutEntriesList({ entries, exercises, onPatch, onRemove }: WorkoutEntriesListProps) {
  if (entries.length === 0) {
    return <p style={{ opacity: 0.75, marginTop: 0 }}>No entries yet.</p>;
  }

  return (
<div className="rounded-lg border bg-card">
  <div className="divide-y divide-border/60">
    {entries.map((entry) => (
      <WorkoutEntryRow
        key={entry.id}
        entry={entry}
        exercises={exercises}
        onPatch={onPatch}
        onRemove={onRemove}
      />
    ))}
  </div>
</div>
  );
}
