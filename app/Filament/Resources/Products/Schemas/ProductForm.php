<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;


class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema

            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                TextInput::make('sku')
                    ->label('SKU')
                    ->required(),
                FileUpload::make('image')
                    ->image()
                    ->directory('products')
                    ->disk('public')
                    ->preserveFilenames()
                    ->required(),
                Select::make('category_id')
                    ->relationship('category', 'name'),
                TextInput::make('unit')
                    ->required()
                    ->default('pcs'),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('cost_price')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('selling_price')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('stock')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('min_stock')
                    ->required()
                    ->numeric()
                    ->default(10),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
