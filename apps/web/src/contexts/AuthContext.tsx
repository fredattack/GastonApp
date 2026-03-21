import React, { createContext, useState, useEffect } from "react";
import axiosClient, {
    fetchCsrfToken,
} from "../providers/apiClientProvider/axiosClient";

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    register: (credentials: RegisterCredentials) => Promise<User>;
    login: (credentials: LoginCredentials) => Promise<User>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize from localStorage on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("auth_token");

            if (token) {
                try {
                    // Fetch CSRF token first (same as login flow)
                    await fetchCsrfToken();

                    axiosClient.defaults.headers.common["Authorization"] =
                        `Bearer ${token}`;
                    const response = await axiosClient.get<User>("/auth/user");
                    const fetchedUser = response.data;
                    localStorage.setItem("auth_user_id", String(fetchedUser.id));
                    setUser(fetchedUser);
                } catch (err: any) {
                    console.log(
                        "[Auth] Error response:",
                        err.response?.status,
                        err.message,
                    );
                    // Only clear token if it's a 401 (unauthorized/expired token)
                    // For other errors (network, etc), keep the token and let the user retry
                    if (err.response?.status === 401) {
                        console.log("[Auth] Token expired/invalid, clearing");
                        localStorage.removeItem("auth_token");
                        localStorage.removeItem("auth_user_id");
                        delete axiosClient.defaults.headers.common[
                            "Authorization"
                        ];
                        setUser(null);
                    } else {
                        console.log("[Auth] Other error, keeping token");
                        // For other errors, still try to use the token - it might work
                        // But set user to null temporarily to show loading state
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const register = async (
        credentials: RegisterCredentials,
    ): Promise<User> => {
        setError(null);
        try {
            await fetchCsrfToken();
            const response = await axiosClient.post<{
                data: { user: User; token: string };
            }>("/auth/register", credentials);
            const { user: newUser, token } = response.data.data;
            localStorage.setItem("auth_token", token);
            localStorage.setItem("auth_user_id", String(newUser.id));
            axiosClient.defaults.headers.common["Authorization"] =
                `Bearer ${token}`;
            setUser(newUser);
            return newUser;
        } catch (err: any) {
            const message =
                err.response?.data?.message || "Registration failed";
            setError(message);
            throw err;
        }
    };

    const login = async (credentials: LoginCredentials): Promise<User> => {
        setError(null);
        try {
            await fetchCsrfToken();
            const response = await axiosClient.post<{
                data: { user: User; token: string };
            }>("/auth/login", credentials);
            const { user: loggedUser, token } = response.data.data;
            localStorage.setItem("auth_token", token);
            localStorage.setItem("auth_user_id", String(loggedUser.id));
            axiosClient.defaults.headers.common["Authorization"] =
                `Bearer ${token}`;
            setUser(loggedUser);
            return loggedUser;
        } catch (err: any) {
            const message = err.response?.data?.message || "Login failed";
            setError(message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await axiosClient.post("/auth/logout", {});
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user_id");
            delete axiosClient.defaults.headers.common["Authorization"];
            setUser(null);
            setError(null);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
}
