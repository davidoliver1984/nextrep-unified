<?php

namespace App\Http\Requests;

use App\Models\Workout;
use Illuminate\Foundation\Http\FormRequest;

class SaveWorkoutAsTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $workout = $this->route('workout');

        return $workout instanceof Workout
            && $this->user()->can('view', $workout);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
