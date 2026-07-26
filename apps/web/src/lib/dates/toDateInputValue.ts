export function toDateInputValue(v: string | Date | null | undefined): string {
    if (!v) return "";

    const d = typeof v === "string" ? new Date(v) : v;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";

    return d.toISOString().slice(0, 10);
  }