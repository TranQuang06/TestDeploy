import styles from "./Dashboard.module.css";
import { useState } from "react";
// import Header from "../Header";
// import Footer from "../Footer";
import TabLeftSocial from "../TabLeftSocial/TabLeftSocial";
import CreatePostSection from "../CreatePostSection/CreatePostSection";
import PostList from "../PostList/PostList";
import JobsSection from "../JobsSection/JobsSection";

function Dashboard({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [chatTarget, setChatTarget] = useState(null);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleStartChat = (userId, displayName) => {
    setChatTarget({ userId, displayName });
    // Auto switch to inbox/chat tab
    setActiveTab("inbox");
  };
  return (
    <div className={styles.dashboardContainer}>
      <TabLeftSocial
        onSidebarToggle={handleSidebarToggle}
        onTabChange={handleTabChange}
        chatTarget={chatTarget}
      />

      <div
        className={`${styles.mainContent} ${
          sidebarCollapsed ? styles.expanded : ""
        }`}
      >
        <div className={styles.contentWrapper}>
          {" "}
          {children ? (
            children
          ) : (
            <>
              <CreatePostSection /> {/* Posts Feed */}
              <div className={styles.postsSection}>
                <PostList
                  feedType={activeTab === "jobs" ? "jobs" : "timeline"}
                  onStartChat={handleStartChat}
                />
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
