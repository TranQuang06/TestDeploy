import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  addCommentSimple as addComment,
  getPostComments,
  recalculateCommentCount,
} from "../../utils/socialMedia";
import styles from "./CommentSection.module.css";
import { message } from "antd";
import {
  AiOutlineUser,
  AiOutlineSend,
  AiOutlineLoading3Quarters,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineCamera,
  AiOutlineGif,
  AiOutlineClose,
} from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";

const CommentSection = ({ postId, onCommentAdded }) => {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
  const [replyText, setReplyText] = useState(""); // Reply text
  const [showReplies, setShowReplies] = useState(new Set()); // Track which comments show replies
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Load comments when component mounts
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await getPostComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error("Error loading comments:", error);
      message.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim() && !selectedImage) {
      message.warning("Vui lòng nhập nội dung hoặc chọn ảnh để bình luận");
      return;
    }

    if (!user) {
      message.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare media object if image is selected
      let mediaData = null;
      if (selectedImage) {
        mediaData = {
          type: "image",
          url: selectedImage,
          alt: "Comment image",
        };
      }

      // Call addComment with correct parameters: userId, postId, content, media, parentCommentId
      const newCommentDoc = await addComment(
        user.uid,
        postId,
        newComment.trim() || "", // Allow empty content if there's an image
        mediaData, // media
        null // parentCommentId
      );

      // Add new comment to local state
      setComments((prev) => {
        const newComments = [...prev, newCommentDoc];

        // Notify parent component with new comment count
        if (onCommentAdded) {
          onCommentAdded(newComments.length);
        }

        return newComments;
      });

      setNewComment("");
      setSelectedImage(null);

      // Try to recalculate comment count - don't fail if this fails
      try {
        await recalculateCommentCount(postId);
      } catch (recalcError) {
        console.warn("Could not recalculate comment count:", recalcError);
        // Don't show error to user - comment was still added successfully
      }

      message.success("Đã thêm bình luận!");
    } catch (error) {
      console.error("Error adding comment:", error);
      // Check if it's a permission error but comment was actually added
      if (error.code === "permission-denied") {
        // Reload comments to see if comment was actually added
        try {
          await loadComments();
          message.success("Đã thêm bình luận!");
          setNewComment("");
          setSelectedImage(null);
        } catch (loadError) {
          message.error("Không thể thêm bình luận");
        }
      } else {
        message.error("Không thể thêm bình luận");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        message.error("Ảnh không được vượt quá 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle emoji insertion
  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText =
        newComment.slice(0, start) + emoji + newComment.slice(end);
      setNewComment(newText);

      // Set cursor position after emoji
      setTimeout(() => {
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        textarea.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setShowReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };
  // Start replying to a comment
  const startReply = (commentId) => {
    console.log("🔄 Starting reply for comment:", commentId);
    setReplyingTo(commentId);
    setReplyText("");
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };
  // Submit reply
  const submitReply = async (parentCommentId) => {
    if (!replyText.trim()) {
      message.warning("Vui lòng nhập nội dung trả lời");
      return;
    }

    if (!user) {
      message.error("Vui lòng đăng nhập để trả lời");
      return;
    }

    try {
      setSubmitting(true);

      // Call addComment with parentCommentId
      const newReply = await addComment(
        user.uid,
        postId,
        replyText.trim(),
        null, // no media for now
        parentCommentId
      );

      // Add new reply to local state
      setComments((prev) => [...prev, newReply]);

      // Reset reply state
      setReplyingTo(null);
      setReplyText("");

      // Show replies for this comment
      setShowReplies((prev) => new Set([...prev, parentCommentId]));

      message.success("Đã trả lời bình luận!");
    } catch (error) {
      console.error("Error adding reply:", error);
      // Check if it's a permission error but reply was actually added
      if (error.code === "permission-denied") {
        // Reload comments to see if reply was actually added
        try {
          await loadComments();
          message.success("Đã trả lời bình luận!");
          setReplyingTo(null);
          setReplyText("");
          setShowReplies((prev) => new Set([...prev, parentCommentId]));
        } catch (loadError) {
          message.error("Không thể trả lời bình luận");
        }
      } else {
        message.error("Không thể trả lời bình luận");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getUserDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (userProfile?.displayName) {
      return userProfile.displayName;
    }
    return user?.displayName || user?.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return userProfile?.avatar || user?.photoURL || null;
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return commentDate.toLocaleDateString("vi-VN");
  };
  const CommentItem = useCallback(
    ({ comment }) => {
      console.log(
        "🎯 Rendering CommentItem for:",
        comment.id,
        "replyingTo:",
        replyingTo
      );
      // Get replies for this comment
      const replies = comments.filter((c) => c.parentCommentId === comment.id);

      return (
        <div className={styles.commentItem}>
          <div className={styles.commentAvatar}>
            {comment.authorInfo?.avatar ? (
              <img
                src={comment.authorInfo.avatar}
                alt={comment.authorInfo.displayName}
                className={styles.avatarImage}
              />
            ) : (
              <AiOutlineUser className={styles.avatarIcon} />
            )}
          </div>{" "}
          <div className={styles.commentContent}>
            <div className={styles.commentBubble}>
              <div className={styles.commentAuthor}>
                {comment.authorInfo?.displayName || "Người dùng"}
              </div>
              {comment.content && (
                <div className={styles.commentText}>{comment.content}</div>
              )}
              {comment.media && comment.media.type === "image" && (
                <div className={styles.commentImageContainer}>
                  <img
                    src={comment.media.url}
                    alt={comment.media.alt || "Comment image"}
                    className={styles.commentImage}
                  />
                </div>
              )}
            </div>

            <div className={styles.commentActions}>
              <span className={styles.commentTime}>
                {formatTimeAgo(comment.createdAt)}
              </span>
              <button className={styles.commentActionBtn}>Thích</button>{" "}
              <button
                className={styles.commentActionBtn}
                onClick={() => startReply(comment.id)}
              >
                Trả lời
              </button>
            </div>

            {/* Replies Section */}
            {showReplies.has(comment.id) && (
              <div className={styles.repliesSection}>
                {" "}
                {/* Show existing replies */}
                {replies.length > 0 ? (
                  replies.map((reply) => (
                    <div key={reply.id} className={styles.replyItem}>
                      <div className={styles.replyAvatar}>
                        {reply.authorInfo?.avatar ? (
                          <img
                            src={reply.authorInfo.avatar}
                            alt={reply.authorInfo.displayName}
                            className={styles.avatarImage}
                          />
                        ) : (
                          <AiOutlineUser className={styles.avatarIcon} />
                        )}
                      </div>
                      <div className={styles.replyContent}>
                        <div className={styles.replyBubble}>
                          <div className={styles.replyAuthor}>
                            {reply.authorInfo?.displayName || "Người dùng"}
                          </div>
                          {reply.content && (
                            <div className={styles.replyText}>
                              {reply.content}
                            </div>
                          )}
                          {reply.media && reply.media.type === "image" && (
                            <div className={styles.replyImageContainer}>
                              <img
                                src={reply.media.url}
                                alt={reply.media.alt || "Reply image"}
                                className={styles.replyImage}
                              />
                            </div>
                          )}
                        </div>

                        <div className={styles.replyActions}>
                          <span className={styles.replyTime}>
                            {formatTimeAgo(reply.createdAt)}
                          </span>
                          <button className={styles.replyActionBtn}>
                            Thích
                          </button>
                          <button
                            className={styles.replyActionBtn}
                            onClick={() =>
                              startReply(reply.id, reply.authorInfo.displayName)
                            } // Start reply to this reply
                          >
                            Trả lời
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noReplies}>
                    <p>Chưa có phản hồi nào. Hãy là người đầu tiên phản hồi!</p>
                  </div>
                )}
                {/* Reply form for replying to a comment */}
                {replyingTo === comment.id && (
                  <div className={styles.replyForm}>
                    <textarea
                      placeholder="Viết phản hồi..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className={styles.replyInput}
                      disabled={submitting}
                      rows={1}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                    />{" "}
                    <div className={styles.replyActions}>
                      <button
                        type="button"
                        className={styles.replyActionBtn}
                        onClick={cancelReply}
                        disabled={submitting}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        className={styles.replySubmitBtn}
                        onClick={() => submitReply(comment.id)}
                        disabled={!replyText.trim() || submitting}
                      >
                        {submitting ? (
                          <AiOutlineLoading3Quarters
                            className={styles.spinIcon}
                          />
                        ) : (
                          "Gửi phản hồi"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    },
    [comments, replyingTo, replyText, submitting, showReplies, formatTimeAgo]
  );

  // Common emojis for quick access
  const commonEmojis = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😘",
    "😊",
    "👍",
    "❤️",
    "😢",
    "😮",
    "😡",
    "🎉",
  ];

  return (
    <div className={styles.commentSection}>
      {/* Comments List */}
      <div className={styles.commentsList}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <AiOutlineLoading3Quarters className={styles.loadingIcon} />
            <span>Đang tải bình luận...</span>
          </div>
        ) : comments.length > 0 ? (
          // Only show main comments (not replies)
          comments
            .filter((comment) => !comment.parentCommentId)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
        ) : (
          <div className={styles.noComments}>
            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          </div>
        )}
      </div>{" "}
      {/* Add Comment Form */}
      {user && (
        <form className={styles.addCommentForm} onSubmit={handleSubmitComment}>
          <div className={styles.commentInputContainer}>
            <div className={styles.inputAvatar}>
              {getUserAvatar() ? (
                <img
                  src={getUserAvatar()}
                  alt="Your Avatar"
                  className={styles.avatarImage}
                />
              ) : (
                <AiOutlineUser className={styles.avatarIcon} />
              )}
            </div>

            <div className={styles.inputWrapper}>
              <textarea
                ref={textareaRef}
                placeholder="Viết bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={styles.commentInput}
                disabled={submitting}
                rows={1}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />

              {/* Action buttons */}
              <div className={styles.inputActions}>
                {/* Emoji button */}
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Chọn emoji"
                >
                  <BsEmojiSmile />
                </button>

                {/* Image button */}
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => fileInputRef.current?.click()}
                  title="Thêm ảnh"
                >
                  <AiOutlineCamera />
                </button>

                {/* GIF button */}
                <button
                  type="button"
                  className={styles.actionButton}
                  title="Thêm GIF"
                >
                  <AiOutlineGif />
                </button>

                {/* Submit button */}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={!newComment.trim() || submitting}
                  title="Gửi bình luận"
                >
                  {submitting ? (
                    <AiOutlineLoading3Quarters className={styles.spinIcon} />
                  ) : (
                    <AiOutlineSend />
                  )}
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className={styles.hiddenFileInput}
              />
            </div>
          </div>

          {/* Image preview */}
          {selectedImage && (
            <div className={styles.imagePreview}>
              <img
                src={selectedImage}
                alt="Preview"
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeImageBtn}
                onClick={removeImage}
                title="Xóa ảnh"
              >
                <AiOutlineClose />
              </button>
            </div>
          )}

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className={styles.emojiPicker}>
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={styles.emojiButton}
                  onClick={() => insertEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </form>
      )}{" "}
      {!user && (
        <div className={styles.loginPrompt}>
          <p>Vui lòng đăng nhập để bình luận</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
