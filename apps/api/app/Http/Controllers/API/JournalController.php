<?php

namespace App\Http\Controllers\API;

use App\Actions\Journals\DeleteJournal;
use App\Actions\Journals\UpdateJournal;
use App\Actions\Journals\UpsertJournalForDate;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListJournalsRequest;
use App\Http\Requests\StoreJournalRequest;
use App\Http\Requests\UpdateJournalRequest;
use App\Http\Resources\JournalResource;
use App\Models\Journal;
use App\Queries\Journals\ListJournalsForUser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class JournalController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Journal::class, 'journal');
    }

    public function index(ListJournalsRequest $request, ListJournalsForUser $query)
    {
        $journals = $query->handle(
            $request->user(),
            $request->date('from'),
            $request->date('to'),
            $request->integer('per_page', 10),
        );

        return JournalResource::collection($journals);
    }

    public function store(StoreJournalRequest $request, UpsertJournalForDate $action)
    {
        $journal = $action->handle($request->user(), $request->validated());

        return (new JournalResource($journal))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Journal $journal)
    {
        return new JournalResource($journal);
    }

    public function update(UpdateJournalRequest $request, Journal $journal, UpdateJournal $action)
    {
        return new JournalResource($action->handle($journal, $request->validated()));
    }

    public function destroy(Journal $journal, DeleteJournal $action)
    {
        $action->handle($journal);

        return response()->noContent();
    }
}
