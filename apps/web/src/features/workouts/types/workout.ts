import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";

export type Workout = {
  id: number;
  user_id: number;
  journal_id: number | null;
  title: string;
  date: string | null;

  entries?: WorkoutEntry[];
  images?: Array<{
    id: number;
    url: string;
  }>;
};
