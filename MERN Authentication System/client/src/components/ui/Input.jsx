import React from 'react';

const Input = ({ 
  icon: Icon, 
  error, 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-gray-50 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all ${
            error ? 'border-red-500' : 'border-gray-200'
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;