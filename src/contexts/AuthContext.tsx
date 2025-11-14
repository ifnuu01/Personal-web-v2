import { createContext, useEffect, useState } from "react";
import type { AuthContextType, User, ValidationError } from "../types/type";
import apiClient from "../hooks/apiClient";
import { extractErrorMessage } from "../utils/errorHandler";

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<ValidationError | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                } catch (err) {
                    console.error("Token tidak valid atau user data rusak", err);
                    logout();
                }
            }

            setIsInitialized(true);
        };

        initializeAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post("/auth/login", { username, password });
            const { token, user, message } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setToken(token);
            setUser(user);
            return message;
        } catch (error: unknown) {
            setError(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };


    const value = {
        user,
        token,
        login,
        logout,
        error,
        loading,
        isInitialized
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider };