<?php

namespace App\Http\Requests;

use App\Models\WorkoutTemplate;
use Illuminate\Foundation\Http\FormRequest;

class StoreWorkoutTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', WorkoutTemplate::class);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'payload' => ['nullable', 'array'],
            'payload.entries' => ['sometimes', 'array'],
            'payload.entries.*.exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            'payload.entries.*.sets' => ['required', 'integer', 'min:1', 'max:100'],
            'payload.entries.*.reps' => ['required', 'integer', 'min:1', 'max:1000'],
            'payload.entries.*.weight' => ['required', 'numeric', 'min:0', 'max:2000'],
            'payload.entries.*.notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
