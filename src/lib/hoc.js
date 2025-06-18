import React, { memo, lazy, Suspense, forwardRef } from 'react';
import { performanceUtils } from './utils';
import Loading from '../components/ui/Loading';
import ErrorBoundary from '../components/ui/ErrorBoundary';

/**
 * Higher-Order Components for performance optimization
 */

/**
 * HOC for memoization with custom comparison
 * @param {React.Component} Component 
 * @param {Function} areEqual - Custom comparison function
 * @returns {React.Component}
 */
export const withMemo = (Component, areEqual = null) => {
  const MemoizedComponent = memo(Component, areEqual);
  MemoizedComponent.displayName = `withMemo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
};

/**
 * HOC for lazy loading with custom loading component
 * @param {Function} importFunc - Dynamic import function
 * @param {React.Component} LoadingComponent - Custom loading component
 * @returns {React.Component}
 */
export const withLazy = (importFunc, LoadingComponent = Loading.Page) => {
  const LazyComponent = lazy(importFunc);
  
  const WrappedComponent = forwardRef((props, ref) => (
    <ErrorBoundary>
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    </ErrorBoundary>
  ));
  
  WrappedComponent.displayName = 'LazyComponent';
  return WrappedComponent;
};

/**
 * HOC for debounced props
 * @param {React.Component} Component 
 * @param {string[]} debouncedProps - Props to debounce
 * @param {number} delay - Debounce delay
 * @returns {React.Component}
 */
export const withDebounce = (Component, debouncedProps = [], delay = 300) => {
  const DebouncedComponent = (props) => {
    const [debouncedValues, setDebouncedValues] = React.useState({});
    
    React.useEffect(() => {
      const timeouts = {};
      
      debouncedProps.forEach(prop => {
        if (props[prop] !== undefined) {
          timeouts[prop] = setTimeout(() => {
            setDebouncedValues(prev => ({
              ...prev,
              [prop]: props[prop]
            }));
          }, delay);
        }
      });
      
      return () => {
        Object.values(timeouts).forEach(clearTimeout);
      };
    }, debouncedProps.map(prop => props[prop]));
    
    const finalProps = {
      ...props,
      ...debouncedValues
    };
    
    return <Component {...finalProps} />;
  };
  
  DebouncedComponent.displayName = `withDebounce(${Component.displayName || Component.name})`;
  return DebouncedComponent;
};

/**
 * HOC for performance monitoring
 * @param {React.Component} Component 
 * @param {string} componentName - Name for monitoring
 * @returns {React.Component}
 */
export const withPerformanceMonitor = (Component, componentName) => {
  const MonitoredComponent = (props) => {
    const renderStartTime = React.useRef();
    
    React.useLayoutEffect(() => {
      renderStartTime.current = performance.now();
    });
    
    React.useEffect(() => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        if (renderTime > 16) { // More than one frame
          console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
      }
    });
    
    return <Component {...props} />;
  };
  
  MonitoredComponent.displayName = `withPerformanceMonitor(${Component.displayName || Component.name})`;
  return MonitoredComponent;
};

/**
 * HOC for intersection observer (lazy loading on scroll)
 * @param {React.Component} Component 
 * @param {Object} options - Intersection observer options
 * @returns {React.Component}
 */
export const withIntersectionObserver = (Component, options = {}) => {
  const ObservedComponent = (props) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasBeenVisible, setHasBeenVisible] = React.useState(false);
    const elementRef = React.useRef();
    
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting && !hasBeenVisible) {
            setHasBeenVisible(true);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
          ...options
        }
      );
      
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      
      return () => observer.disconnect();
    }, [hasBeenVisible]);
    
    if (!hasBeenVisible) {
      return (
        <div 
          ref={elementRef} 
          style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Loading />
        </div>
      );
    }
    
    return <Component {...props} isVisible={isVisible} />;
  };
  
  ObservedComponent.displayName = `withIntersectionObserver(${Component.displayName || Component.name})`;
  return ObservedComponent;
};

/**
 * HOC for error boundary with retry
 * @param {React.Component} Component 
 * @param {React.Component} FallbackComponent - Custom error fallback
 * @returns {React.Component}
 */
export const withErrorBoundary = (Component, FallbackComponent = null) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary fallback={FallbackComponent}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Compose multiple HOCs
 * @param {...Function} hocs - HOCs to compose
 * @returns {Function}
 */
export const compose = (...hocs) => (Component) => {
  return hocs.reduceRight((acc, hoc) => hoc(acc), Component);
};

/**
 * Common performance optimization HOC
 * Combines memo, error boundary, and performance monitoring
 * @param {React.Component} Component 
 * @param {Object} options - Configuration options
 * @returns {React.Component}
 */
export const withOptimization = (Component, options = {}) => {
  const {
    memo: enableMemo = true,
    errorBoundary = true,
    performanceMonitor = process.env.NODE_ENV === 'development',
    lazy = false,
    intersectionObserver = false,
    debounce = null
  } = options;
  
  let OptimizedComponent = Component;
  
  // Apply HOCs in order
  if (debounce) {
    OptimizedComponent = withDebounce(OptimizedComponent, debounce.props, debounce.delay);
  }
  
  if (enableMemo) {
    OptimizedComponent = withMemo(OptimizedComponent);
  }
  
  if (intersectionObserver) {
    OptimizedComponent = withIntersectionObserver(OptimizedComponent, intersectionObserver);
  }
  
  if (performanceMonitor) {
    OptimizedComponent = withPerformanceMonitor(OptimizedComponent, Component.displayName || Component.name);
  }
  
  if (errorBoundary) {
    OptimizedComponent = withErrorBoundary(OptimizedComponent);
  }
  
  return OptimizedComponent;
};
