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

    public function getFileName(Export $export): string
{
    return "Laporan-Transaksi-{$export->getKey()}";
}

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('invoice_number')->label('Nomor Invoice'),
            ExportColumn::make('user.name')->label('Kasir'),
            ExportColumn::make('type')->label('Tipe Transaksi'),
            ExportColumn::make('transaction_date')->label('Tanggal Transaksi'),
            ExportColumn::make('details.product.name')->label('Barang yang Dibeli'),
            ExportColumn::make('details.quantity')->label('Jumlah'),
            ExportColumn::make('details.price_at_transaction')->label('Harga Satuan'),
            ExportColumn::make('total_amount')->label('Total Transaksi'),
            ExportColumn::make('paid_amount')->label('Total Pembayaran'),
            ExportColumn::make('change_amount')->label('Kembalian'),
            ExportColumn::make('created_at')->label('Dibuat Pada'),
            ExportColumn::make('updated_at')->label('Diperbarui Pada'),
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
