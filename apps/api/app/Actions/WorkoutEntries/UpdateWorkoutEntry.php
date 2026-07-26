<?php

namespace App\Actions\WorkoutEntries;

use App\Models\WorkoutEntry;

class UpdateWorkoutEntry
{
    public function handle(WorkoutEntry $entry, array $data): WorkoutEntry
    {
        $entry->update($data);

        return $entry->refresh()->load('exercise');
    }
}
