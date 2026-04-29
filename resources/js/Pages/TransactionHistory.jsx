import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/api/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                // Mengambil data dari properti 'data' milik Laravel Paginator
                const result = response.data.data || [];
                setTransactions(result);
            } catch (error) {
                console.error("Gagal mengambil data transaksi", error);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50">
                <div className="text-zinc-500 animate-pulse font-medium">
                    Memuat data transaksi...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-8 font-sans text-zinc-900">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">
                            Riwayat Transaksi
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Data penjualan Kios Plastik
                        </p>
                    </div>
                    <div className="text-right text-xs text-zinc-400 font-medium">
                        Total Record: {transactions.length}
                    </div>
                </header>

                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    No. Invoice
                                </th>
                                <th className="p-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="p-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Total Pembayaran
                                </th>
                                <th className="p-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {transactions.length > 0 ? (
                                transactions.map((trx) => (
                                    <tr
                                        key={trx.id}
                                        className="hover:bg-zinc-50 transition-colors"
                                    >
                                        <td className="p-4 text-sm font-bold text-zinc-900">
                                            {trx.invoice_number}
                                        </td>
                                        <td className="p-4 text-sm text-zinc-600">
                                            {trx.transaction_date
                                                ? new Date(
                                                      trx.transaction_date,
                                                  ).toLocaleString("id-ID", {
                                                      dateStyle: "medium",
                                                      timeStyle: "short",
                                                  })
                                                : "-"}
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-zinc-900">
                                            Rp{" "}
                                            {Number(
                                                trx.total_amount || 0,
                                            ).toLocaleString("id-ID")}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span
                                                className={`px-2 py-1 text-[10px] font-bold rounded-md border uppercase tracking-tight ${
                                                    trx.type === "out"
                                                        ? "bg-zinc-900 text-white border-zinc-900"
                                                        : "bg-white text-zinc-600 border-zinc-200"
                                                }`}
                                            >
                                                {trx.type === "out"
                                                    ? "Penjualan"
                                                    : "Masuk"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-12 text-center text-zinc-400 italic text-sm"
                                    >
                                        Belum ada riwayat transaksi ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
