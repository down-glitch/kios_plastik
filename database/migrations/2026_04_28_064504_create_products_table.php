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
            $table->id();
            
            // Informasi Dasar
            $table->string('name');
            $table->string('slug')->unique(); // Untuk URL yang rapi di sisi API/React
            $table->string('sku')->unique();  // Kode Barcode atau Serial Barang
            $table->string('image')->nullable();
            
            // Relasi (Pastikan tabel categories & suppliers dibuat lebih dulu)
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            // Spesifikasi Barang
            $table->string('unit')->default('pcs'); // Contoh: pack, bal, dus, kg
            $table->text('description')->nullable();
            
            // Inventaris & Harga
            // Menggunakan decimal(15,2) agar akurat untuk perhitungan uang
            $table->decimal('cost_price', 15, 2)->default(0); // Harga Modal
            $table->decimal('selling_price', 15, 2)->default(0); // Harga Jual
            
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(10); // Batas peringatan stok menipis
            
            // Status & Kontrol
            $table->boolean('is_active')->default(true); // Untuk soft-deactivate
            
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