<?php

namespace App\Actions\WorkoutEntries;

use App\Models\Workout;
use App\Models\WorkoutEntry;

class CreateWorkoutEntry
{
    public function handle(Workout $workout, array $data): WorkoutEntry
    {
        $entry = $workout->entries()->create([
            'exercise_id' => $data['exercise_id'],
            'sets' => $data['sets'],
            'reps' => $data['reps'],
            'weight' => $data['weight'],
            'completed' => $data['completed'] ?? false,
            'notes' => $data['notes'] ?? null,
        ]);

        return $entry->load('exercise');
    }
}
