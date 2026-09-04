import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ children, variant = "default", size = "sm", className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1 rounded-full font-mono font-medium";

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  const variants = {
    default: "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]",
    accent: "bg-[var(--color-accent-glow)] text-[var(--color-accent)] border border-[var(--color-accent-border)]",
    success: "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20",
    warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20",
    error: "bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20",
  };

  return (
    <span className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
