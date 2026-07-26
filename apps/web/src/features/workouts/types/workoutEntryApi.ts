export type PatchWorkoutEntryPayload = Partial<CreateWorkoutEntryPayload>;

export type CreateWorkoutEntryPayload = {
  workout_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
};
