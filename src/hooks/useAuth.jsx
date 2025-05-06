import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);

import { useNavigate } from 'react-router-dom';
import { login, register, getUserData } from '../api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserData(token)
        .then((userData) => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token); // Save token to localStorage
      setIsAuthenticated(true);
      setUser(data); // Save user data
      navigate('/profile'); // Navigate to the profile page after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Register function
  const handleRegister = async (email, password, name) => {
    try {
      const data = await register(email, password, name);
      localStorage.setItem('token', data.token); // Save token to localStorage
      setIsAuthenticated(true);
      setUser(data); // Save user data
      navigate('/profile');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login page
  };

  // Provide context to children
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, handleLogin, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
