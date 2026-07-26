import type { JournalForm } from "@/features/journals/types";
import { toDateInputValue } from "@/lib/dates/toDateInputValue";

export function toEmptyJournalForm(): JournalForm {
    return {
      date: toDateInputValue(new Date()),
      weight: "",
      steps: "",
      calories: "",
      notes: "",
    };
  }