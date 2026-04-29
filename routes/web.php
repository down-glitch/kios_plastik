<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductCatalogController;
use Illuminate\Support\Facades\Storage;

Route::get('/{any}', function () {
    return view('app'); // Ganti 'app' sesuai nama file blade utama Anda (resources/views/app.blade.php)
})->where('any', '.*');

Route::get('/print-laporan', function (Illuminate\Http\Request $request) {
    $query = App\Models\Transaction::where('type', 'out');

    // Terapkan filter yang sama dengan yang dipilih di Filament
    if ($request->dari_tanggal) $query->whereDate('transaction_date', '>=', $request->dari_tanggal);
    if ($request->sampai_tanggal) $query->whereDate('transaction_date', '<=', $request->sampai_tanggal);

    $transactions = $query->with(['details.product'])->get();

    return view('print.laporan', compact('transactions'));
})->name('print.laporan');

Route::get('/storage/{path}', function ($path) {
    $path = str_replace('../', '', $path); // Keamanan dasar
    if (!Storage::disk('public')->exists($path)) abort(404);
    return response()->file(storage_path('app/public/' . $path));
})->where('path', '.*');

Route::get('/katalog', [ProductCatalogController::class, 'index']); 

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
