<?php

namespace App\Actions\JournalImages;

use App\Models\Journal;
use App\Models\JournalImage;
use App\Services\Files\FileStorageService;
use App\Services\Images\ImageThumbnailService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Throwable;

class CreateJournalImage
{
    public function __construct(
        private FileStorageService $storage,
        private ImageThumbnailService $thumbnails,
    ) {}

    public function handle(Journal $journal, UploadedFile $file): JournalImage
    {
        $extension = $file->extension() ?: 'bin';
        $contents = file_get_contents($file->getRealPath());

        return $this->handleContents($journal, $contents, $extension);
    }

    public function handleContents(Journal $journal, string $contents, string $extension): JournalImage
    {
        $path = "journals/{$journal->id}/".Str::uuid().".{$extension}";
        $thumbnailPath = $this->thumbnails->pathFor($path);

        try {
            $this->storage->put($path, $contents);
            $this->storage->put($thumbnailPath, $this->thumbnails->create($contents));

            return $journal->images()->create(['path' => $path]);
        } catch (Throwable $exception) {
            $this->storage->delete($path);
            $this->storage->delete($thumbnailPath);

            throw $exception;
        }
    }
}
