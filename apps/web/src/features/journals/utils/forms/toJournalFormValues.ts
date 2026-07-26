import type { Journal, JournalForm } from "@/features/journals/types";
import { toDateInputValue } from "@/lib/dates/toDateInputValue";

export function toJournalFormValues(entry: Journal): JournalForm {
    return {
      date: toDateInputValue(entry.date),
      weight: entry.weight?.toString() ?? "",
      steps: entry.steps?.toString() ?? "",
      calories: entry.calories?.toString() ?? "",
      notes: entry.notes ?? "",
    };
  }
