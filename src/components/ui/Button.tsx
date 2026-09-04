import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  icon,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-sm px-5 py-2.5",
  };

  const variants = {
    primary: "bg-[var(--color-accent)] text-[var(--color-surface-0)] hover:bg-[var(--color-accent-dim)] shadow-lg shadow-[var(--color-accent)]/20",
    secondary: "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-4)] hover:text-[var(--color-text-primary)]",
    ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text-primary)]",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
