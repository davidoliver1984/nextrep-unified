<?php

namespace App\Http\Requests;

use App\Models\Journal;
use Illuminate\Foundation\Http\FormRequest;

class UpdateJournalRequest extends FormRequest
{
    public function authorize(): bool
    {
        $journal = $this->route('journal');

        return $journal instanceof Journal
            && $this->user()->can('update', $journal);
    }

    public function rules(): array
    {
        $journal = $this->route('journal');

        return [
            'date' => [
                'sometimes',
                'required',
                'date',
                function (string $attribute, mixed $value, \Closure $fail) use ($journal) {
                    $dateExists = Journal::query()
                        ->where('user_id', $this->user()->id)
                        ->whereDate('date', $value)
                        ->when($journal, fn ($query) => $query->whereKeyNot($journal->id))
                        ->exists();

                    if ($dateExists) {
                        $fail('A journal already exists for this date.');
                    }
                },
            ],
            'weight' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:2000'],
            'steps' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'calories' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
