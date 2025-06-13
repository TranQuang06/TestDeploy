// Debug utility để kiểm tra chat data và khắc phục vấn đề last message
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { chatService } from "./chatService.js";

export const debugChatData = {
  // Kiểm tra dữ liệu chat cụ thể
  async inspectChat(chatId) {
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        console.log("📊 Chat Data:", {
          id: chatId,
          participants: chatData.participants,
          lastMessage: chatData.lastMessage,
          lastMessageTime: chatData.lastMessageTime,
          lastMessageSenderId: chatData.lastMessageSenderId,
          unreadCount: chatData.unreadCount,
          createdAt: chatData.createdAt,
        });

        // Lấy tin nhắn mới nhất từ subcollection
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);

        console.log("📨 Recent Messages:");
        snapshot.docs.forEach((doc, index) => {
          const msg = doc.data();
          console.log(
            `  ${index + 1}. [${msg.senderId}] ${msg.content} (${
              msg.timestamp?.toDate?.()?.toLocaleString() || "No timestamp"
            })`
          );
        });

        return chatData;
      } else {
        console.log("❌ Chat not found:", chatId);
        return null;
      }
    } catch (error) {
      console.error("❌ Error inspecting chat:", error);
    }
  },

  // Kiểm tra tất cả chats của user
  async inspectUserChats(userId) {
    try {
      console.log("🔍 Inspecting chats for user:", userId);

      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", userId)
      );

      const snapshot = await getDocs(q);
      console.log(`Found ${snapshot.docs.length} chats`);

      for (const doc of snapshot.docs) {
        await this.inspectChat(doc.id);
      }
    } catch (error) {
      console.error("❌ Error inspecting user chats:", error);
    }
  },

  // Sửa lastMessage data nếu bị lỗi
  async fixLastMessage(chatId) {
    try {
      console.log("🔧 Fixing last message for chat:", chatId);

      // Lấy tin nhắn mới nhất
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        const lastMessage = snapshot.docs[0].data();

        // Cập nhật chat document với last message đúng
        const chatRef = doc(db, "chats", chatId);
        await updateDoc(chatRef, {
          lastMessage: lastMessage.content,
          lastMessageTime: lastMessage.timestamp,
          lastMessageSenderId: lastMessage.senderId,
        });

        console.log("✅ Fixed last message:", {
          content: lastMessage.content,
          senderId: lastMessage.senderId,
          timestamp: lastMessage.timestamp?.toDate?.()?.toLocaleString(),
        });
      } else {
        console.log("⚠️ No messages found in chat");
      }
    } catch (error) {
      console.error("❌ Error fixing last message:", error);
    }
  },

  // Sửa tất cả chats của user
  async fixAllUserChats(userId) {
    try {
      console.log("🔧 Fixing all chats for user:", userId);

      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", userId)
      );

      const snapshot = await getDocs(q);

      for (const doc of snapshot.docs) {
        await this.fixLastMessage(doc.id);
      }

      console.log("✅ Fixed all chats");
    } catch (error) {
      console.error("❌ Error fixing all chats:", error);
    }
  },

  // Test gửi tin nhắn và kiểm tra update
  async testSendMessage(chatId, senderId, content) {
    console.log("🧪 Testing send message...");

    // Kiểm tra trước khi gửi
    await this.inspectChat(chatId);

    // Gửi tin nhắn
    await chatService.sendMessage(chatId, senderId, content);

    // Đợi một chút để data update
    setTimeout(async () => {
      console.log("📊 After sending message:");
      await this.inspectChat(chatId);
    }, 1000);
  },
};

// Export để sử dụng trong browser console
if (typeof window !== "undefined") {
  window.debugChatData = debugChatData;

  console.log("🔧 Chat debug utilities loaded!");
  console.log("Usage:");
  console.log('- debugChatData.inspectChat("chatId")');
  console.log('- debugChatData.inspectUserChats("userId")');
  console.log('- debugChatData.fixLastMessage("chatId")');
  console.log('- debugChatData.fixAllUserChats("userId")');
}
