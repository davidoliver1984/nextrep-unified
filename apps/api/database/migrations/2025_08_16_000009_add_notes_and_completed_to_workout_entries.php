<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workout_entries', function (Blueprint $table) {
            if (! Schema::hasColumn('workout_entries', 'notes')) {
                $table->text('notes')->nullable()->after('weight');
            }
            if (! Schema::hasColumn('workout_entries', 'completed')) {
                $table->boolean('completed')->default(false)->after('notes');
            }
        });
    }

    public function down(): void
    {
        Schema::table('workout_entries', function (Blueprint $table) {
            if (Schema::hasColumn('workout_entries', 'completed')) {
                $table->dropColumn('completed');
            }
            if (Schema::hasColumn('workout_entries', 'notes')) {
                $table->dropColumn('notes');
            }
        });
    }
};
