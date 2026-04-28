<?php

namespace App\Filament\Resources\Transactions\Pages;

use App\Filament\Resources\Transactions\TransactionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;


class ListTransactions extends ListRecords
{
    protected static string $resource = TransactionResource::class;

    protected function getHeaderActions(): array
    {
        return [
                CreateAction::make(),
        \Filament\Actions\ExportAction::make()
            ->exporter(\App\Filament\Exports\TransactionExporter::class)
            ->label('Unduh Data Transaksi')
            ->icon('heroicon-o-document-arrow-down')
            ->columnMapping(false),
        ];
    }
}
