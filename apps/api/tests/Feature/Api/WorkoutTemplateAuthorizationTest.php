<?php

namespace Tests\Feature\Api;

use App\Models\User;

class WorkoutTemplateAuthorizationTest extends ApiTestCase
{
    public function test_owner_can_create_and_apply_template(): void
    {
        $user = $this->authenticate();
        $journal = $this->journal($user);
        $exercise = $this->exercise();

        $created = $this->postJson('/api/templates', [
            'title' => 'Push day',
            'description' => 'Main push session',
            'payload' => [
                'entries' => [[
                    'exercise_id' => $exercise->id,
                    'sets' => 3,
                    'reps' => 8,
                    'weight' => 70,
                ]],
            ],
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Push day')
            ->assertJsonCount(1, 'data.entries');

        $templateId = $created->json('data.id');

        $this->postJson("/api/templates/{$templateId}/apply", [
            'journal_id' => $journal->id,
            'title' => 'Monday push day',
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Monday push day')
            ->assertJsonPath('data.journal_id', $journal->id)
            ->assertJsonCount(1, 'data.entries');
    }

    public function test_owner_can_save_workout_as_template(): void
    {
        $user = $this->authenticate();
        $exercise = $this->exercise();
        $workout = $this->workout($user);
        $this->entry($workout, $exercise);

        $this->postJson("/api/workouts/{$workout->id}/save-as-template", [
            'title' => 'Saved workout',
            'description' => 'Reusable session',
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Saved workout')
            ->assertJsonCount(1, 'data.entries');
    }

    public function test_saving_workout_as_template_converts_unset_weight_to_zero(): void
    {
        $user = $this->authenticate();
        $exercise = $this->exercise();
        $workout = $this->workout($user);
        $this->entry($workout, $exercise, ['weight' => null]);

        $this->postJson("/api/workouts/{$workout->id}/save-as-template", [
            'title' => 'Bodyweight workout',
        ])->assertCreated()
            ->assertJsonPath('data.entries.0.weight', 0);
    }

    public function test_template_list_is_scoped_to_authenticated_user(): void
    {
        $user = $this->authenticate();
        $other = User::factory()->create();
        $ownTemplate = $this->template($user);
        $otherTemplate = $this->template($other, ['title' => 'Private template']);

        $this->getJson('/api/templates')
            ->assertOk()
            ->assertJsonFragment(['id' => $ownTemplate->id])
            ->assertJsonMissing(['id' => $otherTemplate->id]);
    }

    public function test_user_cannot_apply_another_users_template(): void
    {
        $user = $this->authenticate();
        $other = User::factory()->create();
        $journal = $this->journal($user);
        $template = $this->template($other);

        $this->postJson("/api/templates/{$template->id}/apply", [
            'journal_id' => $journal->id,
        ])->assertForbidden();
    }

    public function test_user_cannot_apply_template_to_another_users_journal(): void
    {
        $user = $this->authenticate();
        $other = User::factory()->create();
        $journal = $this->journal($other);
        $template = $this->template($user);

        $this->postJson("/api/templates/{$template->id}/apply", [
            'journal_id' => $journal->id,
        ])->assertForbidden();
    }

    public function test_user_cannot_save_another_users_workout_as_template(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $workout = $this->workout($other);

        $this->postJson("/api/workouts/{$workout->id}/save-as-template", [
            'title' => 'Copied workout',
        ])->assertForbidden();
    }

    public function test_owner_can_delete_template(): void
    {
        $user = $this->authenticate();
        $template = $this->template($user);

        $this->deleteJson("/api/templates/{$template->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('workout_templates', ['id' => $template->id]);
    }

    public function test_user_cannot_delete_another_users_template(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $template = $this->template($other);

        $this->deleteJson("/api/templates/{$template->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('workout_templates', ['id' => $template->id]);
    }
}
