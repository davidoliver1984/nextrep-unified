<?php

namespace Tests\Feature\Api;

use App\Models\JournalImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class JournalImageAuthorizationTest extends ApiTestCase
{
    public function test_owner_can_upload_list_and_delete_journal_image(): void
    {
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        $user = $this->authenticate();
        $journal = $this->journal($user);

        $created = $this->postJson("/api/journals/{$journal->id}/images", [
            'image' => UploadedFile::fake()->image('progress.jpg', 1000, 800),
        ])->assertCreated()
            ->assertJsonPath('data.journal_id', $journal->id)
            ->assertJsonStructure(['data' => ['url', 'thumbnail_url']]);

        $image = JournalImage::findOrFail($created->json('data.id'));
        $thumbnailPath = "journals/{$journal->id}/thumbnails/".pathinfo($image->path, PATHINFO_FILENAME).'.jpg';
        Storage::disk('local')->assertExists($image->path);
        Storage::disk('local')->assertExists($thumbnailPath);

        $thumbnail = imagecreatefromstring(Storage::disk('local')->get($thumbnailPath));
        $this->assertNotFalse($thumbnail);
        $this->assertSame(480, imagesx($thumbnail));
        $this->assertSame(384, imagesy($thumbnail));
        imagedestroy($thumbnail);

        $this->getJson("/api/journal-images/{$image->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $image->id)
            ->assertJsonPath('data.journal_date', '2026-07-20');

        $this->getJson("/api/journals/{$journal->id}/images")
            ->assertOk()
            ->assertJsonFragment(['id' => $image->id]);

        $this->getJson('/api/gallery-images')
            ->assertOk()
            ->assertJsonFragment([
                'id' => $image->id,
                'journal_date' => '2026-07-20',
            ]);

        $this->deleteJson("/api/journal-images/{$image->id}")
            ->assertNoContent();

        Storage::disk('local')->assertMissing($image->path);
        Storage::disk('local')->assertMissing($thumbnailPath);
        $this->assertDatabaseMissing('journal_images', ['id' => $image->id]);
    }

    public function test_user_cannot_manage_another_users_images(): void
    {
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        $this->authenticate();
        $other = User::factory()->create();
        $journal = $this->journal($other);
        $image = $journal->images()->create(['path' => "journals/{$journal->id}/private.jpg"]);

        $this->getJson("/api/journals/{$journal->id}/images")->assertForbidden();
        $this->postJson("/api/journals/{$journal->id}/images", [
            'image' => UploadedFile::fake()->image('attempt.jpg'),
        ])->assertForbidden();
        $this->deleteJson("/api/journal-images/{$image->id}")->assertForbidden();
        $this->getJson("/api/journal-images/{$image->id}")->assertForbidden();
        $this->getJson('/api/gallery-images')
            ->assertOk()
            ->assertJsonMissing(['id' => $image->id]);
    }

    public function test_upload_requires_an_image_within_size_limit(): void
    {
        $user = $this->authenticate();
        $journal = $this->journal($user);

        $this->postJson("/api/journals/{$journal->id}/images", [
            'image' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('image');
    }

    public function test_image_pagination_is_validated(): void
    {
        $this->authenticate();

        $this->getJson('/api/gallery-images?per_page=101')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('per_page');
    }
}
