import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { FastestMovingLift } from "@/features/dashboard/types/dashboard";
import { formatWeight } from "@/features/dashboard/utils/dashboardFormat";

type Props = {
  lifts: FastestMovingLift[];
};

export function FastestMovingPanel({ lifts }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-primary/15 p-2 text-primary">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="space-y-1">
            <CardTitle>Fastest moving lifts</CardTitle>
            <CardDescription>Your strongest increases over 90 days.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {lifts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-5">
            <p className="font-medium">No increases to show yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Log the same lift over time to see its movement here.
            </p>
          </div>
        ) : (
          <ul className="divide-y rounded-lg border">
            {lifts.map((lift) => (
              <li key={lift.exercise_id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{lift.exercise_name}</p>
                  <Badge className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">
                    +{lift.increase_percentage}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatWeight(lift.starting_weight)} → {formatWeight(lift.current_weight)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Across {lift.performance_count} logged sessions
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
