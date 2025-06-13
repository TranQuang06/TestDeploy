# Hướng dẫn sử dụng Social Media Dashboard

## 📋 Tổng quan

Bạn đã hoàn thành việc tích hợp Firebase với hệ thống social media dashboard. Dưới đây là hướng dẫn sử dụng các tính năng mới.

## 🚀 Các tính năng đã implement

### 1. **Cấu trúc Users Collection mới**
- ✅ Thông tin profile đầy đủ (avatar, bio, location, etc.)
- ✅ Privacy settings
- ✅ Activity stats (followers, posts, likes)
- ✅ Social links
- ✅ Notifications preferences

### 2. **Hệ thống Posts**
- ✅ Tạo posts với text và images
- ✅ Privacy settings (public, friends, private)
- ✅ Hashtags và mentions
- ✅ Like và comment system
- ✅ View posts feed với pagination

### 3. **Social Features**
- ✅ Follow/unfollow users
- ✅ Like posts
- ✅ Comment system (cơ bản)
- ✅ Activity tracking

### 4. **Admin Panel**
- ✅ Migration tools
- ✅ Users statistics
- ✅ Database management

## 📖 Cách sử dụng

### Bước 1: Chạy Migration (Chỉ một lần)

1. **Tạo admin user:**
   ```javascript
   // Trong Firebase Console, cập nhật user document:
   {
     role: "admin",
     // ... other user data
   }
   ```

2. **Truy cập Admin Panel:**
   - Đăng nhập với admin account
   - Vào `/Admin` 
   - Click tab "Migration"
   - Click "Chạy Migration" để thiết lập database

3. **Kiểm tra kết quả:**
   - Xem statistics trước và sau migration
   - Kiểm tra Collections mới trong Firebase Console

### Bước 2: Sử dụng Social Features

#### **Tạo Posts:**
1. Vào trang `/Social`
2. Trong ô "What are you thinking?", nhập nội dung
3. Click để mở modal tạo post
4. Thêm text, images, hashtags
5. Chọn privacy level
6. Click "Đăng"

#### **Tương tác với Posts:**
- **Like**: Click nút ❤️ trên bài viết
- **Comment**: Click "Bình luận" (sẽ expand trong future)
- **Share**: Click "Chia sẻ" (sẽ expand trong future)

#### **Follow Users:**
- Sử dụng API `toggleUserFollow(followerId, followingId)`
- Check follow status với `isUserFollowing(followerId, followingId)`

### Bước 3: Customize và Mở rộng

#### **Thêm features mới:**
```javascript
// Example: Thêm save post feature
import { addDoc, collection } from 'firebase/firestore';

const savePost = async (userId, postId) => {
  await addDoc(collection(db, 'saved_posts'), {
    userId,
    postId,
    createdAt: new Date().toISOString()
  });
};
```

#### **Custom UI components:**
- Tất cả components đã responsive
- CSS modules để dễ customize
- Theme colors trong CSS variables

## 🗂️ Collections Structure

### **users** (Optimized)
```javascript
{
  uid: "string",
  email: "string", 
  firstName: "string",
  lastName: "string",
  displayName: "string",
  avatar: "string",
  bio: "string",
  stats: {
    postCount: "number",
    followerCount: "number", 
    followingCount: "number"
  },
  privacySettings: {...},
  // ... nhiều fields khác
}
```

### **posts**
```javascript
{
  id: "string",
  authorId: "string",
  content: "string",
  type: "text|image|video",
  visibility: "public|friends|private",
  stats: {
    likeCount: "number",
    commentCount: "number",
    shareCount: "number"
  },
  createdAt: "string"
}
```

### **likes**, **comments**, **follows**
- Các collections support cho social features
- Optimized cho real-time queries

## 🛠️ API Usage Examples

### **Posts Management:**
```javascript
import { createPost, getPostsFeed, togglePostLike } from '../utils/socialMedia';

// Tạo post
const newPost = await createPost(userId, {
  content: "Hello World!",
  type: "text",
  visibility: "public"
});

// Lấy feed
const { posts, hasMore } = await getPostsFeed(userId, null, 10);

// Like post  
const { liked } = await togglePostLike(userId, postId);
```

### **User Management:**
```javascript
import { updateUserProfile } from '../contexts/AuthContext';

// Update profile
await updateUserProfile({
  bio: "New bio",
  location: {
    city: "Ho Chi Minh",
    country: "Vietnam"
  }
});
```

## 🔧 Troubleshooting

### **Migration Issues:**
- Ensure admin user has proper role
- Check Firebase console for errors
- Backup data before migration
- Run migration only once

### **Posts not showing:**
- Check user authentication
- Verify posts collection exists
- Check Firestore rules
- Ensure proper indexes

### **Performance Issues:**
- Enable Firestore offline persistence
- Implement image optimization
- Use pagination for large datasets
- Cache user profiles

## 📊 Monitoring

### **Firebase Console:**
- Monitor collection sizes
- Check query performance  
- Set up alerts for errors
- Review usage statistics

### **Admin Panel:**
- Users statistics
- Activity monitoring
- Database health checks

## 🚀 Next Steps

### **Immediate:**
1. Test all features thoroughly
2. Add more sample data
3. Customize UI themes
4. Set up production Firebase

### **Future Enhancements:**
1. **Real-time features:** WebRTC, live notifications
2. **Advanced search:** Full-text search, filters
3. **Media handling:** Video posts, image editing
4. **Analytics:** User behavior, engagement metrics
5. **Moderation:** Report system, content filtering

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Verify Firebase configuration
3. Check network connectivity
4. Review API documentation

---

**🎉 Chúc mừng! Social Media Platform của bạn đã sẵn sàng!**
