<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExerciseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'exercise_name' => fake()->unique()->words(3, true),
            'body_region' => 'Upper',
            'muscle_group' => fake()->randomElement(['Back', 'Chest', 'Shoulders', 'Arms']),
            'equipment_type' => fake()->randomElement(['Barbell', 'Dumbbell', 'Cable', 'Bodyweight']),
            'movement_type' => fake()->randomElement(['Push', 'Pull']),
            'exercise_type' => fake()->randomElement(['Compound', 'Isolation']),
            'exercise_level' => 'Intermediate',
            'exercise_desc' => fake()->sentence(),
        ];
    }
}
