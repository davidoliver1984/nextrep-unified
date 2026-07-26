<?php

namespace App\Reports\Dashboard;

use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class BuildDailyLiftHistory
{
    public function handle(Collection $entries): Collection
    {
        return $entries
            ->groupBy('exercise_id')
            ->map(function (Collection $exerciseEntries) {
                $firstEntry = $exerciseEntries->first();

                $dailyPerformances = $exerciseEntries
                    ->groupBy(fn ($entry) => CarbonImmutable::parse($entry->workout_date)->toDateString())
                    ->map(function (Collection $dailyEntries) {
                        $topWeight = (float) $dailyEntries->max('weight');
                        $topWeightEntries = $dailyEntries->filter(
                            fn ($entry) => (float) $entry->weight === $topWeight,
                        );

                        return [
                            'top_weight' => $topWeight,
                            'top_weight_sets' => $topWeightEntries->sum('sets'),
                            'top_weight_reps' => $topWeightEntries->sum(
                                fn ($entry) => (int) $entry->sets * (int) $entry->reps,
                            ),
                        ];
                    })
                    ->sortKeys();

                return [
                    'exercise_id' => (int) $firstEntry->exercise_id,
                    'exercise_name' => $firstEntry->exercise?->exercise_name ?? 'Unknown exercise',
                    'daily_performances' => $dailyPerformances,
                    'daily_weights' => $dailyPerformances->map(
                        fn (array $performance) => $performance['top_weight'],
                    ),
                ];
            })
            ->values();
    }
}
