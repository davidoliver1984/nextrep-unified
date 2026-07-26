<?php

namespace App\Reports\Dashboard;

use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class CalculateProgressionCandidates
{
    public function handle(
        Collection $liftHistory,
        CarbonImmutable $today,
        int $rotationDays,
        int $staleDays,
        int $limit,
    ): Collection {
        $rotationStart = $today->subDays($rotationDays);
        $staleBefore = $today->subDays($staleDays);

        return $liftHistory
            ->map(function (array $lift) use ($rotationStart, $staleBefore, $today) {
                /** @var Collection<string, array{top_weight: float, top_weight_sets: int, top_weight_reps: int}> $dailyPerformances */
                $dailyPerformances = $lift['daily_performances'];

                if ($dailyPerformances->count() < 2) {
                    return null;
                }

                $lastPerformedAt = CarbonImmutable::parse($dailyPerformances->keys()->last());

                if ($lastPerformedAt->isBefore($rotationStart)) {
                    return null;
                }

                $personalBest = (float) $dailyPerformances->max('top_weight');
                $currentPerformance = $dailyPerformances->last();

                if ((float) $currentPerformance['top_weight'] < $personalBest) {
                    return null;
                }

                $lastProgressedAt = null;
                $lastPersonalBestAt = null;
                $bestRepsAtPersonalBest = 0;
                $performancesBelowPersonalBest = 0;

                foreach ($dailyPerformances as $date => $performance) {
                    $performedAt = CarbonImmutable::parse($date);
                    $topWeight = (float) $performance['top_weight'];

                    if ($topWeight < $personalBest) {
                        if ($lastPersonalBestAt !== null) {
                            $performancesBelowPersonalBest++;
                        }

                        continue;
                    }

                    $topWeightReps = (int) $performance['top_weight_reps'];
                    $isFirstPersonalBest = $lastPersonalBestAt === null;
                    $isRepProgression = $topWeightReps > $bestRepsAtPersonalBest;
                    $isSustainedReturn = $lastPersonalBestAt !== null
                        && $performancesBelowPersonalBest > 0
                        && (
                            $performancesBelowPersonalBest >= 2
                            || $lastPersonalBestAt->diffInDays($performedAt) >= 14
                        );

                    if ($isFirstPersonalBest || $isRepProgression || $isSustainedReturn) {
                        $lastProgressedAt = $performedAt;
                    }

                    $bestRepsAtPersonalBest = max($bestRepsAtPersonalBest, $topWeightReps);
                    $lastPersonalBestAt = $performedAt;
                    $performancesBelowPersonalBest = 0;
                }

                $currentWeight = (float) $currentPerformance['top_weight'];

                if (
                    $lastProgressedAt === null
                    || $lastProgressedAt->isAfter($staleBefore)
                ) {
                    return null;
                }

                return [
                    'exercise_id' => $lift['exercise_id'],
                    'exercise_name' => $lift['exercise_name'],
                    'current_weight' => $currentWeight,
                    'personal_best_weight' => $personalBest,
                    'last_progressed_at' => $lastProgressedAt->toDateString(),
                    'last_performed_at' => $lastPerformedAt->toDateString(),
                    'days_since_progression' => (int) $lastProgressedAt->diffInDays($today),
                    'performance_count' => $dailyPerformances->count(),
                ];
            })
            ->filter()
            ->sortBy([
                ['days_since_progression', 'desc'],
                ['exercise_name', 'asc'],
            ])
            ->take($limit)
            ->values();
    }
}
