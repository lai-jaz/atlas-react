
import { createContext, useContext, useState } from 'react';
import { mockCurrentUser } from '@/lib/mockData.js'; 
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(mockCurrentUser); 

  const login = async (email, password) => {
    setUser(mockCurrentUser); // Simulate login by setting mock user
  };

  const logout = async () => {
    setUser(null); // Simulate logout by setting user to null
  };

  const register = async (email, password, name) => {
    setUser(mockCurrentUser); // Simulate registration by setting mock user
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
