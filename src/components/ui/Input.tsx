import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[var(--color-text-muted)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-sm border border-[var(--color-border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-all placeholder:text-[var(--color-text-muted)] ${error ? "border-[var(--color-error)]" : ""} ${className}`}
          {...props}
        />
        {error && (
          <span className="text-[11px] text-[var(--color-error)]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
