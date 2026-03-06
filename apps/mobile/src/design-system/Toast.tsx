import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors } from './Colors';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ show: () => {} });

export const useToast = () => useContext(ToastContext);

const toastColors: Record<ToastType, string> = {
  success: Colors.success,
  error: Colors.error,
  info: Colors.primary[600],
};

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map(toast => (
          <TouchableOpacity
            key={toast.id}
            style={[styles.toast, { backgroundColor: toastColors[toast.type] }]}
            onPress={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          >
            <Text style={styles.text}>{toast.message}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function Toast() {
  return null; // Rendered by ToastProvider
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});
