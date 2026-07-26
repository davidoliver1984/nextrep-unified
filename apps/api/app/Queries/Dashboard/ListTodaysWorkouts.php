<?php

namespace App\Queries\Dashboard;

use App\Models\User;
use App\Models\Workout;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection;

class ListTodaysWorkouts
{
    public function handle(User $user, CarbonInterface $today): Collection
    {
        return Workout::query()
            ->where('user_id', $user->id)
            ->whereDate('date', $today)
            ->with(['journal:id,date', 'entries.exercise'])
            ->oldest('id')
            ->get();
    }
}
