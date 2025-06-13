/**
 * Firebase Users Collection Migration Utility
 * Migrates existing users to optimized social media structure
 */

import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
  getDoc,
  setDoc,
} from "firebase/firestore";

/**
 * Migrate existing users to new social media structure
 * This function safely updates existing user documents
 */
export const migrateUsersToSocialStructure = async () => {
  try {
    console.log("🚀 Starting users migration to social structure...");

    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);

    let migratedCount = 0;
    let errorCount = 0;

    // Use batch writes for better performance
    const batch = writeBatch(db);

    snapshot.forEach((userDoc) => {
      try {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Create new structure while preserving existing data
        const migratedUserData = {
          // Keep existing basic info
          uid: userData.uid || userId,
          email: userData.email || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || userData.surname || "", // Map surname to lastName
          displayName:
            userData.displayName ||
            `${userData.firstName || ""} ${
              userData.surname || userData.lastName || ""
            }`.trim(),

          // Profile Info - New fields
          avatar: userData.avatar || userData.photoURL || "",
          coverPhoto: userData.coverPhoto || "",
          bio: userData.bio || "",
          dateOfBirth: userData.dateOfBirth || "",
          gender: userData.gender || "",
          location: {
            city: userData.city || userData.location?.city || "",
            country: userData.country || userData.location?.country || "",
            coordinates:
              userData.coordinates || userData.location?.coordinates || null,
          },

          // Professional Info
          profession: userData.profession || "",
          company: userData.company || "",
          website: userData.website || "",
          workExperience: userData.workExperience || "",

          // Contact Info
          phone: userData.phone || "",
          socialLinks: userData.socialLinks || {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
            github: "",
          },

          // Privacy & Settings - Default values
          privacySettings: userData.privacySettings || {
            profileVisibility: "public",
            postDefaultVisibility: "public",
            allowMessagesFrom: "everyone",
            showEmail: false,
            showPhone: false,
            showLocation: false,
          },

          // Activity Stats - Initialize if not exists
          stats: userData.stats || {
            postCount: 0,
            followerCount: 0,
            followingCount: 0,
            friendCount: 0,
            likesReceived: 0,
            commentsReceived: 0,
          },

          // Account Status - Keep existing or set defaults
          role: userData.role || "user",
          isVerified: userData.isVerified || false,
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          emailVerified: userData.emailVerified || false,
          profileComplete: userData.profileComplete || false,

          // Additional Features
          interests: userData.interests || [],
          skills: userData.skills || [],
          languages: userData.languages || [],
          timezone: userData.timezone || "",
          theme: userData.theme || "light",
          notifications: userData.notifications || {
            email: true,
            push: true,
            likes: true,
            comments: true,
            follows: true,
            messages: true,
          },

          // Timestamps - Keep existing or set current
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastActiveAt: userData.lastActiveAt || new Date().toISOString(),

          // Legacy fields preservation (for backward compatibility)
          surname: userData.surname || "", // Keep for backward compatibility
          address: userData.address || "", // Keep existing address
          experience: userData.experience || [],
          education: userData.education || [],
          certifications: userData.certifications || [],
          preferences: userData.preferences || {},
        };

        // Remove undefined values to keep document clean
        const cleanedData = removeUndefinedValues(migratedUserData);

        // Add to batch
        const userDocRef = doc(db, "users", userId);
        batch.update(userDocRef, cleanedData);

        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrating user ${userDoc.id}:`, error);
        errorCount++;
      }
    });

    // Commit batch write
    await batch.commit();

    console.log(`✅ Migration completed! 
      - Migrated: ${migratedCount} users
      - Errors: ${errorCount} users
      - Total processed: ${snapshot.size} users`);

    return {
      success: true,
      migratedCount,
      errorCount,
      totalProcessed: snapshot.size,
    };
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

/**
 * Create initial social media collections
 */
export const createSocialMediaCollections = async () => {
  try {
    console.log("🚀 Creating social media collections...");

    // Create sample post
    const samplePost = {
      id: "sample_post_1",
      authorId: "system",
      authorInfo: {
        displayName: "System",
        avatar: "",
        isVerified: true,
      },
      content: "Welcome to our social media platform! 🎉",
      type: "text",
      media: [],
      visibility: "public",
      stats: {
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        viewCount: 0,
      },
      tags: ["welcome", "social"],
      mentions: [],
      location: null,
      isEdited: false,
      isPinned: true,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "posts", "sample_post_1"), samplePost);

    console.log("✅ Social media collections created successfully!");
  } catch (error) {
    console.error("❌ Error creating collections:", error);
    throw error;
  }
};

/**
 * Utility function to remove undefined values from object
 */
const removeUndefinedValues = (obj) => {
  const cleaned = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        cleaned[key] = removeUndefinedValues(value);
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
};

/**
 * Validate user data structure
 */
export const validateUserStructure = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      return { valid: false, error: "User not found" };
    }

    const userData = userDoc.data();
    const requiredFields = [
      "uid",
      "email",
      "firstName",
      "displayName",
      "createdAt",
    ];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      return {
        valid: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    return { valid: true, userData };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Get user statistics
 */
export const getUsersStatistics = async () => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);

    let totalUsers = 0;
    let verifiedUsers = 0;
    let activeUsers = 0;
    let completeProfiles = 0;

    snapshot.forEach((doc) => {
      const userData = doc.data();
      totalUsers++;

      if (userData.isVerified) verifiedUsers++;
      if (userData.isActive) activeUsers++;
      if (userData.profileComplete) completeProfiles++;
    });

    return {
      totalUsers,
      verifiedUsers,
      activeUsers,
      completeProfiles,
      profileCompletionRate: ((completeProfiles / totalUsers) * 100).toFixed(2),
    };
  } catch (error) {
    console.error("Error getting users statistics:", error);
    throw error;
  }
};

export default {
  migrateUsersToSocialStructure,
  createSocialMediaCollections,
  validateUserStructure,
  getUsersStatistics,
};
