import styles from "./Dashboard.module.css";
import { useState } from "react";
// import Header from "../Header";
// import Footer from "../Footer";
import TabLeftSocial from "../TabLeftSocial/TabLeftSocial";
import CreatePostSection from "../CreatePostSection/CreatePostSection";
import PostList from "../PostList/PostList";

function Dashboard({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className={styles.dashboardContainer}>
      <TabLeftSocial onSidebarToggle={handleSidebarToggle} />

      <div
        className={`${styles.mainContent} ${
          sidebarCollapsed ? styles.expanded : ""
        }`}
      >
        <div className={styles.contentWrapper}>
          {children ? (
            children
          ) : (
            <>
              <CreatePostSection />

              {/* Posts Feed */}
              <div className={styles.postsSection}>
                <PostList feedType="timeline" />
              </div>
            </>
          )}
        </div>

        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default Dashboard;
