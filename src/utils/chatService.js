import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Chat Service
export const chatService = {
  // Tạo hoặc lấy chat giữa 2 người
  async getOrCreateChat(currentUserId, otherUserId) {
    try {
      // Tìm chat đã tồn tại
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", currentUserId)
      );

      const snapshot = await getDocs(q);
      let existingChat = null;

      snapshot.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.participants.includes(otherUserId)) {
          existingChat = { id: doc.id, ...chatData };
        }
      });

      if (existingChat) {
        return existingChat;
      }
      // Tạo chat mới
      const newChatData = {
        participants: [currentUserId, otherUserId],
        lastMessage: "",
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: null,
        unreadCount: {
          [currentUserId]: 0,
          [otherUserId]: 0,
        },
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(chatsRef, newChatData);
      return { id: docRef.id, ...newChatData };
    } catch (error) {
      console.error("Error getting or creating chat:", error);
      throw error;
    }
  },

  // Lấy danh sách chat của user
  getUserChats(userId, callback) {
    try {
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", userId),
        orderBy("lastMessageTime", "desc")
      );

      return onSnapshot(q, callback);
    } catch (error) {
      console.error("Error getting user chats:", error);
      throw error;
    }
  },
  // Gửi tin nhắn
  async sendMessage(chatId, senderId, content, type = "text") {
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      const messageData = {
        senderId,
        content,
        type,
        timestamp: serverTimestamp(),
        read: false,
      };

      await addDoc(messagesRef, messageData);

      // Lấy thông tin chat để biết ai là người nhận
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const recipientId = chatData.participants.find((id) => id !== senderId);
        const currentUnreadCount = chatData.unreadCount?.[recipientId] || 0;

        // Cập nhật lastMessage và unreadCount cho chat
        await updateDoc(chatRef, {
          lastMessage: content,
          lastMessageTime: serverTimestamp(),
          lastMessageSenderId: senderId,
          [`unreadCount.${recipientId}`]: currentUnreadCount + 1,
          // Reset unread count cho người gửi
          [`unreadCount.${senderId}`]: 0,
        });

        console.log("Updated chat with last message:", {
          chatId,
          lastMessage: content,
          senderId,
          recipientId,
        });
      }

      return messageData;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Lấy tin nhắn của chat
  getChatMessages(chatId, callback) {
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      return onSnapshot(q, callback);
    } catch (error) {
      console.error("Error getting chat messages:", error);
      throw error;
    }
  },

  // Đánh dấu tin nhắn đã đọc
  async markMessagesAsRead(chatId, userId) {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  },

  // Cập nhật số tin nhắn chưa đọc
  async updateUnreadCount(chatId, recipientId) {
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const currentCount = chatDoc.data().unreadCount?.[recipientId] || 0;
        await updateDoc(chatRef, {
          [`unreadCount.${recipientId}`]: currentCount + 1,
        });
      }
    } catch (error) {
      console.error("Error updating unread count:", error);
      throw error;
    }
  }, // Lấy thông tin user
  async getUser(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Tạo tên hiển thị từ firstName và surname
        let displayName = "";
        if (userData.firstName && userData.surname) {
          displayName = `${userData.firstName} ${userData.surname}`;
        } else if (userData.firstName) {
          displayName = userData.firstName;
        } else if (userData.surname) {
          displayName = userData.surname;
        } else if (userData.name) {
          displayName = userData.name;
        } else {
          displayName = "Unknown User";
        }

        // Lấy avatar từ trường avatar, fallback về photoURL nếu không có
        const avatarUrl = userData.avatar || userData.photoURL || null;

        return {
          id: userSnap.id,
          ...userData,
          name: displayName, // Thêm trường name để compatibility
          displayName: displayName,
          photoURL: avatarUrl, // Đảm bảo có photoURL để compatibility
          avatar: avatarUrl,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },
  // Tìm kiếm users
  async searchUsers(searchTerm, currentUserId) {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const users = [];

      snapshot.forEach((doc) => {
        const userData = doc.data();

        // Tạo tên hiển thị để tìm kiếm
        let displayName = "";
        if (userData.firstName && userData.surname) {
          displayName = `${userData.firstName} ${userData.surname}`;
        } else if (userData.firstName) {
          displayName = userData.firstName;
        } else if (userData.surname) {
          displayName = userData.surname;
        } else if (userData.name) {
          displayName = userData.name;
        }
        // Tìm kiếm theo tên hiển thị, firstName, surname hoặc email
        if (
          doc.id !== currentUserId &&
          (displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userData.firstName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            userData.surname
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            userData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userData.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        ) {
          // Lấy avatar từ trường avatar, fallback về photoURL
          const avatarUrl = userData.avatar || userData.photoURL || null;

          users.push({
            id: doc.id,
            ...userData,
            name: displayName || "Unknown User",
            displayName: displayName || "Unknown User",
            photoURL: avatarUrl, // Để compatibility
            avatar: avatarUrl,
          });
        }
      });

      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },
  // Lấy danh sách bạn bè của user
  async getUserFriends(userId) {
    try {
      const friendsRef = collection(db, "friendships");
      const q = query(friendsRef, where("users", "array-contains", userId));
      const snapshot = await getDocs(q);

      const friends = [];
      for (const doc of snapshot.docs) {
        const friendship = doc.data();
        // Lấy ID của bạn (user khác trong mảng users)
        const friendId = friendship.users.find((id) => id !== userId);

        if (friendId) {
          // Lấy thông tin chi tiết của bạn
          const friendData = await this.getUser(friendId);
          if (friendData) {
            friends.push(friendData);
          }
        }
      }

      return friends;
    } catch (error) {
      console.error("Error getting user friends:", error);
      return [];
    }
  },

  // Tạo user mới
  async createUser(userId, userData) {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: userId, ...userData };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Tạo friendship giữa 2 users
  async createFriendship(userId1, userId2) {
    try {
      // Kiểm tra friendship đã tồn tại chưa
      const friendsRef = collection(db, "friendships");
      const q = query(friendsRef, where("users", "array-contains", userId1));
      const snapshot = await getDocs(q);

      let existingFriendship = null;
      snapshot.forEach((doc) => {
        const friendship = doc.data();
        if (friendship.users.includes(userId2)) {
          existingFriendship = { id: doc.id, ...friendship };
        }
      });

      if (existingFriendship) {
        console.log("Friendship already exists");
        return existingFriendship;
      }

      // Tạo friendship mới
      const friendshipData = {
        users: [userId1, userId2],
        status: "accepted", // accepted, pending, blocked
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(friendsRef, friendshipData);
      return { id: docRef.id, ...friendshipData };
    } catch (error) {
      console.error("Error creating friendship:", error);
      throw error;
    }
  },

  // Xóa friendship
  async removeFriendship(userId1, userId2) {
    try {
      const friendsRef = collection(db, "friendships");
      const q = query(friendsRef, where("users", "array-contains", userId1));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (doc) => {
        const friendship = doc.data();
        if (friendship.users.includes(userId2)) {
          await deleteDoc(doc.ref);
          console.log("Friendship removed");
        }
      });
    } catch (error) {
      console.error("Error removing friendship:", error);
      throw error;
    }
  },
};
