<?php

namespace App\Queries\Dashboard;

use App\Models\User;
use App\Models\WorkoutEntry;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection;

class LoadProgressionHistory
{
    public function handle(
        User $user,
        CarbonInterface $activeSince,
        CarbonInterface $to,
    ): Collection {
        $activeExerciseIds = WorkoutEntry::query()
            ->select('workout_entries.exercise_id')
            ->join('workouts', 'workouts.id', '=', 'workout_entries.workout_id')
            ->where('workouts.user_id', $user->id)
            ->whereNotNull('workouts.date')
            ->whereDate('workouts.date', '>=', $activeSince)
            ->whereDate('workouts.date', '<=', $to)
            ->where('workout_entries.weight', '>', 0)
            ->distinct();

        return WorkoutEntry::query()
            ->select('workout_entries.*')
            ->addSelect('workouts.date as workout_date')
            ->join('workouts', 'workouts.id', '=', 'workout_entries.workout_id')
            ->where('workouts.user_id', $user->id)
            ->whereNotNull('workouts.date')
            ->whereDate('workouts.date', '<=', $to)
            ->where('workout_entries.weight', '>', 0)
            ->whereIn('workout_entries.exercise_id', $activeExerciseIds)
            ->with('exercise:id,exercise_name')
            ->orderBy('workouts.date')
            ->orderBy('workout_entries.id')
            ->get();
    }
}
