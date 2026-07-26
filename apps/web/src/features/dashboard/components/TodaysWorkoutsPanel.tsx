import { CalendarDays, ChevronRight, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { Workout } from "@/features/workouts/types/workout";

type Props = {
  workouts: Workout[];
};

export function TodaysWorkoutsPanel({ workouts }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-primary/15 p-2 text-primary">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div className="space-y-1">
            <CardTitle>Today&apos;s workouts</CardTitle>
            <CardDescription>Your training planned for today.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {workouts.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 rounded-lg border border-dashed p-5">
            <div className="space-y-1">
              <p className="font-medium">Nothing planned yet</p>
              <p className="text-sm text-muted-foreground">
                Create today&apos;s journal entry, then add your workout.
              </p>
            </div>
            <Button asChild>
              <Link to="/journals/create">Create workout</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y rounded-lg border">
            {workouts.map((workout) => (
              <li key={workout.id}>
                <Link
                  to={
                    workout.journal_id
                      ? `/journals/${workout.journal_id}/edit?tab=saved`
                      : "/journals"
                  }
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-accent"
                >
                  <Dumbbell className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{workout.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {workout.entries?.length ?? 0} exercises
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
