<?php

namespace App\Http\Controllers\API;

use App\Actions\WorkoutTemplates\ApplyWorkoutTemplate;
use App\Actions\WorkoutTemplates\CreateWorkoutTemplate;
use App\Actions\WorkoutTemplates\DeleteWorkoutTemplate;
use App\Actions\WorkoutTemplates\SaveWorkoutAsTemplate;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApplyWorkoutTemplateRequest;
use App\Http\Requests\SaveWorkoutAsTemplateRequest;
use App\Http\Requests\StoreWorkoutTemplateRequest;
use App\Http\Resources\WorkoutResource;
use App\Http\Resources\WorkoutTemplateResource;
use App\Models\Journal;
use App\Models\Workout;
use App\Models\WorkoutTemplate;
use App\Queries\WorkoutTemplates\ListWorkoutTemplatesForUser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class WorkoutTemplateController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request, ListWorkoutTemplatesForUser $query)
    {
        $this->authorize('viewAny', WorkoutTemplate::class);

        return WorkoutTemplateResource::collection($query->handle($request->user()));
    }

    public function store(StoreWorkoutTemplateRequest $request, CreateWorkoutTemplate $action)
    {
        $template = $action->handle($request->user(), $request->validated());

        return (new WorkoutTemplateResource($template))
            ->response()
            ->setStatusCode(201);
    }

    public function apply(
        ApplyWorkoutTemplateRequest $request,
        WorkoutTemplate $template,
        ApplyWorkoutTemplate $action,
    ) {
        $journal = Journal::findOrFail($request->integer('journal_id'));
        $workout = $action->handle(
            $request->user(),
            $template,
            $journal,
            $request->validated('title'),
        );

        return (new WorkoutResource($workout))
            ->response()
            ->setStatusCode(201);
    }

    public function saveFromWorkout(
        SaveWorkoutAsTemplateRequest $request,
        Workout $workout,
        SaveWorkoutAsTemplate $action,
    ) {
        $template = $action->handle($request->user(), $workout, $request->validated());

        return (new WorkoutTemplateResource($template))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(
        WorkoutTemplate $template,
        DeleteWorkoutTemplate $action,
    ) {
        $this->authorize('delete', $template);
        $action->handle($template);

        return response()->noContent();
    }
}
