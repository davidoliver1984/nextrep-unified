<?php

namespace App\Http\Requests;

use App\Models\Journal;
use App\Models\WorkoutTemplate;
use Illuminate\Foundation\Http\FormRequest;

class ApplyWorkoutTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $template = $this->route('template');
        $journal = Journal::find($this->integer('journal_id'));

        return $template instanceof WorkoutTemplate
            && $journal !== null
            && $this->user()->can('view', $template)
            && $this->user()->can('update', $journal);
    }

    public function rules(): array
    {
        return [
            'journal_id' => ['required', 'integer', 'exists:journals,id'],
            'title' => ['nullable', 'string', 'min:3', 'max:255'],
        ];
    }
}
