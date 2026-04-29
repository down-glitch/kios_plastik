<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Token/Autentikasi (Paling Penting)
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sesi login tidak valid atau telah berakhir.'
            ], 401);
        }

        // 2. Validasi Request
        $validated = $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|integer|exists:products,id',
            'cart.*.qty' => 'required|integer|min:1',
            'cart.*.selling_price' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated) {
            $cart = $validated['cart'];
            $paidAmount = (float) $validated['paid_amount'];
            $userId = Auth::id(); // Mengambil ID Staf dari Token
            
            // 3. Validasi stok sebelum transaksi
            $totalAmount = 0;
            foreach ($cart as $item) {
                $product = Product::find($item['id']);
                
                if (!$product) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Produk tidak ditemukan'
                    ], 404);
                }
                
                if ($product->stock < $item['qty']) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "Stok {$product->name} tidak cukup! Tersedia: {$product->stock}, diminta: {$item['qty']}"
                    ], 422);
                }
                
                $totalAmount += $item['qty'] * $item['selling_price'];
            }
            
            // 4. Cek uang bayar cukup
            if ($paidAmount < $totalAmount) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Uang bayar kurang! Total: Rp ' . number_format($totalAmount, 0, ',', '.') . 
                                 ', Bayar: Rp ' . number_format($paidAmount, 0, ',', '.')
                ], 422);
            }
            
            $changeAmount = $paidAmount - $totalAmount;
            
            // 5. Buat Transaksi
            $transaction = Transaction::create([
                'invoice_number' => 'KP-' . date('Ymd') . strtoupper(Str::random(4)),
                'user_id' => $userId,
                'type' => 'out',
                'transaction_date' => now(),
                'note' => $validated['note'] ?? 'Penjualan Kasir',
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'change_amount' => $changeAmount,
            ]);

            // 6. Simpan Detail & Potong Stok
            foreach ($cart as $item) {
                $transaction->details()->create([
                    'product_id' => $item['id'],
                    'quantity' => $item['qty'],
                    'price_at_transaction' => $item['selling_price'],
                ]);

                Product::where('id', $item['id'])->decrement('stock', $item['qty']);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil!',
                'invoice' => $transaction->invoice_number,
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'change_amount' => $changeAmount
            ]);
        });
    }

    public function show($id)
    {
        $transaction = Transaction::with(['details.product', 'user'])->find($id);
        
        if (!$transaction) {
            return response()->json(['error' => 'Transaksi tidak ditemukan'], 404);
        }

        return response()->json($transaction);
    }

    public function index()
    {
        // Menggunakan paginate karena Riwayat Transaksi biasanya banyak
        $transactions = Transaction::with(['details', 'user'])
            ->orderBy('transaction_date', 'desc')
            ->paginate(20);
        
        return response()->json($transactions);
    }
}