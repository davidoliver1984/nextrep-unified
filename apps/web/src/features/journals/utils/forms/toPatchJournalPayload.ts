import type { JournalForm, UpdateJournalPayload } from "@/features/journals/types";
import { toCreateJournalPayload } from "@/features/journals/utils/forms";

// for now: same mapping. later you can make it partial.
export function toPatchJournalPayload(form: JournalForm): UpdateJournalPayload {
  return toCreateJournalPayload(form);
}