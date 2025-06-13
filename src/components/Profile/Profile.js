import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { updateUserAvatarInPosts } from "../../utils/socialMedia";
import { message } from "antd";
import styles from "./Profile.module.css";
import {
  AiOutlineUser,
  AiOutlineCamera,
  AiOutlineEdit,
  AiOutlineSave,
  AiOutlineClose,
  AiOutlineLoading3Quarters,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineCalendar,
  AiOutlineEnvironment,
  AiOutlineGlobal,
  AiOutlineHeart,
} from "react-icons/ai";

const Profile = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: "",
    website: "",
    bio: "",
    relationship: "",
    avatar: "",
    coverPhoto: "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || user?.email || "",
        phone: userProfile.phone || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        location: userProfile.location || "",
        website: userProfile.website || "",
        bio: userProfile.bio || "",
        relationship: userProfile.relationship || "",
        avatar: userProfile.avatar || user?.photoURL || "",
        coverPhoto: userProfile.coverPhoto || "",
      });
    }
  }, [userProfile, user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (field, file) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      // 5MB limit
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      message.error("Ảnh không được vượt quá 5MB");
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      console.log("Saving profile data:", formData);

      // Check if avatar changed
      const avatarChanged = userProfile?.avatar !== formData.avatar;
      const displayNameChanged =
        `${userProfile?.firstName} ${userProfile?.lastName}` !==
        `${formData.firstName} ${formData.lastName}`;

      // Update user profile in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });

      console.log("Profile updated in Firestore");

      // Update context with the new profile data
      await updateUserProfile(formData);

      console.log("Profile updated in context");

      // Update avatar in all user's posts if avatar changed
      if (avatarChanged || displayNameChanged) {
        try {
          const newDisplayName = `${formData.firstName} ${formData.lastName}`;
          const updatedPostsCount = await updateUserAvatarInPosts(
            user.uid,
            formData.avatar,
            displayNameChanged ? newDisplayName : null
          );

          if (updatedPostsCount > 0) {
            console.log(`✅ Updated avatar in ${updatedPostsCount} posts`);
          }
        } catch (error) {
          console.error("Error updating avatar in posts:", error);
          // Don't fail the entire update if post avatar update fails
        }
      }

      setIsEditing(false);
      message.success("Đã cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || user?.email || "",
        phone: userProfile.phone || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        location: userProfile.location || "",
        website: userProfile.website || "",
        bio: userProfile.bio || "",
        relationship: userProfile.relationship || "",
        avatar: userProfile.avatar || user?.photoURL || "",
        coverPhoto: userProfile.coverPhoto || "",
      });
    }
    setIsEditing(false);
  };

  const getDisplayName = () => {
    return (
      `${formData.firstName} ${formData.lastName}`.trim() ||
      userProfile?.displayName ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "Người dùng"
    );
  };

  return (
    <div className={styles.profileContainer}>
      {/* Cover Photo */}
      <div className={styles.coverPhotoSection}>
        <div
          className={styles.coverPhoto}
          style={{
            backgroundImage: formData.coverPhoto
              ? `url(${formData.coverPhoto})`
              : "linear-gradient(135deg, #FF6701 0%, #FF8533 100%)",
          }}
        >
          {isEditing && (
            <label className={styles.coverPhotoUpload}>
              <AiOutlineCamera />
              <span>Thay đổi ảnh bìa</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload("coverPhoto", e.target.files[0])
                }
                hidden
              />
            </label>
          )}
        </div>

        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Avatar"
                className={styles.avatarImage}
              />
            ) : (
              <AiOutlineUser className={styles.avatarIcon} />
            )}
            {isEditing && (
              <label className={styles.avatarUpload}>
                <AiOutlineCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload("avatar", e.target.files[0])
                  }
                  hidden
                />
              </label>
            )}
          </div>

          <div className={styles.nameSection}>
            <h1 className={styles.displayName}>{getDisplayName()}</h1>
            {formData.bio && <p className={styles.bio}>{formData.bio}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {!isEditing ? (
          <button
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            <AiOutlineEdit />
            Chỉnh sửa thông tin
          </button>
        ) : (
          <div className={styles.editActions}>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className={styles.spin} />
              ) : (
                <AiOutlineSave />
              )}
              Lưu thay đổi
            </button>
            <button
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={loading}
            >
              <AiOutlineClose />
              Hủy
            </button>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className={styles.profileInfo}>
        <div className={styles.infoSection}>
          <h3 className={styles.sectionTitle}>Thông tin cá nhân</h3>

          <div className={styles.infoGrid}>
            {/* First Name */}
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>
                <AiOutlineUser />
                Tên
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={styles.fieldInput}
                  placeholder="Nhập tên của bạn"
                />
              ) : (
                <span className={styles.fieldValue}>
                  {formData.firstName || "Chưa cập nhật"}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>
                <AiOutlineUser />
                Họ
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={styles.fieldInput}
                  placeholder="Nhập họ của bạn"
                />
              ) : (
                <span className={styles.fieldValue}>
                  {formData.lastName || "Chưa cập nhật"}
                </span>
              )}
            </div>

            {/* Email */}
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>
                <AiOutlineMail />
                Email
              </label>
              <span className={styles.fieldValue}>{formData.email}</span>
            </div>

            {/* Phone */}
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>
                <AiOutlinePhone />
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={styles.fieldInput}
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <span className={styles.fieldValue}>
                  {formData.phone || "Chưa cập nhật"}
                </span>
              )}
            </div>

            {/* Date of Birth */}
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>
                <AiOutlineCalendar />
                Ngày sinh
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className={styles.fieldInput}
                />
              ) : (
                <span className={styles.fieldValue}>
                  {formData.dateOfBirth
                    ? new Date(formData.dateOfBirth).toLocaleDateString("vi-VN")
                    : "Chưa cập nhật"}
                </span>
              )}
            </div>

            {/* Location */}
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>
                <AiOutlineEnvironment />
                Địa chỉ
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={styles.fieldInput}
                  placeholder="Nhập địa chỉ"
                />
              ) : (
                <span className={styles.fieldValue}>
                  {formData.location || "Chưa cập nhật"}
                </span>
              )}
            </div>

            {/* Website */}
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>
                <AiOutlineGlobal />
                Website
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className={styles.fieldInput}
                  placeholder="https://example.com"
                />
              ) : (
                <span className={styles.fieldValue}>
                  {formData.website ? (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formData.website}
                    </a>
                  ) : (
                    "Chưa cập nhật"
                  )}
                </span>
              )}
            </div>

            {/* Relationship */}
            <div className={styles.infoField}>
              <label className={styles.fieldLabel}>
                <AiOutlineHeart />
                Tình trạng
              </label>
              {isEditing ? (
                <select
                  value={formData.relationship}
                  onChange={(e) =>
                    handleInputChange("relationship", e.target.value)
                  }
                  className={styles.fieldSelect}
                >
                  <option value="">Chọn tình trạng</option>
                  <option value="single">Độc thân</option>
                  <option value="in_relationship">Đang hẹn hò</option>
                  <option value="married">Đã kết hôn</option>
                  <option value="complicated">Phức tạp</option>
                </select>
              ) : (
                <span className={styles.fieldValue}>
                  {formData.relationship === "single" && "Độc thân"}
                  {formData.relationship === "in_relationship" && "Đang hẹn hò"}
                  {formData.relationship === "married" && "Đã kết hôn"}
                  {formData.relationship === "complicated" && "Phức tạp"}
                  {!formData.relationship && "Chưa cập nhật"}
                </span>
              )}
            </div>

            {/* Bio */}
            <div className={styles.infoField} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.fieldLabel}>Giới thiệu</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={styles.fieldTextarea}
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                  rows="4"
                />
              ) : (
                <span className={styles.fieldValue}>
                  {formData.bio || "Chưa cập nhật"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
