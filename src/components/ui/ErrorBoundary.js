import React from 'react';
import { Button, Result } from 'antd';
import { errorUtils } from '../../lib/utils';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error,
      errorInfo
    });

    // Log to console and error tracking service
    errorUtils.logError(error, 'ErrorBoundary');
    
    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <Result
            status="error"
            title="Oops! Có lỗi xảy ra"
            subTitle={
              process.env.NODE_ENV === 'development' 
                ? this.state.error?.message 
                : "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại."
            }
            extra={[
              <Button type="primary" key="retry" onClick={this.handleRetry}>
                Thử lại
              </Button>,
              <Button key="home" onClick={() => window.location.href = '/'}>
                Về trang chủ
              </Button>,
            ]}
          />
          
          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ 
              whiteSpace: 'pre-wrap', 
              margin: '20px',
              padding: '20px',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Chi tiết lỗi (Development only)
              </summary>
              <div style={{ marginTop: '10px' }}>
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                <br />
                <strong>Stack trace:</strong>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with Error Boundary
 */
export const withErrorBoundary = (Component, fallback = null) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Simple Error Fallback Component
 */
export const SimpleErrorFallback = ({ error, resetError }) => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center',
    border: '1px solid #ff4d4f',
    borderRadius: '4px',
    background: '#fff2f0'
  }}>
    <h3 style={{ color: '#ff4d4f' }}>Có lỗi xảy ra</h3>
    <p>{error?.message || 'Lỗi không xác định'}</p>
    {resetError && (
      <Button type="primary" onClick={resetError}>
        Thử lại
      </Button>
    )}
  </div>
);

export default ErrorBoundary;
