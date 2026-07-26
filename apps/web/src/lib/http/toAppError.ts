import axios from "axios";

/**
 * A tiny normalised error shape your UI can rely on.
 * - message: what to show the user (banner/toast)
 * - status: HTTP status if available
 * - code: optional app/axios code
 */
export type AppError = {
  message: string;
  status?: number;
  code?: string;
};

/**
 * Convert ANY thrown value into a safe AppError.
 *
 * Why:
 * - catch(err) can be literally anything (Error, string, axios error, object)
 * - UI should not care; it just needs a message + (maybe) status
 */
export function toAppError(err: unknown): AppError {
  // Axios errors (your main case for API calls)
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    /**
     * Laravel commonly returns:
     * - { message: "The given data was invalid.", errors: { ... } } (422)
     * - { message: "Unauthenticated." } (401)
     * - { message: "This action is unauthorized." } (403)
     */
    const messageFromServer =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : null;

    // Fallbacks: axios message, then generic
    const message =
      messageFromServer ??
      err.message ??
      "Request failed. Please try again.";

    return { message, status, code: err.code };
  }

  // Normal JS Error
  if (err instanceof Error) {
    return { message: err.message };
  }

  // Sometimes people throw strings
  if (typeof err === "string") {
    return { message: err };
  }

  // Unknown: final fallback
  return { message: "Something went wrong. Please try again." };
}
