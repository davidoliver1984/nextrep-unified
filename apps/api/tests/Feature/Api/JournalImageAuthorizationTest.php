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

    public function test_user_can_upload_an_image_to_their_journal_by_exact_date(): void
    {
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        $user = $this->authenticate();
        $journal = $this->journal($user, ['date' => '2026-08-12']);

        $created = $this->postJson('/api/journal-images/by-date', [
            'date' => '2026-08-12',
            'image' => UploadedFile::fake()->image('progress.jpg', 1000, 800),
        ])->assertCreated()
            ->assertJsonPath('data.journal_id', $journal->id)
            ->assertJsonPath('data.journal_date', '2026-08-12');

        $image = JournalImage::findOrFail($created->json('data.id'));
        Storage::disk('local')->assertExists($image->path);
    }

    public function test_user_can_upload_a_base64_image_to_their_journal_by_exact_date(): void
    {
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        $user = $this->authenticate();
        $journal = $this->journal($user, ['date' => '2026-08-12']);
        $file = UploadedFile::fake()->image('progress.jpg', 1000, 800);

        $created = $this->postJson('/api/journal-images/by-date', [
            'date' => '2026-08-12',
            'image_base64' => base64_encode(file_get_contents($file->getRealPath())),
        ])->assertCreated()
            ->assertJsonPath('data.journal_id', $journal->id)
            ->assertJsonPath('data.journal_date', '2026-08-12');

        $image = JournalImage::findOrFail($created->json('data.id'));
        Storage::disk('local')->assertExists($image->path);
    }

    public function test_upload_by_date_never_uses_another_users_journal(): void
    {
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        $this->authenticate();
        $other = User::factory()->create();
        $this->journal($other, ['date' => '2026-08-12']);

        $this->postJson('/api/journal-images/by-date', [
            'date' => '2026-08-12',
            'image' => UploadedFile::fake()->image('private.jpg'),
        ])->assertNotFound()
            ->assertJsonPath('message', 'No journal exists for 2026-08-12.');

        $this->assertDatabaseCount('journal_images', 0);
    }

    public function test_upload_by_date_does_not_create_or_guess_a_journal(): void
    {
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        $user = $this->authenticate();
        $this->journal($user, ['date' => '2026-08-11']);

        $this->postJson('/api/journal-images/by-date', [
            'date' => '2026-08-12',
            'image' => UploadedFile::fake()->image('unmatched.jpg'),
        ])->assertNotFound()
            ->assertJson([
                'message' => 'No journal exists for 2026-08-12.',
                'date' => '2026-08-12',
            ]);

        $this->assertDatabaseCount('journals', 1);
        $this->assertDatabaseCount('journal_images', 0);
    }

    public function test_shortcut_can_skip_a_missing_journal_without_stopping_its_batch(): void
    {
        Storage::fake('local');
        config(['filesystems.default' => 'local']);

        $user = $this->authenticate();
        $this->journal($user, ['date' => '2026-08-11']);
        $file = UploadedFile::fake()->image('unmatched.jpg');

        $this->postJson('/api/journal-images/by-date', [
            'date' => '2026-08-12',
            'image_base64' => base64_encode(file_get_contents($file->getRealPath())),
            'skip_missing' => '1',
        ])->assertOk()
            ->assertJson([
                'uploaded' => false,
                'status' => 'skipped',
                'message' => 'No journal exists for 2026-08-12.',
                'date' => '2026-08-12',
            ]);

        $this->assertDatabaseCount('journals', 1);
        $this->assertDatabaseCount('journal_images', 0);
    }

    public function test_upload_by_date_requires_an_exact_date_and_image(): void
    {
        $this->authenticate();

        $this->postJson('/api/journal-images/by-date', [
            'date' => '12/08/2026',
            'image' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['date', 'image']);
    }

    public function test_upload_by_date_rejects_invalid_base64_image_data(): void
    {
        $this->authenticate();

        $this->postJson('/api/journal-images/by-date', [
            'date' => '2026-08-12',
            'image_base64' => base64_encode('not an image'),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('image_base64');
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
