import axios from "axios";

function snakeToCamelSegment(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function snakePathToCamel(path: string) {
  return path
    .split(".")
    .map((seg) => (seg.match(/^\d+$/) ? seg : snakeToCamelSegment(seg)))
    .join(".");
}

export function toLaravelFieldErrors(err: unknown): Record<string, string> {
  if (!axios.isAxiosError(err)) return {};
  if (err.response?.status !== 422) return {};

  const responseData = err.response?.data;
  const raw =
    responseData && typeof responseData === "object" && "errors" in responseData
      ? responseData.errors
      : null;
  if (!raw || typeof raw !== "object") return {};

  const out: Record<string, string> = {};
  for (const [field, messages] of Object.entries(raw)) {
    const key = snakePathToCamel(field);
    out[key] =
      Array.isArray(messages) && typeof messages[0] === "string"
        ? messages[0]
        : typeof messages === "string"
        ? messages
        : "Invalid value.";
  }
  return out;
}
