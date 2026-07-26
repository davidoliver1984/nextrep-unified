<?php

// database/migrations/2025_08_16_000001_make_payload_nullable_on_workout_templates.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workout_templates', function (Blueprint $table) {
            // For MySQL:
            $table->json('payload')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('workout_templates', function (Blueprint $table) {
            $table->json('payload')->nullable(false)->change();
        });
    }
};
