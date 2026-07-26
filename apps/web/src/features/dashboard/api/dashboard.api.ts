import api from "@/api/api";
import { unwrapOne } from "@/lib/http/unwrapResponse";

import type { Dashboard } from "@/features/dashboard/types/dashboard";

export async function fetchDashboard(signal?: AbortSignal): Promise<Dashboard> {
  const response = await api.get("/dashboard", { signal });

  return unwrapOne<Dashboard>(response.data);
}
