<?php

namespace App\Reports\Dashboard;

use App\Models\User;
use App\Queries\Dashboard\ListTodaysWorkouts;
use App\Queries\Dashboard\LoadLiftHistory;
use App\Queries\Dashboard\LoadProgressionHistory;
use Carbon\CarbonImmutable;

class BuildDashboard
{
    public function __construct(
        private ListTodaysWorkouts $listTodaysWorkouts,
        private LoadLiftHistory $loadLiftHistory,
        private LoadProgressionHistory $loadProgressionHistory,
        private BuildDailyLiftHistory $buildDailyLiftHistory,
        private CalculateProgressionCandidates $calculateProgressionCandidates,
        private CalculateFastestMovingLifts $calculateFastestMovingLifts,
    ) {}

    public function handle(User $user, ?CarbonImmutable $today = null): array
    {
        $today ??= CarbonImmutable::today();
        $rotationDays = (int) config('dashboard.current_rotation_days');
        $staleDays = (int) config('dashboard.progression_stale_days');
        $fastestMovingDays = (int) config('dashboard.fastest_moving_days');
        $limit = (int) config('dashboard.result_limit');
        $progressionEntries = $this->loadProgressionHistory->handle(
            $user,
            $today->subDays($rotationDays),
            $today,
        );
        $fastestMovingEntries = $this->loadLiftHistory->handle(
            $user,
            $today->subDays($fastestMovingDays),
            $today,
        );
        $progressionHistory = $this->buildDailyLiftHistory->handle($progressionEntries);
        $fastestMovingHistory = $this->buildDailyLiftHistory->handle($fastestMovingEntries);

        return [
            'date' => $today->toDateString(),
            'today_workouts' => $this->listTodaysWorkouts->handle($user, $today),
            'lifts_ready_for_progression' => $this->calculateProgressionCandidates->handle(
                $progressionHistory,
                $today,
                $rotationDays,
                $staleDays,
                $limit,
            ),
            'fastest_moving_lifts' => $this->calculateFastestMovingLifts->handle(
                $fastestMovingHistory,
                $today,
                $fastestMovingDays,
                $rotationDays,
                $limit,
            ),
        ];
    }
}
