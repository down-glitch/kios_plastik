<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class ProductCatalogController extends Controller
{
    public function index()
    {
        return Inertia::render('Catalog', [
            'products' => Product::with('category')->get()
        ]);
    }
}   