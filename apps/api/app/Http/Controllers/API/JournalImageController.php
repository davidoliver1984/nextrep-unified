<?php

namespace App\Http\Controllers\API;

use App\Actions\JournalImages\CreateJournalImage;
use App\Actions\JournalImages\DeleteJournalImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListJournalImagesRequest;
use App\Http\Requests\StoreJournalImageRequest;
use App\Http\Resources\JournalImageResource;
use App\Models\Journal;
use App\Models\JournalImage;
use App\Queries\JournalImages\ListGalleryImages;
use App\Queries\JournalImages\ListJournalImages;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class JournalImageController extends Controller
{
    use AuthorizesRequests;

    public function index(Journal $journal, ListJournalImagesRequest $request, ListJournalImages $query)
    {
        $this->authorize('view', $journal);

        $perPage = $request->integer('per_page', 24);
        $images = $query->handle($journal, $perPage);

        return JournalImageResource::collection($images);
    }

    public function store(StoreJournalImageRequest $request, Journal $journal, CreateJournalImage $action)
    {
        $image = $action->handle($journal, $request->file('image'));

        return (new JournalImageResource($image))
            ->response()
            ->setStatusCode(201);
    }

    public function show(JournalImage $journalImage): JournalImageResource
    {
        $this->authorize('view', $journalImage);

        return new JournalImageResource($journalImage->load('journal'));
    }

    public function destroy(JournalImage $journalImage, DeleteJournalImage $action)
    {
        $this->authorize('delete', $journalImage);

        $action->handle($journalImage);

        return response()->noContent();
    }

    public function gallery(ListJournalImagesRequest $request, ListGalleryImages $query)
    {
        $perPage = $request->integer('per_page', 24);

        $images = $query->handle($request->user(), $perPage);

        return JournalImageResource::collection($images);
    }
}
