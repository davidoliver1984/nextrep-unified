<?php

namespace App\Actions\JournalImages;

use App\Models\JournalImage;
use App\Services\Files\FileStorageService;
use App\Services\Images\ImageThumbnailService;

class DeleteJournalImage
{
    public function __construct(
        private FileStorageService $storage,
        private ImageThumbnailService $thumbnails,
    ) {}

    public function handle(JournalImage $image): void
    {
        $this->storage->delete($image->path);
        $this->storage->delete($this->thumbnails->pathFor($image->path));
        $image->delete();
    }
}
