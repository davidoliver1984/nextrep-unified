
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DashboardLoading } from "@/features/dashboard/components/DashboardLoading";
import { FastestMovingPanel } from "@/features/dashboard/components/FastestMovingPanel";
import { ProgressionPanel } from "@/features/dashboard/components/ProgressionPanel";
import { TodaysWorkoutsPanel } from "@/features/dashboard/components/TodaysWorkoutsPanel";
import { useDashboardQuery } from "@/features/dashboard/query/useDashboardQuery";
import { formatDashboardDate } from "@/features/dashboard/utils/dashboardFormat";
import { toAppError } from "@/lib/http";

export default function DashboardPage() {
  const dashboardQuery = useDashboardQuery();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {dashboardQuery.data
            ? `Your training overview for ${formatDashboardDate(dashboardQuery.data.date)}.`
            : "Your training overview, progression cues and recent momentum."}
        </p>
      </div>

      {dashboardQuery.isLoading ? <DashboardLoading /> : null}

      {dashboardQuery.isError ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center">
            <span className="rounded-full bg-destructive/15 p-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div className="flex-1 space-y-1">
              <p className="font-medium">Dashboard could not be loaded</p>
              <p className="text-sm text-muted-foreground">
                {toAppError(dashboardQuery.error).message}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => dashboardQuery.refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {dashboardQuery.data ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:col-span-2 xl:col-span-1">
            <TodaysWorkoutsPanel workouts={dashboardQuery.data.today_workouts} />
          </div>
          <ProgressionPanel lifts={dashboardQuery.data.lifts_ready_for_progression} />
          <FastestMovingPanel lifts={dashboardQuery.data.fastest_moving_lifts} />
        </div>
      ) : null}
    </div>
  );
}
