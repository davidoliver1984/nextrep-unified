import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";

export type Template = {
    id: number;
    user_id?: number;
    title: string;
    description?: string;
    payload?: unknown;
    entries_count?: number;
    entries?: WorkoutEntry[];
    created_at?: string;
    updated_at?: string;
  }
