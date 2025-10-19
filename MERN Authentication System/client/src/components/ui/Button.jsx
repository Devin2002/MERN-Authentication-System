import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  loading = false, 
  variant = 'primary', 
  fullWidth = true,
  type = 'button',
  onClick,
  disabled,
  ...props 
}) => {
  const baseClasses = 'py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
      {...props}
    >
      {loading && <Loader2 size={20} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;