import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetCondition?: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors in its child component tree.
 * Displays a fallback UI instead of crashing the whole app.
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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props): void {
    // If resetCondition changes, reset the error state
    if (this.state.hasError && this.props.resetCondition !== prevProps.resetCondition) {
      this.setState({ hasError: false, error: null });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided, otherwise render default UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-8 max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md border border-red-100">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="text-red-500 h-12 w-12" />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-center">
            We're sorry, but there was an error loading this component.
          </p>
          <div className="text-gray-500 bg-gray-50 p-4 rounded-md mb-6 overflow-auto max-h-32">
            <code>{this.state.error?.toString() || 'Unknown error'}</code>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
