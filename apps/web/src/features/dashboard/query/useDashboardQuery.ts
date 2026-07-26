import { useQuery } from "@tanstack/react-query";

import { fetchDashboard } from "@/features/dashboard/api/dashboard.api";
import { queryKeys } from "@/lib/query/queryKeys";

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: ({ signal }) => fetchDashboard(signal),
    staleTime: 60_000,
  });
}
