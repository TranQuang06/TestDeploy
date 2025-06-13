import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPostsFeed,
  getTrendingPosts,
  togglePostLike,
  hasUserLikedPost,
  deletePost,
  savePost,
  unsavePost,
  updatePostVisibility,
} from "../../utils/socialMedia";
import styles from "./PostList.module.css";
import { Modal, message } from "antd";
import CommentSection from "../CommentSection/CommentSection";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineUser,
  AiOutlineMore,
  AiOutlineGlobal,
  AiOutlineLoading3Quarters,
  AiOutlineDelete,
  AiOutlineSave,
  AiOutlineEye,
  AiOutlineLock,
} from "react-icons/ai";

const PostList = ({
  feedType = "timeline",
  customPosts = null,
  onLoadMore = null,
  hasMore: hasMoreProp = false,
  onPostUnsaved = null,
}) => {
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState(customPosts || []);
  const [loading, setLoading] = useState(!customPosts);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMoreInternal, setHasMoreInternal] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likingPosts, setLikingPosts] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [showComments, setShowComments] = useState(new Set());

  // Use external hasMore if provided, otherwise internal
  const hasMore = customPosts ? hasMoreProp : hasMoreInternal;

  // Update posts when customPosts change
  useEffect(() => {
    if (customPosts) {
      setPosts(customPosts);
      setLoading(false);
    }
  }, [customPosts]);

  useEffect(() => {
    if (!customPosts) {
      loadInitialPosts();
    }
  }, [feedType, customPosts]);
  // Separate useEffect to check likes when user changes
  useEffect(() => {
    if (user && posts.length > 0) {
      checkUserLikes(posts);
    }
  }, [user, posts.length]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeDropdown &&
        !event.target.closest(`.${styles.moreButtonContainer}`)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const loadInitialPosts = async () => {
    try {
      setLoading(true);
      let result;

      if (feedType === "trending") {
        const trendingPosts = await getTrendingPosts(10);
        result = {
          posts: trendingPosts,
          lastDoc: null,
          hasMore: false,
        };
      } else {
        result = await getPostsFeed(user?.uid, null, 10);
      }
      setPosts(result.posts);
      setLastDoc(result.lastDoc);
      setHasMoreInternal(result.hasMore);

      // Check which posts user has liked
      if (user) {
        await checkUserLikes(result.posts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };
  const checkUserLikes = async (postList) => {
    if (!user) return;

    console.log(
      "🔍 Checking likes for posts:",
      postList.map((p) => p.id)
    );
    const newLikedPostIds = new Set();

    await Promise.all(
      postList.map(async (post) => {
        const isLiked = await hasUserLikedPost(user.uid, post.id);
        if (isLiked) {
          newLikedPostIds.add(post.id);
        }
      })
    );

    console.log("❤️ Found liked posts:", Array.from(newLikedPostIds));

    // Merge with existing liked posts instead of replacing
    setLikedPosts((prevLiked) => {
      const mergedLiked = new Set([...prevLiked, ...newLikedPostIds]);
      console.log("❤️ Updated liked posts state:", Array.from(mergedLiked));
      return mergedLiked;
    });
  };
  const loadMorePosts = async () => {
    if (!hasMore || loading) return;

    // Use external load more if provided (for saved posts page)
    if (onLoadMore) {
      onLoadMore();
      return;
    }

    try {
      setLoading(true);
      const result = await getPostsFeed(user?.uid, lastDoc, 10);

      setPosts((prev) => [...prev, ...result.posts]);
      setLastDoc(result.lastDoc);
      setHasMoreInternal(result.hasMore);

      // Check likes for new posts
      if (user) {
        await checkUserLikes(result.posts);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!user || likingPosts.has(postId)) return;

    try {
      setLikingPosts((prev) => new Set([...prev, postId]));

      const result = await togglePostLike(user.uid, postId);

      // Update local state
      setLikedPosts((prev) => {
        const newLiked = new Set(prev);
        if (result.liked) {
          newLiked.add(postId);
        } else {
          newLiked.delete(postId);
        }
        return newLiked;
      });

      // Update post like count
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              stats: {
                ...post.stats,
                likeCount: post.stats.likeCount + (result.liked ? 1 : -1),
              },
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLikingPosts((prev) => {
        const newLiking = new Set(prev);
        newLiking.delete(postId);
        return newLiking;
      });
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return postDate.toLocaleDateString("vi-VN");
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (postId) => {
    setActiveDropdown(activeDropdown === postId ? null : postId);
  }; // Handle delete post
  const handleDeletePost = async (postId) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  // Confirm delete post
  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      console.log("🗑️ Deleting post:", postToDelete);

      // Delete post from Firebase
      await deletePost(postToDelete, user.uid);

      // Update local state
      setPosts((prev) => prev.filter((post) => post.id !== postToDelete));

      console.log("✅ Post deleted successfully");
      message.success("Đã xóa bài viết thành công!");
    } catch (error) {
      console.error("❌ Error deleting post:", error);

      let errorMessage = "Có lỗi xảy ra khi xóa bài viết!";
      if (error.message === "You can only delete your own posts") {
        errorMessage = "Bạn chỉ có thể xóa bài viết của chính mình!";
      } else if (error.message === "Post not found") {
        errorMessage = "Không tìm thấy bài viết!";
      }

      message.error(errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };
  // Cancel delete
  const cancelDeletePost = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  // Toggle comment section visibility
  const toggleComments = (postId) => {
    setShowComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }; // Handle save/unsave post
  const handleSavePost = async (postId) => {
    try {
      console.log("💾 Saving/Unsaving post:", postId);

      // If this is saved page, unsave the post
      if (feedType === "saved") {
        await unsavePost(user.uid, postId);

        // Remove from local state
        setPosts((prev) => prev.filter((post) => post.id !== postId));

        // Notify parent component
        if (onPostUnsaved) {
          onPostUnsaved(postId);
        }

        message.success("Đã bỏ lưu bài viết!");
      } else {
        // Save post to Firebase
        await savePost(user.uid, postId);
        message.success("Đã lưu bài viết!");
      }

      setActiveDropdown(null);
      console.log("✅ Post save/unsave operation completed");
    } catch (error) {
      console.error("❌ Error saving/unsaving post:", error);

      let errorMessage = "Có lỗi xảy ra khi thao tác với bài viết!";
      if (error.message === "Post already saved") {
        errorMessage = "Bài viết đã được lưu trước đó!";
      } else if (error.message === "Post not found") {
        errorMessage = "Không tìm thấy bài viết!";
      } else if (error.message === "Post is not saved") {
        errorMessage = "Bài viết chưa được lưu!";
      }

      message.error(errorMessage);
    }
  }; // Handle change visibility
  const handleChangeVisibility = async (postId, newVisibility) => {
    try {
      console.log("👁️ Updating post visibility:", { postId, newVisibility });

      // Update post visibility in Firebase
      await updatePostVisibility(postId, user.uid, newVisibility);

      // Update local state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, visibility: newVisibility } : post
        )
      );

      setActiveDropdown(null);
      const visibilityText =
        newVisibility === "public" ? "công khai" : "chỉ mình tôi";
      console.log("✅ Post visibility updated successfully");
      message.success(`Đã thay đổi đối tượng xem thành ${visibilityText}!`);
    } catch (error) {
      console.error("❌ Error updating post visibility:", error);

      let errorMessage = "Có lỗi xảy ra khi cập nhật đối tượng xem!";
      if (error.message === "You can only edit your own posts") {
        errorMessage = "Bạn chỉ có thể chỉnh sửa bài viết của chính mình!";
      } else if (error.message === "Post not found") {
        errorMessage = "Không tìm thấy bài viết!";
      }

      message.error(errorMessage);
    }
  };

  const PostItem = ({ post }) => {
    const isLiked = likedPosts.has(post.id);
    const isLiking = likingPosts.has(post.id);

    // Debug post media
    console.log("📋 Post media data:", post.media);

    return (
      <div className={styles.postItem}>
        {/* Post Header */}
        <div className={styles.postHeader}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              {post.authorInfo.avatar ? (
                <img
                  src={post.authorInfo.avatar}
                  alt={post.authorInfo.displayName}
                  className={styles.avatarImage}
                />
              ) : (
                <AiOutlineUser className={styles.avatarIcon} />
              )}
            </div>
            <div className={styles.authorDetails}>
              <div className={styles.authorName}>
                {post.authorInfo.displayName}
                {post.authorInfo.isVerified && (
                  <span className={styles.verifiedBadge}>✓</span>
                )}
              </div>
              <div className={styles.postMeta}>
                <span className={styles.postTime}>
                  {formatTimeAgo(post.createdAt)}
                </span>
                <AiOutlineGlobal className={styles.visibilityIcon} />
              </div>
            </div>{" "}
          </div>
          <div className={styles.moreButtonContainer}>
            <button
              className={styles.moreBtn}
              onClick={() => handleDropdownToggle(post.id)}
            >
              <AiOutlineMore />
            </button>

            {/* Dropdown menu */}
            {activeDropdown === post.id && (
              <div className={styles.dropdownMenu}>
                {/* Only show delete option if user owns the post */}
                {post.authorId === user?.uid && (
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <AiOutlineDelete className={styles.dropdownIcon} />
                    <span>Xóa bài viết</span>
                  </button>
                )}{" "}
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleSavePost(post.id)}
                >
                  <AiOutlineSave className={styles.dropdownIcon} />
                  <span>
                    {feedType === "saved" ? "Bỏ lưu bài viết" : "Lưu bài viết"}
                  </span>
                </button>
                {/* Only show visibility options if user owns the post */}
                {post.authorId === user?.uid && (
                  <>
                    <div className={styles.dropdownDivider}></div>
                    <div className={styles.dropdownLabel}>Đối tượng xem:</div>

                    <button
                      className={`${styles.dropdownItem} ${
                        post.visibility === "public" ? styles.active : ""
                      }`}
                      onClick={() => handleChangeVisibility(post.id, "public")}
                    >
                      <AiOutlineGlobal className={styles.dropdownIcon} />
                      <span>Công khai</span>
                      {post.visibility === "public" && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                    </button>

                    <button
                      className={`${styles.dropdownItem} ${
                        post.visibility === "private" ? styles.active : ""
                      }`}
                      onClick={() => handleChangeVisibility(post.id, "private")}
                    >
                      <AiOutlineLock className={styles.dropdownIcon} />
                      <span>Chỉ mình tôi</span>
                      {post.visibility === "private" && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>{" "}
        {/* Post Content */}
        <div className={styles.postContent}>
          {post.content && (
            <div className={styles.postText}>{post.content}</div>
          )}
          {/* Post Media */}
          {post.media && post.media.length > 0 && (
            <div className={styles.postMedia}>
              {post.media.map((media, index) => {
                console.log(`🖼️ Rendering image ${index + 1}:`, {
                  type: media.type,
                  urlLength: media.url?.length,
                  urlPrefix: media.url?.substring(0, 50),
                  isBase64: media.url?.startsWith("data:image/"),
                });
                return (
                  <div key={index} className={styles.mediaItem}>
                    {media.type === "image" && (
                      <img
                        src={media.url}
                        alt={media.alt || `Ảnh bài viết ${index + 1}`}
                        className={styles.postImage}
                        onLoad={() => {
                          console.log(
                            `✅ Image ${index + 1} loaded successfully`
                          );
                        }}
                        onError={(e) => {
                          console.error(
                            `❌ Image ${index + 1} failed to load:`,
                            {
                              src: e.target.src?.substring(0, 100),
                              error: e.type,
                            }
                          );
                        }}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {/* Post Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.postTags}>
              {post.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Post Stats */}
        <div className={styles.postStats}>
          <div className={styles.statItem}>
            <span className={styles.statCount}>
              {post.stats.likeCount} lượt thích
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statCount}>
              {post.stats.commentCount} bình luận
            </span>
          </div>
        </div>
        {/* Post Actions */}
        <div className={styles.postActions}>
          <button
            className={`${styles.actionBtn} ${isLiked ? styles.liked : ""}`}
            onClick={() => handleLikePost(post.id)}
            disabled={isLiking}
          >
            {isLiking ? (
              <AiOutlineLoading3Quarters className={styles.spinIcon} />
            ) : isLiked ? (
              <AiFillHeart className={styles.heartIcon} />
            ) : (
              <AiOutlineHeart className={styles.heartIcon} />
            )}
            <span>Thích</span>
          </button>{" "}
          <button
            className={styles.actionBtn}
            onClick={() => toggleComments(post.id)}
          >
            <AiOutlineComment className={styles.actionIcon} />
            <span>Bình luận</span>
          </button>{" "}
          <button className={styles.actionBtn}>
            <AiOutlineShareAlt className={styles.actionIcon} />
            <span>Chia sẻ</span>
          </button>
        </div>
        {/* Comment Section */}
        {showComments.has(post.id) && (
          <CommentSection
            postId={post.id}
            onCommentAdded={() => {
              // Optionally refresh post data or show notification
              console.log(`New comment added to post ${post.id}`);
            }}
          />
        )}
      </div>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <AiOutlineLoading3Quarters className={styles.loadingIcon} />
        <span>Đang tải bài viết...</span>
      </div>
    );
  }
  return (
    <div className={styles.postList}>
      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3>Chưa có bài viết nào</h3>
          <p>Hãy tạo bài viết đầu tiên của bạn!</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                className={styles.loadMoreBtn}
                onClick={loadMorePosts}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className={styles.spinIcon} />
                    Đang tải...
                  </>
                ) : (
                  "Xem thêm bài viết"
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa bài viết"
        open={deleteModalOpen}
        onOk={confirmDeletePost}
        onCancel={cancelDeletePost}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        centered
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default PostList;
