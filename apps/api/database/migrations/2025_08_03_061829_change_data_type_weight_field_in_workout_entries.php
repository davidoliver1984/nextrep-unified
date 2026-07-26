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
        Schema::table('workout_entries', function (Blueprint $table) {
            $table->decimal('weight', 5, 1)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('workout_entries', function (Blueprint $table) {
            $table->integer('weight')->nullable()->change();
        });
    }
};
