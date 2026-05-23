import { useToast } from '@/context';
import { Button } from './Button';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <span className="toast__message">{toast.message}</span>
          <Button
            variant="ghost"
            size="sm"
            className="toast__close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss"
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
};
