import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('orderStatusUpdate', (data) => {
      setOrderStatus(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinOrder = useCallback((orderId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinOrder', orderId);
    } else {
      socketRef.current?.once('connect', () => {
        socketRef.current.emit('joinOrder', orderId);
      });
    }
  }, []);

  return (
    <SocketContext.Provider value={{ orderStatus, joinOrder, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
