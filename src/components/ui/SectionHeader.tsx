import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function SectionHeader({ title, subtitle, icon, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-xl bg-[var(--color-accent-glow)] text-[var(--color-accent)]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[var(--color-text-primary)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
