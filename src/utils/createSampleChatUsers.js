import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const sampleUsers = [
  {
    id: "user1",
    name: "Hoàng Bảo",
    email: "hoangbao@example.com",
    photoURL: "https://i.pravatar.cc/150?img=1",
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: "user2",
    name: "Cô Hòn Sông",
    email: "cohonsong@example.com",
    photoURL: "https://i.pravatar.cc/150?img=2",
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "user3",
    name: "Toan Dang",
    email: "toandang@example.com",
    photoURL: "https://i.pravatar.cc/150?img=3",
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: "user4",
    name: "Nguyễn Vũ",
    email: "nguyenvu@example.com",
    photoURL: "https://i.pravatar.cc/150?img=4",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000), // 30 minutes ago
  },
  {
    id: "user5",
    name: "Trần Lê",
    email: "tranle@example.com",
    photoURL: "https://i.pravatar.cc/150?img=5",
    isOnline: true,
    lastSeen: new Date(),
  },
];

export const createSampleUsers = async () => {
  console.log("Creating sample users for chat testing...");

  try {
    for (const user of sampleUsers) {
      const userRef = doc(db, "users", user.id);
      await setDoc(
        userRef,
        {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true }
      );

      console.log(`Created user: ${user.name}`);
    }

    console.log("✅ Sample users created successfully!");
    console.log("You can now test the chat feature with these users.");
  } catch (error) {
    console.error("❌ Error creating sample users:", error);
  }
};

// Sample chats
export const createSampleChats = async (currentUserId) => {
  if (!currentUserId) {
    console.log("Please provide current user ID");
    return;
  }

  console.log("Creating sample chats...");

  try {
    // Create sample chats with current user
    const sampleChats = [
      {
        participants: [currentUserId, "user1"],
        lastMessage: "Chào bạn, bạn có khỏe không?",
        lastMessageTime: new Date(Date.now() - 300000), // 5 minutes ago
        unreadCount: {
          [currentUserId]: 1,
          user1: 0,
        },
      },
      {
        participants: [currentUserId, "user2"],
        lastMessage: "Cảm ơn bạn đã chia sẻ!",
        lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
        unreadCount: {
          [currentUserId]: 0,
          user2: 0,
        },
      },
    ];

    for (const chat of sampleChats) {
      const chatRef = await addDoc(collection(db, "chats"), {
        ...chat,
        createdAt: new Date(),
      });

      // Add sample messages
      const messages = [
        {
          senderId: chat.participants[1],
          content: chat.lastMessage,
          timestamp: chat.lastMessageTime,
          read: false,
          type: "text",
        },
      ];

      for (const message of messages) {
        await addDoc(collection(db, "chats", chatRef.id, "messages"), message);
      }

      console.log(
        `Created chat between ${currentUserId} and ${chat.participants[1]}`
      );
    }

    console.log("✅ Sample chats created successfully!");
  } catch (error) {
    console.error("❌ Error creating sample chats:", error);
  }
};

// Run this function to create sample data
if (typeof window !== "undefined") {
  window.createSampleChatData = () => {
    createSampleUsers();
  };
}
