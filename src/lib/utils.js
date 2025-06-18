import { COLORS, ANIMATION, ERROR_MESSAGES } from '../constants';

/**
 * Utility functions for the application
 */

// String utilities
export const stringUtils = {
  /**
   * Capitalize first letter of string
   * @param {string} str 
   * @returns {string}
   */
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert string to slug
   * @param {string} str 
   * @returns {string}
   */
  slugify: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Truncate string with ellipsis
   * @param {string} str 
   * @param {number} length 
   * @returns {string}
   */
  truncate: (str, length = 100) => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
  },

  /**
   * Remove HTML tags from string
   * @param {string} html 
   * @returns {string}
   */
  stripHtml: (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  },
};

// Date utilities
export const dateUtils = {
  /**
   * Format date to readable string
   * @param {Date|string} date 
   * @param {string} locale 
   * @returns {string}
   */
  formatDate: (date, locale = 'vi-VN') => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Format date to relative time (e.g., "2 hours ago")
   * @param {Date|string} date 
   * @returns {string}
   */
  formatRelativeTime: (date) => {
    if (!date) return '';
    const now = new Date();
    const dateObj = new Date(date);
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
    return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
  },

  /**
   * Check if date is today
   * @param {Date|string} date 
   * @returns {boolean}
   */
  isToday: (date) => {
    if (!date) return false;
    const today = new Date();
    const dateObj = new Date(date);
    return dateObj.toDateString() === today.toDateString();
  },
};

// Array utilities
export const arrayUtils = {
  /**
   * Remove duplicates from array
   * @param {Array} arr 
   * @param {string} key - Key to compare for objects
   * @returns {Array}
   */
  removeDuplicates: (arr, key = null) => {
    if (!Array.isArray(arr)) return [];
    if (key) {
      const seen = new Set();
      return arr.filter(item => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      });
    }
    return [...new Set(arr)];
  },

  /**
   * Chunk array into smaller arrays
   * @param {Array} arr 
   * @param {number} size 
   * @returns {Array[]}
   */
  chunk: (arr, size) => {
    if (!Array.isArray(arr) || size <= 0) return [];
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  /**
   * Shuffle array
   * @param {Array} arr 
   * @returns {Array}
   */
  shuffle: (arr) => {
    if (!Array.isArray(arr)) return [];
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
};

// Object utilities
export const objectUtils = {
  /**
   * Deep clone object
   * @param {Object} obj 
   * @returns {Object}
   */
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => objectUtils.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      Object.keys(obj).forEach(key => {
        cloned[key] = objectUtils.deepClone(obj[key]);
      });
      return cloned;
    }
  },

  /**
   * Check if object is empty
   * @param {Object} obj 
   * @returns {boolean}
   */
  isEmpty: (obj) => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
  },

  /**
   * Pick specific keys from object
   * @param {Object} obj 
   * @param {string[]} keys 
   * @returns {Object}
   */
  pick: (obj, keys) => {
    if (!obj || !Array.isArray(keys)) return {};
    const result = {};
    keys.forEach(key => {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  },
};

// Validation utilities
export const validationUtils = {
  /**
   * Validate email format
   * @param {string} email 
   * @returns {boolean}
   */
  isValidEmail: (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (Vietnamese format)
   * @param {string} phone 
   * @returns {boolean}
   */
  isValidPhone: (phone) => {
    if (!phone) return false;
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Validate URL format
   * @param {string} url 
   * @returns {boolean}
   */
  isValidUrl: (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// File utilities
export const fileUtils = {
  /**
   * Format file size to readable string
   * @param {number} bytes 
   * @returns {string}
   */
  formatFileSize: (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Get file extension
   * @param {string} filename 
   * @returns {string}
   */
  getFileExtension: (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  },

  /**
   * Check if file is image
   * @param {File|string} file 
   * @returns {boolean}
   */
  isImage: (file) => {
    if (!file) return false;
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const extension = typeof file === 'string' 
      ? fileUtils.getFileExtension(file)
      : fileUtils.getFileExtension(file.name);
    return imageTypes.includes(extension);
  },
};

// Performance utilities
export const performanceUtils = {
  /**
   * Debounce function
   * @param {Function} func 
   * @param {number} wait 
   * @returns {Function}
   */
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   * @param {Function} func 
   * @param {number} limit 
   * @returns {Function}
   */
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
};

// Error handling utilities
export const errorUtils = {
  /**
   * Get user-friendly error message
   * @param {Error|string} error 
   * @returns {string}
   */
  getErrorMessage: (error) => {
    if (!error) return ERROR_MESSAGES.GENERIC_ERROR;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return ERROR_MESSAGES.GENERIC_ERROR;
  },

  /**
   * Log error with context
   * @param {Error} error 
   * @param {string} context 
   */
  logError: (error, context = '') => {
    console.error(`[${context}] Error:`, error);
    // Here you could send to error tracking service
  },
};
