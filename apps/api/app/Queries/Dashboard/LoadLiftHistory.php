<?php

namespace App\Queries\Dashboard;

use App\Models\User;
use App\Models\WorkoutEntry;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection;

class LoadLiftHistory
{
    public function handle(User $user, CarbonInterface $from, CarbonInterface $to): Collection
    {
        return WorkoutEntry::query()
            ->select('workout_entries.*')
            ->addSelect('workouts.date as workout_date')
            ->join('workouts', 'workouts.id', '=', 'workout_entries.workout_id')
            ->where('workouts.user_id', $user->id)
            ->whereNotNull('workouts.date')
            ->whereDate('workouts.date', '>=', $from)
            ->whereDate('workouts.date', '<=', $to)
            ->where('workout_entries.weight', '>', 0)
            ->with('exercise:id,exercise_name')
            ->orderBy('workouts.date')
            ->orderBy('workout_entries.id')
            ->get();
    }
}
