import { useState, useEffect } from "react";
import styles from "./Saved.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import TabLeftSocial from "../../components/TabLeftSocial/TabLeftSocial";
import PostList from "../../components/PostList/PostList";
import { useAuth } from "../../contexts/AuthContext";
import { getSavedPosts } from "../../utils/socialMedia";
import { Spin, Empty, message } from "antd";

function SavedPage() {
  const { user, isAuthenticated } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Fetch saved posts
  const fetchSavedPosts = async (isInitial = true) => {
    if (!user || !isAuthenticated) return;

    try {
      setLoading(isInitial);
      const result = await getSavedPosts(
        user.uid,
        10,
        isInitial ? null : lastDoc
      );

      if (isInitial) {
        setSavedPosts(result.posts);
      } else {
        setSavedPosts((prev) => [...prev, ...result.posts]);
      }

      setLastDoc(result.lastDocument);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      message.error("Không thể tải bài viết đã lưu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchSavedPosts();
    }
  }, [user, isAuthenticated]);

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchSavedPosts(false);
    }
  };

  // Handle post removal from saved list (when unsaved)
  const handlePostUnsaved = (postId) => {
    setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.notAuthenticated}>
          <h2>Vui lòng đăng nhập để xem bài viết đã lưu</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* <Header /> */}

      <div className={styles.pageWrapper}>
        <TabLeftSocial onSidebarToggle={handleSidebarToggle} />

        <div
          className={`${styles.mainContent} ${
            sidebarCollapsed ? styles.expanded : ""
          }`}
        >
          <div className={styles.contentWrapper}>
            <div className={styles.header}>
              <h1>Bài viết đã lưu</h1>
              <p>Tất cả bài viết bạn đã lưu để đọc sau</p>
            </div>

            {loading ? (
              <div className={styles.loadingWrapper}>
                <Spin size="large" />
                <p>Đang tải bài viết đã lưu...</p>
              </div>
            ) : savedPosts.length > 0 ? (
              <div className={styles.postsSection}>
                <PostList
                  feedType="saved"
                  customPosts={savedPosts}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  onPostUnsaved={handlePostUnsaved}
                />
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Empty
                  description="Chưa có bài viết nào được lưu"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <p>Khi bạn lưu bài viết, chúng sẽ xuất hiện ở đây</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default SavedPage;
