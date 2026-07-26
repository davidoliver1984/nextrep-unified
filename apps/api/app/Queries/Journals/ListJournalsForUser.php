<?php

namespace App\Queries\Journals;

use App\Models\Journal;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListJournalsForUser
{
    public function handle(User $user, ?\DateTimeInterface $from = null, ?\DateTimeInterface $to = null, int $perPage = 10): LengthAwarePaginator
    {
        return Journal::query()
            ->where('user_id', $user->id)
            ->when($from, fn ($query) => $query->whereDate('date', '>=', $from))
            ->when($to, fn ($query) => $query->whereDate('date', '<=', $to))
            ->orderByDesc('date')
            ->paginate($perPage);
    }
}
