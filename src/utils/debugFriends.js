import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Debug function to check friendships data
export const debugFriends = {
  async checkFriendships() {
    try {
      console.log("=== DEBUG FRIENDSHIPS ===");

      // Lấy tất cả friendships
      const friendshipsRef = collection(db, "friendships");
      const snapshot = await getDocs(friendshipsRef);

      console.log(`Total friendships found: ${snapshot.docs.length}`);

      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`Friendship ${index + 1}:`, {
          id: doc.id,
          users: data.users,
          createdAt: data.createdAt,
          status: data.status,
        });
      });

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error checking friendships:", error);
      return [];
    }
  },

  async checkUsers() {
    try {
      console.log("=== DEBUG USERS ===");

      // Lấy tất cả users
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      console.log(`Total users found: ${snapshot.docs.length}`);

      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`User ${index + 1}:`, {
          id: doc.id,
          name: data.name,
          email: data.email,
          photoURL: data.photoURL,
        });
      });

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error checking users:", error);
      return [];
    }
  },

  async checkSpecificUserFriends(userId) {
    try {
      console.log(`=== DEBUG FRIENDS FOR USER ${userId} ===`);

      // Kiểm tra user có tồn tại không
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        console.log("User not found in users collection");
        return [];
      }

      console.log("User found:", userDoc.data());

      // Tìm friendships của user này
      const friendshipsRef = collection(db, "friendships");
      const snapshot = await getDocs(friendshipsRef);

      const userFriendships = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.users && data.users.includes(userId)) {
          userFriendships.push({ id: doc.id, ...data });
        }
      });

      console.log(`Friendships for user ${userId}:`, userFriendships);

      // Lấy thông tin chi tiết của từng bạn
      const friends = [];
      for (const friendship of userFriendships) {
        const friendId = friendship.users.find((id) => id !== userId);
        if (friendId) {
          const friendDoc = await getDoc(doc(db, "users", friendId));
          if (friendDoc.exists()) {
            friends.push({
              id: friendDoc.id,
              ...friendDoc.data(),
            });
          }
        }
      }

      console.log(`Friends data for user ${userId}:`, friends);
      return friends;
    } catch (error) {
      console.error("Error checking specific user friends:", error);
      return [];
    }
  },
};
