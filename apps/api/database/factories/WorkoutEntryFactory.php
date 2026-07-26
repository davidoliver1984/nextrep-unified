<?php

namespace Database\Factories;

use App\Models\Exercise;
use App\Models\Workout;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkoutEntryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'workout_id' => Workout::factory(),
            'exercise_id' => Exercise::factory(),
            'sets' => fake()->numberBetween(1, 5),
            'reps' => fake()->numberBetween(1, 20),
            'weight' => fake()->randomFloat(1, 0, 250),
            'notes' => fake()->optional()->sentence(),
            'completed' => false,
        ];
    }
}
