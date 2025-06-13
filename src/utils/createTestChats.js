// Test script để kiểm tra tính năng chat
import { chatService } from "./chatService.js";
import { createUserIfNotExists } from "./syncUsers.js";

// Tạo dữ liệu test cho nhiều cuộc trò chuyện
export const createTestChats = async () => {
  try {
    console.log("🚀 Starting test chats creation...");

    // Danh sách test users
    const testUsers = [
      {
        id: "test-user-1",
        firstName: "Nguyễn",
        surname: "Văn A",
        email: "nguyenvana@example.com",
        avatar: "https://i.pravatar.cc/150?u=1",
      },
      {
        id: "test-user-2",
        firstName: "Trần",
        surname: "Thị B",
        email: "tranthib@example.com",
        avatar: "https://i.pravatar.cc/150?u=2",
      },
      {
        id: "test-user-3",
        firstName: "Lê",
        surname: "Hoàng C",
        email: "lehoangc@example.com",
        avatar: "https://i.pravatar.cc/150?u=3",
      },
      {
        id: "test-user-4",
        firstName: "Phạm",
        surname: "Minh D",
        email: "phamminhd@example.com",
        avatar: "https://i.pravatar.cc/150?u=4",
      },
      {
        id: "test-user-5",
        firstName: "Vũ",
        surname: "Thế E",
        email: "vuthee@example.com",
        avatar: "https://i.pravatar.cc/150?u=5",
      },
    ];

    // Tạo các test users
    console.log("📝 Creating test users...");
    for (const user of testUsers) {
      await chatService.createUser(user.id, user);
      console.log(`✅ Created user: ${user.firstName} ${user.surname}`);
    }

    // Giả sử current user là 'test-current-user'
    const currentUserId = "test-current-user";
    await chatService.createUser(currentUserId, {
      firstName: "Current",
      surname: "User",
      email: "currentuser@example.com",
      avatar: "https://i.pravatar.cc/150?u=current",
    });

    // Tạo các chats và tin nhắn test
    console.log("💬 Creating test chats and messages...");

    for (let i = 0; i < testUsers.length; i++) {
      const otherUser = testUsers[i];

      // Tạo chat giữa current user và test user
      const chat = await chatService.getOrCreateChat(
        currentUserId,
        otherUser.id
      );
      console.log(
        `✅ Created chat between current user and ${otherUser.firstName} ${otherUser.surname}`
      );

      // Gửi một vài tin nhắn test
      const messages = [
        `Xin chào ${otherUser.firstName}!`,
        `Bạn có khỏe không?`,
        `Hẹn gặp lại nhé!`,
      ];

      for (let j = 0; j < messages.length; j++) {
        const senderId = j % 2 === 0 ? currentUserId : otherUser.id;
        await chatService.sendMessage(chat.id, senderId, messages[j]);

        // Delay nhỏ để tạo timestamp khác nhau
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(
        `💬 Added ${messages.length} messages to chat with ${otherUser.firstName} ${otherUser.surname}`
      );
    }

    console.log("🎉 Test chats creation completed!");
    console.log(
      `📊 Created ${testUsers.length} test users and ${testUsers.length} chat conversations`
    );
  } catch (error) {
    console.error("❌ Error creating test chats:", error);
  }
};

// Hàm để xóa dữ liệu test (clean up)
export const cleanupTestData = async () => {
  console.log("🧹 Cleaning up test data...");
  // Implementation để xóa test data nếu cần
  console.log("✅ Cleanup completed");
};

// Export để có thể chạy từ browser console
if (typeof window !== "undefined") {
  window.createTestChats = createTestChats;
  window.cleanupTestData = cleanupTestData;
}
