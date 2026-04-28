<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListProducts extends ListRecords
{
    protected static string $resource = ProductResource::class;
    

    protected function getHeaderActions(): array
    {
        
        return [
            \Filament\Actions\CreateAction::make(),
        \Filament\Actions\ExportAction::make()
            ->exporter(\App\Filament\Exports\ProductExporter::class)
            ->label('Unduh Data Produk')
            ->icon('heroicon-o-document-arrow-down')
            ->columnMapping(false),
        ];
    }
}
