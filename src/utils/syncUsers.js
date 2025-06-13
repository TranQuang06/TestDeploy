import { collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Đồng bộ tất cả users từ Authentication vào collection users
export const syncUsersToFirestore = async () => {
  try {
    console.log("Syncing users to Firestore...");

    // Lấy tất cả friendships để tìm user IDs
    const friendshipsRef = collection(db, "friendships");
    const friendshipsSnapshot = await getDocs(friendshipsRef);

    const userIds = new Set();

    friendshipsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.users && Array.isArray(data.users)) {
        data.users.forEach((userId) => userIds.add(userId));
      }
    });

    console.log("Found user IDs:", Array.from(userIds));

    // Tạo users mặc định cho những ID chưa có
    for (const userId of userIds) {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log(`Creating user document for: ${userId}`);

        await setDoc(userRef, {
          name: `User ${userId.substring(0, 8)}`,
          email: `${userId}@example.com`,
          photoURL: `https://i.pravatar.cc/150?u=${userId}`,
          isOnline: false,
          lastSeen: new Date(),
          createdAt: new Date(),
        });

        console.log(`Created user: ${userId}`);
      } else {
        console.log(`User already exists: ${userId}`);
      }
    }

    console.log("User sync completed!");
    return Array.from(userIds);
  } catch (error) {
    console.error("Error syncing users:", error);
    throw error;
  }
};

// Tạo user mới với thông tin cụ thể
export const createUserIfNotExists = async (userId, userInfo = {}) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const defaultUserData = {
        firstName: userInfo.firstName || `User`,
        surname: userInfo.surname || userId.substring(0, 8),
        email: userInfo.email || `${userId}@example.com`,
        avatar: userInfo.avatar || userInfo.photoURL || null,
        photoURL: userInfo.avatar || userInfo.photoURL || null, // Compatibility
        isOnline: userInfo.isOnline || false,
        lastSeen: new Date(),
        createdAt: new Date(),
      };

      await setDoc(userRef, defaultUserData);
      console.log(`Created user: ${userId}`, defaultUserData);

      // Trả về với tên hiển thị
      return {
        id: userId,
        ...defaultUserData,
        name: `${defaultUserData.firstName} ${defaultUserData.surname}`,
        displayName: `${defaultUserData.firstName} ${defaultUserData.surname}`,
      };
    }

    const userData = userDoc.data();
    // Tạo tên hiển thị cho user đã tồn tại
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

    // Lấy avatar từ trường avatar, fallback về photoURL
    const avatarUrl = userData.avatar || userData.photoURL || null;

    return {
      id: userDoc.id,
      ...userData,
      name: displayName,
      displayName: displayName,
      photoURL: avatarUrl, // Compatibility
      avatar: avatarUrl,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
