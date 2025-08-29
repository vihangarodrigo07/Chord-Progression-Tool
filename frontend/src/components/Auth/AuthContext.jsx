// src/components/Auth/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../../services/api';

// Create the context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    api.token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null)
  );

  useEffect(() => {
    if (token) {
      api.setToken(token);
      api.getCurrentUser().then(res => {
        if (res.success) setUser(res.user);
        else {
          setUser(null);
          api.clearToken();
          setToken(null);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      api.setToken(res.token);
      return { success: true };
    }
    return res;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
    api.clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);

// Default export (optional, mainly for wrapping App)
export default AuthProvider;
