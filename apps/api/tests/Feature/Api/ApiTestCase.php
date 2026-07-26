<?php

namespace Tests\Feature\Api;

use App\Models\Exercise;
use App\Models\Journal;
use App\Models\User;
use App\Models\Workout;
use App\Models\WorkoutEntry;
use App\Models\WorkoutTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;

    protected function authenticate(?User $user = null): User
    {
        $user ??= User::factory()->create();
        Sanctum::actingAs($user);

        return $user;
    }

    protected function journal(User $user, array $attributes = []): Journal
    {
        return Journal::forceCreate([
            'user_id' => $user->id,
            'title' => 'Legacy journal title',
            'date' => '2026-07-20',
            ...$attributes,
        ]);
    }

    protected function exercise(array $attributes = []): Exercise
    {
        return Exercise::forceCreate([
            'exercise_name' => 'Bench Press',
            'body_region' => 'Upper',
            'muscle_group' => 'Chest',
            'equipment_type' => 'Barbell',
            'movement_type' => 'Push',
            'exercise_type' => 'Compound',
            'exercise_level' => 'Intermediate',
            'exercise_desc' => 'Barbell bench press',
            ...$attributes,
        ]);
    }

    protected function workout(User $user, ?Journal $journal = null, array $attributes = []): Workout
    {
        return Workout::forceCreate([
            'user_id' => $user->id,
            'journal_id' => $journal?->id,
            'title' => 'Heavy workout',
            'date' => '2026-07-20',
            ...$attributes,
        ]);
    }

    protected function entry(Workout $workout, Exercise $exercise, array $attributes = []): WorkoutEntry
    {
        return WorkoutEntry::forceCreate([
            'workout_id' => $workout->id,
            'exercise_id' => $exercise->id,
            'sets' => 3,
            'reps' => 8,
            'weight' => 80,
            'completed' => false,
            ...$attributes,
        ]);
    }

    protected function template(User $user, array $attributes = []): WorkoutTemplate
    {
        return WorkoutTemplate::forceCreate([
            'user_id' => $user->id,
            'title' => 'Push template',
            'description' => null,
            'payload' => null,
            ...$attributes,
        ]);
    }
}
