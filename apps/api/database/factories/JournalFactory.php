<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class JournalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'date' => fake()->unique()->date(),
            'weight' => fake()->optional()->randomFloat(2, 40, 250),
            'steps' => fake()->optional()->numberBetween(0, 30000),
            'calories' => fake()->optional()->numberBetween(0, 6000),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
