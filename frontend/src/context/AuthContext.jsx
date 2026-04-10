import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('pf_token');
        const savedUser = localStorage.getItem('pf_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
        setLoading(false);
    }, []);

    const login = (tokenVal, userData) => {
        setToken(tokenVal);
        setUser(userData);
        localStorage.setItem('pf_token', tokenVal);
        localStorage.setItem('pf_user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenVal}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('pf_token');
        localStorage.removeItem('pf_user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
