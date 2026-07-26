 import { toAppError } from "./toAppError";


 /*
 A function to resolve query errors into user-friendly messages.
 */


 export function resolveQueryError(
    isError: boolean,
    error: unknown,
    notFoundMessage: string
  ) {
    if (!isError) return null;

    const appErr = toAppError(error);

    if (appErr.status === 404) {
      return notFoundMessage;
    }

    return appErr.message ?? "Something went wrong.";
  }