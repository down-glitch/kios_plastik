<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        // Mengambil produk beserta kategorinya
        return response()->json(Product::with('category')->get());
    }
}