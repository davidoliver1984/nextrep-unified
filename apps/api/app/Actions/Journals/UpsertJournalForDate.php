<?php

namespace App\Actions\Journals;

use App\Models\Journal;
use App\Models\User;

class UpsertJournalForDate
{
    public function handle(User $user, array $data): Journal
    {
        $journal = $user->journals()
            ->whereDate('date', $data['date'])
            ->first() ?? new Journal;

        $journal->fill($data);
        $journal->user()->associate($user);
        $journal->save();

        return $journal->refresh();
    }
}
