import { format, parseISO } from "date-fns";

export function formatDashboardDate(value: string, pattern = "d MMMM yyyy") {
  return format(parseISO(value), pattern);
}

export function formatWeight(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)} kg`;
}
