<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('description')->nullable();
            $table->json('payload'); //  going to use jsson for workout exercises, sets, reps
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_templates');
    }
};
