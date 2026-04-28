<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $fillable = [
        'invoice_number', 'user_id', 'type', 
        'transaction_date', 'note', 'total_amount', 
        'paid_amount', 'change_amount'
    ];

    // Relasi ke User (Petugas/Admin)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Detail Barang yang ditransaksikan
    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }
}