<?php

namespace App\Actions\WorkoutEntries;

use App\Models\Workout;
use App\Models\WorkoutEntry;
use Illuminate\Database\Eloquent\Collection;

class CompleteWorkoutEntries
{
    /**
     * @return Collection<int, WorkoutEntry>
     */
    public function handle(Workout $workout): Collection
    {
        $workout->entries()->update(['completed' => true]);

        return $workout->entries()->with('exercise')->get();
    }
}
