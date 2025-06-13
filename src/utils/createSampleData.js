// Script to create sample posts for testing
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const createSamplePost = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be logged in");
    }

    // Create a sample post
    const samplePost = {
      authorId: user.uid,
      authorInfo: {
        displayName: user.displayName || "Test User",
        avatar: user.photoURL || null,
        isVerified: false,
      },
      content: "Welcome to our social media platform! 🎉",
      media: [],
      tags: ["welcome", "social"],
      visibility: "public",
      stats: {
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add the post to Firestore
    const docRef = await addDoc(collection(db, "posts"), samplePost);
    console.log("✅ Sample post created with ID:", docRef.id);

    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating sample post:", error);
    throw error;
  }
};

export const createSampleUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be logged in");
    }

    // Check if user profile exists in social media format
    const userProfile = {
      // Keep existing fields
      firstName: user.displayName?.split(" ")[0] || "Test",
      surname: user.displayName?.split(" ")[1] || "User",
      email: user.email,
      createdAt: new Date().toISOString(),
      role: "user",
      profileComplete: true,
      emailVerified: user.emailVerified,

      // Add social media fields
      avatar: user.photoURL || null,
      bio: "Welcome to my profile!",
      location: "",
      website: "",
      stats: {
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
      },
      privacy: {
        profileVisibility: "public",
        allowMessages: true,
        showEmail: false,
      },
      socialLinks: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
      preferences: {
        notifications: {
          likes: true,
          comments: true,
          follows: true,
          messages: true,
        },
        privacy: {
          showOnlineStatus: true,
          allowTagging: true,
        },
      },
      updatedAt: new Date().toISOString(),
    };

    // Update user document
    await setDoc(doc(db, "users", user.uid), userProfile, { merge: true });
    console.log("✅ User profile updated for social media");

    return userProfile;
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    throw error;
  }
};

// Function to run both
export const initializeSampleData = async () => {
  try {
    console.log("🚀 Initializing sample data...");

    // Update user profile first
    await createSampleUserProfile();

    // Create sample post
    const postId = await createSamplePost();

    console.log("✅ Sample data initialized successfully!");
    return { success: true, postId };
  } catch (error) {
    console.error("❌ Error initializing sample data:", error);
    return { success: false, error: error.message };
  }
};
