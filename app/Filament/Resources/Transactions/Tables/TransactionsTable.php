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
use App\Filament\Exports\TransactionExporter;
// IMPORT YANG BENAR UNTUK EXPORT DI DALAM TABEL
use Filament\Actions\ExportAction;

class TransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('invoice_number')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->label('Kasir')
                    ->sortable(),
                TextColumn::make('details.product.name')
                    ->label('Barang yang Dibeli')
                    ->listWithLineBreaks()
                    ->bulleted()
                    ->searchable(),

                TextColumn::make('details.quantity')
                    ->label('Jumlah')
                    ->listWithLineBreaks()
                    ->badge()
                    ->color('info'),

                TextColumn::make('details.price_at_transaction')
                    ->label('Harga Satuan')
                    ->listWithLineBreaks()
                    ->money('idr'), 

                TextColumn::make('details.subtotal')
                    ->label('Subtotal')
                    ->listWithLineBreaks()
                    ->money('idr')
                    ->state(function ($record) {
                        return $record->details->map(fn ($detail) => $detail->quantity * $detail->price_at_transaction);
                    }),

                TextColumn::make('type')
                    ->badge(),
                TextColumn::make('transaction_date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('total_amount')
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('paid_amount')
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('change_amount')
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Filter::make('transaction_date')
                    ->form([
                        DatePicker::make('from')->label('Dari Tanggal'),
                        DatePicker::make('until')->label('Sampai Tanggal'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when($data['from'], fn ($query, $date) => $query->whereDate('transaction_date', '>=', $date))
                            ->when($data['until'], fn ($query, $date) => $query->whereDate('transaction_date', '<=', $date));
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['from'] ?? null) $indicators[] = 'Sejak: ' . \Carbon\Carbon::parse($data['from'])->format('d/m/Y');
                        if ($data['until'] ?? null) $indicators[] = 'Hingga: ' . \Carbon\Carbon::parse($data['until'])->format('d/m/Y');
                        return $indicators;
                    })
            ])
            ->actions([
                // PERBAIKAN: Gunakan ExportAction dari namespace Tables
                ExportAction::make('export_row')
                    ->label('Ekspor Baris')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('success')
                    ->exporter(TransactionExporter::class)
                    // Membatasi ekspor hanya untuk baris ini saja
                    ->modifyQueryUsing(fn (Builder $query, $record) => $query->where('id', $record->id))
                    ->columnMapping(false),
                
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}