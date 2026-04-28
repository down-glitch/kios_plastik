<?php

namespace App\Filament\Exports;

use App\Models\Transaction;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;
use Illuminate\Support\Number;

class TransactionExporter extends Exporter
{
    protected static ?string $model = Transaction::class;

    public static function getColumns(): array
    {
        return [
        ExportColumn::make('invoice_number')->label('Nomor Invoice'),
        ExportColumn::make('user.name')->label('Nama'),
        ExportColumn::make('type')->label('Type'),
        ExportColumn::make('transaction_date')->label('Tanggal Transaksi'),
        ExportColumn::make('total_amount')->label('Total Transaksi'),
        ExportColumn::make('paid_amount')->label('Total Pembayaran'),
        ExportColumn::make('change_amount')->label('Kembalian'),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Your transaction export has completed and ' . Number::format($export->successful_rows) . ' ' . str('row')->plural($export->successful_rows) . ' exported.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . Number::format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
