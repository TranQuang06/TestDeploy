import { chatService } from "./chatService.js";

// Test functions để kiểm tra chức năng chat
export const testChatFunctions = {
  // Test 1: Tạo sample users
  async createSampleUsers() {
    console.log("🚀 Creating sample users...");

    const users = [
      {
        id: "user1",
        firstName: "Nguyễn",
        surname: "Văn An",
        email: "nguyenvanan@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=0ea5e9&color=fff&size=100",
      },
      {
        id: "user2",
        firstName: "Trần",
        surname: "Thị Bình",
        email: "tranthibinh@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=10b981&color=fff&size=100",
      },
      {
        id: "user3",
        firstName: "Lê",
        surname: "Hoàng Cường",
        email: "lehoangcuong@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=Le+Hoang+Cuong&background=f59e0b&color=fff&size=100",
      },
    ];

    for (const user of users) {
      try {
        await chatService.createUser(user.id, user);
        console.log(`✅ Created user: ${user.firstName} ${user.surname}`);
      } catch (error) {
        console.log(`⚠️ User ${user.id} might already exist:`, error.message);
      }
    }

    return users;
  },

  // Test 2: Tạo chats giữa current user và sample users
  async createSampleChats(currentUserId) {
    if (!currentUserId) {
      console.error("❌ Current user ID is required");
      return;
    }

    console.log("💬 Creating sample chats for user:", currentUserId);

    const otherUserIds = ["user1", "user2", "user3"];
    const chats = [];

    for (const otherUserId of otherUserIds) {
      try {
        const chat = await chatService.getOrCreateChat(
          currentUserId,
          otherUserId
        );
        chats.push(chat);
        console.log(
          `✅ Created/found chat between ${currentUserId} and ${otherUserId}`
        );
      } catch (error) {
        console.error(`❌ Error creating chat with ${otherUserId}:`, error);
      }
    }

    return chats;
  },

  // Test 3: Gửi sample messages
  async sendSampleMessages(currentUserId) {
    if (!currentUserId) {
      console.error("❌ Current user ID is required");
      return;
    }

    console.log("📨 Sending sample messages...");

    const chats = await this.createSampleChats(currentUserId);

    const sampleMessages = [
      "Xin chào! Bạn có khỏe không?",
      "Dạo này công việc thế nào?",
      "Cuối tuần này rảnh không?",
      "Mình gửi bạn tài liệu này nhé",
      "Cảm ơn bạn rất nhiều!",
    ];

    for (let i = 0; i < chats.length; i++) {
      const chat = chats[i];
      const otherUserId = chat.participants.find((id) => id !== currentUserId);

      // Gửi vài tin nhắn từ current user
      for (let j = 0; j < 2; j++) {
        const message =
          sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        await chatService.sendMessage(chat.id, currentUserId, message);

        // Delay nhỏ
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Gửi reply từ user khác
      const replyMessage =
        sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      await chatService.sendMessage(chat.id, otherUserId, replyMessage);

      console.log(`✅ Sent messages to chat with user ${otherUserId}`);

      // Delay giữa các chat
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  },
  // Test 4: Tạo friendships
  async createSampleFriendships(currentUserId) {
    if (!currentUserId) {
      console.error("❌ Current user ID is required");
      return;
    }

    console.log("👥 Creating sample friendships...");

    const friendIds = ["user1", "user2", "user3"];

    for (const friendId of friendIds) {
      try {
        await chatService.createFriendship(currentUserId, friendId);
        console.log(
          `🤝 Created friendship between ${currentUserId} and ${friendId}`
        );
      } catch (error) {
        console.log(
          `⚠️ Friendship might already exist between ${currentUserId} and ${friendId}`
        );
      }
    }
  },

  // Test 5: Cleanup test data
  async cleanupTestData() {
    console.log("🧹 Cleaning up test data...");
    console.log(
      "⚠️ Cleanup not implemented yet - you may need to manually delete test data"
    );
  },

  // Test tổng hợp
  async runFullTest(currentUserId) {
    if (!currentUserId) {
      console.error("❌ Please provide current user ID");
      console.log('Example: testChatFunctions.runFullTest("your-user-id")');
      return;
    }

    console.log("🎯 Running full chat test for user:", currentUserId);

    try {
      await this.createSampleUsers();
      await this.createSampleChats(currentUserId);
      await this.sendSampleMessages(currentUserId);
      await this.createSampleFriendships(currentUserId);

      console.log("🎉 Full test completed successfully!");
      console.log("💡 Now you can check the chat interface to see the results");
    } catch (error) {
      console.error("❌ Test failed:", error);
    }
  },
};

// Export để có thể sử dụng từ browser console
if (typeof window !== "undefined") {
  window.testChatFunctions = testChatFunctions;

  // Helper function cho dễ sử dụng
  window.testChat = (userId) => {
    return testChatFunctions.runFullTest(userId);
  };

  console.log("🔧 Chat test functions loaded!");
  console.log(
    'Usage: testChat("your-user-id") or testChatFunctions.runFullTest("your-user-id")'
  );
}
