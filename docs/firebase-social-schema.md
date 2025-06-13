# Firebase Schema cho Social Media Dashboard

## 1. Collection: `users` (Tối ưu hóa)

```javascript
{
  // Basic Info
  uid: "string", // Firebase Auth UID
  email: "string",
  firstName: "string",
  lastName: "string", // Đổi từ 'surname' thành 'lastName'
  displayName: "string", // Auto-generated từ firstName + lastName
  
  // Profile Info
  avatar: "string", // URL to Firebase Storage
  coverPhoto: "string", // Cover photo URL
  bio: "string", // User bio/description
  dateOfBirth: "string", // ISO date format
  gender: "string", // "male", "female", "other", "prefer_not_to_say"
  location: {
    city: "string",
    country: "string",
    coordinates: { // Optional for location-based features
      lat: "number",
      lng: "number"
    }
  },
  
  // Professional Info
  profession: "string",
  company: "string",
  website: "string",
  workExperience: "string",
  
  // Contact Info
  phone: "string",
  socialLinks: {
    facebook: "string",
    twitter: "string",
    linkedin: "string",
    instagram: "string",
    github: "string"
  },
  
  // Privacy & Settings
  privacySettings: {
    profileVisibility: "string", // "public", "friends", "private"
    postDefaultVisibility: "string", // "public", "friends", "private"
    allowMessagesFrom: "string", // "everyone", "friends", "no_one"
    showEmail: "boolean",
    showPhone: "boolean",
    showLocation: "boolean"
  },
  
  // Activity Stats
  stats: {
    postCount: "number",
    followerCount: "number",
    followingCount: "number",
    friendCount: "number",
    likesReceived: "number",
    commentsReceived: "number"
  },
  
  // Account Status
  role: "string", // "user", "moderator", "admin"
  isVerified: "boolean", // Verified account badge
  isActive: "boolean",
  emailVerified: "boolean",
  profileComplete: "boolean",
  
  // Timestamps
  createdAt: "string", // ISO datetime
  updatedAt: "string", // ISO datetime
  lastActiveAt: "string", // ISO datetime
  
  // Additional Features
  interests: ["string"], // Array of user interests
  skills: ["string"], // Array of skills
  languages: ["string"], // Languages spoken
  timezone: "string",
  theme: "string", // "light", "dark", "auto"
  notifications: {
    email: "boolean",
    push: "boolean",
    likes: "boolean",
    comments: "boolean",
    follows: "boolean",
    messages: "boolean"
  }
}
```

## 2. Collection: `posts`

```javascript
{
  id: "string", // Auto-generated document ID
  authorId: "string", // User UID
  authorInfo: { // Denormalized data for performance
    displayName: "string",
    avatar: "string",
    isVerified: "boolean"
  },
  
  // Content
  content: "string", // Post text content
  type: "string", // "text", "image", "video", "link", "poll"
  
  // Media
  media: [
    {
      type: "string", // "image", "video"
      url: "string", // Firebase Storage URL
      thumbnailUrl: "string", // For videos
      caption: "string",
      altText: "string" // Accessibility
    }
  ],
  
  // Privacy & Visibility
  visibility: "string", // "public", "friends", "private"
  
  // Engagement
  stats: {
    likeCount: "number",
    commentCount: "number",
    shareCount: "number",
    viewCount: "number"
  },
  
  // Tags & Categories
  tags: ["string"], // Hashtags
  mentions: ["string"], // User IDs mentioned
  location: {
    name: "string",
    coordinates: {
      lat: "number",
      lng: "number"
    }
  },
  
  // Status
  isEdited: "boolean",
  isPinned: "boolean",
  isArchived: "boolean",
  
  // Timestamps
  createdAt: "string",
  updatedAt: "string",
  publishedAt: "string"
}
```

## 3. Collection: `comments`

```javascript
{
  id: "string",
  postId: "string", // Reference to post
  authorId: "string", // User UID
  authorInfo: { // Denormalized
    displayName: "string",
    avatar: "string"
  },
  
  content: "string",
  parentCommentId: "string", // For nested comments (null for top-level)
  
  stats: {
    likeCount: "number",
    replyCount: "number"
  },
  
  mentions: ["string"], // User IDs mentioned
  isEdited: "boolean",
  
  createdAt: "string",
  updatedAt: "string"
}
```

## 4. Collection: `likes`

```javascript
{
  id: "string",
  userId: "string", // User who liked
  targetType: "string", // "post", "comment"
  targetId: "string", // Post or comment ID
  createdAt: "string"
}
```

