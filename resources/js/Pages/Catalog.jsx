import React, { useState, useEffect } from "react";
import axios from "axios";

const Catalog = ( ) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [payAmount, setPayAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("/api/products");
            setProducts(response.data);
        } catch (error) {
            showMessage("error", "Gagal memuat produk");
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const addToCart = (product) => {
        if (product.stock <= 0) {
            showMessage("error", `${product.name} stok habis!`);
            return;
        }

        const existing = cart.find((item) => item.id === product.id);
        if (existing) {
            if (existing.qty >= product.stock) {
                showMessage(
                    "warning",
                    `Stok ${product.name} hanya ${product.stock}`,
                );
                return;
            }
            updateQuantity(product.id, existing.qty + 1);
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
            showMessage("success", `${product.name} ditambahkan`);
        }
    };

    const updateQuantity = (id, newQty) => {
        if (newQty <= 0) {
            removeFromCart(id);
            return;
        }

        const product = products.find((p) => p.id === id);
        if (newQty > product.stock) {
            showMessage(
                "warning",
                `Stok ${product.name} hanya ${product.stock}`,
            );
            return;
        }

        setCart(
            cart.map((item) =>
                item.id === id ? { ...item, qty: newQty } : item,
            ),
        );
    };

    const removeFromCart = (id) => {
        const item = cart.find((item) => item.id === id);
        setCart(cart.filter((item) => item.id !== id));
        showMessage("info", `${item.name} dihapus dari keranjang`);
    };

    const totalPrice = cart.reduce(
        (acc, item) => acc + item.selling_price * item.qty,
        0,
    );
    const changeAmount = parseInt(payAmount) - totalPrice;

 const handleCheckout = async () => {
     const token = localStorage.getItem("token");

     // 1. HITUNG TOTAL HARGA DULU
     // Kita jumlahkan (harga * quantity) dari semua item di keranjang
     const totalHarga = cart.reduce((sum, item) => {
         return sum + Number(item.price) * (item.quantity || 1);
     }, 0);

     // 2. SIAPKAN DATA (PAYLOAD)
     const payload = {
         cart: cart,
         total_amount: totalHarga, // Gunakan variabel totalHarga yang baru dihitung
         paid_amount: payAmount, // Uang yang dibayarkan pelanggan
     };

     try {
         const response = await axios.post(
             "http://127.0.0.1:8000/api/transactions",
             payload,
             {
                 headers: {
                     Authorization: `Bearer ${token}`,
                     Accept: "application/json",
                 },
             },
         );

         if (response.status === 200 || response.status === 201) {
             alert("Transaksi Berhasil!");

             // Bersihkan state agar halaman "seolah-olah" refresh
             setCart([]);
             setPayAmount(0);

             // Kalau mau refresh total halaman:
             window.location.reload();
         }
     } catch (error) {
         console.error("Detail Error:", error.response?.data);
         alert(
             "Gagal: " + (error.response?.data?.message || "Terjadi kesalahan"),
         );
     }
 };
    return (
        <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900">
            {/* NOTIFIKASI */}
            {message.text && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg text-white z-50 shadow-lg transition-all ${
                        message.type === "success"
                            ? "bg-zinc-800" // Gunakan zinc gelap untuk success agar kontras tapi tetap elegan
                            : message.type === "error"
                              ? "bg-red-600"
                              : message.type === "warning"
                                ? "bg-orange-500"
                                : "bg-zinc-600"
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* BAGIAN KIRI: KATALOG PRODUK */}
            <div className="w-2/3 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-zinc-800">
                        Kios Plastik - Kasir
                    </h1>
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border border-zinc-300 rounded-lg w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 bg-white"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {products
                        .filter((p) =>
                            p.name.toLowerCase().includes(search.toLowerCase()),
                        )
                        .map((product) => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className={`bg-white p-4 rounded-xl border border-zinc-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-zinc-800 transition-all ${
                                    product.stock <= 0
                                        ? "opacity-50 grayscale"
                                        : ""
                                }`}
                            >
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="h-32 w-full object-cover rounded-lg mb-3"
                                    onError={(e) =>
                                        (e.target.src =
                                            "https://placehold.co/400x300/e4e4e7/52525b?text=No+Image")
                                    }
                                />
                                <h3 className="font-semibold text-zinc-700 truncate">
                                    {product.name}
                                </h3>
                                <p className="text-zinc-900 font-bold">
                                    Rp{" "}
                                    {Number(
                                        product.selling_price,
                                    ).toLocaleString("id-ID")}
                                </p>
                                <span
                                    className={`text-xs font-medium ${
                                        product.stock < 10
                                            ? "text-red-500"
                                            : "text-zinc-400"
                                    }`}
                                >
                                    Stok: {product.stock}
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            {/* BAGIAN KANAN: KERANJANG & CHECKOUT */}
            <div className="w-1/3 bg-white shadow-xl border-l border-zinc-200 p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-4 border-b border-zinc-100 pb-2 text-zinc-800">
                    Pesanan ({cart.length})
                </h2>

                <div className="flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center mt-10">
                            <p className="text-zinc-400 text-sm italic">
                                Belum ada barang dipilih
                            </p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="mb-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-sm text-zinc-700">
                                        {item.name}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-zinc-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="text-xs font-bold">
                                            ✕
                                        </span>
                                    </button>
                                </div>
                                <p className="text-zinc-500 text-xs mb-2 font-mono">
                                    Rp{" "}
                                    {Number(item.selling_price).toLocaleString(
                                        "id-ID",
                                    )}{" "}
                                    x {item.qty}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.qty - 1,
                                                )
                                            }
                                            className="bg-white border border-zinc-300 hover:bg-zinc-100 px-2 py-1 rounded text-xs font-bold text-zinc-600"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-zinc-700">
                                            {item.qty}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.qty + 1,
                                                )
                                            }
                                            className="bg-white border border-zinc-300 hover:bg-zinc-100 px-2 py-1 rounded text-xs font-bold text-zinc-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="font-bold text-zinc-900">
                                        Rp{" "}
                                        {Number(
                                            item.qty * item.selling_price,
                                        ).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-zinc-100 pt-4 space-y-3">
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-zinc-600">Total:</span>
                        <span className="text-zinc-900">
                            Rp {totalPrice.toLocaleString("id-ID")}
                        </span>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                            Uang Bayar (Rp)
                        </label>
                        <input
                            type="number"
                            value={payAmount}
                            onChange={(e) => {
                                let val = e.target.value;
                                let numericValue = Number(val);
                                if (val === "" || numericValue < 0) {
                                    setPayAmount(0);
                                } else {
                                    setPayAmount(numericValue);
                                }
                            }}
                            className="w-full p-3 bg-zinc-100 border border-zinc-200 rounded-lg text-xl font-mono focus:ring-2 focus:ring-zinc-800 outline-none"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-between text-sm py-2 px-3 bg-zinc-50 rounded border border-zinc-100">
                        <span className="text-zinc-500">Kembalian:</span>
                        <span
                            className={`font-bold ${
                                changeAmount < 0
                                    ? "text-red-500"
                                    : "text-zinc-900"
                            }`}
                        >
                            Rp {changeAmount.toLocaleString("id-ID")}
                        </span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={
                            cart.length === 0 || changeAmount < 0 || loading
                        }
                        className="w-full bg-zinc-900 hover:bg-black disabled:bg-zinc-200 disabled:text-zinc-400 text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.98]"
                    >
                        {loading ? "MEMPROSES..." : "SIMPAN TRANSAKSI"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
