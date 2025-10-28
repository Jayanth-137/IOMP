import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
  };

  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`fixed top-20 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg border-l-4 shadow-lg ${styles[type]} max-w-md animate-slide-in`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
