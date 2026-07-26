<?php

namespace App\Services\Images;

use RuntimeException;

class ImageThumbnailService
{
    public function pathFor(string $originalPath): string
    {
        $directory = dirname($originalPath);
        $filename = pathinfo($originalPath, PATHINFO_FILENAME);

        return "{$directory}/thumbnails/{$filename}.jpg";
    }

    public function create(string $contents, int $maximumDimension = 480): string
    {
        $source = @imagecreatefromstring($contents);

        if ($source === false) {
            throw new RuntimeException('The uploaded image could not be processed.');
        }

        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $scale = min(1, $maximumDimension / max($sourceWidth, $sourceHeight));
        $targetWidth = max(1, (int) round($sourceWidth * $scale));
        $targetHeight = max(1, (int) round($sourceHeight * $scale));
        $thumbnail = imagecreatetruecolor($targetWidth, $targetHeight);

        if ($thumbnail === false) {
            imagedestroy($source);

            throw new RuntimeException('The image thumbnail could not be created.');
        }

        $background = imagecolorallocate($thumbnail, 255, 255, 255);
        imagefill($thumbnail, 0, 0, $background);
        imagecopyresampled(
            $thumbnail,
            $source,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $sourceWidth,
            $sourceHeight,
        );

        ob_start();
        $encoded = imagejpeg($thumbnail, null, 82);
        $jpeg = ob_get_clean();

        imagedestroy($thumbnail);
        imagedestroy($source);

        if (! $encoded || ! is_string($jpeg)) {
            throw new RuntimeException('The image thumbnail could not be encoded.');
        }

        return $jpeg;
    }
}
