<?php

namespace App\Actions\WorkoutTemplates;

use App\Models\User;
use App\Models\WorkoutTemplate;
use Illuminate\Support\Facades\DB;

class CreateWorkoutTemplate
{
    public function handle(User $user, array $data): WorkoutTemplate
    {
        return DB::transaction(function () use ($user, $data) {
            $template = $user->workoutTemplates()->create([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'payload' => $data['payload'] ?? null,
            ]);

            foreach ($data['payload']['entries'] ?? [] as $entry) {
                $template->entries()->create($entry);
            }

            return $template->load('entries.exercise');
        });
    }
}
