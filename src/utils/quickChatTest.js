// Simple test script để kiểm tra và fix last message issues
// Chạy trong browser console

// Function để kiểm tra và in ra console log data chat
window.checkChatData = function (userId) {
  console.log("🔍 Checking chat data for user:", userId);

  // Sử dụng chatService để lấy chats
  const unsubscribe = chatService.getUserChats(userId, (snapshot) => {
    console.log("📊 Current chats:");

    snapshot.docs.forEach((doc, index) => {
      const chat = { id: doc.id, ...doc.data() };
      console.log(`\nChat ${index + 1}:`, {
        id: chat.id,
        participants: chat.participants,
        lastMessage: chat.lastMessage,
        lastMessageSenderId: chat.lastMessageSenderId,
        lastMessageTime:
          chat.lastMessageTime?.toDate?.()?.toLocaleString() || "No timestamp",
      });
    });

    // Unsubscribe sau khi check
    setTimeout(() => unsubscribe(), 1000);
  });
};

// Function test gửi tin nhắn
window.testSendMessage = async function (currentUserId, otherUserId, message) {
  try {
    console.log("🧪 Testing send message...");

    // Tạo hoặc lấy chat
    const chat = await chatService.getOrCreateChat(currentUserId, otherUserId);
    console.log("📝 Chat created/found:", chat.id);

    // Gửi tin nhắn
    await chatService.sendMessage(chat.id, currentUserId, message);
    console.log("✅ Message sent successfully");

    // Kiểm tra data sau khi gửi
    setTimeout(() => {
      window.checkChatData(currentUserId);
    }, 1000);
  } catch (error) {
    console.error("❌ Error testing send message:", error);
  }
};

// Function tạo sample chat nhanh cho test
window.createQuickTestChat = async function (userId) {
  try {
    console.log("🚀 Creating quick test chat...");

    // Tạo test user
    const testUser = {
      id: "test-user-quick",
      firstName: "Test",
      surname: "User",
      email: "testuser@example.com",
      avatar:
        "https://ui-avatars.com/api/?name=Test+User&background=0ea5e9&color=fff&size=100",
    };

    await chatService.createUser(testUser.id, testUser);
    console.log("✅ Test user created");

    // Tạo chat
    const chat = await chatService.getOrCreateChat(userId, testUser.id);
    console.log("✅ Chat created:", chat.id);

    // Gửi vài tin nhắn test
    await chatService.sendMessage(chat.id, userId, "Xin chào!");
    await new Promise((resolve) => setTimeout(resolve, 500));

    await chatService.sendMessage(chat.id, testUser.id, "Chào bạn!");
    await new Promise((resolve) => setTimeout(resolve, 500));

    await chatService.sendMessage(chat.id, userId, "Bạn có khỏe không?");

    console.log("✅ Test messages sent");

    // Kiểm tra kết quả
    setTimeout(() => {
      window.checkChatData(userId);
    }, 1000);
  } catch (error) {
    console.error("❌ Error creating test chat:", error);
  }
};

console.log("🔧 Quick chat test functions loaded!");
console.log("Usage:");
console.log('- checkChatData("your-user-id")');
console.log('- testSendMessage("your-user-id", "other-user-id", "Hello!")');
console.log('- createQuickTestChat("your-user-id")');
