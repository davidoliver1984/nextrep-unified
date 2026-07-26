<?php

namespace App\Actions\Workouts;

use App\Models\Workout;

class UpdateWorkout
{
    public function handle(Workout $workout, array $data): Workout
    {
        $workout->update($data);

        return $workout->refresh()->load(['journal:id,date', 'entries.exercise']);
    }
}
