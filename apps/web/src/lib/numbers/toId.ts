
export function toId(param: string | undefined): number | null {
    if (!param) return null;
    const n = Number(param);
    return Number.isFinite(n) ? n : null;
  }