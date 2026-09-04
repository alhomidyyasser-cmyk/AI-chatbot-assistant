import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "interactive";
}

export default function Card({ children, className = "", variant = "default" }: CardProps) {
  const baseStyles = "rounded-2xl border transition-all duration-200";

  const variants = {
    default: "bg-[var(--color-surface-1)] border-[var(--color-border-subtle)]",
    elevated: "bg-[var(--color-surface-2)] border-[var(--color-border-default)] shadow-lg shadow-black/20",
    interactive: "bg-[var(--color-surface-1)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] hover:bg-[var(--color-surface-2)]",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
