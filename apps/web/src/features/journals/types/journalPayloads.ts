export type CreateJournalPayload = {
    date: string;
    weight: number | null;
    steps: number | null;
    calories: number | null;
    notes: string | null;
  };

  export type UpdateJournalPayload = CreateJournalPayload;