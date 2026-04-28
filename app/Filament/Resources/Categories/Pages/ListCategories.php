<?php

namespace App\Filament\Resources\Categories\Pages;

use App\Filament\Resources\Categories\CategoriesResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;


class ListCategories extends ListRecords
{
    protected static string $resource = CategoriesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            
            CreateAction::make()
                ->label('Tambah Kategori Baru') // Mengubah teks tombol
                ->icon('heroicon-o-plus'),     // Menambahkan ikon plus
        ];
    }

    // Menambahkan judul halaman yang kustom
    public function getTitle(): string 
    {
        return 'Daftar Kategori Plastik';
    }
}
