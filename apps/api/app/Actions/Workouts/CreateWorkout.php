<?php

namespace App\Actions\Workouts;

use App\Models\Journal;
use App\Models\User;
use App\Models\Workout;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class CreateWorkout
{
    public function handle(User $user, array $data): Workout
    {
        $journal = $this->ownedJournal($user, $data['journal_id'] ?? null);

        return DB::transaction(function () use ($user, $journal, $data) {
            $workout = $user->workouts()->create([
                'journal_id' => $journal?->id,
                'title' => $data['title'],
                'date' => $data['date'] ?? now()->toDateString(),
            ]);

            foreach ($data['entries'] as $entry) {
                $workout->entries()->create([
                    'exercise_id' => $entry['exercise_id'],
                    'sets' => $entry['sets'],
                    'reps' => $entry['reps'],
                    'weight' => $entry['weight'],
                    'notes' => $entry['notes'] ?? null,
                ]);
            }

            return $workout->load(['journal:id,date', 'entries.exercise']);
        });
    }

    private function ownedJournal(User $user, ?int $journalId): ?Journal
    {
        if ($journalId === null) {
            return null;
        }

        return Journal::query()
            ->where('user_id', $user->id)
            ->find($journalId)
            ?? throw (new ModelNotFoundException)->setModel(Journal::class, [$journalId]);
    }
}
