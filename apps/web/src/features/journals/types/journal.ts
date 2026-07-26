// src/features/journals/types/journal.ts
export type Journal = {
  id: number;
  date: string;
  weight?: number | null;
  calories?: number | null;
  steps?: number | null;
  notes?: string | null;
  workout_ids?: number[];
};

export type JournalForm = {
  date: string;
  weight: string;
  steps: string;
  calories: string;
  notes: string;
};

export type LaravelPaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type Paginated<T> = {
  data: T[];
  meta: LaravelPaginationMeta;
};
