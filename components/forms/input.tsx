import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, id, className, required, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-800"
      >
        {label}
        {required && <span className="ml-0.5 text-accent-dark">*</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helperText ? helpId : undefined}
        className={cn(
          'block w-full rounded-xl border bg-white px-4 py-3 text-base text-neutral-900 shadow-sm transition-colors',
          'placeholder:text-neutral-400',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-neutral-200 hover:border-neutral-300',
          className,
        )}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helpId} className="text-sm text-neutral-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
