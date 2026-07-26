<?php

namespace App\Actions\WorkoutTemplates;

use App\Models\User;
use App\Models\Workout;
use App\Models\WorkoutTemplate;
use Illuminate\Support\Facades\DB;

class SaveWorkoutAsTemplate
{
    public function handle(User $user, Workout $workout, array $data): WorkoutTemplate
    {
        return DB::transaction(function () use ($user, $workout, $data) {
            $template = $user->workoutTemplates()->create([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'payload' => null,
            ]);

            $workout->loadMissing('entries');

            foreach ($workout->entries as $entry) {
                $template->entries()->create([
                    'exercise_id' => $entry->exercise_id,
                    'sets' => $entry->sets,
                    'reps' => $entry->reps,
                    'weight' => $entry->weight ?? 0,
                    'notes' => $entry->notes,
                ]);
            }

            return $template->load('entries.exercise');
        });
    }
}
