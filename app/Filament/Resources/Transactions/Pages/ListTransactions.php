<?php

namespace App\Filament\Resources\Transactions\Pages;

use App\Models\User;
use App\Filament\Resources\Transactions\TransactionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Auth;


class ListTransactions extends ListRecords
{
    protected static string $resource = TransactionResource::class;

    protected function getHeaderActions(): array
    {
        $actions = [];

        // Admin tidak bisa membuat transaksi
        /** @var User|null $user */
        $user = Auth::user();
        if ($user instanceof User && $user->role !== 'admin') {
            $actions[] = CreateAction::make();
        }

        $actions[] = \Filament\Actions\ExportAction::make()
            ->exporter(\App\Filament\Exports\TransactionExporter::class)
            ->label('Unduh Data Transaksi')
            ->icon('heroicon-o-document-arrow-down')
            ->columnMapping(true);

        return $actions;
    }
}
