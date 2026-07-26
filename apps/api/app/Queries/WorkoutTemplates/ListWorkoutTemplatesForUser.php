<?php

namespace App\Queries\WorkoutTemplates;

use App\Models\User;
use App\Models\WorkoutTemplate;
use Illuminate\Database\Eloquent\Collection;

class ListWorkoutTemplatesForUser
{
    public function handle(User $user): Collection
    {
        return WorkoutTemplate::query()
            ->where('user_id', $user->id)
            ->withCount('entries')
            ->latest()
            ->get();
    }
}
