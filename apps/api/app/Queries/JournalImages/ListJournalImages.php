<?php

namespace App\Queries\JournalImages;

use App\Models\Journal;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListJournalImages
{
    public function handle(Journal $journal, int $perPage = 24): LengthAwarePaginator
    {
        return $journal->images()
            ->latest('id')
            ->paginate($perPage);
    }
}
