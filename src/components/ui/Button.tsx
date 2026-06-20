import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 font-bold border-4 border-black neo-shadow transition-all hover:-translate-y-1 hover:-translate-x-1 hover:neo-shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-wide";
  
  const variants = {
    primary: "bg-neo-yellow text-black",
    secondary: "bg-neo-blue text-black",
    outline: "bg-white text-black",
    danger: "bg-neo-pink text-black"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
