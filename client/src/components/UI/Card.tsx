import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className={`
        rounded-lg shadow-md p-4 
        ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} 
        ${onClick ? 'cursor-pointer transition-transform hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;