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

            // addin FK for journal link
            $table->foreignId('journal_id')
                ->nullable()
                ->constrained('journals')
                ->onDelete('set null');

            $table->date('date')->nullable(); // set to null might want to backfill
            $table->string('title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workout_entries', function (Blueprint $table) {

            $table->dropForeign(['journal_id']);
            $table->dropColumn('journal_id');
            $table->dropColumn('date');
            $table->dropColumn('title');
        });
    }
};
