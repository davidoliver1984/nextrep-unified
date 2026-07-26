import type { Workout } from "@/features/workouts/types/workout";

export type ProgressionCandidate = {
  exercise_id: number;
  exercise_name: string;
  current_weight: number;
  personal_best_weight: number;
  last_progressed_at: string;
  last_performed_at: string;
  days_since_progression: number;
  performance_count: number;
};

export type FastestMovingLift = {
  exercise_id: number;
  exercise_name: string;
  starting_weight: number;
  current_weight: number;
  increase_percentage: number;
  started_at: string;
  last_performed_at: string;
  performance_count: number;
};

export type Dashboard = {
  date: string;
  today_workouts: Workout[];
  lifts_ready_for_progression: ProgressionCandidate[];
  fastest_moving_lifts: FastestMovingLift[];
};
