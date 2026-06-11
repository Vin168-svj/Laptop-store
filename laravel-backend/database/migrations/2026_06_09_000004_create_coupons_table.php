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
        Schema::create('coupons', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('discount_type'); // 'percentage' | 'fixed'
            $table->decimal('discount_value', 10, 2);
            $table->decimal('min_subtotal', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
