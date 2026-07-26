<?php

namespace App\Actions\Workouts;

use App\Models\Workout;

class DeleteWorkout
{
    public function handle(Workout $workout): void
    {
        $workout->delete();
    }
}
