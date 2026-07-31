import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in DataTable application:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" role="alert">
          <div className="error-title">Something went wrong</div>
          <div className="error-message">
            {this.state.error?.message || 'An unexpected error occurred while rendering the data table.'}
          </div>
          <button className="btn btn-primary" onClick={this.handleReset}>
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
