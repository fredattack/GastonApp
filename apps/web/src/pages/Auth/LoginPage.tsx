import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

interface LoginCredentials {
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const [formData, setFormData] = useState<LoginCredentials>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(formData);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F1E8] to-[#FDFCFA] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-2 text-[#8FA998]">
                    Gaston
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Connectez-vous à votre compte
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FA998]"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FA998]"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8FA998] text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Pas de compte?{" "}
                    <button
                        onClick={() => navigate("/register")}
                        className="text-[#8FA998] hover:underline font-medium"
                    >
                        S'inscrire
                    </button>
                </p>

                <div className="flex justify-center gap-3 mt-4 text-xs text-gray-400">
                    <a href="/cgu" className="hover:text-[#8FA998] transition">
                        CGU
                    </a>
                    <span>·</span>
                    <a
                        href="/privacy"
                        className="hover:text-[#8FA998] transition"
                    >
                        Confidentialité
                    </a>
                </div>
            </div>
        </div>
    );
}
