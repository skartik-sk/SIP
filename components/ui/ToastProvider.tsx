import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ToastProvider } from 'react-native-toast-notifications';

export function ToastNotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider
      placement="top"
      duration={4000}
      animationType="slide-in"
      animationDuration={250}
      successColor="#10B981"
      dangerColor="#EF4444"
      warningColor="#F59E0B"
      normalColor="#3B82F6"
      successIcon={<Ionicons name="checkmark-circle" size={20} color="#fff" />}
      dangerIcon={<Ionicons name="close-circle" size={20} color="#fff" />}
      warningIcon={<Ionicons name="warning" size={20} color="#fff" />}
      textStyle={{
        fontSize: 14,
        fontFamily: 'SpaceMono',
        color: '#fff',
      }}
      offset={50}
      offsetTop={60}
      swipeEnabled={true}
    >
      {children}
    </ToastProvider>
  );
}
