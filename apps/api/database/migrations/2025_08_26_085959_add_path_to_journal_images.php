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
        if (Schema::hasColumn('journal_images', 'path')) {
            return;
        }

        Schema::table('journal_images', function (Blueprint $table) {
            $table->string('path', 1024)->after('journal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('journal_images', 'path')) {
            return;
        }

        Schema::table('journal_images', function (Blueprint $table) {
            $table->dropColumn('path');
        });
    }
};
