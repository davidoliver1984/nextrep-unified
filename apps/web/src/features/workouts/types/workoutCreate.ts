export type WorkoutEntryDraft = {
    exerciseId: string; // form string
    sets: string;
    reps: string;
    weight: string;
  };

  export type WorkoutCreateDraft = {
    title: string;
    date: string;      // optional string (YYYY-MM-DD) - keep as string in form
    journalId: string; // optional string
    entries: WorkoutEntryDraft[];
  };

  // what your API expects (snake_case)
  export type CreateWorkoutPayload = {
    journal_id: number | null;
    title: string;
    date: string | null;
    entries: Array<{
      exercise_id: number;
      sets: number;
      reps: number;
      weight: number;
      notes?: string | null;
    }>;
  };