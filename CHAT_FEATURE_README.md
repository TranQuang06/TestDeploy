# Chat Feature - Facebook Messenger Clone

Tính năng chat realtime tích hợp vào ứng dụng BWD 2025, với giao diện giống Facebook Messenger.

## ✨ Tính năng được cập nhật

- **Giao diện giống Messenger**: Layout 2 cột với danh sách chat và nội dung chat
- **Realtime messaging**: Tin nhắn được cập nhật theo thời gian thực  
- **Quản lý bạn bè**: Tab chuyển đổi giữa "Tin nhắn" và "Bạn bè"
- **Tìm kiếm người dùng**: Tìm kiếm để bắt đầu chat mới
- **Hiển thị đúng tên và avatar**: Lấy từ Firebase (firstName + surname, avatar)
- **Unread messages**: Hiển thị số tin nhắn chưa đọc với badge
- **Online status**: Hiển thị chấm xanh cho người dùng đang online
- **Responsive design**: Tương thích với các kích thước màn hình

## 🏗️ Cấu trúc Files Hoàn chỉnh

```
src/
├── components/
│   ├── ChatInterface/
│   │   ├── ChatInterface.js          # Component chính cho chat (Đã cập nhật)
│   │   └── ChatInterface.module.css  # Styles hoàn chỉnh (Đã cập nhật)
│   └── TabLeftSocial/
│       ├── TabLeftSocial.js          # Sidebar với nút Inbox (Đã cập nhật)
│       └── TabLeftSocial.module.css  # Styles cho sidebar (Đã cập nhật)
├── utils/
│   ├── chatService.js                # Service quản lý chat/messages (Đã hoàn thiện)
│   ├── testChatFunctions.js          # Functions để test chat (Mới)
│   └── createTestChats.js            # Script tạo dữ liệu test (Mới)
└── contexts/
    └── AuthContext.js                # Context quản lý authentication
```
{
  participants: ['userId1', 'userId2'],
  lastMessage: 'Tin nhắn cuối cùng',
  lastMessageTime: timestamp,
  unreadCount: {
    userId1: 0,
    userId2: 1
  },
  createdAt: timestamp
}
```

**Messages Subcollection** (`/chats/{chatId}/messages/{messageId}`):
```javascript
{
  senderId: 'userId',
  content: 'Nội dung tin nhắn',
  timestamp: timestamp,
  read: false,
  type: 'text'
}
```

**Users Collection** (`/users/{userId}`):
```javascript
{
  name: 'Tên người dùng',
  email: 'email@example.com',
  photoURL: 'URL avatar',
  isOnline: true,
  lastSeen: timestamp
}
```

### 🔐 Firestore Security Rules

```javascript
// Chat collections
match /chats/{chatId} {
  allow read, write: if isAuthenticated() && 
                        request.auth.uid in resource.data.participants;
  allow create: if isAuthenticated() && 
                   request.auth.uid in request.resource.data.participants;
  
  // Messages subcollection
  match /messages/{messageId} {
    allow read, write: if isAuthenticated() && 
                          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
    allow create: if isAuthenticated() && 
                     request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants &&
                     request.auth.uid == request.resource.data.senderId;
  }
}
```

### 🧪 Tạo data mẫu để test

1. Mở Developer Console trong browser
2. Chạy lệnh: `createSampleChatData()`
3. Hoặc import và chạy trong component:

```javascript
import { createSampleUsers, createSampleChats } from '../utils/createSampleChatUsers';

// Tạo users mẫu
await createSampleUsers();

// Tạo chats mẫu (cần có userId hiện tại)
await createSampleChats('currentUserId');
```

### 🎨 Customization

**Thay đổi màu sắc**:
- Chỉnh sửa CSS variables trong `ChatInterface.module.css`
- Màu chính: `#1877f2` (Facebook blue)
- Màu nền: `#f8f9fa`
- Màu text: `#050505`

**Thêm tính năng**:
- Gửi hình ảnh/file
- Emoji reactions
- Typing indicators
- Message status (sent/delivered/seen)

### 🚀 Deployment

1. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

2. Đảm bảo authentication được cấu hình đúng
3. Test chức năng trên production

### 🐛 Troubleshooting

**Lỗi thường gặp**:

1. **Không thể gửi tin nhắn**:
   - Kiểm tra Firestore rules
   - Đảm bảo user đã đăng nhập
   - Kiểm tra network connection

2. **Không hiển thị tin nhắn real-time**:
   - Kiểm tra Firebase config
   - Đảm bảo có internet connection
   - Kiểm tra browser console for errors

3. **Lỗi authentication**:
   - Đảm bảo user context được cấu hình đúng
   - Kiểm tra AuthContext provider

### 📝 Notes

- Chức năng này yêu cầu user phải đăng nhập
- Sử dụng Firebase Firestore để lưu trữ và đồng bộ data
- Tương thích với responsive design
- Có thể mở rộng thêm nhiều tính năng khác

### 🔄 Future Enhancements

- [ ] Push notifications
- [ ] Voice/Video call
- [ ] File sharing
- [ ] Group chat
- [ ] Message encryption
- [ ] Chat themes
- [ ] Message reactions
- [ ] Typing indicators
