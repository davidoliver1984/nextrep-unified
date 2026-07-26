<?php

namespace Tests\Feature\Api;

use App\Models\User;

class WorkoutAuthorizationTest extends ApiTestCase
{
    public function test_owner_can_create_update_and_delete_workout_with_entries(): void
    {
        $user = $this->authenticate();
        $journal = $this->journal($user);
        $exercise = $this->exercise();

        $created = $this->postJson('/api/workouts', [
            'journal_id' => $journal->id,
            'title' => 'Heavy push workout',
            'date' => '2026-07-20',
            'entries' => [[
                'exercise_id' => $exercise->id,
                'sets' => 3,
                'reps' => 8,
                'weight' => 80.5,
                'notes' => 'Controlled reps',
            ]],
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Heavy push workout')
            ->assertJsonCount(1, 'data.entries');

        $workoutId = $created->json('data.id');

        $this->patchJson("/api/workouts/{$workoutId}", [
            'title' => 'Updated push workout',
        ])->assertOk()
            ->assertJsonPath('data.title', 'Updated push workout');

        $this->deleteJson("/api/workouts/{$workoutId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('workouts', ['id' => $workoutId]);
        $this->assertDatabaseMissing('workout_entries', ['workout_id' => $workoutId]);
    }

    public function test_workout_list_is_scoped_to_authenticated_user(): void
    {
        $user = $this->authenticate();
        $other = User::factory()->create();
        $ownWorkout = $this->workout($user);
        $otherWorkout = $this->workout($other);

        $this->getJson('/api/workouts')
            ->assertOk()
            ->assertJsonFragment(['id' => $ownWorkout->id])
            ->assertJsonMissing(['id' => $otherWorkout->id]);
    }

    public function test_user_cannot_access_another_users_workout(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $workout = $this->workout($other);

        $this->getJson("/api/workouts/{$workout->id}")->assertForbidden();
        $this->patchJson("/api/workouts/{$workout->id}", ['title' => 'Changed title'])->assertForbidden();
        $this->deleteJson("/api/workouts/{$workout->id}")->assertForbidden();
    }

    public function test_user_cannot_create_workout_for_another_users_journal(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $journal = $this->journal($other);
        $exercise = $this->exercise();

        $this->postJson('/api/workouts', [
            'journal_id' => $journal->id,
            'title' => 'Push workout',
            'entries' => [[
                'exercise_id' => $exercise->id,
                'sets' => 3,
                'reps' => 8,
                'weight' => 80,
            ]],
        ])->assertForbidden();
    }

    public function test_workout_entries_are_validated(): void
    {
        $this->authenticate();

        $this->postJson('/api/workouts', [
            'title' => 'Push workout',
            'entries' => [[
                'exercise_id' => 999,
                'sets' => 0,
                'reps' => 0,
                'weight' => 3000,
            ]],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'entries.0.exercise_id',
                'entries.0.sets',
                'entries.0.reps',
                'entries.0.weight',
            ]);
    }
}
