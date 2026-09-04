import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-3)] text-[var(--color-text-muted)] flex items-center justify-center">
          {icon}
        </div>
      )}
      <div>
        <h4 className="text-sm font-semibold text-[var(--color-text-secondary)]">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-[var(--color-text-muted)] max-w-xs mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
