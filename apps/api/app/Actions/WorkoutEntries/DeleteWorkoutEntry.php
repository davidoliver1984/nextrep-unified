<?php

namespace App\Actions\WorkoutEntries;

use App\Models\WorkoutEntry;

class DeleteWorkoutEntry
{
    public function handle(WorkoutEntry $entry): void
    {
        $entry->delete();
    }
}
