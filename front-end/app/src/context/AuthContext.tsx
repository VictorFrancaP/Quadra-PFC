import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  latitude?: number;
  longitude?: number;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND as string,
  withCredentials: true,
});

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user: User) => void;
  signOut: (shouldNavigate?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let isRefreshing = false;
let failedRequestsQueue: Array<{
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}> = [];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const signOut = useCallback(
    async (shouldNavigate = true) => {
      try {
        await api.post("/auth/user/logout");
      } catch (err: any) {
        console.error("Erro ao tentar deslogar no backend:", err.message);
      } finally {
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
        failedRequestsQueue = [];
        isRefreshing = false;
        if (shouldNavigate) navigate("/");
      }
    },
    [navigate]
  );

  useEffect(() => {
    const refreshAuthToken = async () => {
      try {
        const response = await api.post("/auth/refresh");
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      } catch (err: any) {
        signOut(false);
      } finally {
        setIsLoading(false);
      }
    };
    refreshAuthToken();
  }, [signOut]);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig;
        const status = error.response?.status;

        if (status === 401 && originalRequest.url !== "/auth/refresh") {
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const response = await api.post("/auth/refresh");
              const { token: newToken, user: newUser } = response.data;
              setToken(newToken);
              setUser(newUser);
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${newToken}`;

              failedRequestsQueue.forEach((request) =>
                request.onSuccess(newToken)
              );
              failedRequestsQueue = [];
              if (originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              }
              return api(originalRequest);
            } catch (refreshError: any) {
              console.error(
                "Interceptor: Refresh falhou. Deslogando usuário.",
                refreshError
              );
              failedRequestsQueue.forEach((request) =>
                request.onFailure(refreshError as AxiosError)
              );
              failedRequestsQueue = [];
              signOut(true);
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers["Authorization"] = `Bearer ${token}`;
                }
                resolve(api(originalRequest));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [signOut]);

  const signIn = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
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
