<?php

namespace App\Http\Requests;

use App\Models\Journal;
use Illuminate\Foundation\Http\FormRequest;

class StoreWorkoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        $journalId = $this->integer('journal_id');

        if ($journalId === 0) {
            return true;
        }

        return Journal::query()
            ->whereKey($journalId)
            ->where('user_id', $this->user()->id)
            ->exists();
    }

    public function rules(): array
    {
        return [
            'journal_id' => ['nullable', 'integer', 'exists:journals,id'],
            'title' => ['required', 'string', 'min:5', 'max:255'],
            'date' => ['nullable', 'date'],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            'entries.*.sets' => ['required', 'integer', 'min:1', 'max:100'],
            'entries.*.reps' => ['required', 'integer', 'min:1', 'max:1000'],
            'entries.*.weight' => ['required', 'numeric', 'min:0', 'max:2000'],
            'entries.*.notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
