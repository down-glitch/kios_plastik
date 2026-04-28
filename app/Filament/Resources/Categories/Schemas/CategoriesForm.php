<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\TextInput; // Import komponen input
use Filament\Forms\Form; // Pastikan menggunakan Form jika di Filament v4
use Illuminate\Support\Str;

class CategoriesForm
{
    public static function configure($form)
    {
        return $form
            ->schema([
                // Input untuk Nama Kategori
                TextInput::make('name')
                    ->label('Nama Kategori')
                    ->required()
                    ->placeholder('Contoh: Plastik Kiloan')
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                // Input untuk Slug (Otomatis terisi dari Nama)
                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->unique('categories', 'slug', ignoreRecord: true)
                    ->helperText('Otomatis terisi berdasarkan nama kategori'),
            ]);
    }
}