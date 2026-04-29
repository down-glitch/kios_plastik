<?php

namespace App\Filament\Resources\Transactions\Pages;

use App\Models\User;
use App\Filament\Resources\Transactions\TransactionResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;

class CreateTransaction extends CreateRecord
{
    protected static string $resource = TransactionResource::class;

    public function mount(): void
    {
        /** @var User|null $user */
        $user = Auth::user();
        
        if ($user instanceof User && $user->role === 'admin') {
            abort(403, 'Admin tidak memiliki izin untuk membuat transaksi.');
        }

        parent::mount();
    }
}
