import { Component } from 'react';

/**
 * Error Boundary — catches rendering errors in child components
 * and displays a graceful fallback UI instead of crashing the app.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, this would send to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <span className="error-boundary__icon">⚠️</span>
            <h2 className="error-boundary__title">Something went wrong</h2>
            <p className="error-boundary__message">
              We're sorry for the inconvenience. Please try again.
            </p>
            <button
              className="error-boundary__btn"
              onClick={this.handleRetry}
              type="button"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
