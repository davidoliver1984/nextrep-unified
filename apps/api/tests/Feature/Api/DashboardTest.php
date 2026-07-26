<?php

namespace Tests\Feature\Api;

use App\Models\Exercise;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonImmutable;

class DashboardTest extends ApiTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow('2026-07-20 10:00:00');
        CarbonImmutable::setTestNow('2026-07-20 10:00:00');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_dashboard_requires_authentication(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized();
    }

    public function test_dashboard_returns_todays_workouts_and_user_scoped_reports(): void
    {
        $user = $this->authenticate();
        $otherUser = User::factory()->create();

        $readyLift = $this->exercise(['exercise_name' => 'Bench Press']);
        $fastLift = $this->exercise(['exercise_name' => 'Barbell Row']);
        $recentLift = $this->exercise(['exercise_name' => 'Shoulder Press']);
        $privateLift = $this->exercise(['exercise_name' => 'Private Lift']);

        $todayWorkout = $this->workout($user, attributes: [
            'title' => 'Today workout',
            'date' => '2026-07-20',
        ]);
        $this->entry($todayWorkout, $readyLift, ['weight' => 120]);
        $yesterdayWorkout = $this->workout($user, attributes: [
            'title' => 'Yesterday workout',
            'date' => '2026-07-19',
        ]);
        $this->entry($yesterdayWorkout, $fastLift, ['weight' => 75]);
        $otherTodayWorkout = $this->workout($otherUser, attributes: [
            'title' => 'Private workout',
            'date' => '2026-07-20',
        ]);
        $this->entry($otherTodayWorkout, $privateLift, ['weight' => 500]);

        $this->logLift($user, $readyLift, '2026-03-01', 120);
        $this->logLift($user, $readyLift, '2026-04-01', 100);
        $this->logLift($user, $readyLift, '2026-05-01', 120);
        $this->logLift($user, $readyLift, '2026-07-10', 120);

        $this->logLift($user, $fastLift, '2026-04-25', 40);
        $this->logLift($user, $fastLift, '2026-04-25', 50);
        $this->logLift($user, $fastLift, '2026-07-10', 75);

        $this->logLift($user, $recentLift, '2026-06-20', 50);
        $this->logLift($user, $recentLift, '2026-07-15', 60);

        $this->logLift($otherUser, $privateLift, '2026-04-25', 100);
        $this->logLift($otherUser, $privateLift, '2026-07-15', 500);

        $response = $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('data.date', '2026-07-20')
            ->assertJsonCount(1, 'data.today_workouts')
            ->assertJsonPath('data.today_workouts.0.id', $todayWorkout->id)
            ->assertJsonPath('data.lifts_ready_for_progression.0.exercise_id', $readyLift->id)
            ->assertJsonPath('data.lifts_ready_for_progression.0.current_weight', 120)
            ->assertJsonPath('data.lifts_ready_for_progression.0.personal_best_weight', 120)
            ->assertJsonPath('data.lifts_ready_for_progression.0.last_progressed_at', '2026-05-01')
            ->assertJsonPath('data.fastest_moving_lifts.0.exercise_id', $fastLift->id)
            ->assertJsonPath('data.fastest_moving_lifts.0.increase_percentage', 50);

        $reportExerciseIds = collect([
            ...$response->json('data.lifts_ready_for_progression'),
            ...$response->json('data.fastest_moving_lifts'),
        ])->pluck('exercise_id');

        $this->assertNotContains($privateLift->id, $reportExerciseIds);
        $this->assertNotContains($recentLift->id, collect(
            $response->json('data.lifts_ready_for_progression'),
        )->pluck('exercise_id'));
    }

    public function test_dashboard_returns_empty_collections_without_activity(): void
    {
        $this->authenticate();

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('data.date', '2026-07-20')
            ->assertJsonCount(0, 'data.today_workouts')
            ->assertJsonCount(0, 'data.lifts_ready_for_progression')
            ->assertJsonCount(0, 'data.fastest_moving_lifts');
    }

    private function logLift(User $user, Exercise $exercise, string $date, float $weight): void
    {
        $workout = $this->workout($user, attributes: [
            'title' => "{$exercise->exercise_name} on {$date}",
            'date' => $date,
        ]);

        $this->entry($workout, $exercise, ['weight' => $weight]);
    }
}
