/**
 * Analytics and Web Vitals monitoring
 */

// Web Vitals tracking
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // Log to console in development
    console.log('Web Vital:', metric);
    
    // Send to analytics service
    // Example: Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        custom_map: { metric_id: 'custom_metric' },
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
    
    // Send to custom analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch(console.error);
    }
  }
}

// Performance monitoring utilities
export const performanceMonitor = {
  /**
   * Mark the start of a performance measurement
   * @param {string} name - Name of the measurement
   */
  markStart: (name) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`);
    }
  },

  /**
   * Mark the end of a performance measurement and log the duration
   * @param {string} name - Name of the measurement
   */
  markEnd: (name) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = window.performance.getEntriesByName(name)[0];
      if (measure) {
        console.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
        
        // Send to analytics if duration is significant
        if (measure.duration > 100) {
          reportCustomMetric('performance_timing', {
            name,
            duration: measure.duration,
            url: window.location.href,
          });
        }
      }
    }
  },

  /**
   * Measure the execution time of a function
   * @param {string} name - Name of the measurement
   * @param {Function} fn - Function to measure
   * @returns {*} - Result of the function
   */
  measureFunction: async (name, fn) => {
    performanceMonitor.markStart(name);
    try {
      const result = await fn();
      return result;
    } finally {
      performanceMonitor.markEnd(name);
    }
  },

  /**
   * Get current performance metrics
   * @returns {Object} - Performance metrics
   */
  getMetrics: () => {
    if (typeof window === 'undefined' || !window.performance) {
      return {};
    }

    const navigation = window.performance.getEntriesByType('navigation')[0];
    const paint = window.performance.getEntriesByType('paint');
    
    return {
      // Navigation timing
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      
      // Paint timing
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
      
      // Memory (if available)
      memory: window.performance.memory ? {
        used: window.performance.memory.usedJSHeapSize,
        total: window.performance.memory.totalJSHeapSize,
        limit: window.performance.memory.jsHeapSizeLimit,
      } : null,
    };
  },
};

// Custom metric reporting
export function reportCustomMetric(eventName, data) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/custom-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          data,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(console.error);
    }
  }
}

// Error tracking
export function reportError(error, context = {}) {
  console.error('Application Error:', error, context);
  
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(console.error);
    }
  }
}

// Page view tracking
export function trackPageView(url) {
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_location: url,
      });
    }
    
    // Custom analytics
    reportCustomMetric('page_view', {
      url,
      referrer: document.referrer,
      timestamp: Date.now(),
    });
  }
}

// User interaction tracking
export function trackEvent(action, category = 'User Interaction', label = '', value = 0) {
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
    
    // Custom analytics
    reportCustomMetric('user_event', {
      action,
      category,
      label,
      value,
    });
  }
}

// Resource loading monitoring
export function monitorResourceLoading() {
  if (typeof window !== 'undefined' && window.performance) {
    // Monitor large resources
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.transferSize > 100000) { // > 100KB
          console.warn(`Large resource loaded: ${entry.name} (${(entry.transferSize / 1024).toFixed(2)}KB)`);
          
          reportCustomMetric('large_resource', {
            name: entry.name,
            size: entry.transferSize,
            duration: entry.duration,
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
}

// Initialize monitoring
export function initializeAnalytics() {
  if (typeof window !== 'undefined') {
    // Start resource monitoring
    monitorResourceLoading();
    
    // Track initial page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = performanceMonitor.getMetrics();
        reportCustomMetric('page_load_metrics', metrics);
      }, 0);
    });
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      trackEvent('page_visibility_change', 'Engagement', document.visibilityState);
    });
  }
}
