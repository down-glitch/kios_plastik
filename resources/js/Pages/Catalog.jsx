import React, { useState, useEffect } from "react";
import axios from "axios";

const Catalog = () => {
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
        if (cart.length === 0) {
            showMessage("warning", "Keranjang kosong!");
            return;
        }
        if (parseInt(payAmount) < totalPrice) {
            showMessage(
                "error",
                `Uang bayar kurang! Kurang Rp ${(totalPrice - parseInt(payAmount)).toLocaleString("id-ID")}`,
            );
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/transactions", {
                cart: cart,
                paid_amount: parseInt(payAmount),
                note: "Penjualan Kasir",
            });

            showMessage(
                "success",
                `✓ Transaksi berhasil! Invoice: ${response.data.invoice}`,
            );
            setCart([]);
            setPayAmount(0);
            fetchProducts();
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                error.message ||
                "Gagal menyimpan transaksi";
            showMessage("error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* NOTIFIKASI */}
            {message.text && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
                        message.type === "success"
                            ? "bg-green-500"
                            : message.type === "error"
                              ? "bg-red-500"
                              : message.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* BAGIAN KIRI: KATALOG PRODUK */}
            <div className="w-2/3 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Kios Plastik - Kasir
                    </h1>
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border rounded-lg w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                                className={`bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all ${
                                    product.stock <= 0 ? "opacity-50" : ""
                                }`}
                            >
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="h-32 w-full object-cover rounded-lg mb-3"
                                    onError={(e) =>
                                        (e.target.src =
                                            "https://placehold.co/400x300?text=No+Image")
                                    }
                                />
                                <h3 className="font-semibold text-gray-700 truncate">
                                    {product.name}
                                </h3>
                                <p className="text-amber-600 font-bold">
                                    Rp{" "}
                                    {Number(
                                        product.selling_price,
                                    ).toLocaleString("id-ID")}
                                </p>
                                <span
                                    className={`text-xs ${
                                        product.stock < 10
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                >
                                    Stok: {product.stock}
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            {/* BAGIAN KANAN: KERANJANG & CHECKOUT */}
            <div className="w-1/3 bg-white shadow-2xl p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                    Pesanan ({cart.length})
                </h2>

                <div className="flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-center mt-10 text-sm italic">
                            Belum ada barang dipilih
                        </p>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium text-sm">
                                        {item.name}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p className="text-gray-600 text-xs mb-2">
                                    Rp{" "}
                                    {Number(item.selling_price).toLocaleString(
                                        "id-ID",
                                    )}{" "}
                                    x {item.qty}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.qty - 1,
                                                )
                                            }
                                            className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-xs font-bold"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold">
                                            {item.qty}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.qty + 1,
                                                )
                                            }
                                            className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-xs font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="font-bold text-amber-600">
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

                <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-amber-600">
                            Rp {totalPrice.toLocaleString("id-ID")}
                        </span>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500">
                            Uang Bayar (Rp)
                        </label>
                        <input
                            type="number"
                            value={payAmount}
                            onChange={(e) => {
                                // Ambil nilai, buang karakter non-angka
                                let val = e.target.value;

                                // Konversi ke Number untuk menghilangkan leading zero secara otomatis
                                let numericValue = Number(val);

                                if (val === "" || numericValue < 0) {
                                    setPayAmount(0);
                                } else {
                                    setPayAmount(numericValue);
                                }
                            }}
                            className="w-full p-3 bg-gray-100 border-none rounded-lg text-xl font-mono"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-between text-sm py-2 bg-gray-50 p-2 rounded">
                        <span>Kembalian:</span>
                        <span
                            className={`font-bold ${
                                changeAmount < 0
                                    ? "text-red-500"
                                    : "text-green-600"
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
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        {loading ? "MEMPROSES..." : "SIMPAN TRANSAKSI"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
