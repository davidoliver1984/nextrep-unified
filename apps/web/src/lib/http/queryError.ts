import { toAppError } from "@/lib/http/toAppError";

/**
 * Convert unknown error into a clean user-facing string.
 * - Axios? extract message / status
 * - Non-Axios? fallback safely
 */
export function toQueryErrorMessage(err: unknown): string {
  // If you already have a good toAppError(), use it as the one source of truth.
  const app = toAppError(err);

  // app.message should be a string always
  return app.message || "Something went wrong.";
}
