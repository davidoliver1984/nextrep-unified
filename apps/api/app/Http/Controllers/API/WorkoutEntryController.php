<?php

namespace App\Http\Controllers\API;

use App\Actions\WorkoutEntries\CompleteWorkoutEntries;
use App\Actions\WorkoutEntries\CreateWorkoutEntry;
use App\Actions\WorkoutEntries\DeleteWorkoutEntry;
use App\Actions\WorkoutEntries\UpdateWorkoutEntry;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkoutEntryRequest;
use App\Http\Requests\UpdateWorkoutEntryRequest;
use App\Http\Resources\WorkoutEntryResource;
use App\Models\Workout;
use App\Models\WorkoutEntry;
use App\Queries\WorkoutEntries\ListWorkoutEntries;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class WorkoutEntryController extends Controller
{
    use AuthorizesRequests;

    public function store(StoreWorkoutEntryRequest $request, CreateWorkoutEntry $action)
    {
        $workout = Workout::findOrFail($request->integer('workout_id'));
        $entry = $action->handle($workout, $request->validated());

        return (new WorkoutEntryResource($entry))
            ->response()
            ->setStatusCode(201);
    }

    public function show(WorkoutEntry $workoutEntry)
    {
        $this->authorize('view', $workoutEntry);

        return new WorkoutEntryResource($workoutEntry->load('exercise'));
    }

    public function update(
        UpdateWorkoutEntryRequest $request,
        WorkoutEntry $workoutEntry,
        UpdateWorkoutEntry $action,
    ) {
        return new WorkoutEntryResource(
            $action->handle($workoutEntry, $request->validated())
        );
    }

    public function destroy(WorkoutEntry $workoutEntry, DeleteWorkoutEntry $action)
    {
        $this->authorize('delete', $workoutEntry);
        $action->handle($workoutEntry);

        return response()->noContent();
    }

    public function byWorkout(Workout $workout, ListWorkoutEntries $query)
    {
        $this->authorize('view', $workout);

        return WorkoutEntryResource::collection($query->handle($workout));
    }

    public function completeAll(Workout $workout, CompleteWorkoutEntries $action)
    {
        $this->authorize('update', $workout);

        return WorkoutEntryResource::collection($action->handle($workout));
    }
}
