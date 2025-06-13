import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Modal, message } from "antd";
import styles from "./MyNetworkPage.module.css";
import {
  AiOutlineUserAdd,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineLoading3Quarters,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";

const MyNetworkPage = () => {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [removeFriendModalOpen, setRemoveFriendModalOpen] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null);

  useEffect(() => {
    if (user) {
      loadNetworkData();
    }
  }, [user]);

  const loadNetworkData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadSuggestedUsers(),
        loadFriendRequests(),
        loadFriends(),
      ]);
    } catch (error) {
      console.error("Error loading network data:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadSuggestedUsers = async () => {
    try {
      // Get all users except current user
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, limit(50));
      const usersSnapshot = await getDocs(usersQuery);

      const allUsers = [];
      usersSnapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          allUsers.push({ id: doc.id, ...doc.data() });
        }
      });

      // Get ONLY PENDING friend requests (both sent and received)
      const sentRequestsQuery = query(
        collection(db, "friendRequests"),
        where("fromUserId", "==", user.uid),
        where("status", "==", "pending")
      );
      const receivedRequestsQuery = query(
        collection(db, "friendRequests"),
        where("toUserId", "==", user.uid),
        where("status", "==", "pending")
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentRequestsQuery),
        getDocs(receivedRequestsQuery),
      ]);

      // Get IDs of users with PENDING requests only
      const pendingRequestUserIds = new Set();
      sentSnapshot.forEach((doc) => {
        const data = doc.data();
        pendingRequestUserIds.add(data.toUserId);
      });
      receivedSnapshot.forEach((doc) => {
        const data = doc.data();
        pendingRequestUserIds.add(data.fromUserId);
      });

      // Get existing friends
      const friendsQuery = query(
        collection(db, "friendships"),
        where("users", "array-contains", user.uid)
      );
      const friendsSnapshot = await getDocs(friendsQuery);
      const friendIds = new Set();
      friendsSnapshot.forEach((doc) => {
        const data = doc.data();
        const friendId = data.users.find((id) => id !== user.uid);
        if (friendId) {
          friendIds.add(friendId);
        }
      });

      // Filter out users who have PENDING requests or are current friends
      const filteredUsers = allUsers.filter(
        (user) => !pendingRequestUserIds.has(user.id) && !friendIds.has(user.id)
      );

      console.log("📋 All users:", allUsers.length);
      console.log("🔄 Pending requests:", pendingRequestUserIds.size);
      console.log("👥 Current friends:", friendIds.size);
      console.log("💡 Suggested users:", filteredUsers.length);

      setSuggestedUsers(filteredUsers);
    } catch (error) {
      console.error("Error loading suggested users:", error);
    }
  };
  const loadFriendRequests = async () => {
    try {
      // Load sent requests
      const sentQuery = query(
        collection(db, "friendRequests"),
        where("fromUserId", "==", user.uid),
        where("status", "==", "pending")
      );
      const sentSnapshot = await getDocs(sentQuery);
      const sent = [];
      for (const requestDoc of sentSnapshot.docs) {
        const requestData = requestDoc.data();
        const userDocRef = doc(db, "users", requestData.toUserId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          sent.push({
            id: requestDoc.id,
            ...requestData,
            userInfo: { id: userDoc.id, ...userDoc.data() },
          });
        }
      }
      setSentRequests(sent);

      // Load received requests
      const receivedQuery = query(
        collection(db, "friendRequests"),
        where("toUserId", "==", user.uid),
        where("status", "==", "pending")
      );
      const receivedSnapshot = await getDocs(receivedQuery);
      const received = [];
      for (const requestDoc of receivedSnapshot.docs) {
        const requestData = requestDoc.data();
        const userDocRef = doc(db, "users", requestData.fromUserId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          received.push({
            id: requestDoc.id,
            ...requestData,
            userInfo: { id: userDoc.id, ...userDoc.data() },
          });
        }
      }
      setReceivedRequests(received);
    } catch (error) {
      console.error("Error loading friend requests:", error);
    }
  };
  const loadFriends = async () => {
    try {
      // Load friends list
      const friendsQuery = query(
        collection(db, "friendships"),
        where("users", "array-contains", user.uid)
      );
      const friendsSnapshot = await getDocs(friendsQuery);
      const friendsList = [];

      for (const friendshipDoc of friendsSnapshot.docs) {
        const friendshipData = friendshipDoc.data();
        const friendId = friendshipData.users.find((id) => id !== user.uid);
        const friendDocRef = doc(db, "users", friendId);
        const friendDoc = await getDoc(friendDocRef);
        if (friendDoc.exists()) {
          friendsList.push({
            id: friendDoc.id,
            ...friendDoc.data(),
          });
        }
      }
      setFriends(friendsList);
    } catch (error) {
      console.error("Error loading friends:", error);
    }
  };
  const sendFriendRequest = async (toUserId) => {
    try {
      const requestId = `${user.uid}_${toUserId}`;
      const requestRef = doc(db, "friendRequests", requestId);
      await setDoc(requestRef, {
        fromUserId: user.uid,
        toUserId: toUserId,
        status: "pending",
        createdAt: new Date(),
      });

      // Refresh data to update all UI sections
      await loadNetworkData();

      console.log("✅ Friend request sent");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };
  const cancelFriendRequest = async (requestId, toUserId) => {
    try {
      const requestRef = doc(db, "friendRequests", requestId);
      await deleteDoc(requestRef);

      // Refresh data to update UI
      await loadNetworkData();

      console.log("✅ Friend request cancelled");
    } catch (error) {
      console.error("Error cancelling friend request:", error);
    }
  };
  const removeFriend = async (friendId) => {
    try {
      // Find and delete friendship document
      const friendshipId = [user.uid, friendId].sort().join("_");
      const friendshipRef = doc(db, "friendships", friendshipId);
      await deleteDoc(friendshipRef);

      // Note: We're NOT deleting chat history - only removing friendship

      // Refresh data to update UI
      await loadNetworkData();

      message.success("Đã hủy kết bạn thành công!");
      console.log("✅ Friendship removed");
    } catch (error) {
      console.error("Error removing friend:", error);
      message.error("Có lỗi xảy ra khi hủy kết bạn!");
    }
  };

  const handleRemoveFriend = (friend) => {
    setFriendToRemove(friend);
    setRemoveFriendModalOpen(true);
  };

  const confirmRemoveFriend = async () => {
    if (friendToRemove) {
      await removeFriend(friendToRemove.id);
      setRemoveFriendModalOpen(false);
      setFriendToRemove(null);
    }
  };

  const cancelRemoveFriend = () => {
    setRemoveFriendModalOpen(false);
    setFriendToRemove(null);
  };
  const acceptFriendRequest = async (requestId, fromUserId) => {
    try {
      // Create friendship first
      const friendshipId = [user.uid, fromUserId].sort().join("_");
      const friendshipRef = doc(db, "friendships", friendshipId);
      await setDoc(friendshipRef, {
        users: [user.uid, fromUserId],
        createdAt: new Date(),
      });

      // Delete the friend request (both directions if exists)
      const requestRef = doc(db, "friendRequests", requestId);
      await deleteDoc(requestRef);

      // Also delete reverse request if exists
      const reverseRequestId = `${fromUserId}_${user.uid}`;
      const reverseRequestRef = doc(db, "friendRequests", reverseRequestId);
      try {
        await deleteDoc(reverseRequestRef);
      } catch (e) {
        // Ignore if reverse request doesn't exist
      }

      // Refresh all data to update UI
      await loadNetworkData();

      console.log("✅ Friend request accepted and friendship created");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };
  const rejectFriendRequest = async (requestId) => {
    try {
      const requestRef = doc(db, "friendRequests", requestId);
      await deleteDoc(requestRef);

      // Refresh data to update UI
      await loadNetworkData();

      console.log("✅ Friend request rejected");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };
  const searchUsers = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const allResults = [];
      usersSnapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          const userData = doc.data();
          const displayName =
            userData.displayName ||
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim();

          if (
            displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (userData.email &&
              userData.email.toLowerCase().includes(searchQuery.toLowerCase()))
          ) {
            allResults.push({ id: doc.id, ...userData });
          }
        }
      });

      // Apply same filtering logic as suggestions
      // Get ONLY PENDING friend requests
      const sentRequestsQuery = query(
        collection(db, "friendRequests"),
        where("fromUserId", "==", user.uid),
        where("status", "==", "pending")
      );
      const receivedRequestsQuery = query(
        collection(db, "friendRequests"),
        where("toUserId", "==", user.uid),
        where("status", "==", "pending")
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentRequestsQuery),
        getDocs(receivedRequestsQuery),
      ]);

      const pendingRequestUserIds = new Set();
      sentSnapshot.forEach((doc) => {
        const data = doc.data();
        pendingRequestUserIds.add(data.toUserId);
      });
      receivedSnapshot.forEach((doc) => {
        const data = doc.data();
        pendingRequestUserIds.add(data.fromUserId);
      });

      // Get existing friends
      const friendsQuery = query(
        collection(db, "friendships"),
        where("users", "array-contains", user.uid)
      );
      const friendsSnapshot = await getDocs(friendsQuery);
      const friendIds = new Set();
      friendsSnapshot.forEach((doc) => {
        const data = doc.data();
        const friendId = data.users.find((id) => id !== user.uid);
        if (friendId) {
          friendIds.add(friendId);
        }
      });

      // Filter search results to exclude pending requests and current friends
      const filteredResults = allResults.filter(
        (user) => !pendingRequestUserIds.has(user.id) && !friendIds.has(user.id)
      );

      console.log("🔍 Search results before filter:", allResults.length);
      console.log("🔍 Search results after filter:", filteredResults.length);

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearchLoading(false);
    }
  };
  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);

    // Debounce search
    if (searchQuery.length >= 2) {
      setTimeout(() => searchUsers(searchQuery), 300);
    } else {
      setSearchResults([]);
    }
  };

  const renderUserCard = (userInfo, actionType = "suggest") => {
    const displayName =
      userInfo.displayName ||
      `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() ||
      "Người dùng ẩn danh";

    return (
      <div key={userInfo.id} className={styles.userCard}>
        <div className={styles.userAvatar}>
          {userInfo.avatar ? (
            <img src={userInfo.avatar} alt={displayName} />
          ) : (
            <AiOutlineUser className={styles.avatarIcon} />
          )}
        </div>

        <div className={styles.userInfo}>
          <h4 className={styles.userName}>{displayName}</h4>
          {userInfo.title && (
            <p className={styles.userTitle}>{userInfo.title}</p>
          )}
          {userInfo.location && (
            <p className={styles.userLocation}>{userInfo.location}</p>
          )}
        </div>

        <div className={styles.userActions}>
          {actionType === "suggest" && (
            <button
              className={styles.connectBtn}
              onClick={() => sendFriendRequest(userInfo.id)}
            >
              <AiOutlineUserAdd className={styles.actionIcon} />
              Kết nối
            </button>
          )}
          {actionType === "received" && (
            <>
              <button
                className={styles.acceptBtn}
                onClick={() =>
                  acceptFriendRequest(userInfo.requestId, userInfo.fromUserId)
                }
              >
                <AiOutlineCheck className={styles.actionIcon} />
                Chấp nhận
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => rejectFriendRequest(userInfo.requestId)}
              >
                <AiOutlineClose className={styles.actionIcon} />
                Từ chối
              </button>
            </>
          )}{" "}
          {actionType === "sent" && (
            <button
              className={styles.cancelBtn}
              onClick={() =>
                cancelFriendRequest(userInfo.requestId, userInfo.id)
              }
            >
              <AiOutlineClose className={styles.actionIcon} />
              Hủy yêu cầu
            </button>
          )}{" "}
          {actionType === "friend" && (
            <button
              className={styles.removeFriendBtn}
              onClick={() => handleRemoveFriend(userInfo)}
            >
              <AiOutlineClose className={styles.actionIcon} />
              Hủy kết bạn
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <AiOutlineLoading3Quarters className={styles.loadingIcon} />
        <span>Đang tải...</span>
      </div>
    );
  }

  return (
    <div className={styles.myNetworkPage}>
      <div className={styles.header}>
        <h1>Mạng lưới của tôi</h1>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          {searchLoading && (
            <AiOutlineLoading3Quarters className={styles.searchLoadingIcon} />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "suggestions" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("suggestions")}
        >
          Gợi ý ({suggestedUsers.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "received" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("received")}
        >
          Lời mời nhận ({receivedRequests.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "sent" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Lời mời đã gửi ({sentRequests.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "friends" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Bạn bè ({friends.length})
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className={styles.section}>
            <h2>Kết quả tìm kiếm</h2>
            <div className={styles.userGrid}>
              {searchResults.map((user) => renderUserCard(user, "suggest"))}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "suggestions" && (
          <div className={styles.section}>
            <h2>Gợi ý kết nối</h2>
            {suggestedUsers.length > 0 ? (
              <div className={styles.userGrid}>
                {suggestedUsers.map((user) => renderUserCard(user, "suggest"))}
              </div>
            ) : (
              <p className={styles.emptyState}>Không có gợi ý nào.</p>
            )}
          </div>
        )}

        {activeTab === "received" && (
          <div className={styles.section}>
            <h2>Lời mời kết bạn</h2>
            {receivedRequests.length > 0 ? (
              <div className={styles.userGrid}>
                {receivedRequests.map((request) =>
                  renderUserCard(
                    {
                      ...request.userInfo,
                      requestId: request.id,
                      fromUserId: request.fromUserId,
                    },
                    "received"
                  )
                )}
              </div>
            ) : (
              <p className={styles.emptyState}>Không có lời mời nào.</p>
            )}
          </div>
        )}

        {activeTab === "sent" && (
          <div className={styles.section}>
            <h2>Lời mời đã gửi</h2>
            {sentRequests.length > 0 ? (
              <div className={styles.userGrid}>
                {sentRequests.map((request) =>
                  renderUserCard(
                    {
                      ...request.userInfo,
                      requestId: request.id,
                    },
                    "sent"
                  )
                )}
              </div>
            ) : (
              <p className={styles.emptyState}>Chưa gửi lời mời nào.</p>
            )}
          </div>
        )}

        {activeTab === "friends" && (
          <div className={styles.section}>
            <h2>Danh sách bạn bè</h2>
            {friends.length > 0 ? (
              <div className={styles.userGrid}>
                {friends.map((friend) => renderUserCard(friend, "friend"))}
              </div>
            ) : (
              <p className={styles.emptyState}>Chưa có bạn bè nào.</p>
            )}
          </div>
        )}
      </div>

      {/* Remove Friend Confirmation Modal */}
      <Modal
        title="Xác nhận hủy kết bạn"
        open={removeFriendModalOpen}
        onOk={confirmRemoveFriend}
        onCancel={cancelRemoveFriend}
        okText="Hủy kết bạn"
        cancelText="Hủy bỏ"
        okType="danger"
        centered
      >
        <p>
          Bạn có chắc chắn muốn hủy kết bạn với{" "}
          <strong>
            {friendToRemove?.displayName ||
              friendToRemove?.firstName + " " + friendToRemove?.lastName ||
              "người này"}
          </strong>
          ?
        </p>
        <p>
          <em>Lưu ý: Lịch sử trò chuyện sẽ được giữ lại.</em>
        </p>
      </Modal>
    </div>
  );
};

export default MyNetworkPage;
