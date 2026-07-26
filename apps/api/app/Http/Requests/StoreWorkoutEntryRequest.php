<?php

namespace App\Http\Requests;

use App\Models\Workout;
use Illuminate\Foundation\Http\FormRequest;

class StoreWorkoutEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $workout = Workout::find($this->integer('workout_id'));

        return $workout !== null && $this->user()->can('update', $workout);
    }

    public function rules(): array
    {
        return [
            'workout_id' => ['required', 'integer', 'exists:workouts,id'],
            'exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            'sets' => ['required', 'integer', 'min:1', 'max:100'],
            'reps' => ['required', 'integer', 'min:1', 'max:1000'],
            'weight' => ['required', 'numeric', 'min:0', 'max:2000'],
            'completed' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
