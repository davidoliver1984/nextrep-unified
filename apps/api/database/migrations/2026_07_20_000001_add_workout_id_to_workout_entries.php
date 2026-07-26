<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('workout_entries', 'workout_id')) {
            return;
        }

        Schema::table('workout_entries', function (Blueprint $table) {
            $table->foreignId('workout_id')
                ->nullable()
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('workout_entries', 'workout_id')) {
            return;
        }

        Schema::table('workout_entries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('workout_id');
        });
    }
};
