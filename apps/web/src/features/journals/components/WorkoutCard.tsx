// WorkoutCard.tsx
import * as React from "react";
import { ListChecks, MoreHorizontal, Plus, X } from "lucide-react";

import type { Exercise } from "@/features/exercises/types/exercise";
import type { Workout } from "@/features/workouts/types/workout";
import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";
import { WorkoutEntriesList } from "@/features/workouts/components/WorkoutEntriesList";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { WorkoutQuickAdd } from "./WorkoutQuickAdd";

type Props = {
  workout: Workout;
  exercises: Exercise[];

  onPatch: (entryId: number, patch: Partial<WorkoutEntry>) => void | Promise<void>;
  onRemove: (entryId: number) => void | Promise<void>;

  // Create entry mutation (parent provides)
  onQuickAddCreate: (workoutId: number, form: QuickAddForm) => Promise<void>;

  onEditWorkout?: (workoutId: number) => void;
  onDeleteWorkout?: (workoutId: number) => void;
  onCompleteAll?: (workoutId: number) => void | Promise<void>;
  completingAll?: boolean;
};

export type QuickAddForm = {
  exerciseId: string;
  sets: string;
  reps: string;
  weight: string;
};

export function WorkoutCard({
  workout,
  exercises,
  onPatch,
  onRemove,
  onQuickAddCreate,
  onEditWorkout,
  onDeleteWorkout,
  onCompleteAll,
  completingAll = false,
}: Props) {
  const workoutId = Number(workout.id);
  const entryCount = workout.entries?.length ?? 0;
  const completedCount = workout.entries?.filter((entry) => entry.completed).length ?? 0;
  const allComplete = entryCount > 0 && completedCount === entryCount;

  const [quickOpen, setQuickOpen] = React.useState(false);

  return (
    <Card className="border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{workout.title}</CardTitle>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="h-5 px-2 text-[11px] font-medium">
                {entryCount} {entryCount === 1 ? "entry" : "entries"}
              </Badge>
              <Badge
                variant="outline"
                className={allComplete
                  ? "h-5 border-emerald-500/50 bg-emerald-500/10 px-2 text-[11px] text-emerald-400"
                  : "h-5 border-amber-500/40 bg-amber-500/10 px-2 text-[11px] text-amber-300"}
              >
                {completedCount}/{entryCount} complete
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={quickOpen ? "outline" : "secondary"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuickOpen((v) => !v)}
              aria-label={quickOpen ? "Close quick add" : "Open quick add"}
              title={quickOpen ? "Close quick add" : "Quick add entry"}
            >
              {quickOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Workout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEditWorkout?.(workoutId)} disabled={!onEditWorkout}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setQuickOpen(true)}>
                  Quick add entry
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => void onCompleteAll?.(workoutId)}
                  disabled={!onCompleteAll || entryCount === 0 || allComplete || completingAll}
                >
                  <ListChecks />
                  {completingAll ? "Marking complete…" : "Mark all complete"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDeleteWorkout?.(workoutId)}
                  disabled={!onDeleteWorkout}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {quickOpen ? (
          <WorkoutQuickAdd
            exercises={exercises}
            onCreate={(form) => onQuickAddCreate(workoutId, form)}
            onClose={() => setQuickOpen(false)}
          />
        ) : null}

        <WorkoutEntriesList
          entries={workout.entries ?? []}
          exercises={exercises}
          onPatch={onPatch}
          onRemove={onRemove}
        />
      </CardContent>
    </Card>
  );
}
