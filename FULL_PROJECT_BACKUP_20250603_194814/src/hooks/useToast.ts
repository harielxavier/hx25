import { useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastHook {
  toast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  toasts: Toast[];
}

export const useToast = (): ToastHook => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      type: options.type,
      message: options.message
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, options.duration || 3000);

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast
  };
};
