<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Auth\LoginController;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions', [TransactionController::class, 'index']);
}); // Sesuaikan dengan controller kamu

Route::post('/login', [LoginController::class, 'login']);



Route::get('/products', [ProductController::class, 'index']);