<?php

namespace Tests\Unit\Reports;

use App\Reports\Dashboard\CalculateFastestMovingLifts;
use App\Reports\Dashboard\CalculateProgressionCandidates;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;

class DashboardReportRulesTest extends TestCase
{
    public function test_progression_candidates_must_be_active_stale_and_have_repeat_history(): void
    {
        $today = CarbonImmutable::parse('2026-07-20');
        $history = collect([
            $this->lift(1, 'Ready lift', [
                '2026-05-01' => 100,
                '2026-05-10' => 110,
                '2026-07-15' => 110,
            ]),
            $this->lift(2, 'Recently progressed', [
                '2026-06-20' => 100,
                '2026-07-10' => 120,
            ]),
            $this->lift(3, 'No longer active', [
                '2026-04-01' => 50,
                '2026-05-01' => 50,
            ]),
            $this->lift(4, 'Only one performance', [
                '2026-07-01' => 80,
            ]),
            $this->lift(5, 'Still below previous best', [
                '2026-05-01' => 100,
                '2026-07-15' => 90,
            ]),
        ]);

        $result = (new CalculateProgressionCandidates)->handle(
            $history,
            $today,
            rotationDays: 42,
            staleDays: 60,
            limit: 5,
        );

        $this->assertCount(1, $result);
        $this->assertSame('Ready lift', $result->first()['exercise_name']);
        $this->assertSame('2026-05-10', $result->first()['last_progressed_at']);
        $this->assertSame(71, $result->first()['days_since_progression']);
    }

    public function test_progression_uses_the_latest_load_increase_after_a_reduction(): void
    {
        $history = collect([
            $this->lift(1, 'Rebuilt lift', [
                '2026-03-03' => 75,
                '2026-04-18' => 70,
                '2026-05-30' => 75,
                '2026-07-18' => 75,
            ]),
        ]);

        $report = new CalculateProgressionCandidates;

        $notYetReady = $report->handle(
            $history,
            CarbonImmutable::parse('2026-07-21'),
            rotationDays: 42,
            staleDays: 60,
            limit: 5,
        );

        $this->assertCount(0, $notYetReady);

        $ready = $report->handle(
            $history,
            CarbonImmutable::parse('2026-08-01'),
            rotationDays: 42,
            staleDays: 60,
            limit: 5,
        );

        $this->assertCount(1, $ready);
        $this->assertSame('2026-05-30', $ready->first()['last_progressed_at']);
        $this->assertSame(63, $ready->first()['days_since_progression']);
        $this->assertSame(75.0, $ready->first()['personal_best_weight']);
    }

    public function test_progression_includes_reps_and_sets_at_the_top_working_weight(): void
    {
        $history = collect([
            $this->lift(1, 'Rep-progressing lift', [
                '2026-05-12' => ['weight' => 63, 'sets' => 1, 'reps' => 6],
                '2026-05-19' => ['weight' => 63, 'sets' => 1, 'reps' => 6],
                '2026-06-16' => ['weight' => 63, 'sets' => 1, 'reps' => 12],
                '2026-07-16' => ['weight' => 63, 'sets' => 1, 'reps' => 10],
            ]),
            $this->lift(2, 'Set-progressing lift', [
                '2026-06-20' => ['weight' => 40, 'sets' => 2, 'reps' => 10],
                '2026-07-10' => ['weight' => 40, 'sets' => 3, 'reps' => 10],
                '2026-07-18' => ['weight' => 40, 'sets' => 3, 'reps' => 10],
            ]),
        ]);

        $result = (new CalculateProgressionCandidates)->handle(
            $history,
            CarbonImmutable::parse('2026-07-21'),
            rotationDays: 42,
            staleDays: 21,
            limit: 5,
        );

        $this->assertCount(1, $result);
        $this->assertSame('Rep-progressing lift', $result->first()['exercise_name']);
        $this->assertSame('2026-06-16', $result->first()['last_progressed_at']);
        $this->assertSame(35, $result->first()['days_since_progression']);
    }

    public function test_progression_candidates_are_most_overdue_first_and_limited(): void
    {
        $today = CarbonImmutable::parse('2026-07-20');
        $history = collect(range(1, 7))->map(function (int $number) {
            $progressDate = CarbonImmutable::parse('2026-05-01')->addDays($number);

            return $this->lift($number, "Lift {$number}", [
                $progressDate->toDateString() => 100,
                '2026-07-19' => 100,
            ]);
        });

        $result = (new CalculateProgressionCandidates)->handle(
            $history,
            $today,
            rotationDays: 42,
            staleDays: 60,
            limit: 5,
        );

        $this->assertCount(5, $result);
        $this->assertSame([1, 2, 3, 4, 5], $result->pluck('exercise_id')->all());
    }

    public function test_fastest_moving_lifts_use_first_and_latest_weights_in_window(): void
    {
        $today = CarbonImmutable::parse('2026-07-20');
        $history = collect([
            $this->lift(1, 'Fast lift', [
                '2026-04-25' => 50,
                '2026-07-20' => 75,
            ]),
            $this->lift(2, 'Slow lift', [
                '2026-04-25' => 100,
                '2026-07-20' => 110,
            ]),
            $this->lift(3, 'Declining lift', [
                '2026-04-25' => 100,
                '2026-07-20' => 90,
            ]),
            $this->lift(4, 'Old lift', [
                '2026-03-01' => 10,
                '2026-03-10' => 20,
            ]),
        ]);

        $result = (new CalculateFastestMovingLifts)->handle(
            $history,
            $today,
            windowDays: 90,
            rotationDays: 42,
            limit: 5,
        );

        $this->assertSame(['Fast lift', 'Slow lift'], $result->pluck('exercise_name')->all());
        $this->assertSame(50.0, $result->first()['increase_percentage']);
        $this->assertSame(10.0, $result->last()['increase_percentage']);
    }

    private function lift(int $id, string $name, array $dailyWeights): array
    {
        $dailyPerformances = collect($dailyWeights)->map(function ($performance) {
            if (is_array($performance)) {
                $sets = $performance['sets'];
                $reps = $performance['reps'];

                return [
                    'top_weight' => (float) $performance['weight'],
                    'top_weight_sets' => $sets,
                    'top_weight_reps' => $sets * $reps,
                ];
            }

            return [
                'top_weight' => (float) $performance,
                'top_weight_sets' => 1,
                'top_weight_reps' => 1,
            ];
        });

        return [
            'exercise_id' => $id,
            'exercise_name' => $name,
            'daily_performances' => $dailyPerformances,
            'daily_weights' => $dailyPerformances->map(
                fn (array $performance) => $performance['top_weight'],
            ),
        ];
    }
}
