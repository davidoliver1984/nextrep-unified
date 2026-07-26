<?php

namespace App\Policies;

use App\Models\Journal;
use App\Models\JournalImage;
use App\Models\User;

class JournalImagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, Journal $journal): bool
    {
        return (int) $journal->user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, JournalImage $journalImage): bool
    {
        return (int) $journalImage->journal->user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Journal $journal): bool
    {
        return (int) $journal->user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, JournalImage $journalImage): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, JournalImage $image): bool
    {
        return (int) $image->journal->user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, JournalImage $journalImage): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, JournalImage $journalImage): bool
    {
        return false;
    }
}
