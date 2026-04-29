import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Ganti URL sesuai endpoint Laravel Anda (misal: Sanctum atau JWT)
            const response = await axios.post("/api/login", credentials);

            // Simpan token dan data user ke localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Redirect berdasarkan role (Gunakan window.location atau react-router-dom)
            if (response.data.user.role === "staff") {
                window.location.href = "/catalog";
            } else {
                window.location.href = "/history";
            }
        } catch (err) {
            setError("Email atau password salah. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-zinc-200">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                        Kios Plastik
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">
                        Masuk untuk mengelola transaksi
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block mb-2">
                            Alamat Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="nama@perusahaan.com"
                            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:bg-white outline-none transition-all text-zinc-800"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block">
                                Kata Sandi
                            </label>
                            <a
                                href="#"
                                className="text-[10px] text-zinc-400 hover:text-zinc-900 transition-colors uppercase font-bold"
                            >
                                Lupa?
                            </a>
                        </div>
                        <input
                            type="password"
                            name="password"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:bg-white outline-none transition-all text-zinc-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] disabled:bg-zinc-300 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "MENCOBA MASUK..." : "MASUK KE SISTEM"}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
                    <p className="text-zinc-400 text-xs">
                        &copy; 2026 Kios Plastik Digital System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
