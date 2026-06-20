import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="font-bold text-sm uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 border-4 border-black bg-white text-black font-medium neo-shadow-sm focus:outline-none focus:neo-shadow-lg transition-all ${error ? 'border-neo-pink' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-bold text-neo-pink">{error}</p>}
    </div>
  );
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="font-bold text-sm uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full px-4 py-3 border-4 border-black bg-white text-black font-medium neo-shadow-sm focus:outline-none focus:neo-shadow-lg transition-all resize-none ${error ? 'border-neo-pink' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-bold text-neo-pink">{error}</p>}
    </div>
  );
};