## 5. Collection: `follows`

```javascript
{
  id: "string",
  followerId: "string", // User who is following
  followingId: "string", // User being followed
  status: "string", // "active", "pending" (for private accounts)
  createdAt: "string"
}
```

## 6. Collection: `friendships`

```javascript
{
  id: "string",
  requester: "string", // User who sent friend request
  addressee: "string", // User who received request
  status: "string", // "pending", "accepted", "declined", "blocked"
  createdAt: "string",
  updatedAt: "string"
}
```

## 7. Collection: `notifications`

```javascript
{
  id: "string",
  recipientId: "string", // User receiving notification
  senderId: "string", // User who triggered notification
  senderInfo: { // Denormalized
    displayName: "string",
    avatar: "string"
  },
  
  type: "string", // "like", "comment", "follow", "friend_request", "mention", "post_share"
  message: "string", // Notification message
  
  relatedData: { // Context-specific data
    postId: "string",
    commentId: "string",
    // Other relevant IDs
  },
  
  isRead: "boolean",
  createdAt: "string"
}
```

## 8. Collection: `conversations`

```javascript
{
  id: "string",
  participants: ["string"], // Array of user IDs
  participantInfo: [ // Denormalized for UI
    {
      userId: "string",
      displayName: "string",
      avatar: "string",
      lastSeen: "string"
    }
  ],
  
  type: "string", // "direct", "group"
  name: "string", // For group chats
  avatar: "string", // For group chats
  
  lastMessage: {
    content: "string",
    senderId: "string",
    timestamp: "string",
    type: "string" // "text", "image", "file"
  },
  
  settings: {
    isArchived: "boolean",
    isMuted: "boolean",
    muteUntil: "string"
  },
  
  createdAt: "string",
  updatedAt: "string"
}
```

## 9. Collection: `messages`

```javascript
{
  id: "string",
  conversationId: "string",
  senderId: "string",
  content: "string",
  type: "string", // "text", "image", "file", "audio", "video"
  
  media: { // For non-text messages
    url: "string",
    filename: "string",
    fileSize: "number",
    mimeType: "string"
  },
  
  readBy: [ // For group chats
    {
      userId: "string",
      readAt: "string"
    }
  ],
  
  isEdited: "boolean",
  replyTo: "string", // Message ID if replying
  
  createdAt: "string",
  updatedAt: "string"
}
```

## 10. Collection: `user_settings`

```javascript
{
  userId: "string", // Document ID same as user UID
  
  // Privacy
  privacy: {
    profileVisibility: "string",
    postVisibility: "string",
    friendListVisibility: "string",
    lastSeenVisibility: "string",
    contactInfoVisibility: "string"
  },
  
  // Notifications
  notifications: {
    email: {
      enabled: "boolean",
      frequency: "string", // "immediate", "daily", "weekly", "never"
      types: ["string"] // Array of notification types
    },
    push: {
      enabled: "boolean",
      types: ["string"]
    }
  },
  
  // UI Preferences
  ui: {
    theme: "string", // "light", "dark", "auto"
    language: "string",
    timezone: "string",
    autoPlayVideos: "boolean",
    showOnlineStatus: "boolean"
  },
  
  // Block & Restrict
  blockedUsers: ["string"],
  restrictedUsers: ["string"],
  hiddenPosts: ["string"],
  
  updatedAt: "string"
}
```

## Indexes cần thiết cho Performance

```javascript
// Firestore Composite Indexes
{
  collection: "posts",
  fields: [
    { field: "authorId", order: "ASCENDING" },
    { field: "createdAt", order: "DESCENDING" }
  ]
},
{
  collection: "posts",
  fields: [
    { field: "visibility", order: "ASCENDING" },
    { field: "createdAt", order: "DESCENDING" }
  ]
},
{
  collection: "comments",
  fields: [
    { field: "postId", order: "ASCENDING" },
    { field: "createdAt", order: "ASCENDING" }
  ]
},
{
  collection: "notifications",
  fields: [
    { field: "recipientId", order: "ASCENDING" },
    { field: "isRead", order: "ASCENDING" },
    { field: "createdAt", order: "DESCENDING" }
  ]
}
```

## Migration Plan

1. **Phase 1**: Cập nhật collection `users` hiện có
2. **Phase 2**: Tạo collection `posts` 
3. **Phase 3**: Tạo các collection support (likes, comments, follows)
4. **Phase 4**: Implement messaging system
5. **Phase 5**: Add advanced features (notifications, settings)
