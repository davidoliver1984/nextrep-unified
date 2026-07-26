import { Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { ProgressionCandidate } from "@/features/dashboard/types/dashboard";
import { formatDashboardDate, formatWeight } from "@/features/dashboard/utils/dashboardFormat";

type Props = {
  lifts: ProgressionCandidate[];
};

export function ProgressionPanel({ lifts }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-primary/15 p-2 text-primary">
            <Target className="h-5 w-5" />
          </span>
          <div className="space-y-1">
            <CardTitle>Lifts ready for progression</CardTitle>
            <CardDescription>Active lifts without a recent increase.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {lifts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-5">
            <p className="font-medium">No lifts are due yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep logging sessions and progression suggestions will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y rounded-lg border">
            {lifts.map((lift) => (
              <li key={lift.exercise_id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{lift.exercise_name}</p>
                  <Badge variant="secondary">{lift.days_since_progression} days</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current {formatWeight(lift.current_weight)} · Best {formatWeight(lift.personal_best_weight)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last trained {formatDashboardDate(lift.last_performed_at, "d MMM yyyy")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
