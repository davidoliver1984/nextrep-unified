// src/lib/http/unwrapResponse.ts

export function unwrapOne<T>(raw: unknown): T {
    if (!raw || typeof raw !== "object" || !("data" in raw)) return raw as T;
    const data = raw.data;
    if (data && typeof data === "object" && "data" in data) return data.data as T;
    return data as T;
  }

  export function unwrapList<T>(raw: unknown): T[] {
    // raw array
    if (Array.isArray(raw)) return raw;

    // { data: [...] }
    if (raw && typeof raw === "object" && "data" in raw && Array.isArray(raw.data)) {
      return raw.data as T[];
    }

    // { data: { data: [...] } }
    if (raw && typeof raw === "object" && "data" in raw) {
      const data = raw.data;
      if (data && typeof data === "object" && "data" in data && Array.isArray(data.data)) {
        return data.data as T[];
      }
    }

    throw new Error("Unexpected response format (expected a list).");
  }
