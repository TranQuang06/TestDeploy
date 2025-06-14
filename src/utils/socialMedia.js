/**
 * Social Media Utilities
 * Handles posts, likes, comments, follows and other social features
 */

import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  writeBatch,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// ===============================
// POST MANAGEMENT
// ===============================

/**
 * Create a new post
 */
export const createPost = async (authorId, postData) => {
  try {
    // Get author info
    const authorDoc = await getDoc(doc(db, "users", authorId));
    if (!authorDoc.exists()) {
      throw new Error("Author not found");
    }

    const authorInfo = authorDoc.data();

    const post = {
      authorId,
      authorInfo: {
        displayName:
          authorInfo.displayName ||
          `${authorInfo.firstName} ${authorInfo.lastName}`,
        avatar: authorInfo.avatar || "",
        isVerified: authorInfo.isVerified || false,
      },
      content: postData.content || "",
      type: postData.type || "text",
      media: postData.media || [],
      visibility: postData.visibility || "public",
      stats: {
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        viewCount: 0,
      },
      tags: postData.tags || [],
      mentions: postData.mentions || [],
      location: postData.location || null,
      isEdited: false,
      isPinned: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    // Add post to posts collection
    const postRef = await addDoc(collection(db, "posts"), post);

    // Update user's post count
    await updateDoc(doc(db, "users", authorId), {
      "stats.postCount": increment(1),
      updatedAt: new Date().toISOString(),
    });

    return { id: postRef.id, ...post };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

/**
 * Get posts feed for user (with pagination)
 */
export const getPostsFeed = async (
  userId,
  lastPostDoc = null,
  limitCount = 10
) => {
  try {
    // Simplified query to avoid index requirements
    let q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (lastPostDoc) {
      q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastPostDoc),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const posts = [];

    snapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      posts,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === limitCount,
    };
  } catch (error) {
    console.error("Error getting posts feed:", error);
    throw error;
  }
};

/**
 * Get posts by specific user
 */
export const getUserPosts = async (
  authorId,
  lastPostDoc = null,
  limitCount = 10
) => {
  try {
    let q = query(
      collection(db, "posts"),
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (lastPostDoc) {
      q = query(
        collection(db, "posts"),
        where("authorId", "==", authorId),
        orderBy("createdAt", "desc"),
        startAfter(lastPostDoc),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const posts = [];

    snapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      posts,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === limitCount,
    };
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

// ===============================
// LIKE SYSTEM
// ===============================

/**
 * Like or unlike a post
 */
export const togglePostLike = async (userId, postId) => {
  try {
    const batch = writeBatch(db);

    // Check if like already exists
    const likesQuery = query(
      collection(db, "likes"),
      where("userId", "==", userId),
      where("targetType", "==", "post"),
      where("targetId", "==", postId)
    );

    const likesSnapshot = await getDocs(likesQuery);

    if (likesSnapshot.empty) {
      // Add like
      const likeRef = doc(collection(db, "likes"));
      batch.set(likeRef, {
        userId,
        targetType: "post",
        targetId: postId,
        createdAt: new Date().toISOString(),
      });

      // Increment post like count
      const postRef = doc(db, "posts", postId);
      batch.update(postRef, {
        "stats.likeCount": increment(1),
      });

      // Update post author's likes received
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        if (postData.authorId !== userId) {
          // Don't count self-likes
          batch.update(doc(db, "users", postData.authorId), {
            "stats.likesReceived": increment(1),
          });
        }
      }

      await batch.commit();
      return { liked: true };
    } else {
      // Remove like
      const likeDoc = likesSnapshot.docs[0];
      batch.delete(likeDoc.ref);

      // Decrement post like count
      const postRef = doc(db, "posts", postId);
      batch.update(postRef, {
        "stats.likeCount": increment(-1),
      });

      // Update post author's likes received
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        if (postData.authorId !== userId) {
          batch.update(doc(db, "users", postData.authorId), {
            "stats.likesReceived": increment(-1),
          });
        }
      }

      await batch.commit();
      return { liked: false };
    }
  } catch (error) {
    console.error("Error toggling post like:", error);
    throw error;
  }
};

/**
 * Check if user has liked a post
 */
export const hasUserLikedPost = async (userId, postId) => {
  try {
    console.log("🔍 Checking like for:", { userId, postId });

    const likesQuery = query(
      collection(db, "likes"),
      where("userId", "==", userId),
      where("targetType", "==", "post"),
      where("targetId", "==", postId)
    );

    const snapshot = await getDocs(likesQuery);
    const isLiked = !snapshot.empty;

    console.log("❤️ Like check result:", {
      userId,
      postId,
      isLiked,
      docsCount: snapshot.size,
    });

    return isLiked;
  } catch (error) {
    console.error("Error checking post like:", error);
    return false;
  }
};

// ===============================
// COMMENT SYSTEM
// ===============================

/**
 * Add comment to post
 */
export const addComment = async (
  userId,
  postId,
  content,
  media = null,
  parentCommentId = null
) => {
  try {
    console.log("🔍 Adding comment:", {
      userId,
      postId,
      content,
      media,
      parentCommentId,
    });

    // Get commenter info
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userInfo = userDoc.data();
    const comment = {
      postId,
      authorId: userId,
      authorInfo: {
        displayName:
          userInfo.displayName ||
          `${userInfo.firstName || "User"} ${userInfo.lastName || ""}`.trim() ||
          userInfo.email?.split("@")[0] ||
          "Anonymous User",
        avatar: userInfo.avatar || "",
      },
      content,
      media: media || null, // Add media field
      parentCommentId: parentCommentId || null,
      stats: {
        likeCount: 0,
        replyCount: 0,
      },
      mentions: [], // Extract mentions from content if needed
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("📝 Comment data to save:", comment);

    const batch = writeBatch(db);

    // Add comment
    const commentRef = doc(collection(db, "comments"));
    batch.set(commentRef, comment);

    console.log("💾 Adding comment with ID:", commentRef.id);

    // Update post comment count
    batch.update(doc(db, "posts", postId), {
      "stats.commentCount": increment(1),
    });

    // If it's a reply, update parent comment reply count
    if (parentCommentId) {
      batch.update(doc(db, "comments", parentCommentId), {
        "stats.replyCount": increment(1),
      });
    }

    // Update post author's comments received
    const postDoc = await getDoc(doc(db, "posts", postId));
    if (postDoc.exists()) {
      const postData = postDoc.data();
      if (postData.authorId !== userId) {
        batch.update(doc(db, "users", postData.authorId), {
          "stats.commentsReceived": increment(1),
        });
      }
    }

    console.log("🚀 Committing batch...");
    await batch.commit();
    console.log("✅ Comment added successfully!");

    return { id: commentRef.id, ...comment };
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    throw error;
  }
};

/**
 * Simple version of add comment - just adds comment without updating stats
 */
export const addCommentSimple = async (
  userId,
  postId,
  content,
  media = null,
  parentCommentId = null
) => {
  try {
    console.log("🔍 Adding comment (simple):", {
      userId,
      postId,
      content,
      media,
      parentCommentId,
    });

    // Get commenter info
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userInfo = userDoc.data();
    const comment = {
      postId,
      authorId: userId,
      authorInfo: {
        displayName:
          userInfo.displayName ||
          `${userInfo.firstName || "User"} ${userInfo.lastName || ""}`.trim() ||
          userInfo.email?.split("@")[0] ||
          "Anonymous User",
        avatar: userInfo.avatar || "",
      },
      content,
      media: media || null,
      parentCommentId: parentCommentId || null,
      stats: {
        likeCount: 0,
        replyCount: 0,
      },
      mentions: [],
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("📝 Comment data to save:", comment);

    // Add comment only - no batch operations
    const commentRef = doc(collection(db, "comments"));
    await setDoc(commentRef, comment);
    console.log("✅ Comment saved with ID:", commentRef.id);

    // Try to update post comment count - but don't fail if it doesn't work
    try {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const currentStats = postDoc.data().stats || {};
        await updateDoc(postRef, {
          "stats.commentCount": (currentStats.commentCount || 0) + 1,
          updatedAt: new Date().toISOString(),
        });
        console.log("✅ Post comment count updated");
      }
    } catch (updateError) {
      console.warn("⚠️ Could not update post comment count:", updateError);
      // Don't throw error - comment was still added successfully
      // The count will be corrected by recalculateCommentCount later
    }

    return { id: commentRef.id, ...comment };
  } catch (error) {
    console.error("❌ Error adding comment (simple):", error);
    throw error;
  }
};

/**
 * Get comments for a post
 */
export const getPostComments = async (postId, limitCount = 50) => {
  try {
    // Get all comments for this post (including replies)
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const comments = [];

    snapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`📊 Retrieved ${comments.length} comments for post ${postId}`);
    return comments;
  } catch (error) {
    console.error("Error getting post comments:", error);
    // If there's an index error, try a simpler query
    if (error.code === "failed-precondition") {
      try {
        console.log("🔄 Trying simpler query without orderBy...");
        const simpleQ = query(
          collection(db, "comments"),
          where("postId", "==", postId),
          limit(limitCount)
        );
        const simpleSnapshot = await getDocs(simpleQ);
        const simpleComments = [];

        simpleSnapshot.forEach((doc) => {
          simpleComments.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Sort manually by createdAt
        simpleComments.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        console.log(
          `📊 Retrieved ${simpleComments.length} comments with simple query`
        );
        return simpleComments;
      } catch (simpleError) {
        console.error("Simple query also failed:", simpleError);
        throw simpleError;
      }
    }
    throw error;
  }
};

// ===============================
// FOLLOW SYSTEM
// ===============================

/**
 * Follow or unfollow a user
 */
export const toggleUserFollow = async (followerId, followingId) => {
  try {
    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    const batch = writeBatch(db);

    // Check if already following
    const followQuery = query(
      collection(db, "follows"),
      where("followerId", "==", followerId),
      where("followingId", "==", followingId)
    );

    const followSnapshot = await getDocs(followQuery);

    if (followSnapshot.empty) {
      // Add follow
      const followRef = doc(collection(db, "follows"));
      batch.set(followRef, {
        followerId,
        followingId,
        status: "active",
        createdAt: new Date().toISOString(),
      });

      // Update follower's following count
      batch.update(doc(db, "users", followerId), {
        "stats.followingCount": increment(1),
      });

      // Update following user's follower count
      batch.update(doc(db, "users", followingId), {
        "stats.followerCount": increment(1),
      });

      await batch.commit();
      return { following: true };
    } else {
      // Remove follow
      const followDoc = followSnapshot.docs[0];
      batch.delete(followDoc.ref);

      // Update counts
      batch.update(doc(db, "users", followerId), {
        "stats.followingCount": increment(-1),
      });

      batch.update(doc(db, "users", followingId), {
        "stats.followerCount": increment(-1),
      });

      await batch.commit();
      return { following: false };
    }
  } catch (error) {
    console.error("Error toggling user follow:", error);
    throw error;
  }
};

/**
 * Check if user is following another user
 */
export const isUserFollowing = async (followerId, followingId) => {
  try {
    const followQuery = query(
      collection(db, "follows"),
      where("followerId", "==", followerId),
      where("followingId", "==", followingId),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(followQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

// ===============================
// USER ACTIVITY TRACKING
// ===============================

/**
 * Update user's last active timestamp
 */
export const updateUserActivity = async (userId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      lastActiveAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user activity:", error);
  }
};

/**
 * Get trending posts (posts with high engagement in last 24 hours)
 */
export const getTrendingPosts = async (limitCount = 10) => {
  try {
    // Simplified query to avoid index requirements
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(limitCount * 2) // Get more to filter by engagement
    );

    const snapshot = await getDocs(q);
    const posts = [];

    snapshot.forEach((doc) => {
      const postData = doc.data();
      const engagementScore =
        (postData.stats?.likeCount || 0) +
        (postData.stats?.commentCount || 0) * 2 +
        (postData.stats?.shareCount || 0) * 3;

      posts.push({
        id: doc.id,
        ...postData,
        engagementScore,
      });
    });

    // Sort by engagement and return top posts
    return posts
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error getting trending posts:", error);
    throw error;
  }
};

/**
 * Delete a post (only by post author)
 */
export const deletePost = async (postId, userId) => {
  try {
    console.log("🗑️ Simple delete post:", { postId, userId });

    if (!postId || !userId) {
      throw new Error("Post ID and User ID are required");
    }

    // First check if the post exists and user owns it
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    const postData = postDoc.data();
    console.log("📝 Post ownership check:", {
      authorId: postData.authorId,
      userId,
      match: postData.authorId === userId,
    });

    // Check if user owns the post
    if (postData.authorId !== userId) {
      throw new Error("You can only delete your own posts");
    }

    // Simple delete - just delete the main post
    await deleteDoc(postRef); // Try to update user's post count (optional, don't fail if it doesn't work)
    try {
      await updateDoc(doc(db, "users", userId), {
        "stats.postCount": increment(-1),
        updatedAt: new Date().toISOString(),
      });
    } catch (statsError) {
      // Silently ignore stats update errors
    }

    console.log("✅ Post deleted successfully:", postId);
    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    throw error;
  }
};

/**
 * Simple delete post function (fallback)
 */
export const deletePostSimple = async (postId, userId) => {
  try {
    console.log("🗑️ Simple delete post:", { postId, userId });

    // First check if the post exists and user owns it
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    const postData = postDoc.data();

    // Check if user owns the post
    if (postData.authorId !== userId) {
      throw new Error("You can only delete your own posts");
    }

    // Just delete the post (don't worry about related data for now)
    await deleteDoc(postRef);

    // Try to update user stats, but don't fail if it doesn't work
    try {
      await updateDoc(doc(db, "users", userId), {
        "stats.postCount": increment(-1),
        updatedAt: new Date().toISOString(),
      });
    } catch (statsError) {
      console.warn("⚠️ Could not update user stats:", statsError);
    }

    console.log("✅ Post deleted successfully (simple):", postId);
    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("❌ Error in simple delete:", error);
    throw error;
  }
};

/**
 * Update post visibility
 */
export const updatePostVisibility = async (postId, userId, newVisibility) => {
  try {
    // Check if the post exists and user owns it
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    const postData = postDoc.data();

    // Check if user owns the post
    if (postData.authorId !== userId) {
      throw new Error("You can only edit your own posts");
    }

    // Update post visibility
    await updateDoc(postRef, {
      visibility: newVisibility,
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Post visibility updated:", { postId, newVisibility });
    return { success: true, visibility: newVisibility };
  } catch (error) {
    console.error("❌ Error updating post visibility:", error);
    throw error;
  }
};

/**
 * Save post to user's saved posts
 */
export const savePost = async (userId, postId) => {
  try {
    // Check if post exists
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    // Check if already saved
    const savedPostsQuery = query(
      collection(db, "saved_posts"),
      where("userId", "==", userId),
      where("postId", "==", postId)
    );
    const savedPostsSnapshot = await getDocs(savedPostsQuery);

    if (!savedPostsSnapshot.empty) {
      throw new Error("Post already saved");
    }

    // Save the post
    await addDoc(collection(db, "saved_posts"), {
      userId,
      postId,
      createdAt: new Date().toISOString(),
    });

    // Update user's saved posts count
    await updateDoc(doc(db, "users", userId), {
      "stats.savedPostsCount": increment(1),
      updatedAt: new Date().toISOString(),
    });
    console.log("✅ Post saved successfully:", postId);
    return { success: true, message: "Post saved successfully" };
  } catch (error) {
    console.error("❌ Error saving post:", error);
    throw error;
  }
};

/**
 * Unsave a post from user's saved posts
 */
export const unsavePost = async (userId, postId) => {
  try {
    // Find the saved post record
    const savedPostsQuery = query(
      collection(db, "saved_posts"),
      where("userId", "==", userId),
      where("postId", "==", postId)
    );
    const savedPostsSnapshot = await getDocs(savedPostsQuery);

    if (savedPostsSnapshot.empty) {
      throw new Error("Post is not saved");
    }

    // Delete the saved post record
    const batch = writeBatch(db);
    savedPostsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Update user's saved posts count
    await updateDoc(doc(db, "users", userId), {
      "stats.savedPostsCount": increment(-1),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Post unsaved successfully:", postId);
    return { success: true, message: "Post unsaved successfully" };
  } catch (error) {
    console.error("❌ Error unsaving post:", error);
    throw error;
  }
};

/**
 * Get user's saved posts
 */
export const getSavedPosts = async (
  userId,
  limitCount = 10,
  lastDoc = null
) => {
  try {
    // First get saved post IDs
    let savedPostsQuery = query(
      collection(db, "saved_posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (lastDoc) {
      savedPostsQuery = query(
        collection(db, "saved_posts"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const savedPostsSnapshot = await getDocs(savedPostsQuery);

    if (savedPostsSnapshot.empty) {
      return {
        posts: [],
        lastDocument: null,
        hasMore: false,
      };
    }

    // Get post IDs
    const postIds = savedPostsSnapshot.docs.map((doc) => doc.data().postId);

    // Get actual posts
    const posts = [];
    for (const postId of postIds) {
      try {
        const postDoc = await getDoc(doc(db, "posts", postId));
        if (postDoc.exists()) {
          posts.push({
            id: postDoc.id,
            ...postDoc.data(),
          });
        }
      } catch (error) {
        console.warn("Post not found:", postId);
      }
    }

    return {
      posts,
      lastDocument: savedPostsSnapshot.docs[savedPostsSnapshot.docs.length - 1],
      hasMore: savedPostsSnapshot.docs.length === limitCount,
    };
  } catch (error) {
    console.error("❌ Error getting saved posts:", error);
    throw error;
  }
};

/**
 * Update user avatar in all their posts
 */
export const updateUserAvatarInPosts = async (
  userId,
  newAvatar,
  newDisplayName = null
) => {
  try {
    console.log(`🔄 Updating avatar in all posts for user: ${userId}`);

    // Get all posts by this user
    const q = query(collection(db, "posts"), where("authorId", "==", userId));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("📭 No posts found for this user");
      return;
    }

    const batch = writeBatch(db);
    let updateCount = 0;

    querySnapshot.forEach((doc) => {
      const postRef = doc.ref;
      const updateData = {
        "authorInfo.avatar": newAvatar,
        updatedAt: new Date().toISOString(),
      };

      // Also update display name if provided
      if (newDisplayName) {
        updateData["authorInfo.displayName"] = newDisplayName;
      }

      batch.update(postRef, updateData);
      updateCount++;
    });

    // Commit all updates
    await batch.commit();

    console.log(`✅ Updated avatar in ${updateCount} posts`);
    return updateCount;
  } catch (error) {
    console.error("❌ Error updating user avatar in posts:", error);
    throw error;
  }
};

/**
 * Recalculate comment count for a post
 */
export const recalculateCommentCount = async (postId) => {
  try {
    console.log("🔢 Recalculating comment count for post:", postId);

    // Count comments in database
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const actualCount = commentsSnapshot.size;

    console.log("📊 Actual comment count:", actualCount);

    // Update post with correct count
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      "stats.commentCount": actualCount,
    });

    console.log("✅ Comment count updated to:", actualCount);
    return actualCount;
  } catch (error) {
    console.error("❌ Error recalculating comment count:", error);
    throw error;
  }
};

export default {
  // Posts
  createPost,
  getPostsFeed,
  getUserPosts,
  getTrendingPosts,
  deletePost,
  deletePostSimple,
  deletePostSimple,
  savePost,
  unsavePost,
  getSavedPosts,
  updatePostVisibility,

  // Likes
  togglePostLike,
  hasUserLikedPost,
  // Comments
  addComment,
  addCommentSimple,
  getPostComments,
  recalculateCommentCount,

  // Follows
  toggleUserFollow,
  isUserFollowing,

  // Activity
  updateUserActivity,

  // Avatar
  updateUserAvatarInPosts,

  // Recalculate comment count
  recalculateCommentCount,
};
