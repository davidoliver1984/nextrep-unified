<?php

namespace Database\Factories;

use App\Models\Exercise;
use App\Models\WorkoutTemplate;
use App\Models\WorkoutTemplateEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkoutTemplateEntry>
 */
class WorkoutTemplateEntryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'workout_template_id' => WorkoutTemplate::factory(),
            'exercise_id' => Exercise::factory(),
            'sets' => fake()->numberBetween(1, 5),
            'reps' => fake()->numberBetween(1, 20),
            'weight' => fake()->randomFloat(1, 0, 250),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
