<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreJournalImageByDateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date_format:Y-m-d'],
            'image' => ['nullable', 'required_without:image_base64', 'image', 'max:5120'],
            'image_base64' => ['nullable', 'required_without:image', 'string', 'max:7340032'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if (! $this->filled('image_base64')) {
                    return;
                }

                $contents = $this->decodedImage();

                if ($contents === null || @getimagesizefromstring($contents) === false) {
                    $validator->errors()->add('image_base64', 'The encoded image must be a valid image.');

                    return;
                }

                if (strlen($contents) > 5 * 1024 * 1024) {
                    $validator->errors()->add('image_base64', 'The encoded image must not be greater than 5 MB.');
                }
            },
        ];
    }

    public function decodedImage(): ?string
    {
        $encoded = preg_replace('/^data:image\/[a-zA-Z0-9.+-]+;base64,/', '', $this->string('image_base64')->toString());
        $encoded = preg_replace('/\s+/', '', $encoded ?? '');
        $contents = base64_decode($encoded, true);

        return $contents === false ? null : $contents;
    }
}
