<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'date' => $this->resource['date'],
            'today_workouts' => WorkoutResource::collection($this->resource['today_workouts']),
            'lifts_ready_for_progression' => $this->resource['lifts_ready_for_progression'],
            'fastest_moving_lifts' => $this->resource['fastest_moving_lifts'],
        ];
    }
}
