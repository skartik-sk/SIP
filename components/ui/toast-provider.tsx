import React, { createContext, ReactNode, useContext } from 'react';
import { Alert } from 'react-native';

interface ToastContextType {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const show = (message: string) => {
    Alert.alert('Notification', message);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
