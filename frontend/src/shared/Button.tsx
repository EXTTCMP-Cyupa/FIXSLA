import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ label, variant = 'primary', style, ...props }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

  const variantClasses = {
    primary: 'border border-transparent bg-blue-600 text-slate-50 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    ghost: 'border border-dashed border-slate-300 bg-transparent text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800',
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]}`}
      style={{
        ...style,
      }}
    >
      {label}
    </button>
  );
}
