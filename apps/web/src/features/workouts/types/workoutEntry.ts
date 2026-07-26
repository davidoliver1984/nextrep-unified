export type WorkoutEntry = {
  id: number;
  workout_id: number;
  exercise_id: number;
  exercise_name?: string;

  sets: number;
  reps: number;
  weight: number;

  completed: boolean;

  // loaded relation on detail endpoints
  exercise?: {
    id: number;
    exercise_name: string;
    equipment_type: string | null;
  };
};
