import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Auth/Login";
import Catalog from "./Pages/Catalog";
import TransactionHistory from "./Pages/TransactionHistory";

// PROTEKSI KERAS: Hanya untuk Staff
const StaffOnlyGate = ({ children }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // 1. Jika belum login
    if (!token) return <Navigate to="/login" replace />;

    // 2. Jika yang masuk ADMIN (Admin tidak boleh di sini, Admin di Filament!)
    if (user?.role === "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
                    <h1 className="text-4xl font-bold text-zinc-900 mb-2">
                        403
                    </h1>
                    <p className="text-zinc-600 mb-4">
                        Maaf, halaman Kasir (Catalog) ini khusus untuk
                        **Staff**.
                    </p>
                    <p className="text-sm text-zinc-400 mb-6">
                        Admin silakan gunakan dashboard Filament.
                    </p>
                    <button
                        onClick={() => (window.location.href = "/admin")}
                        className="bg-zinc-900 text-white px-6 py-2 rounded-lg font-medium"
                    >
                        Ke Dashboard Admin
                    </button>
                </div>
            </div>
        );
    }

    // 3. Jika dia STAFF (Berhasil Masuk!)
    if (user?.role === "staff") {
        return children;
    }

    // 4. Jika role tidak dikenal
    return <Navigate to="/login" replace />;
};

const MainLayout = () => (
    <div className="min-h-screen bg-zinc-50 font-sans">
        <Navbar />
        <main className="p-4 md:p-8">
            <Outlet />
        </main>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Bungkus semua halaman Staff di sini */}
            <Route element={<MainLayout />}>
                <Route
                    path="/catalog"
                    element={
                        <StaffOnlyGate>
                            <Catalog />
                        </StaffOnlyGate>
                    }
                />
                <Route
                    path="/history"
                    element={
                        <StaffOnlyGate>
                            <TransactionHistory />
                        </StaffOnlyGate>
                    }
                />
            </Route>

            {/* Default: Staff langsung ke Catalog */}
            <Route path="/" element={<Navigate to="/catalog" replace />} />
        </Routes>
    );
};

export default AppRoutes;
