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
        Schema::create('stock_adjustments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained();
    $table->integer('actual_quantity'); // Jumlah asli di rak
    $table->integer('system_quantity'); // Jumlah menurut komputer
    $table->integer('difference'); // Selisihnya
    $table->string('reason'); // Alasan: "Barang Rusak" atau "Salah Input"
    $table->foreignId('user_id')->constrained(); // Siapa yang melakukan penyesuaian
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_adjustments');
    }
};
