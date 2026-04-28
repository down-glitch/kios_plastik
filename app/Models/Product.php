<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class product extends Model
{
    protected $fillable = [
        'name', 'slug', 'sku', 'image', 'category_id', 
        'unit', 'cost_price', 'selling_price', 
        'stock', 'min_stock', 'is_active'
    ];

    // Append URL gambar agar bisa langsung dibaca oleh React petugas
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image 
            ? asset('storage/' . $this->image) 
            : asset('images/no-image.png');
    }

    // Relasi balik ke Kategori
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}