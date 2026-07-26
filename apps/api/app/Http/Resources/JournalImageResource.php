<?php

namespace App\Http\Resources;

use App\Services\Files\FileStorageService;
use App\Services\Images\ImageThumbnailService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JournalImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var FileStorageService $storage */
        $storage = app(FileStorageService::class);
        /** @var ImageThumbnailService $thumbnails */
        $thumbnails = app(ImageThumbnailService::class);
        $thumbnailPath = $thumbnails->pathFor($this->path);

        return [
            'id' => $this->id,
            'journal_id' => $this->journal_id,
            'journal_date' => $this->whenLoaded(
                'journal',
                fn () => $this->journal?->date?->format('Y-m-d')
            ),
            'url' => $storage->temporaryUrl($this->path, 60),
            'thumbnail_url' => $storage->temporaryUrl(
                $storage->exists($thumbnailPath) ? $thumbnailPath : $this->path,
                60,
            ),
            'path' => $this->path,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
