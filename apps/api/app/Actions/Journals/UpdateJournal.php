<?php

namespace App\Actions\Journals;

use App\Models\Journal;

class UpdateJournal
{
    public function handle(Journal $journal, array $data): Journal
    {
        $journal->update($data);

        return $journal->refresh();
    }
}
