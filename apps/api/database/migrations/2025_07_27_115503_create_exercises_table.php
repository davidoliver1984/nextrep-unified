<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('exercise_name');
            $table->string('body_region'); // e.g., Upper, Lower
            $table->string('muscle_group'); // or FK if normalised
            $table->string('equipment_type'); // e.g., Dumbbell
            $table->string('movement_type'); // e.g., Push, Pull
            $table->string('exercise_type'); // Compound or Isolation
            $table->string('exercise_level'); // Compound or Isolation
            $table->string('exercise_desc'); // Compound or Isolation
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
