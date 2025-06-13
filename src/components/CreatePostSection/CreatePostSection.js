import { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { createPost } from "../../utils/socialMedia";
import styles from "./CreatePostSection.module.css";
import { Modal, message } from "antd";
import JobPostingModal from "../JobPostingModal/JobPostingModal";
import {
  AiOutlineUser,
  AiOutlinePicture,
  AiOutlineVideoCamera,
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineGlobal,
  AiOutlineDown,
  AiOutlineLoading3Quarters,
  AiOutlineFileText,
} from "react-icons/ai";

const CreatePostSection = () => {
  const { user, userProfile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [privacy, setPrivacy] = useState("public"); // public, friends, private
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Validate image file function
  const validateImageFile = (file, maxSizeMB = 5) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`Image size must be less than ${maxSizeMB}MB`);
    }

    const supportedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!supportedFormats.includes(file.type)) {
      throw new Error(
        "Unsupported image format. Please use JPG, PNG, GIF, or WebP"
      );
    }

    return true;
  };
  // Convert image to Base64 (no Firebase Storage needed)
  const convertImageToBase64 = async (imageFile) => {
    try {
      if (!imageFile) {
        throw new Error("No image file provided");
      }

      // Check file size (limit to 1MB for Base64)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (imageFile.size > maxSize) {
        throw new Error("Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 1MB");
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          console.log(`✅ Image converted to Base64 successfully`);
          resolve(reader.result); // Base64 string
        };

        reader.onerror = () => {
          console.error("❌ Error converting image to Base64");
          reject(new Error("Failed to convert image"));
        };

        reader.readAsDataURL(imageFile);
      });
    } catch (error) {
      console.error("❌ Error converting image:", error);
      throw error;
    }
  };
  // Convert multiple images to Base64
  const convertMultipleImagesToBase64 = async (imageFiles) => {
    try {
      if (!imageFiles || imageFiles.length === 0) {
        return [];
      }

      console.log(`📤 Converting ${imageFiles.length} images to Base64...`);

      // Convert all images in parallel
      const convertPromises = imageFiles.map((file) =>
        convertImageToBase64(file)
      );
      const base64Strings = await Promise.all(convertPromises);

      console.log(`✅ All ${imageFiles.length} images converted successfully`);
      return base64Strings;
    } catch (error) {
      console.error("❌ Error converting multiple images:", error);
      throw error;
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

  const handleCreatePost = () => {
    setShowModal(true);
  };
  const handleImageSelect = async (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    try {
      // Convert to Base64 for preview
      const newImages = await Promise.all(
        imageFiles.map(async (file) => {
          const base64 = await convertImageToBase64(file);
          return {
            file,
            preview: base64, // Use Base64 for preview instead of blob URL
            id: Math.random().toString(36).substr(2, 9),
          };
        })
      );
      setSelectedImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("❌ Error processing images:", error);
      message.error("Có lỗi khi xử lý ảnh. Vui lòng thử lại!");
    }
  };
  const removeImage = (imageId) => {
    setSelectedImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== imageId);
      // No need to clean up object URLs since we're using Base64
      return updatedImages;
    });
  };
  const handleModalClose = () => {
    setShowModal(false);
    setPostContent("");
    setPrivacy("public");
    // No need to clean up object URLs since we're using Base64
    setSelectedImages([]);
  };
  const handleSubmitPost = async () => {
    if (!postContent.trim() && selectedImages.length === 0) {
      message.warning("Vui lòng nhập nội dung hoặc chọn ảnh để đăng bài!");
      return;
    }

    setIsSubmitting(true);
    try {
      let mediaArray = [];
      if (selectedImages.length > 0) {
        console.log("🖼️ Using Base64 images from preview...");

        mediaArray = selectedImages.map((img, index) => ({
          type: "image",
          url: img.preview, // Use Base64 from preview
          alt: `Image ${index + 1}`,
        }));

        console.log("✅ Media array prepared:", mediaArray.length);
        console.log(
          "🖼️ First image sample:",
          mediaArray[0]?.url?.substring(0, 50)
        );
      } // Prepare post data with Base64 images
      const postData = {
        content: postContent.trim(),
        type: selectedImages.length > 0 ? "image" : "text",
        visibility: privacy,
        media: mediaArray, // Base64 images
        tags: extractHashtags(postContent),
        mentions: extractMentions(postContent),
      };
      console.log("📋 Post data to be created:", postData);
      console.log("🖼️ Media data:", postData.media); // Create post in Firebase
      const newPost = await createPost(user.uid, postData);
      console.log("✅ Post created successfully:", newPost);

      // Close modal and reset form first
      handleModalClose();

      // Show success notification
      message.success({
        content:
          "Đăng bài thành công! Bài viết của bạn đã được hiển thị trên timeline.",
        duration: 3,
        style: {
          marginTop: "10vh",
        },
      });

      // Optionally reload the page to show new post immediately
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("❌ Error creating post:", error);

      // Show specific error message
      let errorMessage = "Có lỗi xảy ra khi đăng bài. Vui lòng thử lại!";
      if (error.message.includes("File must be an image")) {
        errorMessage = "Vui lòng chỉ chọn file hình ảnh!";
      } else if (error.message.includes("Image size must be less than")) {
        errorMessage = "Kích thước ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.";
      } else if (error.message.includes("Unsupported image format")) {
        errorMessage =
          "Định dạng ảnh không được hỗ trợ! Vui lòng chọn JPG, PNG, GIF hoặc WebP.";
      }

      message.error({
        content: errorMessage,
        duration: 4,
        style: {
          marginTop: "10vh",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract hashtags from content
  const extractHashtags = (content) => {
    const hashtagRegex = /#[\w\u00C0-\u024F\u1E00-\u1EFF]+/g;
    const hashtags = content.match(hashtagRegex);
    return hashtags ? hashtags.map((tag) => tag.substring(1)) : [];
  };

  // Extract mentions from content (basic implementation)
  const extractMentions = (content) => {
    const mentionRegex = /@[\w\u00C0-\u024F\u1E00-\u1EFF]+/g;
    const mentions = content.match(mentionRegex);
    return mentions ? mentions.map((mention) => mention.substring(1)) : [];
  };

  return (
    <>
      {" "}
      <div className={styles.createPostSection}>
        <div className={styles.postInput}>
          <div className={styles.userAvatar}>
            {getUserAvatar() ? (
              <img
                src={getUserAvatar()}
                alt="User Avatar"
                className={styles.avatarImage}
              />
            ) : (
              <AiOutlineUser className={styles.avatarIcon} />
            )}
          </div>

          <div className={styles.inputField} onClick={handleCreatePost}>
            <span className={styles.placeholder}>
              {getUserDisplayName()}, bạn đang nghĩ gì?
            </span>
          </div>
        </div>{" "}
        <div className={styles.postActions}>
          <button
            className={styles.actionBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            <AiOutlinePicture className={styles.actionIcon} />
            <span>Ảnh/video</span>
          </button>

          <button className={styles.actionBtn} onClick={handleCreatePost}>
            <AiOutlineUser className={styles.actionIcon} />
            <span>Gắn thẻ bạn bè</span>
          </button>

          <button className={styles.actionBtn} onClick={handleCreatePost}>
            <span>😊</span>
            <span>Cảm xúc/hoạt động</span>
          </button>

          <button
            className={styles.actionBtn}
            onClick={() => setShowJobModal(true)}
          >
            <AiOutlineFileText className={styles.actionIcon} />
            <span>Đăng tuyển dụng</span>
          </button>
        </div>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
      </div>{" "}
      {/* Modal để tạo bài viết */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          {" "}
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Tạo bài viết</h3>
              <button className={styles.closeBtn} onClick={handleModalClose}>
                <AiOutlineClose />
              </button>
            </div>
            {/* User info section */}
            <div className={styles.userInfoSection}>
              <div className={styles.userInfo}>
                <div className={styles.modalUserAvatar}>
                  {getUserAvatar() ? (
                    <img
                      src={getUserAvatar()}
                      alt="User Avatar"
                      className={styles.modalAvatarImage}
                    />
                  ) : (
                    <AiOutlineUser className={styles.modalAvatarIcon} />
                  )}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{getUserDisplayName()}</div>
                  <div className={styles.privacySelector}>
                    <AiOutlineGlobal className={styles.privacyIcon} />
                    <span>Công khai</span>
                    <AiOutlineDown className={styles.dropdownIcon} />
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className={styles.modalContent}>
              <textarea
                className={styles.textArea}
                placeholder={`${getUserDisplayName()}, bạn đang nghĩ gì?`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={6}
              />
              {/* Image preview section */}
              {selectedImages.length > 0 && (
                <div className={styles.imagePreviewSection}>
                  <div className={styles.imageGrid}>
                    {selectedImages.map((image) => (
                      <div key={image.id} className={styles.imagePreview}>
                        <img src={image.preview} alt="Preview" />
                        <button
                          className={styles.removeImageBtn}
                          onClick={() => removeImage(image.id)}
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Media upload options */}
              <div className={styles.mediaOptions}>
                <button
                  className={styles.mediaBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AiOutlinePicture />
                  <span>Thêm ảnh</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
              </div>{" "}
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  className={styles.postBtn}
                  onClick={handleSubmitPost}
                  disabled={
                    (!postContent.trim() && selectedImages.length === 0) ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? (
                    <>
                      <AiOutlineLoading3Quarters className={styles.spinIcon} />
                      Đang đăng...
                    </>
                  ) : (
                    "Đăng"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal để đăng tuyển dụng */}
      {showJobModal && (
        <JobPostingModal
          visible={showJobModal}
          onClose={() => setShowJobModal(false)}
          user={user}
        />
      )}
      {/* Job Posting Modal */}
      <JobPostingModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onJobPosted={(newJob) => {
          console.log("✅ New job posted:", newJob);
          message.success("Đăng tin tuyển dụng thành công!");
        }}
      />
    </>
  );
};

export default CreatePostSection;
