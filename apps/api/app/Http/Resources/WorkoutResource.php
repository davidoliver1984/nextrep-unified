<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'user_id' => (int) $this->user_id,
            'journal_id' => $this->journal_id !== null ? (int) $this->journal_id : null,
            'title' => $this->title,
            'date' => $this->date?->toDateString(),

            'entries' => WorkoutEntryResource::collection(
                $this->whenLoaded('entries', function () {
                    return $this->entries->loadMissing('exercise');
                })
            ),
            'journal_date' => $this->whenLoaded(
                'journal',
                fn () => $this->journal?->date?->toDateString(),
            ),
        ];
    }
}
