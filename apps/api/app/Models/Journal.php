<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'weight',
        'steps',
        'calories',
        'notes',
    ];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workouts()
    {
        return $this->hasMany(Workout::class);
    }

    public function images()
    {
        return $this->hasMany(JournalImage::class, 'journal_id');
    }
}
