
import WorkoutCreatePage from "@/features/workouts/pages/WorkoutCreatePage";

export function NewWorkoutTab({ journalId }: { journalId: number }) {

  return (
    <div style={{ display: "grid", gap: 12 }}>

        <WorkoutCreatePage journalId={journalId} />

    </div>
  );
}