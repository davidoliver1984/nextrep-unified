<?php

namespace App\Services\Files;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\File as HttpFile;
use Illuminate\Support\Facades\Storage;

class FileStorageService
{
    private FilesystemAdapter $disk;

    public function __construct(?string $disk = null)
    {
        // Grab the actual driver instance here
        $name = $disk ?: config('filesystems.default', 's3');
        $this->disk = Storage::disk($name);
    }

    public function put(string $path, string|HttpFile $contents, array $options = []): string
    {
        if (! $this->disk->put($path, $contents, $options)) {
            throw new \RuntimeException("The file could not be stored at {$path}.");
        }

        return $path;
    }

    public function exists(string $path): bool
    {
        return $this->disk->exists($path);
    }

    public function delete(string $path): bool
    {
        return $this->disk->delete($path);
    }

    public function publicUrl(string $path): string
    {
        return $this->disk->url($path);
    }

    public function temporaryUrl(string $path, int $minutes = 60): string
    {
        if ($this->disk->providesTemporaryUrls()) {
            return $this->disk->temporaryUrl($path, now()->addMinutes($minutes));
        }

        return $this->disk->url($path);
    }
}
