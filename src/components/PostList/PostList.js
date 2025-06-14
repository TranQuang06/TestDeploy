import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPostsFeed,
  getTrendingPosts,
  togglePostLike,
  hasUserLikedPost,
  deletePost,
  deletePostSimple,
  savePost,
  unsavePost,
  updatePostVisibility,
} from "../../utils/socialMedia";
import { getJobPosts } from "../../utils/jobService";
import styles from "./PostList.module.css";
import { Modal, message } from "antd";
import CommentSection from "../CommentSection/CommentSection";
import ProfileMiniCard from "../ProfileMiniCard/ProfileMiniCard";
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
  AiOutlineDollarCircle,
  AiOutlineEnvironment,
  AiOutlineCalendar,
  AiOutlineFileText,
} from "react-icons/ai";

const PostList = ({
  feedType = "timeline",
  customPosts = null,
  onLoadMore = null,
  hasMore: hasMoreProp = false,
  onPostUnsaved = null,
  onStartChat = null,
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
  const [showProfileCard, setShowProfileCard] = useState(null);
  const [profileCardPosition, setProfileCardPosition] = useState({
    top: 0,
    left: 0,
  });

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
  
  // Handle profile card hover
  const handleAvatarMouseEnter = (userId, event) => {
    console.log("🔍 Avatar hover entered:", userId, "current user:", user?.uid);
    if (!userId) {
      console.log("⚠️ Skipping profile card - no userId");
      return; // Don't show if no userId
    }

    const rect = event.currentTarget.getBoundingClientRect();
    
    // For fixed positioning, we use viewport coordinates directly
    const position = {
      top: rect.bottom + 8, // Position below the avatar with some spacing
      left: Math.max(10, rect.left - 160), // Center card relative to avatar, with min left margin
    };

    console.log("📍 Setting profile card position:", position);
    console.log("📍 Avatar rect:", rect);
    setProfileCardPosition(position);
    setShowProfileCard(userId);
    console.log("✅ Profile card should show for user:", userId);
  };
  const handleAvatarMouseLeave = () => {
    // Delay hiding to allow moving to card
    setTimeout(() => {
      setShowProfileCard(null);
    }, 300); // Increased delay for better UX
  };
  const handleProfileCardClose = () => {
    setShowProfileCard(null);
  };

  // Handle start chat with job poster
  const handleStartChat = (userId, companyName) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để sử dụng tính năng chat!");
      return;
    }

    if (userId === user.uid) {
      message.info("Đây là tin tuyển dụng của bạn!");
      return;
    }

    if (onStartChat) {
      onStartChat(userId, companyName);
    } else {
      message.info("Tính năng chat đang được phát triển!");
    }
  };

  const handleCommentAdded = async (postId, newCommentCount) => {
    try {
      // Find and update the post in local state
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        // Update local state with the provided count
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts];
          updatedPosts[postIndex] = {
            ...updatedPosts[postIndex],
            stats: {
              ...updatedPosts[postIndex].stats,
              commentCount: newCommentCount,
            },
          };
          return updatedPosts;
        });

        console.log(
          `✅ Updated comment count for post ${postId}: ${newCommentCount}`
        );
      }
    } catch (error) {
      console.error("Error updating comment count:", error);
    }
  };
  const loadInitialPosts = async () => {
    try {
      setLoading(true);
      let result;

      if (feedType === "jobs") {
        // Load job posts instead of regular posts
        const jobPosts = await getJobPosts({
          status: "active",
          limit: 10,
        });
        // Transform job posts to match post structure
        const transformedJobs = jobPosts.map((job) => ({
          id: job.id,
          type: "job",
          content: `${job.jobTitle} tại ${job.companyName}\n\n${job.jobDescription}`,
          author: {
            uid: job.postedBy,
            displayName: job.companyName,
            photoURL: job.companyLogo || null,
            email: job.contactEmail || null,
          },
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          stats: {
            likeCount: job.viewCount || 0,
            commentCount: 0,
            shareCount: 0,
          },
          visibility: "public",
          // Additional job-specific data
          jobData: {
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            salary: job.salary,
            location: job.location,
            jobType: job.jobType,
            category: job.category,
            experience: job.experience,
            skills: job.skills,
            benefits: job.benefits,
            contactEmail: job.contactEmail,
            expiryDate: job.expiryDate,
          },
        }));

        result = {
          posts: transformedJobs,
          lastDoc: null,
          hasMore: false,
        };
      } else if (feedType === "trending") {
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

      // Check which posts user has liked (skip for job posts)
      if (user && feedType !== "jobs") {
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
  // Format time for display
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";

    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
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
    if (!postToDelete || !user?.uid) {
      message.error("Không thể xác định người dùng hoặc bài viết!");
      return;
    }

    try {
      console.log("🗑️ Attempting to delete post:", {
        postId: postToDelete,
        userId: user.uid,
        userEmail: user.email,
      });

      // Find the post to verify ownership
      const postToDeleteData = posts.find((p) => p.id === postToDelete);
      if (!postToDeleteData) {
        throw new Error("Không tìm thấy bài viết trong danh sách!");
      }

      console.log("📝 Post data:", {
        authorId: postToDeleteData.authorId,
        currentUserId: user.uid,
        isOwner: postToDeleteData.authorId === user.uid,
      });

      if (postToDeleteData.authorId !== user.uid) {
        throw new Error("Bạn chỉ có thể xóa bài viết của chính mình!");
      } // Delete post from Firebase
      await deletePost(postToDelete, user.uid);

      // Update local state
      setPosts((prev) => prev.filter((post) => post.id !== postToDelete));

      console.log("✅ Post deleted successfully");
      message.success("Đã xóa bài viết thành công!");
    } catch (error) {
      console.error("❌ Error deleting post:", error);

      let errorMessage = "Có lỗi xảy ra khi xóa bài viết!";

      if (error.code === "permission-denied") {
        errorMessage =
          "Không có quyền xóa bài viết này! Vui lòng kiểm tra quyền truy cập.";
      } else if (error.message.includes("You can only delete your own posts")) {
        errorMessage = "Bạn chỉ có thể xóa bài viết của chính mình!";
      } else if (error.message.includes("Post not found")) {
        errorMessage = "Không tìm thấy bài viết!";
      } else if (
        error.message.includes("Missing or insufficient permissions")
      ) {
        errorMessage =
          "Thiếu quyền truy cập Firebase! Vui lòng kiểm tra Firestore rules.";
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
  }; // Job Item Component for rendering job posts
  const JobItem = ({ post }) => {
    const { jobData } = post;

    // Debug logging
    console.log("🔍 JobItem received:", { post, jobData });
    console.log("🔍 Skills type:", typeof jobData?.skills, jobData?.skills);
    console.log(
      "🔍 Benefits type:",
      typeof jobData?.benefits,
      jobData?.benefits
    );

    return (
      <div className={`${styles.postItem} ${styles.jobItem}`}>
        {/* Job Header */}
        <div className={styles.postHeader}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              {post.author.photoURL ? (
                <img
                  src={post.author.photoURL}
                  alt={post.author.displayName}
                  className={styles.avatarImage}
                />
              ) : (
                <AiOutlineUser className={styles.avatarIcon} />
              )}
            </div>
            <div className={styles.authorDetails}>
              <div className={styles.authorName}>{jobData.companyName}</div>
              <div className={styles.postMeta}>
                <span className={styles.postTime}>
                  {formatTimeAgo(post.createdAt)}
                </span>
                <AiOutlineGlobal className={styles.visibilityIcon} />
              </div>
            </div>
          </div>
          <div className={styles.jobBadge}>
            <AiOutlineFileText />
            <span>Tuyển dụng</span>
          </div>
        </div>
        {/* Job Content */}
        <div className={styles.jobContent}>
          <h3 className={styles.jobTitle}>{jobData.jobTitle}</h3>
          <div className={styles.jobDetails}>
            <div className={styles.jobDetailItem}>
              <AiOutlineDollarCircle className={styles.jobIcon} />
              <span>{jobData.salary}</span>
            </div>
            <div className={styles.jobDetailItem}>
              <AiOutlineEnvironment className={styles.jobIcon} />
              <span>{jobData.location}</span>
            </div>
            <div className={styles.jobDetailItem}>
              <AiOutlineCalendar className={styles.jobIcon} />
              <span>{jobData.jobType}</span>
            </div>
          </div>
          {jobData.experience && (
            <div className={styles.jobRequirement}>
              <strong>Kinh nghiệm:</strong> {jobData.experience}
            </div>
          )}{" "}
          {jobData.skills && (
            <div className={styles.jobSkills}>
              <strong>Kỹ năng:</strong>
              {Array.isArray(jobData.skills) ? (
                <div className={styles.skillTags}>
                  {jobData.skills.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className={styles.skillText}>{jobData.skills}</div>
              )}
            </div>
          )}
          {jobData.benefits && (
            <div className={styles.jobBenefits}>
              <strong>Quyền lợi:</strong>
              {Array.isArray(jobData.benefits) ? (
                <ul className={styles.benefitsList}>
                  {jobData.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <div className={styles.benefitText}>{jobData.benefits}</div>
              )}
            </div>
          )}{" "}
          {jobData.expiryDate && (
            <div className={styles.jobDeadline}>
              <strong>Hạn ứng tuyển:</strong>{" "}
              {jobData.expiryDate instanceof Date
                ? jobData.expiryDate.toLocaleDateString("vi-VN")
                : jobData.expiryDate.toDate
                ? jobData.expiryDate.toDate().toLocaleDateString("vi-VN")
                : new Date(jobData.expiryDate).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>{" "}
        {/* Job Actions */}
        <div className={styles.jobActions}>
          <button
            className={styles.primaryJobBtn}
            onClick={() =>
              handleStartChat(post.author.uid, jobData.companyName)
            }
          >
            Nhắn ngay
          </button>
          <button className={styles.secondaryJobBtn}>Lưu tin</button>
          <button className={styles.actionBtn}>
            <AiOutlineShareAlt className={styles.actionIcon} />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>
    );
  };

  const PostItem = ({ post }) => {
    const isLiked = likedPosts.has(post.id);
    const isLiking = likingPosts.has(post.id); // Debug post data
    console.log("📋 Post data:", post);
    console.log("👤 Author ID:", post.authorId);
    console.log("📋 Post media data:", post.media);

    return (
      <div className={styles.postItem}>
        {/* Post Header */}
        <div className={styles.postHeader}>
          {" "}
          <div className={styles.authorInfo}>
            <div
              className={styles.authorAvatar}
              onMouseEnter={(e) => handleAvatarMouseEnter(post.authorId, e)}
              onMouseLeave={handleAvatarMouseLeave}
            >
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
            </button>{" "}
            {/* Dropdown menu */}
            {activeDropdown === post.id && (
              <>
                {/* Mobile backdrop */}
                <div
                  className={styles.dropdownBackdrop}
                  onClick={() => setActiveDropdown(null)}
                />

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
                  )}

                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleSavePost(post.id)}
                  >
                    <AiOutlineSave className={styles.dropdownIcon} />
                    <span>
                      {feedType === "saved"
                        ? "Bỏ lưu bài viết"
                        : "Lưu bài viết"}
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
                        onClick={() =>
                          handleChangeVisibility(post.id, "public")
                        }
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
                        onClick={() =>
                          handleChangeVisibility(post.id, "private")
                        }
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
              </>
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
        </div>{" "}
        {/* Comment Section */}
        {showComments.has(post.id) && (
          <CommentSection
            postId={post.id}
            onCommentAdded={(newCommentCount) =>
              handleCommentAdded(post.id, newCommentCount)
            }
          />
        )}
      </div>
    );
  };
  if (loading && posts.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <AiOutlineLoading3Quarters className={styles.loadingIcon} />
        <span>
          {feedType === "jobs"
            ? "Đang tải tin tuyển dụng..."
            : "Đang tải bài viết..."}
        </span>
      </div>
    );
  }
  return (
    <div className={styles.postList}>
      {" "}
      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            {feedType === "jobs" ? "�" : "�📝"}
          </div>
          <h3>
            {feedType === "jobs"
              ? "Chưa có tin tuyển dụng nào"
              : "Chưa có bài viết nào"}
          </h3>
          <p>
            {feedType === "jobs"
              ? "Hãy đăng tin tuyển dụng đầu tiên của bạn!"
              : "Hãy tạo bài viết đầu tiên của bạn!"}
          </p>
        </div>
      ) : (
        <>
          {posts.map((post) =>
            post.type === "job" ? (
              <JobItem key={post.id} post={post} />
            ) : (
              <PostItem key={post.id} post={post} />
            )
          )}

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
        {" "}
        <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>{" "}
      {/* Profile Mini Card */}
      {showProfileCard && (
        <>
          {console.log(
            "🎨 Rendering ProfileMiniCard for:",
            showProfileCard,
            "at position:",
            profileCardPosition
          )}
          <ProfileMiniCard
            userId={showProfileCard}
            position={profileCardPosition}
            onClose={handleProfileCardClose}
          />
        </>
      )}
    </div>
  );
};

export default PostList;
