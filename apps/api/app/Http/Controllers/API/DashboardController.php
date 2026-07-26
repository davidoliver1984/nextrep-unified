<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Reports\Dashboard\BuildDashboard;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request, BuildDashboard $report): DashboardResource
    {
        return new DashboardResource($report->handle($request->user()));
    }
}
