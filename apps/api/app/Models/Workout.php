<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{
    use HasFactory;

    protected $fillable = [
        'journal_id',
        'title',
        'date',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'journal_id' => 'integer',
        'title' => 'string',
        'date' => 'date',
    ];

    public function entries()
    {
        return $this->hasMany(WorkoutEntry::class);
    }

    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
}
