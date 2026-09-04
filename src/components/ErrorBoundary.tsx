import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-surface-0)] flex items-center justify-center p-8">
          <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-2xl p-8 max-w-md w-full text-center flex flex-col gap-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-error)]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-error)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              حدث خطأ غير متوقع
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {this.state.error?.message || "حدث خطأ في التطبيق"}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-[var(--color-surface-0)] font-semibold text-sm hover:bg-[var(--color-accent-dim)] transition-colors"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
