<?php

namespace App\Actions\Journals;

use App\Models\Journal;

class DeleteJournal
{
    public function handle(Journal $journal): void
    {
        $journal->delete();
    }
}
