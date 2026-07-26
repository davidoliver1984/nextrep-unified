<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workout;
use App\Models\WorkoutEntry;

class WorkoutEntryPolicy
{
    public function viewAny(User $user, Workout $workout): bool
    {
        return (int) $workout->user_id === (int) $user->id;
    }

    public function view(User $user, WorkoutEntry $workoutEntry): bool
    {
        return (int) $workoutEntry->workout->user_id === (int) $user->id;
    }

    public function create(User $user, Workout $workout): bool
    {
        return (int) $workout->user_id === (int) $user->id;
    }

    public function update(User $user, WorkoutEntry $workoutEntry): bool
    {
        return (int) $workoutEntry->workout->user_id === (int) $user->id;
    }

    public function delete(User $user, WorkoutEntry $workoutEntry): bool
    {
        return (int) $workoutEntry->workout->user_id === (int) $user->id;
    }
}
