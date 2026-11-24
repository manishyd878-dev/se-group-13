import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bloodbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('bloodbridge_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api
        .getMe()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('bloodbridge_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('bloodbridge_token', res.token);
      localStorage.setItem('bloodbridge_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('bloodbridge_token', res.token);
      localStorage.setItem('bloodbridge_user', JSON.stringify(res.user));
    }
    return res;
  };

  const loginWithGoogle = async (googlePayload) => {
    const res = await api.googleAuth(googlePayload);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('bloodbridge_token', res.token);
      localStorage.setItem('bloodbridge_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bloodbridge_token');
    localStorage.removeItem('bloodbridge_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
