import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  withCredentials: true,
});

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAuthToken = async () => {
      try {
        const response = await api.post("/auth/refresh");

        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      } catch (err: any) {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    refreshAuthToken();
  }, []);

  const signIn = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const signOut = async () => {
    try {
      await api.post("/auth/user/logout");
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
      navigate("/");
    }
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    signIn,
    signOut,
  };
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
