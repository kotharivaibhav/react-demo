import { createContext } from 'react';
import type { ToastMessage, ToastType } from '@/types';

export type ToastContextValue = {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
