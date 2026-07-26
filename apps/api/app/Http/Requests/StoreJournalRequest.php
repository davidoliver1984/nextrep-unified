<?php

namespace App\Http\Requests;

use App\Models\Journal;
use Illuminate\Foundation\Http\FormRequest;

class StoreJournalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Journal::class);
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'weight' => ['nullable', 'numeric', 'min:0', 'max:2000'],
            'steps' => ['nullable', 'integer', 'min:0'],
            'calories' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
