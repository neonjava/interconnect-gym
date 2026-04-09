import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sa_user')) || null; }
        catch { return null; }
    });
    const [loading, setLoading] = useState(false);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            const { user: u, accessToken } = data.data;
            localStorage.setItem('sa_user', JSON.stringify(u));
            localStorage.setItem('sa_access_token', accessToken);
            setUser(u);
            toast.success(`Welcome back, ${u.name.split(' ')[0]}! 👋`);
            return u;
        } finally { setLoading(false); }
    }, []);

    const register = useCallback(async (formData) => {
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', formData);
            const { user: u, accessToken } = data.data;
            localStorage.setItem('sa_user', JSON.stringify(u));
            localStorage.setItem('sa_access_token', accessToken);
            setUser(u);
            toast.success('Account created! Welcome to Strength Arena 🏋️');
            return u;
        } finally { setLoading(false); }
    }, []);

    const logout = useCallback(async () => {
        try { await api.post('/auth/logout'); } catch { /* ignore */ }
        localStorage.removeItem('sa_user');
        localStorage.removeItem('sa_access_token');
        setUser(null);
        toast.success('Logged out successfully.');
    }, []);

    const updateUser = useCallback((updates) => {
        setUser((prev) => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('sa_user', JSON.stringify(updated));
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
