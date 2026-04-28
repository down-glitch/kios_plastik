<?php

namespace App\Filament\Widgets;

use App\Models\Category;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            // Menghitung Total Kategori
            Stat::make('Total Kategori', Category::count())
                ->description('Kategori plastik aktif')
                ->descriptionIcon('heroicon-m-rectangle-stack')
                ->color('success'),

            // Menghitung Total Produk
            Stat::make('Total Produk', Product::count())
                ->description('Semua item di gudang')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('info'),

            // Menghitung Stok yang sedikit (di bawah 10)
            Stat::make('Stok Menipis', Product::where('stock', '<', 10)->count())
                ->description('Perlu segera restok!')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('danger'),
        ];
    }
}