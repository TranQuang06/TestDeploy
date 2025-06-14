import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { toggleUserFollow, isUserFollowing } from "../../utils/socialMedia";
import styles from "./ProfileMiniCard.module.css";
import {
  AiOutlineUser,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
  AiOutlineEnvironment,
  AiOutlineMail,
  AiOutlineLoading3Quarters,
  AiOutlineMessage,
} from "react-icons/ai";

const ProfileMiniCard = ({ userId, position, onClose }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Get user profile data
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }

        // Check if current user is following this user
        if (user && user.uid !== userId) {
          const following = await isUserFollowing(user.uid, userId);
          setIsFollowing(following);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, user]);  // Auto-adjust position to prevent card from going off-screen
  const getAdjustedPosition = () => {
    const cardWidth = 320;
    const cardHeight = 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedLeft = position.left;
    let adjustedTop = position.top;

    // Adjust horizontal position if card goes off screen
    if (adjustedLeft + cardWidth > viewportWidth) {
      adjustedLeft = viewportWidth - cardWidth - 20; // More margin from edge
    }
    if (adjustedLeft < 20) {
      adjustedLeft = 20;
    }

    // Adjust vertical position if card goes off screen
    // For fixed positioning, we check against viewport height directly
    if (adjustedTop + cardHeight > viewportHeight) {
      adjustedTop = Math.max(20, position.top - cardHeight - 20); // Show above avatar if possible
    }

    // Ensure card doesn't go above viewport
    if (adjustedTop < 20) {
      adjustedTop = 20;
    }

    return {
      top: adjustedTop,
      left: adjustedLeft,
    };
  };

  const handleFollow = async () => {
    if (!user || user.uid === userId) return;

    try {
      setFollowLoading(true);
      await toggleUserFollow(user.uid, userId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log("Message user:", userId);
  };  if (loading) {
    const adjustedPosition = getAdjustedPosition();
    return (
      <div
        className={styles.miniCard}
        style={{
          position: "fixed",
          top: adjustedPosition.top,
          left: adjustedPosition.left,
          zIndex: 9999,
        }}
      >
        <div className={styles.loading}>
          <AiOutlineLoading3Quarters className={styles.loadingIcon} />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }
  if (!userProfile) {
    return null;
  }
  const displayName =
    userProfile.displayName ||
    `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() ||
    "Người dùng ẩn danh";

  const adjustedPosition = getAdjustedPosition();
  return (
    <div
      className={styles.miniCard}
      style={{
        position: "fixed",
        top: adjustedPosition.top,
        left: adjustedPosition.left,
        zIndex: 9999,
      }}
      onMouseEnter={() => {}} // Prevent card from disappearing when hovering over it
      onMouseLeave={onClose}
    >
      {/* Cover Photo */}
      <div className={styles.coverPhoto}>
        {userProfile.coverPhoto ? (
          <img
            src={userProfile.coverPhoto}
            alt="Cover"
            className={styles.coverImage}
          />
        ) : (
          <div className={styles.defaultCover}></div>
        )}
      </div>{" "}
      {/* Profile Info */}
      <div className={styles.profileInfo}>
        {/* Top Section - Avatar and Name */}
        <div className={styles.topSection}>
          {/* Avatar */}
          <div className={styles.avatar}>
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={displayName}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.defaultAvatar}>
                <AiOutlineUser className={styles.avatarIcon} />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className={styles.userDetails}>
            <h3 className={styles.userName}>
              {displayName}
              {userProfile.isVerified && (
                <span className={styles.verifiedBadge}>✓</span>
              )}
            </h3>

            {userProfile.title && (
              <p className={styles.userTitle}>{userProfile.title}</p>
            )}

            {/* Location */}
            {userProfile.location && (
              <div className={styles.location}>
                <AiOutlineEnvironment className={styles.locationIcon} />
                <span>{userProfile.location}</span>
              </div>
            )}
          </div>
        </div>
        {/* Bio */}
        {userProfile.bio && (
          <p className={styles.bio}>{userProfile.bio}</p>
        )}{" "}
        {/* Stats */}
        <div className={styles.stats}>
          {userProfile.stats && (
            <>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {userProfile.stats.postCount || 0}
                </span>
                <span className={styles.statLabel}>bài viết</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {userProfile.stats.followerCount || 0}
                </span>
                <span className={styles.statLabel}>người theo dõi</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {userProfile.stats.followingCount || 0}
                </span>
                <span className={styles.statLabel}>đang theo dõi</span>
              </div>
            </>
          )}
        </div>
        {/* Action Buttons */}
        {user && user.uid !== userId && (
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${
                isFollowing ? styles.following : styles.follow
              }`}
              onClick={handleFollow}
              disabled={followLoading}
            >
              {followLoading ? (
                <AiOutlineLoading3Quarters className={styles.loadingIcon} />
              ) : isFollowing ? (
                <>
                  <AiOutlineUserDelete className={styles.actionIcon} />
                  <span>Bỏ theo dõi</span>
                </>
              ) : (
                <>
                  <AiOutlineUserAdd className={styles.actionIcon} />
                  <span>Theo dõi</span>
                </>
              )}
            </button>

            <button
              className={`${styles.actionBtn} ${styles.message}`}
              onClick={handleMessage}
            >
              <AiOutlineMessage className={styles.actionIcon} />
              <span>Nhắn tin</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMiniCard;
