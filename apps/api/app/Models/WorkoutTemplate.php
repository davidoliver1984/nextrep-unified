<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutTemplate extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'payload'];

    protected $casts = ['user_id' => 'integer', 'payload' => 'array'];

    protected $attributes = ['payload' => null];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function entries()
    {
        return $this->hasMany(WorkoutTemplateEntry::class, 'workout_template_id');
    }
}
