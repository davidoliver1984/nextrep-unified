<?php

namespace App\Http\Requests;

use App\Models\Workout;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        $workout = $this->route('workout');

        return $workout instanceof Workout
            && $this->user()->can('update', $workout);
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'min:5', 'max:255'],
            'date' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
