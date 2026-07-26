<?php

namespace Tests\Feature\Api;

use App\Models\User;

class WorkoutEntryAuthorizationTest extends ApiTestCase
{
    public function test_user_cannot_access_another_users_workout_entries(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $exercise = $this->exercise();
        $workout = $this->workout($other);
        $entry = $this->entry($workout, $exercise);

        $this->getJson("/api/workouts/{$workout->id}/entries")->assertForbidden();
        $this->getJson("/api/workout-entries/{$entry->id}")->assertForbidden();
        $this->patchJson("/api/workout-entries/{$entry->id}", ['weight' => 90])->assertForbidden();
        $this->deleteJson("/api/workout-entries/{$entry->id}")->assertForbidden();
    }

    public function test_user_cannot_add_entry_to_another_users_workout(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $workout = $this->workout($other);
        $exercise = $this->exercise();

        $this->postJson('/api/workout-entries', [
            'workout_id' => $workout->id,
            'exercise_id' => $exercise->id,
            'sets' => 3,
            'reps' => 8,
            'weight' => 80,
        ])->assertForbidden();
    }

    public function test_owner_can_create_and_update_workout_entry(): void
    {
        $user = $this->authenticate();
        $workout = $this->workout($user);
        $exercise = $this->exercise();

        $response = $this->postJson('/api/workout-entries', [
            'workout_id' => $workout->id,
            'exercise_id' => $exercise->id,
            'sets' => 3,
            'reps' => 8,
            'weight' => 80,
            'completed' => false,
        ])->assertCreated();

        $entryId = $response->json('data.id');

        $this->patchJson("/api/workout-entries/{$entryId}", [
            'weight' => 82.5,
            'completed' => true,
        ])
            ->assertOk()
            ->assertJsonPath('data.weight', 82.5)
            ->assertJsonPath('data.completed', true);
    }

    public function test_owner_can_mark_all_workout_entries_complete(): void
    {
        $user = $this->authenticate();
        $workout = $this->workout($user);
        $firstExercise = $this->exercise();
        $secondExercise = $this->exercise();
        $firstEntry = $this->entry($workout, $firstExercise, ['completed' => false]);
        $secondEntry = $this->entry($workout, $secondExercise, ['completed' => false]);

        $this->patchJson("/api/workouts/{$workout->id}/entries/complete")
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.completed', true)
            ->assertJsonPath('data.1.completed', true);

        $this->assertDatabaseHas('workout_entries', [
            'id' => $firstEntry->id,
            'completed' => true,
        ]);
        $this->assertDatabaseHas('workout_entries', [
            'id' => $secondEntry->id,
            'completed' => true,
        ]);
    }

    public function test_user_cannot_complete_another_users_workout_entries(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $workout = $this->workout($other);
        $entry = $this->entry($workout, $this->exercise(), ['completed' => false]);

        $this->patchJson("/api/workouts/{$workout->id}/entries/complete")
            ->assertForbidden();

        $this->assertDatabaseHas('workout_entries', [
            'id' => $entry->id,
            'completed' => false,
        ]);
    }
}
