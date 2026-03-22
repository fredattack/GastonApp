import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuthContext();
    const [formData, setFormData] = useState<RegisterCredentials>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
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

        if (formData.password !== formData.password_confirmation) {
            setError("Les mots de passe ne correspondent pas");
            setLoading(false);
            return;
        }

        try {
            await register(formData);
            navigate("/");
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Erreur lors de l'inscription",
            );
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
                    Créez votre compte
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Nom complet
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FA998]"
                            placeholder="Votre nom"
                        />
                    </div>

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

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Confirmer le mot de passe
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
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
                        {loading ? "Inscription..." : "S'inscrire"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Vous avez déjà un compte?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-[#8FA998] hover:underline font-medium"
                    >
                        Se connecter
                    </button>
                </p>
            </div>
        </div>
    );
}
