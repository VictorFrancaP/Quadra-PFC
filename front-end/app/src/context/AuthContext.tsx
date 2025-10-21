// Importa as funções principais do React
import { createContext, useState, useContext, useEffect } from "react";
// Importa o tipo 'ReactNode' para tipar o 'children'
import type { ReactNode } from "react";
// Importa o 'axios' para criar uma instância de API
import axios from "axios";
// Importa o 'useNavigate' para podermos redirecionar o usuário no logout
import { useNavigate } from "react-router-dom";

/**
 * Define a estrutura de dados do 'User'.
 * Exportar isso permite que outros componentes (como Setup2FA)
 * saibam qual é o formato de um usuário.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Cria uma instância global do Axios.
 * Configurar 'baseURL' evita repetir "http://localhost:3000" em todo canto.
 * 'withCredentials: true' é ESSENCIAL para que o front-end envie
 * os cookies (como o seu RefreshToken) para o back-end.
 */
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
    // Função interna assíncrona para buscar o refresh token
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
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
      navigate("/login");
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
