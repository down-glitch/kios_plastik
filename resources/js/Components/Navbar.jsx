import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Helper untuk cek link aktif
    const isActive = (path) =>
        location.pathname === path
            ? "bg-zinc-100 text-zinc-900"
            : "text-zinc-600 hover:bg-zinc-50";

    return (
        <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold text-zinc-900 tracking-tight">
                            KIOS
                            <span className="text-zinc-400 font-light">
                                PLASTIK
                            </span>
                        </span>

                        {/* Navigation Links */}
                        <div className="hidden md:flex gap-1">
                            <Link
                                to="/catalog"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/catalog")}`}
                            >
                                Katalog
                            </Link>
                            <Link
                                to="/history"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/history")}`}
                            >
                                Riwayat
                            </Link>
                        </div>
                    </div>

                    {/* Profile & Logout */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-zinc-900 leading-none">
                                {user.name || "User"}
                            </p>
                            <p className="text-xs text-zinc-500 capitalize">
                                {user.role || "Staff"}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-100"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
