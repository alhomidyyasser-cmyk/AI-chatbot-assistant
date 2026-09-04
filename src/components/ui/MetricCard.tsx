import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  accent?: boolean;
}

export default function MetricCard({ label, value, description, icon, accent = false }: MetricCardProps) {
  return (
    <div className="bg-[var(--color-surface-2)] p-4 border border-[var(--color-border-subtle)] rounded-xl flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-[var(--color-text-muted)]">
            {icon}
          </span>
        )}
        <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
          {label}
        </span>
      </div>
      <span className={`text-2xl font-bold font-mono ${accent ? "text-[var(--color-accent)]" : "text-[var(--color-text-primary)]"}`}>
        {value}
      </span>
      {description && (
        <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
          {description}
        </p>
      )}
    </div>
  );
}
