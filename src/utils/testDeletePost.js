/**
 * Test Delete Post Function
 * Run this in browser console to test delete functionality
 */

// Test function to debug delete post
window.testDeletePost = async (postId) => {
  console.log("🧪 Testing delete post function...");

  try {
    // Get current user
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ No user logged in");
      return;
    }

    console.log("👤 Current user:", user.uid, user.email);

    // Get post data first
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      console.error("❌ Post not found");
      return;
    }

    const postData = postDoc.data();
    console.log("📝 Post data:", postData);
    console.log("🔍 Ownership check:", {
      postAuthor: postData.authorId,
      currentUser: user.uid,
      isOwner: postData.authorId === user.uid,
    });

    // Test delete
    const result = await deletePost(postId, user.uid);
    console.log("✅ Delete result:", result);
  } catch (error) {
    console.error("❌ Delete test failed:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
  }
};

// Instructions
console.log(`
🧪 Delete Post Test Ready!

To test:
1. Find a post ID from your posts
2. Run: testDeletePost('your-post-id')
3. Check console for detailed logs

Or inspect existing posts:
Array.from(document.querySelectorAll('[data-post-id]')).map(el => el.dataset.postId)
`);
