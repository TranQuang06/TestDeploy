// Application Constants
export const APP_CONFIG = {
  name: 'BWD 2025',
  description: 'Professional Job Portal & CV Builder',
  version: '1.0.0',
  author: 'BWD Team',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

// API Endpoints
export const API_ENDPOINTS = {
  ADZUNA: '/api/adzuna',
  GEMINI: '/api/gemini',
  NEWS: '/api/news',
  POPULAR_BLOGS: '/api/popular-blogs',
  ELEVENLABS_TTS: '/api/elevenlabs-tts',
};

// Firebase Collections
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  JOBS: 'jobs',
  COMMENTS: 'comments',
  LIKES: 'likes',
  SAVES: 'saves',
  CHATS: 'chats',
  MESSAGES: 'messages',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  RECRUITER: 'recruiter',
  EMPLOYER: 'employer',
};

// Post Types
export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  JOB: 'job',
  ARTICLE: 'article',
};

// Post Visibility
export const POST_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  FRIENDS: 'friends',
};

// Job Status
export const JOB_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
  DRAFT: 'draft',
};

// CV Template Categories
export const CV_CATEGORIES = {
  MODERN: 'modern',
  CLASSIC: 'classic',
  CREATIVE: 'creative',
  PROFESSIONAL: 'professional',
  MINIMAL: 'minimal',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  POSTS_PER_PAGE: 5,
  JOBS_PER_PAGE: 12,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Animation Durations
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (matching CSS)
export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
};

// Colors (matching CSS variables)
export const COLORS = {
  PRIMARY: '#ff6701',
  SECONDARY: '#fea82f',
  HOVER: '#ffc288',
  LIGHT: '#fcecdd',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  INFO: '#1890ff',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'bwd_user_preferences',
  THEME: 'bwd_theme',
  LANGUAGE: 'bwd_language',
  RECENT_SEARCHES: 'bwd_recent_searches',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  UPLOAD_ERROR: 'Lỗi tải file. Vui lòng thử lại.',
  GENERIC_ERROR: 'Có lỗi xảy ra. Vui lòng thử lại.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Lưu thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  UPLOAD_SUCCESS: 'Tải lên thành công!',
  SEND_SUCCESS: 'Gửi thành công!',
};
