import { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      <div className="toast-content">
        <span className="toast-icon">{type === 'error' ? '✕' : type === 'success' ? '✓' : 'ℹ'}</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

export default Toast;

