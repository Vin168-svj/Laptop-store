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
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary(); // String primary key matching 'p1', 'p2', etc.
            $table->string('name');
            $table->string('brand');
            $table->decimal('price', 10, 2);
            $table->text('description');
            $table->json('images')->nullable(); // Cast to array in model
            $table->json('specs')->nullable();   // Cast to array in model
            $table->string('category');
            $table->integer('stock')->default(0);
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->boolean('is_best_seller')->default(false);
            $table->boolean('is_new_arrival')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
