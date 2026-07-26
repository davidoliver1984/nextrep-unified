<?php

namespace App\Models;

use Database\Factories\JournalImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalImage extends Model
{
    /** @use HasFactory<JournalImageFactory> */
    use HasFactory;

    protected $fillable = [
        'path',
    ];

    protected $casts = [
        'journal_id' => 'integer',
        'path' => 'string',
    ];

    public function journal()
    {
        return $this->belongsTo(Journal::class, 'journal_id');
    }
}
