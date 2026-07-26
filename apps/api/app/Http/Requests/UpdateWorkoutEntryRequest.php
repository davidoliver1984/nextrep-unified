<?php

namespace App\Http\Requests;

use App\Models\WorkoutEntry;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkoutEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $entry = $this->route('workout_entry');

        return $entry instanceof WorkoutEntry
            && $this->user()->can('update', $entry);
    }

    public function rules(): array
    {
        return [
            'exercise_id' => ['sometimes', 'required', 'integer', 'exists:exercises,id'],
            'sets' => ['sometimes', 'required', 'integer', 'min:1', 'max:100'],
            'reps' => ['sometimes', 'required', 'integer', 'min:1', 'max:1000'],
            'weight' => ['sometimes', 'required', 'numeric', 'min:0', 'max:2000'],
            'completed' => ['sometimes', 'boolean'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
