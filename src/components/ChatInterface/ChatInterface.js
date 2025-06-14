import { useState, useEffect, useRef } from "react";
import styles from "./ChatInterface.module.css";
import { chatService } from "../../utils/chatService";
import { useAuth } from "../../contexts/AuthContext";
import { createUserIfNotExists } from "../../utils/syncUsers";
import {
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineSend,
  AiOutlineUser,
  AiOutlineMore,
  AiOutlinePhone,
  AiOutlineVideoCamera,
  AiOutlineInbox,
  AiOutlineArrowLeft,
} from "react-icons/ai";

const ChatInterface = ({
  onClose,
  initialChatTarget,
  onConversationStateChange,
}) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [chatUsers, setChatUsers] = useState({});
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const messagesEndRef = useRef(null); // Lấy danh sách chat của user
  useEffect(() => {
    if (!user?.uid) return;

    console.log("🔄 Setting up chat listener for user:", user.uid);

    const unsubscribe = chatService.getUserChats(user.uid, async (snapshot) => {
      console.log("📥 Received chat updates, processing...");
      const chatsList = [];
      const usersMap = {};

      // Xử lý từng chat document
      for (const doc of snapshot.docs) {
        const chatData = { id: doc.id, ...doc.data() };

        // Chỉ thêm chat nếu có ít nhất 1 tin nhắn hoặc được tạo gần đây
        if (
          chatData.lastMessage ||
          (chatData.createdAt &&
            chatData.createdAt.toDate &&
            Date.now() - chatData.createdAt.toDate().getTime() <
              24 * 60 * 60 * 1000)
        ) {
          chatsList.push(chatData);
        }

        // Lấy thông tin user khác trong chat
        const otherUserId = chatData.participants.find((id) => id !== user.uid);
        if (otherUserId && !chatUsers[otherUserId] && !usersMap[otherUserId]) {
          try {
            let userData = await chatService.getUser(otherUserId);

            // Nếu user không tồn tại, tạo user mặc định
            if (!userData) {
              console.log(
                "⚠️ User not found, creating default user for:",
                otherUserId
              );
              userData = {
                id: otherUserId,
                firstName: "User",
                surname: otherUserId.substring(0, 8),
                name: "User " + otherUserId.substring(0, 8),
                email: otherUserId + "@example.com",
                avatar: `https://ui-avatars.com/api/?name=User&background=0ea5e9&color=fff&size=40`,
                isOnline: false,
                lastSeen: new Date(),
              };

              // Tạo user trong Firestore
              try {
                await chatService.createUser(otherUserId, userData);
              } catch (createError) {
                console.error(
                  "❌ Error creating user in Firestore:",
                  createError
                );
              }
            }

            if (userData) {
              usersMap[otherUserId] = userData;
            }
          } catch (error) {
            console.error("❌ Error fetching user data:", error);
            // Tạo user placeholder khi có lỗi
            usersMap[otherUserId] = {
              id: otherUserId,
              firstName: "User",
              surname: otherUserId.substring(0, 8),
              name: "User " + otherUserId.substring(0, 8),
              email: otherUserId + "@example.com",
              avatar: `https://ui-avatars.com/api/?name=User&background=6b7280&color=fff&size=40`,
              isOnline: false,
              lastSeen: new Date(),
            };
          }
        }
      }

      console.log("✅ Processed chats:", chatsList.length);
      console.log("✅ Loaded users:", Object.keys(usersMap).length);

      // Sắp xếp chats theo thời gian tin nhắn cuối
      chatsList.sort((a, b) => {
        const timeA = a.lastMessageTime?.toDate?.() || new Date(0);
        const timeB = b.lastMessageTime?.toDate?.() || new Date(0);
        return timeB - timeA;
      });

      setChats(chatsList);
      setChatUsers((prev) => ({ ...prev, ...usersMap }));
    });

    return () => unsubscribe();
  }, [user?.uid]); // Lấy tin nhắn của chat được chọn
  useEffect(() => {
    if (!selectedChat) return;

    // Đảm bảo thông tin user được load khi chọn chat
    const loadOtherUserInfo = async () => {
      const otherUserId = selectedChat.participants.find(
        (id) => id !== user.uid
      );
      if (otherUserId && !chatUsers[otherUserId]) {
        try {
          let userData = await chatService.getUser(otherUserId);
          if (!userData) {
            // Tạo user mặc định nếu không tồn tại
            userData = {
              id: otherUserId,
              name: "User " + otherUserId.substring(0, 8),
              email: otherUserId + "@example.com",
              photoURL: `https://i.pravatar.cc/150?u=${otherUserId}`,
              isOnline: false,
              lastSeen: new Date(),
            };
            await chatService.createUser(otherUserId, userData);
          }
          setChatUsers((prev) => ({ ...prev, [otherUserId]: userData }));
        } catch (error) {
          console.error("Error loading user info:", error);
        }
      }
    };

    loadOtherUserInfo();

    const unsubscribe = chatService.getChatMessages(
      selectedChat.id,
      (snapshot) => {
        const messagesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      }
    );

    // Đánh dấu tin nhắn đã đọc khi mở chat
    if (selectedChat.unreadCount && selectedChat.unreadCount[user.uid] > 0) {
      chatService.markMessagesAsRead(selectedChat.id, user.uid);
    }

    return () => unsubscribe();
  }, [selectedChat, user.uid]);
  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle initial chat target (from job posting)
  useEffect(() => {
    if (initialChatTarget && initialChatTarget.userId && user?.uid) {
      const initializeChat = async () => {
        try {
          // Create user object for the chat target
          const targetUser = {
            id: initialChatTarget.userId,
            name: initialChatTarget.displayName || "User",
            displayName: initialChatTarget.displayName || "User",
            email: `${initialChatTarget.userId}@example.com`,
            photoURL: null,
            isOnline: false,
            lastSeen: new Date(),
          };

          // Start chat with the target user
          await startNewChat(targetUser);

          console.log("✅ Started chat with job poster:", initialChatTarget);
        } catch (error) {
          console.error("❌ Error starting chat with job poster:", error);
        }
      };

      // Delay to ensure user data is loaded
      setTimeout(initializeChat, 500);
    }
  }, [initialChatTarget, user?.uid]);

  // Tìm kiếm users
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      setIsSearching(true);
      try {
        const results = await chatService.searchUsers(term, user.uid);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Bắt đầu chat với user mới
  const startNewChat = async (otherUser) => {
    try {
      const chat = await chatService.getOrCreateChat(user.uid, otherUser.id);
      setSelectedChat(chat);
      setChatUsers((prev) => ({ ...prev, [otherUser.id]: otherUser }));
      setSearchTerm("");
      setSearchResults([]);
      setIsSearching(false);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  // Gửi tin nhắn
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await chatService.sendMessage(
        selectedChat.id,
        user.uid,
        newMessage.trim()
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // Format thời gian theo style Messenger
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Nếu trong vòng 1 phút
    if (diffInMinutes < 1) {
      return "Vừa xong";
    }

    // Nếu trong vòng 1 giờ
    if (diffInMinutes < 60) {
      return `${diffInMinutes}p`;
    }

    // Nếu trong ngày hôm nay
    if (diffInHours < 24 && date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Nếu hôm qua
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    }

    // Nếu trong tuần này (dưới 7 ngày)
    if (diffInDays < 7) {
      return date.toLocaleDateString("vi-VN", { weekday: "short" });
    }

    // Ngày cụ thể cho tin nhắn cũ hơn
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };
  const getOtherUser = (chat) => {
    if (!chat || !chat.participants) {
      return {
        name: "Unknown User",
        photoURL: null,
        avatar: null,
        isOnline: false,
        email: "",
      };
    }

    const otherUserId = chat.participants.find((id) => id !== user.uid);
    if (!otherUserId) {
      return {
        name: "Unknown User",
        photoURL: null,
        avatar: null,
        isOnline: false,
        email: "",
      };
    }

    const otherUser = chatUsers[otherUserId];

    if (otherUser) {
      // Tạo tên hiển thị từ firstName và surname
      let displayName = "";
      if (otherUser.firstName && otherUser.surname) {
        displayName = `${otherUser.firstName} ${otherUser.surname}`;
      } else if (otherUser.displayName) {
        displayName = otherUser.displayName;
      } else if (otherUser.name) {
        displayName = otherUser.name;
      } else if (otherUser.firstName) {
        displayName = otherUser.firstName;
      } else if (otherUser.surname) {
        displayName = otherUser.surname;
      } else {
        displayName = "User " + otherUserId.substring(0, 8);
      }

      // Lấy avatar từ trường avatar, fallback về photoURL
      const avatarUrl = otherUser.avatar || otherUser.photoURL || null;

      return {
        id: otherUser.id || otherUserId,
        name: displayName,
        displayName: displayName,
        photoURL: avatarUrl, // Để compatibility
        avatar: avatarUrl,
        isOnline: otherUser.isOnline || false,
        email: otherUser.email || "",
        firstName: otherUser.firstName,
        surname: otherUser.surname,
      };
    }

    // Fallback nếu không có dữ liệu user
    return {
      id: otherUserId,
      name: "User " + otherUserId.substring(0, 8),
      photoURL: null,
      avatar: null,
      isOnline: false,
      email: "",
    };
  }; // Hiển thị tin nhắn cuối cùng với thông tin người gửi
  const getLastMessageDisplay = (chat) => {
    if (!chat.lastMessage) {
      return "Bắt đầu cuộc trò chuyện";
    }

    // Truncate tin nhắn nếu quá dài
    const truncateMessage = (msg, maxLength = 40) => {
      if (msg.length <= maxLength) return msg;
      return msg.substring(0, maxLength) + "...";
    };

    // Nếu tin nhắn do mình gửi
    if (chat.lastMessageSenderId === user.uid) {
      return `Bạn: ${truncateMessage(chat.lastMessage)}`;
    }

    // Nếu tin nhắn do người khác gửi, chỉ hiển thị nội dung tin nhắn
    return truncateMessage(chat.lastMessage);
  }; // Lấy danh sách bạn bè
  useEffect(() => {
    const loadFriends = async () => {
      if (!user?.uid) return;

      try {
        const friendsList = await chatService.getUserFriends(user.uid);
        setFriends(friendsList);
      } catch (error) {
        console.error("Error loading friends:", error);
      }
    };

    loadFriends();
  }, [user?.uid]);

  // Notify parent component about conversation state changes
  useEffect(() => {
    if (onConversationStateChange) {
      onConversationStateChange(!!selectedChat);
    }
  }, [selectedChat, onConversationStateChange]);

  return (
    <div
      className={`${styles.chatInterface} ${
        selectedChat ? styles.hasChatSelected : ""
      }`}
    >
      {/* Chat List */}
      <div className={styles.chatList}>
        <div className={styles.chatHeader}>
          <h3>Đoạn chat</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        {/* Search */}
        <div className={styles.searchContainer}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        {/* Search Results */}
        {isSearching && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            <h4>Kết quả tìm kiếm</h4>
            {searchResults.map((resultUser) => (
              <div
                key={resultUser.id}
                className={styles.searchResultItem}
                onClick={() => startNewChat(resultUser)}
              >
                {" "}
                <div className={styles.avatar}>
                  {resultUser.avatar || resultUser.photoURL ? (
                    <img
                      src={resultUser.avatar || resultUser.photoURL}
                      alt={resultUser.name || resultUser.displayName}
                    />
                  ) : (
                    <AiOutlineUser />
                  )}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{resultUser.name}</div>
                  <div className={styles.userEmail}>{resultUser.email}</div>
                </div>
              </div>
            ))}
          </div>
        )}{" "}
        {/* Chat Items */}
        <div className={styles.chatItems}>
          {/* Toggle between chats and friends */}
          <div className={styles.chatTabs}>
            <button
              className={`${styles.tabButton} ${
                !showFriends ? styles.active : ""
              }`}
              onClick={() => setShowFriends(false)}
            >
              Tin nhắn
            </button>
            <button
              className={`${styles.tabButton} ${
                showFriends ? styles.active : ""
              }`}
              onClick={() => setShowFriends(true)}
            >
              Bạn bè
            </button>
          </div>{" "}
          {/* Show chats or friends */}
          {!showFriends ? (
            // Existing chats
            <>
              {chats.length === 0 ? (
                <div className={styles.emptyList}>
                  <div className={styles.emptyIcon}>
                    <AiOutlineInbox />
                  </div>
                  <p>Chưa có cuộc trò chuyện nào</p>
                  <small>
                    Chọn tab "Bạn bè" để bắt đầu chat với bạn bè hoặc tìm kiếm
                    người dùng ở trên
                  </small>
                </div>
              ) : (
                <div className={styles.chatsList}>
                  {chats.map((chat) => {
                    const otherUser = getOtherUser(chat);
                    const hasUnread =
                      chat.unreadCount && chat.unreadCount[user.uid] > 0;

                    return (
                      <div
                        key={chat.id}
                        className={`${styles.chatItem} ${
                          selectedChat?.id === chat.id ? styles.active : ""
                        } ${hasUnread ? styles.unread : ""}`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className={styles.avatar}>
                          {otherUser.avatar || otherUser.photoURL ? (
                            <img
                              src={otherUser.avatar || otherUser.photoURL}
                              alt={otherUser.name}
                            />
                          ) : (
                            <AiOutlineUser />
                          )}
                          {otherUser.isOnline && (
                            <div className={styles.onlineStatus}></div>
                          )}
                        </div>
                        <div className={styles.chatInfo}>
                          <div className={styles.chatName}>
                            {otherUser.name}
                          </div>
                          <div className={styles.lastMessage}>
                            {getLastMessageDisplay(chat)}
                          </div>
                        </div>
                        <div className={styles.chatTime}>
                          {chat.lastMessageTime &&
                            formatTime(chat.lastMessageTime)}
                          {hasUnread && (
                            <div className={styles.unreadIndicator}>
                              {chat.unreadCount[user.uid] > 9
                                ? "9+"
                                : chat.unreadCount[user.uid]}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            // Friends list
            <>
              {friends.length === 0 ? (
                <div className={styles.emptyList}>
                  <div className={styles.emptyIcon}>
                    <AiOutlineUser />
                  </div>
                  <p>Chưa có bạn bè nào</p>
                  <small>
                    Hãy kết bạn để bắt đầu chat hoặc tìm kiếm người dùng ở trên
                  </small>
                </div>
              ) : (
                <div className={styles.friendsList}>
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className={styles.chatItem}
                      onClick={() => startNewChat(friend)}
                    >
                      <div className={styles.avatar}>
                        {friend.avatar || friend.photoURL ? (
                          <img
                            src={friend.avatar || friend.photoURL}
                            alt={friend.name || friend.displayName}
                          />
                        ) : (
                          <AiOutlineUser />
                        )}
                        {friend.isOnline && (
                          <div className={styles.onlineStatus}></div>
                        )}
                      </div>
                      <div className={styles.chatInfo}>
                        <div className={styles.chatName}>
                          {friend.name || friend.displayName}
                        </div>
                        <div className={styles.lastMessage}>
                          {friend.isOnline
                            ? "Đang hoạt động"
                            : "Click để bắt đầu chat"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chat Content */}
      <div className={styles.chatContent}>
        {selectedChat ? (
          <>
            {" "}
            {/* Chat Header */}
            <div className={styles.chatContentHeader}>
              {" "}
              <div className={styles.chatUserInfo}>
                {/* Back button - only visible on mobile devices */}
                <button
                  className={`${styles.backButton} ${styles.mobileOnly}`}
                  onClick={() => setSelectedChat(null)}
                >
                  <AiOutlineArrowLeft />
                </button>
                <div className={styles.avatar}>
                  {getOtherUser(selectedChat).avatar ||
                  getOtherUser(selectedChat).photoURL ? (
                    <img
                      src={
                        getOtherUser(selectedChat).avatar ||
                        getOtherUser(selectedChat).photoURL
                      }
                      alt={getOtherUser(selectedChat).name}
                    />
                  ) : (
                    <AiOutlineUser />
                  )}
                </div>
                <div>
                  <div className={styles.chatUserName}>
                    {getOtherUser(selectedChat).name}
                  </div>
                  <div className={styles.onlineText}>Đang hoạt động</div>
                </div>
              </div>
              <div className={styles.chatActions}>
                <button className={styles.actionButton}>
                  <AiOutlinePhone />
                </button>
                <button className={styles.actionButton}>
                  <AiOutlineVideoCamera />
                </button>
                <button className={styles.actionButton}>
                  <AiOutlineMore />
                </button>
              </div>
            </div>
            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.map((message, index) => {
                const isOwn = message.senderId === user.uid;
                const showDate =
                  index === 0 ||
                  (messages[index - 1] &&
                    formatDate(message.timestamp) !==
                      formatDate(messages[index - 1].timestamp));

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className={styles.dateHeader}>
                        {formatDate(message.timestamp)}
                      </div>
                    )}{" "}
                    <div
                      className={`${styles.message} ${
                        isOwn ? styles.own : styles.other
                      }`}
                    >
                      {" "}
                      {!isOwn && (
                        <div className={styles.messageAvatar}>
                          {getOtherUser(selectedChat).avatar ||
                          getOtherUser(selectedChat).photoURL ? (
                            <img
                              src={
                                getOtherUser(selectedChat).avatar ||
                                getOtherUser(selectedChat).photoURL
                              }
                              alt=""
                            />
                          ) : (
                            <AiOutlineUser />
                          )}
                        </div>
                      )}
                      <div className={styles.messageContent}>
                        {!isOwn && (
                          <div className={styles.senderName}>
                            {getOtherUser(selectedChat).name}
                          </div>
                        )}                        <div 
                          className={`${styles.messageText} ${
                            message.content && message.content.length <= 3 ? styles.shortMessage : ''
                          }`}
                        >
                          {message.content}
                        </div>
                        <div className={styles.messageTime}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {/* Message Input */}
            <form className={styles.messageForm} onSubmit={sendMessage}>
              <div className={styles.messageInputContainer}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Aa"
                  className={styles.messageInput}
                />
                <button
                  type="submit"
                  className={styles.sendButton}
                  disabled={!newMessage.trim()}
                >
                  <AiOutlineSend />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.emptyChatContent}>
            <div className={styles.emptyIcon}>
              <AiOutlineInbox />
            </div>
            <h3>Tin nhắn của bạn</h3>
            <p>Gửi tin nhắn riêng tư cho bạn bè và đồng nghiệp.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
