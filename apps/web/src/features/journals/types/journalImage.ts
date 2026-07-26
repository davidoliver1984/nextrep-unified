export type JournalImage = {
  id: number;
  journal_id: number;
  journal_date?: string | null;
  url: string;
  thumbnail_url: string;
  path: string;
  created_at?: string | null;
};
