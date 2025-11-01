import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Toast from './Toast';
import '../styles/ToastContainer.css';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = toastIdCounter++;
    const toast = { id, message, type, duration };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Make showToast globally available for API interceptor
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showToast = showToast;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.showToast;
      }
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback for when ToastProvider is not available
    return {
      showToast: (message, type = 'info', duration = 3000) => {
        console.warn('ToastProvider not found. Toast:', message);
      },
    };
  }
  return context;
};

// Export for backwards compatibility (deprecated, use useToast hook)
export const showToast = (message, type = 'info', duration = 3000) => {
  console.warn('showToast called outside of ToastProvider. Use useToast hook instead.');
  if (typeof window !== 'undefined' && window.showToast) {
    return window.showToast(message, type, duration);
  }
};

