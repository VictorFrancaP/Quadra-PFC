import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    let newSocket: Socket | null = null;

    if (token) {
      console.log("Tentando conectar o socket...");
      newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', {
        auth: {
          token: token
        },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('Socket conectado:', newSocket?.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket desconectado:', reason);
        setIsConnected(false);
        setSocket(null);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Erro de conexão do socket:', error);
        setIsConnected(false);
      });

      newSocket.on('errorMessage', (data: { error: string }) => {
         console.error('Erro vindo do servidor via Socket:', data.error);
         alert(`Erro do Servidor: ${data.error}`);
      });


      setSocket(newSocket);
    } else {
      socket?.disconnect();
      setSocket(null);
      setIsConnected(false);
    }

    return () => {
      console.log("Desconectando o socket...");
      newSocket?.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket deve ser usado dentro de um SocketProvider');
  }
  return context;
};