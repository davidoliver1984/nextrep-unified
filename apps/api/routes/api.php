<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\ExerciseController;
use App\Http\Controllers\API\JournalController;
use App\Http\Controllers\API\JournalImageController;
use App\Http\Controllers\API\WorkoutController;
use App\Http\Controllers\API\WorkoutEntryController;
use App\Http\Controllers\API\WorkoutTemplateController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])
    ->middleware('throttle:login')
    ->name('auth.login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'user'])->name('auth.user');
    Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');

    Route::get('dashboard', DashboardController::class)->name('dashboard.show');

    Route::apiResource('exercises', ExerciseController::class)
        ->only(['index', 'show']);

    Route::apiResource('journals', JournalController::class);

    Route::get('gallery-images', [JournalImageController::class, 'gallery'])
        ->name('gallery-images.index');
    Route::get('journals/{journal}/images', [JournalImageController::class, 'index'])
        ->name('journals.images.index');
    Route::post('journals/{journal}/images', [JournalImageController::class, 'store'])
        ->name('journals.images.store');
    Route::get('journal-images/{journalImage}', [JournalImageController::class, 'show'])
        ->name('journal-images.show');
    Route::delete('journal-images/{journalImage}', [JournalImageController::class, 'destroy'])
        ->name('journal-images.destroy');

    Route::apiResource('workouts', WorkoutController::class);
    Route::get('workouts/{workout}/entries', [WorkoutEntryController::class, 'byWorkout'])
        ->name('workouts.entries.index');
    Route::patch('workouts/{workout}/entries/complete', [WorkoutEntryController::class, 'completeAll'])
        ->name('workouts.entries.complete');

    Route::post('workout-entries', [WorkoutEntryController::class, 'store'])
        ->name('workout-entries.store');
    Route::get('workout-entries/{workout_entry}', [WorkoutEntryController::class, 'show'])
        ->name('workout-entries.show');
    Route::match(['put', 'patch'], 'workout-entries/{workout_entry}', [WorkoutEntryController::class, 'update'])
        ->name('workout-entries.update');
    Route::delete('workout-entries/{workout_entry}', [WorkoutEntryController::class, 'destroy'])
        ->name('workout-entries.destroy');

    Route::get('templates', [WorkoutTemplateController::class, 'index'])
        ->name('templates.index');
    Route::post('templates', [WorkoutTemplateController::class, 'store'])
        ->name('templates.store');
    Route::post('templates/{template}/apply', [WorkoutTemplateController::class, 'apply'])
        ->name('templates.apply');
    Route::delete('templates/{template}', [WorkoutTemplateController::class, 'destroy'])
        ->name('templates.destroy');
    Route::post('workouts/{workout}/save-as-template', [WorkoutTemplateController::class, 'saveFromWorkout'])
        ->name('workouts.save-as-template');
});
