import { Component, type ErrorInfo, type ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Apricity failed to render", error, info);
  }

  private handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="app-crash-fallback" dir="rtl" lang="fa">
        <div className="app-crash-fallback__card">
          <div className="app-crash-fallback__icon" aria-hidden="true">🌱</div>
          <p className="eyebrow">یک لحظه...</p>
          <h1>باغت درست باز نشد</h1>
          <p>یک بار دوباره امتحان کنیم؟ اگر صفحه‌ی قدیمی مانده باشد، باغ خودش تازه می‌شود.</p>
          <button type="button" className="primary-button" onClick={this.handleRetry}>
            تلاش دوباره
          </button>
        </div>
      </main>
    );
  }
}
