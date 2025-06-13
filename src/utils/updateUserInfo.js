import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

// Hàm để cập nhật thông tin user hiện tại với ảnh đại diện
export const updateCurrentUserInfo = async () => {
  try {
    console.log("Updating user info with profile images...");

    // Lấy tất cả users hiện tại
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const sampleAvatars = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b1d7?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    ];

    let avatarIndex = 0;

    for (const docSnap of snapshot.docs) {
      const userData = docSnap.data();
      const userId = docSnap.id;

      // Nếu user chưa có photoURL hoặc đang dùng placeholder
      if (!userData.photoURL || userData.photoURL.includes("pravatar.cc")) {
        const newPhotoURL = sampleAvatars[avatarIndex % sampleAvatars.length];
        avatarIndex++;

        const userRef = doc(db, "users", userId);
        await setDoc(
          userRef,
          {
            ...userData,
            photoURL: newPhotoURL,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        console.log(
          `Updated photo for user ${userId}: ${userData.firstName} ${userData.surname}`
        );
      }

      // Đảm bảo có name field
      if (!userData.name && (userData.firstName || userData.surname)) {
        const displayName = `${userData.firstName || ""} ${
          userData.surname || ""
        }`.trim();

        const userRef = doc(db, "users", userId);
        await setDoc(
          userRef,
          {
            ...userData,
            name: displayName,
            displayName: displayName,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        console.log(`Updated name for user ${userId}: ${displayName}`);
      }
    }

    console.log("User info update completed!");
    return "Success";
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

// Tạo sample users với thông tin đầy đủ
export const createSampleUsersWithFullInfo = async () => {
  try {
    console.log("Creating sample users with full info...");

    const sampleUsers = [
      {
        id: "sample_user_1",
        firstName: "Nguyễn",
        surname: "Văn A",
        email: "nguyenvana@example.com",
        photoURL:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
        role: "job_seeker",
      },
      {
        id: "sample_user_2",
        firstName: "Trần",
        surname: "Thị B",
        email: "tranthib@example.com",
        photoURL:
          "https://images.unsplash.com/photo-1494790108755-2616b612b1d7?w=150&h=150&fit=crop&crop=face",
        isOnline: false,
        role: "job_seeker",
      },
      {
        id: "sample_user_3",
        firstName: "Lê",
        surname: "Minh C",
        email: "leminhc@example.com",
        photoURL:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
        role: "job_seeker",
      },
    ];

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

    console.log("Sample users created successfully!");
    return sampleUsers;
  } catch (error) {
    console.error("Error creating sample users:", error);
    throw error;
  }
};
