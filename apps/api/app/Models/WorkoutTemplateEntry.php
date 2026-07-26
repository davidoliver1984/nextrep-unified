<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutTemplateEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'exercise_id',
        'sets',
        'reps',
        'weight',
        'notes',
    ];

    protected $casts = [
        'workout_template_id' => 'integer',
        'exercise_id' => 'integer',
        'sets' => 'integer',
        'reps' => 'integer',
        'weight' => 'float',
        'notes' => 'string',
    ];

    public function template()
    {
        return $this->belongsTo(WorkoutTemplate::class, 'workout_template_id');
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
