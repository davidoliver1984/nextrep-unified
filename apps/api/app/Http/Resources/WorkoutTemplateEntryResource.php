<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutTemplateEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'exercise_id' => (int) $this->exercise_id,
            'exercise_name' => $this->whenLoaded(
                'exercise',
                fn () => $this->exercise?->exercise_name,
            ),
            'sets' => (int) $this->sets,
            'reps' => (int) $this->reps,
            'weight' => (float) $this->weight,
            'notes' => $this->notes,
        ];
    }
}
