<?php

namespace App\Reports\Dashboard;

use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class CalculateFastestMovingLifts
{
    public function handle(
        Collection $liftHistory,
        CarbonImmutable $today,
        int $windowDays,
        int $rotationDays,
        int $limit,
    ): Collection {
        $windowStart = $today->subDays($windowDays);
        $rotationStart = $today->subDays($rotationDays);

        return $liftHistory
            ->map(function (array $lift) use ($windowStart, $rotationStart) {
                /** @var Collection<string, float> $dailyWeights */
                $dailyWeights = $lift['daily_weights']
                    ->filter(fn (float $weight, string $date) => ! CarbonImmutable::parse($date)->isBefore($windowStart));

                if ($dailyWeights->count() < 2) {
                    return null;
                }

                $firstDate = CarbonImmutable::parse($dailyWeights->keys()->first());
                $lastDate = CarbonImmutable::parse($dailyWeights->keys()->last());
                $startingWeight = (float) $dailyWeights->first();
                $currentWeight = (float) $dailyWeights->last();

                if (
                    $lastDate->isBefore($rotationStart)
                    || $startingWeight <= 0
                    || $currentWeight <= $startingWeight
                ) {
                    return null;
                }

                return [
                    'exercise_id' => $lift['exercise_id'],
                    'exercise_name' => $lift['exercise_name'],
                    'starting_weight' => $startingWeight,
                    'current_weight' => $currentWeight,
                    'increase_percentage' => round(
                        (($currentWeight - $startingWeight) / $startingWeight) * 100,
                        1,
                    ),
                    'started_at' => $firstDate->toDateString(),
                    'last_performed_at' => $lastDate->toDateString(),
                    'performance_count' => $dailyWeights->count(),
                ];
            })
            ->filter()
            ->sortBy([
                ['increase_percentage', 'desc'],
                ['exercise_name', 'asc'],
            ])
            ->take($limit)
            ->values();
    }
}
