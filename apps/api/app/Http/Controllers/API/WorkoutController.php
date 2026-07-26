<?php

namespace App\Http\Controllers\API;

use App\Actions\Workouts\CreateWorkout;
use App\Actions\Workouts\DeleteWorkout;
use App\Actions\Workouts\UpdateWorkout;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListWorkoutsRequest;
use App\Http\Requests\StoreWorkoutRequest;
use App\Http\Requests\UpdateWorkoutRequest;
use App\Http\Resources\WorkoutResource;
use App\Models\Workout;
use App\Queries\Workouts\ListWorkoutsForUser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class WorkoutController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Workout::class, 'workout');
    }

    public function index(ListWorkoutsRequest $request, ListWorkoutsForUser $query)
    {
        $workouts = $query->handle(
            $request->user(),
            $request->integer('journal_id') ?: null,
            $request->integer('per_page', 10),
        );

        return WorkoutResource::collection($workouts);
    }

    public function store(StoreWorkoutRequest $request, CreateWorkout $action)
    {
        $workout = $action->handle($request->user(), $request->validated());

        return (new WorkoutResource($workout))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Workout $workout)
    {
        return new WorkoutResource(
            $workout->load(['journal:id,date', 'entries.exercise'])
        );
    }

    public function update(UpdateWorkoutRequest $request, Workout $workout, UpdateWorkout $action)
    {
        return new WorkoutResource(
            $action->handle($workout, $request->validated())
        );
    }

    public function destroy(Workout $workout, DeleteWorkout $action)
    {
        $action->handle($workout);

        return response()->noContent();
    }
}
