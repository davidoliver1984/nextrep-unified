// src/lib/http/unwrapPaginated.ts
export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export function unwrapPaginated<T>(raw: unknown): { data: T[]; meta: PaginationMeta } {
    if (!raw || typeof raw !== "object") {
      throw new Error("Unexpected response format (expected paginated resource).");
    }

    const { data, meta } = raw as { data?: unknown; meta?: unknown };

    if (!Array.isArray(data) || !meta || typeof meta !== "object") {
      throw new Error("Unexpected response format (expected paginated resource).");
    }

    return { data: data as T[], meta: meta as PaginationMeta };
  }
