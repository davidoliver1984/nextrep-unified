<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutEntryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (int) $this->id,
            'workout_id' => (int) $this->workout_id,
            'exercise_id' => (int) $this->exercise_id,
            'exercise_name' => $this->whenLoaded(
                'exercise',
                fn () => $this->exercise?->exercise_name,
                'Unknown'
            ),
            'sets' => (int) $this->sets,
            'reps' => (int) $this->reps,
            'weight' => (float) $this->weight,
            'completed' => (bool) $this->completed,
        ];
    }
}
