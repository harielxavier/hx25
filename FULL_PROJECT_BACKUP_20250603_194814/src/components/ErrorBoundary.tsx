import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch JavaScript errors in child component tree
 * and display a fallback UI instead of crashing the whole application.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // You could also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-6 bg-red-50 border border-red-100 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-700 mb-4">
            We're sorry, but there was an error loading this component.
          </p>
          <details className="bg-white p-3 rounded border border-red-200">
            <summary className="cursor-pointer text-red-600 font-medium">
              Error details
            </summary>
            <pre className="mt-2 text-sm overflow-auto p-2 bg-gray-50">
              {this.state.error?.toString() || 'Unknown error'}
            </pre>
          </details>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
