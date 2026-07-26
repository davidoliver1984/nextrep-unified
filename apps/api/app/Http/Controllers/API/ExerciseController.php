<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExerciseResource;
use App\Models\Exercise;

class ExerciseController extends Controller
{
    public function index()
    {
        return ExerciseResource::collection(Exercise::all());
    }

    public function show(Exercise $exercise)
    {
        return new ExerciseResource($exercise);
    }
}
