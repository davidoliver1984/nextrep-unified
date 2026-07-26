<?php

namespace App\Actions\WorkoutTemplates;

use App\Models\Journal;
use App\Models\User;
use App\Models\Workout;
use App\Models\WorkoutTemplate;
use Illuminate\Support\Facades\DB;

class ApplyWorkoutTemplate
{
    public function handle(User $user, WorkoutTemplate $template, Journal $journal, ?string $title = null): Workout
    {
        return DB::transaction(function () use ($user, $template, $journal, $title) {
            $workout = $user->workouts()->create([
                'journal_id' => $journal->id,
                'title' => $title ?? $template->title,
                'date' => $journal->date,
            ]);

            $template->loadMissing('entries');

            foreach ($template->entries as $entry) {
                $workout->entries()->create([
                    'exercise_id' => $entry->exercise_id,
                    'sets' => $entry->sets,
                    'reps' => $entry->reps,
                    'weight' => $entry->weight,
                    'notes' => $entry->notes,
                    'completed' => false,
                ]);
            }

            return $workout->load(['journal:id,date', 'entries.exercise']);
        });
    }
}
