import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string, detail?: string, durationMs?: number) =>
    sonnerToast.success(message, { description: detail, duration: durationMs }),
  error: (message: string, detail?: string, durationMs?: number) =>
    sonnerToast.error(message, { description: detail, duration: durationMs }),
  info: (message: string, detail?: string, durationMs?: number) =>
    sonnerToast.info(message, { description: detail, duration: durationMs }),
};
