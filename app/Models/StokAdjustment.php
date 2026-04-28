<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class stock_adjustments extends Model
{
    protected $fillable = [
        'product_id', 
        'user_id', 
        'system_quantity', 
        'actual_quantity', 
        'difference', 
        'reason', 
        'note'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}