<?php

namespace App\Queries\WorkoutEntries;

use App\Models\Workout;
use Illuminate\Database\Eloquent\Collection;

class ListWorkoutEntries
{
    public function handle(Workout $workout): Collection
    {
        return $workout->entries()->with('exercise')->latest()->get();
    }
}
