<?php

namespace App\Actions\WorkoutTemplates;

use App\Models\WorkoutTemplate;

class DeleteWorkoutTemplate
{
    public function handle(WorkoutTemplate $template): void
    {
        $template->delete();
    }
}
