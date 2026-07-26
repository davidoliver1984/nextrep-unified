<?php

namespace App\Queries\JournalImages;

use App\Models\JournalImage;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListGalleryImages
{
    public function handle(User $user, int $perPage = 24): LengthAwarePaginator
    {
        return JournalImage::query()
            ->select('journal_images.*')
            ->join('journals', 'journals.id', '=', 'journal_images.journal_id')
            ->where('journals.user_id', $user->id)
            ->with('journal')
            ->orderByDesc('journals.date')
            ->orderByDesc('journal_images.id')
            ->paginate($perPage);
    }
}
