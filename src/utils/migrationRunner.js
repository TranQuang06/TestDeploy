/**
 * Migration Runner Script
 * Run this script to migrate users and setup social media collections
 */

import {
  migrateUsersToSocialStructure,
  createSocialMediaCollections,
  getUsersStatistics,
} from "../utils/userMigration.js";

import { createPost } from "../utils/socialMedia.js";

/**
 * Run complete migration process
 */
export const runSocialMediaMigration = async () => {
  console.log("🚀 Starting Social Media Migration Process...\n");

  try {
    // Step 1: Get current statistics
    console.log("📊 Getting current users statistics...");
    const beforeStats = await getUsersStatistics();
    console.log("Before migration:", beforeStats);
    console.log("");

    // Step 2: Migrate existing users
    console.log("👥 Migrating existing users to social structure...");
    const migrationResult = await migrateUsersToSocialStructure();
    console.log("Migration result:", migrationResult);
    console.log("");

    // Step 3: Create initial collections
    console.log("🗂️  Creating social media collections...");
    await createSocialMediaCollections();
    console.log("");

    // Step 4: Create sample posts (optional)
    console.log("📝 Creating sample posts...");
    await createSamplePosts();
    console.log("");

    // Step 5: Get final statistics
    console.log("📊 Getting final statistics...");
    const afterStats = await getUsersStatistics();
    console.log("After migration:", afterStats);
    console.log("");

    console.log("✅ Migration completed successfully!");
    console.log("🎉 Your social media platform is ready to use!");

    return {
      success: true,
      beforeStats,
      afterStats,
      migrationResult,
    };
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

/**
 * Create sample posts for testing
 */
const createSamplePosts = async () => {
  const samplePosts = [
    {
      content:
        "Chào mừng đến với nền tảng mạng xã hội mới! 🎉\n\nHãy chia sẻ những khoảnh khắc đáng nhớ của bạn với mọi người. #welcome #social #sharing",
      type: "text",
      visibility: "public",
      tags: ["welcome", "social", "sharing"],
      mentions: [],
    },
    {
      content:
        "Hôm nay là một ngày tuyệt vời để chia sẻ những suy nghĩ tích cực! ☀️\n\n#positivity #motivation #dailylife",
      type: "text",
      visibility: "public",
      tags: ["positivity", "motivation", "dailylife"],
      mentions: [],
    },
    {
      content:
        "Đang thử nghiệm tính năng đăng bài mới. Ai cũng có thể tham gia và chia sẻ nhé! 💻\n\n#testing #newfeature #community",
      type: "text",
      visibility: "public",
      tags: ["testing", "newfeature", "community"],
      mentions: [],
    },
  ];

  // Create posts with system user
  for (const postData of samplePosts) {
    try {
      const post = await createPost("system", postData);
      console.log(`✅ Created sample post: ${post.id}`);
    } catch (error) {
      console.error(`❌ Error creating sample post:`, error);
    }
  }
};

/**
 * Utility to run migration from browser console
 * Usage: window.runMigration()
 */
if (typeof window !== "undefined") {
  window.runSocialMediaMigration = runSocialMediaMigration;
  window.createSamplePosts = createSamplePosts;

  console.log(`
🔧 Social Media Migration Tools Available:

1. Run full migration:
   runSocialMediaMigration()

2. Create sample posts only:
   createSamplePosts()

3. Check current stats:
   getUsersStatistics()
  `);
}

export default {
  runSocialMediaMigration,
  createSamplePosts,
};
