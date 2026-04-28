<?php

namespace App\Filament\Resources\Categories\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn; // Tambahkan import ini
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
class CategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // 1. Tambahkan kolom Nama
                TextColumn::make('name')
                    ->label('Nama Kategori')
                    ->searchable()
                    ->sortable(),

                // 2. Tambahkan kolom Slug
                TextColumn::make('slug')
                    ->label('Slug')
                    ->color('gray'),

                // 3. Tambahkan kolom Tanggal (Opsional)
                TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}