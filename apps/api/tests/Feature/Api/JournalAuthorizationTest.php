<?php

namespace Tests\Feature\Api;

use App\Models\User;

class JournalAuthorizationTest extends ApiTestCase
{
    public function test_owner_can_create_update_and_delete_journal(): void
    {
        $user = $this->authenticate();

        $created = $this->postJson('/api/journals', [
            'date' => '2026-07-20',
            'weight' => 180.5,
            'steps' => 8000,
            'calories' => 2400,
            'notes' => 'Rest day',
        ])->assertCreated()
            ->assertJsonPath('data.date', '2026-07-20')
            ->assertJsonPath('data.steps', 8000);

        $journalId = $created->json('data.id');

        $this->putJson("/api/journals/{$journalId}", [
            'date' => '2026-07-20',
            'weight' => 181,
            'steps' => 9000,
            'calories' => 2500,
            'notes' => 'Updated notes',
        ])->assertOk()
            ->assertJsonPath('data.notes', 'Updated notes');

        $this->deleteJson("/api/journals/{$journalId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('journals', [
            'id' => $journalId,
            'user_id' => $user->id,
        ]);
    }

    public function test_creating_same_date_updates_existing_journal(): void
    {
        $user = $this->authenticate();
        $journal = $this->journal($user, ['date' => '2026-07-20']);

        $this->postJson('/api/journals', [
            'date' => '2026-07-20',
            'steps' => 10000,
        ])->assertCreated()
            ->assertJsonPath('data.id', $journal->id)
            ->assertJsonPath('data.steps', 10000);

        $this->assertDatabaseCount('journals', 1);
    }

    public function test_journal_date_cannot_be_changed_to_an_existing_date(): void
    {
        $user = $this->authenticate();
        $journal = $this->journal($user, ['date' => '2026-07-20']);
        $this->journal($user, ['date' => '2026-07-19']);

        $this->patchJson("/api/journals/{$journal->id}", [
            'date' => '2026-07-19',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('date');
    }

    public function test_journal_list_is_scoped_to_authenticated_user(): void
    {
        $user = $this->authenticate();
        $other = User::factory()->create();
        $ownJournal = $this->journal($user);
        $otherJournal = $this->journal($other, ['date' => '2026-07-19']);

        $this->getJson('/api/journals')
            ->assertOk()
            ->assertJsonFragment(['id' => $ownJournal->id])
            ->assertJsonMissing(['id' => $otherJournal->id]);
    }

    public function test_user_cannot_access_another_users_journal(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $journal = $this->journal($other);

        $this->getJson("/api/journals/{$journal->id}")->assertForbidden();
        $this->patchJson("/api/journals/{$journal->id}", ['notes' => 'Changed'])->assertForbidden();
        $this->deleteJson("/api/journals/{$journal->id}")->assertForbidden();
    }

    public function test_journal_payload_is_validated(): void
    {
        $this->authenticate();

        $this->postJson('/api/journals', [
            'date' => 'not-a-date',
            'steps' => -1,
            'notes' => str_repeat('x', 2001),
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['date', 'steps', 'notes']);
    }
}
