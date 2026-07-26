<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'exercise_name',
        'muscle_group',
        'equipment_type',
    ];

    protected $casts = [
        'id' => 'integer',
        'exercise_name' => 'string',
        'muscle_group' => 'string',
        'equipment_type' => 'string',

    ];
}
