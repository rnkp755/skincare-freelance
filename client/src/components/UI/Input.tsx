import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  
  const inputClass = `
    rounded-lg px-4 py-2 w-full
    ${theme === 'dark' 
      ? 'bg-gray-700 text-white border-gray-600 focus:border-teal-400' 
      : 'bg-white text-gray-900 border-gray-300 focus:border-teal-500'
    }
    border focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${error ? 'border-red-500 focus:ring-red-200' : 'focus:ring-teal-200'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input className={inputClass} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;