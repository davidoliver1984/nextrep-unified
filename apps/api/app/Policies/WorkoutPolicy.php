<?php

namespace App\Policies;

use App\Models\Journal;
use App\Models\User;
use App\Models\Workout;

class WorkoutPolicy
{
    /**
     * Anyone authenticated can list their own workouts (query is user-scoped).
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * A workout is viewable only by its owner.
     */
    public function view(User $user, Workout $workout): bool
    {
        return (int) $user->id === (int) $workout->user_id;
    }

    /**
     * Creating a workout requires owning the target journal.
     * We’ll pass the Journal as an extra argument when authorizing.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Owner can update/delete.
     */
    public function update(User $user, Workout $workout): bool
    {
        return (int) $user->id === (int) $workout->user_id;
    }

    public function delete(User $user, Workout $workout): bool
    {
        return (int) $user->id === (int) $workout->user_id;
    }

    // (restore/forceDelete usually not needed)
}
