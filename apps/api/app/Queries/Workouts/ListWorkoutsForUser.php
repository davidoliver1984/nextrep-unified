<?php

namespace App\Queries\Workouts;

use App\Models\User;
use App\Models\Workout;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListWorkoutsForUser
{
    public function handle(User $user, ?int $journalId = null, int $perPage = 10): LengthAwarePaginator
    {
        return Workout::query()
            ->where('user_id', $user->id)
            ->when($journalId, fn ($query) => $query->where('journal_id', $journalId))
            ->with(['journal:id,date', 'entries.exercise'])
            ->latest('id')
            ->paginate($perPage);
    }
}
