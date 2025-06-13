import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Tạo chat mẫu để test
export const createSampleChats = async (currentUserId) => {
  try {
    console.log("Creating sample chats for user:", currentUserId);

    // Tạo một số users mẫu trước
    const sampleUsers = [
      {
        id: "sample_user_chat_1",
        firstName: "Nguyễn",
        surname: "Văn An",
        email: "nguyenvanan@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
        role: "job_seeker",
      },
      {
        id: "sample_user_chat_2",
        firstName: "Trần",
        surname: "Thị Linh",
        email: "tranthilinh@example.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b1d7?w=150&h=150&fit=crop&crop=face",
        isOnline: false,
        role: "job_seeker",
      },
    ];

    // Tạo users trong Firebase
    for (const userData of sampleUsers) {
      const displayName = `${userData.firstName} ${userData.surname}`;
      const userRef = doc(db, "users", userData.id);

      await setDoc(userRef, {
        ...userData,
        name: displayName,
        displayName: displayName,
        createdAt: new Date(),
        lastSeen: new Date(),
        emailVerified: true,
        profileComplete: true,
      });

      console.log(`Created sample user: ${displayName}`);
    }

    // Tạo chats với users mẫu
    const chats = [];

    for (const sampleUser of sampleUsers) {
      const chatData = {
        participants: [currentUserId, sampleUser.id],
        lastMessage: `Chào bạn! Tôi là ${sampleUser.firstName}`,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: sampleUser.id,
        unreadCount: {
          [currentUserId]: 1,
          [sampleUser.id]: 0,
        },
        createdAt: serverTimestamp(),
      };

      const chatsRef = collection(db, "chats");
      const docRef = await addDoc(chatsRef, chatData);

      console.log(`Created chat with ${sampleUser.firstName}: ${docRef.id}`);

      // Tạo tin nhắn mẫu trong chat
      const messagesRef = collection(db, "chats", docRef.id, "messages");
      await addDoc(messagesRef, {
        senderId: sampleUser.id,
        content: `Chào bạn! Tôi là ${sampleUser.firstName}`,
        type: "text",
        timestamp: serverTimestamp(),
        read: false,
      });

      chats.push({ id: docRef.id, ...chatData });
    }

    console.log("Sample chats created successfully!");
    return chats;
  } catch (error) {
    console.error("Error creating sample chats:", error);
    throw error;
  }
};

// Tạo friendships để có thể chat
export const createSampleFriendships = async (currentUserId) => {
  try {
    console.log("Creating sample friendships for user:", currentUserId);

    const friendIds = ["sample_user_chat_1", "sample_user_chat_2"];

    for (const friendId of friendIds) {
      const friendshipData = {
        users: [currentUserId, friendId],
        status: "accepted",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const friendshipsRef = collection(db, "friendships");
      await addDoc(friendshipsRef, friendshipData);

      console.log(`Created friendship: ${currentUserId} - ${friendId}`);
    }

    console.log("Sample friendships created successfully!");
  } catch (error) {
    console.error("Error creating sample friendships:", error);
    throw error;
  }
};
