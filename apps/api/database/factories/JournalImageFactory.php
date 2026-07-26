<?php

namespace Database\Factories;

use App\Models\Journal;
use App\Models\JournalImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JournalImage>
 */
class JournalImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'journal_id' => Journal::factory(),
            'path' => 'journals/'.fake()->uuid().'.jpg',
        ];
    }
}
