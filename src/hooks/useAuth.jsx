
import { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, mockCurrentUser } from '@/lib/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<UserProfile | null>(mockCurrentUser);

  const login = async (email, password) => {
    setUser(mockCurrentUser); // Mock login functionality
  };

  const logout = async () => {
    setUser(null); // Mock logout functionality
  };

  const register = async (email, password, name) => {
    setUser(mockCurrentUser); // Mock registration functionality
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
