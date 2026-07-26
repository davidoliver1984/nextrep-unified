<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutEntry extends Model
{
    use HasFactory;

    protected $fillable = ['exercise_id', 'sets', 'reps', 'weight', 'notes', 'completed'];

    protected $casts = [
        'workout_id' => 'integer',
        'exercise_id' => 'integer',
        'sets' => 'integer',
        'reps' => 'integer',
        'weight' => 'float',
        'notes' => 'string',
        'completed' => 'boolean',
    ];

    public function exercise()
    {
        return $this->belongsTo(Exercise::class, 'exercise_id');
    }

    public function workout()
    {
        return $this->belongsTo(Workout::class);
    }
}
