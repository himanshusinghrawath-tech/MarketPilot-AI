import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-3xl mx-auto my-12 rounded-xl bg-surface-container border border-error/40 text-on-surface">
          <div className="flex items-center gap-3 text-error mb-4">
            <span className="material-symbols-outlined text-3xl">error</span>
            <h2 className="text-xl font-bold">Analysis Rendering Notice</h2>
          </div>
          <p className="text-sm text-on-surface-variant mb-4">
            An unexpected error occurred while rendering the intelligence dashboard. You can return to new analysis or reload the dossier.
          </p>
          <pre className="p-4 rounded bg-surface-container-lowest text-xs font-mono text-error overflow-auto max-h-48 border border-surface-container-high mb-6">
            {this.state.error?.toString()}
          </pre>
          <div className="flex gap-4">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="px-4 py-2 rounded bg-primary text-on-primary font-bold text-xs"
            >
              Reset & Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-xs"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
