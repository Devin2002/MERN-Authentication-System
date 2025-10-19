import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const Alert = ({ type = 'success', message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slide-in max-w-md ${
        type === 'success'
          ? 'bg-green-500'
          : type === 'error'
          ? 'bg-red-500'
          : type === 'warning'
          ? 'bg-yellow-500'
          : 'bg-blue-500'
      } text-white`}
    >
      <div className="flex-shrink-0">
        {type === 'success' ? (
          <CheckCircle size={20} />
        ) : (
          <AlertCircle size={20} />
        )}
      </div>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-75 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Alert;