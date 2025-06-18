// Type definitions for the application
// Note: These are JSDoc type definitions for better IDE support

/**
 * @typedef {Object} User
 * @property {string} uid - User ID
 * @property {string} email - User email
 * @property {string} displayName - User display name
 * @property {string} photoURL - User photo URL
 * @property {string} role - User role (admin, user, recruiter, employer)
 * @property {boolean} isAdmin - Admin status
 * @property {string[]} permissions - User permissions
 * @property {Object} profile - User profile data
 * @property {Date} createdAt - Account creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Post
 * @property {string} id - Post ID
 * @property {string} userId - Author user ID
 * @property {string} content - Post content
 * @property {string} type - Post type (text, image, video, job, article)
 * @property {string} visibility - Post visibility (public, private, friends)
 * @property {string[]} images - Array of image URLs
 * @property {Object} metadata - Additional metadata
 * @property {number} likesCount - Number of likes
 * @property {number} commentsCount - Number of comments
 * @property {number} sharesCount - Number of shares
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Job
 * @property {string} id - Job ID
 * @property {string} title - Job title
 * @property {string} company - Company name
 * @property {string} location - Job location
 * @property {string} description - Job description
 * @property {string[]} requirements - Job requirements
 * @property {string} salary - Salary information
 * @property {string} type - Job type (full-time, part-time, contract, internship)
 * @property {string} level - Job level (entry, mid, senior, executive)
 * @property {string[]} skills - Required skills
 * @property {string} status - Job status (active, inactive, expired, draft)
 * @property {string} employerId - Employer user ID
 * @property {Date} deadline - Application deadline
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Comment
 * @property {string} id - Comment ID
 * @property {string} postId - Post ID
 * @property {string} userId - Commenter user ID
 * @property {string} content - Comment content
 * @property {string} parentId - Parent comment ID (for replies)
 * @property {number} likesCount - Number of likes
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} CVTemplate
 * @property {string} id - Template ID
 * @property {string} name - Template name
 * @property {string} category - Template category
 * @property {string} thumbnail - Template thumbnail URL
 * @property {Object} structure - Template structure
 * @property {boolean} isPremium - Premium status
 * @property {number} downloads - Download count
 * @property {number} rating - Average rating
 */

/**
 * @typedef {Object} CVData
 * @property {string} fullname - Full name
 * @property {string} position - Position/Title
 * @property {string} photo - Photo URL
 * @property {string} objective - Career objective
 * @property {PersonalInfo} personal - Personal information
 * @property {Education[]} education - Education history
 * @property {Experience[]} experience - Work experience
 * @property {Activity[]} activities - Activities
 * @property {Certificate[]} certificates - Certificates
 * @property {Reference[]} references - References
 * @property {Award[]} awards - Awards
 * @property {string} extraInfo - Additional information
 */

/**
 * @typedef {Object} PersonalInfo
 * @property {string} phone - Phone number
 * @property {string} email - Email address
 * @property {string} address - Address
 * @property {string} website - Website URL
 * @property {string} linkedin - LinkedIn profile
 * @property {string} github - GitHub profile
 */

/**
 * @typedef {Object} Education
 * @property {string} school - School name
 * @property {string} degree - Degree
 * @property {string} field - Field of study
 * @property {string} startDate - Start date
 * @property {string} endDate - End date
 * @property {string} description - Description
 */

/**
 * @typedef {Object} Experience
 * @property {string} company - Company name
 * @property {string} position - Position
 * @property {string} startDate - Start date
 * @property {string} endDate - End date
 * @property {string} description - Job description
 * @property {string[]} achievements - Key achievements
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Success status
 * @property {*} data - Response data
 * @property {string} message - Response message
 * @property {string} error - Error message (if any)
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 * @property {string} sortBy - Sort field
 * @property {string} sortOrder - Sort order (asc, desc)
 */

/**
 * @typedef {Object} SearchParams
 * @property {string} query - Search query
 * @property {string[]} filters - Applied filters
 * @property {string} category - Category filter
 * @property {string} location - Location filter
 * @property {PaginationParams} pagination - Pagination params
 */

// Export empty object to make this a module
export {};
