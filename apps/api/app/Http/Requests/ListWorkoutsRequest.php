<?php

namespace App\Http\Requests;

use App\Models\Journal;
use Illuminate\Foundation\Http\FormRequest;

class ListWorkoutsRequest extends FormRequest
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
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'journal_id' => ['sometimes', 'integer', 'exists:journals,id'],
        ];
    }
}
