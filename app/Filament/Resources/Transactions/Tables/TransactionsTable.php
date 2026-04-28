<?php

namespace App\Filament\Resources\Transactions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class TransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('invoice_number')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('details.product.name') // Asumsi relasi ke detail lalu ke product
                    ->label('Barang yang Dibeli')
                    ->listWithLineBreaks() // Membuat daftar ke bawah dalam satu sel
                    ->bulleted()          // Menambahkan titik peluru
                    ->searchable(),

                // MENAMPILKAN JUMLAH TIAP BARANG
                TextColumn::make('details.quantity')
                    ->label('Jumlah')
                    ->listWithLineBreaks()
                    ->badge() // Memberi efek badge agar angka lebih menonjol
                    ->color('info'),
                TextColumn::make('details.price_at_transaction') // Samakan persis dengan nama di migrasi
    ->label('Harga Satuan')
    ->listWithLineBreaks()
    ->money('idr'), 

TextColumn::make('details.subtotal')
    ->label('Subtotal')
    ->listWithLineBreaks()
    ->money('idr')
    ->state(function ($record) {
        // Hitung manual: Qty x Harga saat transaksi
        return $record->details->map(fn ($detail) => $detail->quantity * $detail->price_at_transaction);
    }),
                TextColumn::make('type'),
                TextColumn::make('transaction_date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('total_amount')
                    ->numeric()
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('paid_amount')
                    ->numeric()
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('change_amount')
                    ->numeric()
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // FILTER RENTANG TANGGAL DISATUKAN DI SINI
                Filter::make('transaction_date')
                    ->form([
                        DatePicker::make('from')
                            ->label('Dari Tanggal'),
                        DatePicker::make('until')
                            ->label('Sampai Tanggal'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('transaction_date', '>=', $date),
                            )
                            ->when(
                                $data['until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('transaction_date', '<=', $date),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['from'] ?? null) {
                            $indicators[] = 'Sejak: ' . \Carbon\Carbon::parse($data['from'])->format('d/m/Y');
                        }
                        if ($data['until'] ?? null) {
                            $indicators[] = 'Hingga: ' . \Carbon\Carbon::parse($data['until'])->format('d/m/Y');
                        }
                        return $indicators;
                    })
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
