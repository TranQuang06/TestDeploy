import styles from "./TabLeftSocial.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  AiOutlineHome,
  AiOutlineTeam,
  AiOutlineInbox,
  AiOutlineHeart,
  AiOutlineMenuUnfold,
  AiOutlineMenuFold,
  AiOutlineUser,
} from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi";
import ChatInterface from "../ChatInterface/ChatInterface";
import { useAuth } from "../../contexts/AuthContext";

function TabLeftSocial({ onSidebarToggle, onTabChange, chatTarget }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [currentChatTarget, setCurrentChatTarget] = useState(null);
  const [isInConversation, setIsInConversation] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Set initial active tab based on current route
    const setInitialActiveTab = () => {
      const currentPath = router.pathname;
      let initialTab = "home";

      if (currentPath === "/my-network") {
        initialTab = "network";
      } else if (currentPath === "/saved") {
        initialTab = "saved";
      } else if (currentPath === "/Profile") {
        initialTab = "profile";
      } else if (currentPath === "/Social") {
        initialTab = "home";
      }

      setActiveTab(initialTab);
      if (onTabChange) {
        onTabChange(initialTab);
      }
    };

    setInitialActiveTab();

    return () => window.removeEventListener("resize", handleResize);
  }, [router.pathname]);
  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isCollapsed);
    }
  }, [isCollapsed, onSidebarToggle]);

  // Handle chat target changes
  useEffect(() => {
    if (chatTarget && chatTarget.userId) {
      setCurrentChatTarget(chatTarget);
      setShowChat(true);
      setIsCollapsed(true);
      setActiveTab("inbox");
    }
  }, [chatTarget]);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (onTabChange) {
      onTabChange(tabName);
    }
    // Auto-close sidebar on mobile after navigation
    if (isMobile) {
      setIsCollapsed(true);
    }
  };
  // Handle Home click
  const handleHomeClick = (e) => {
    e.preventDefault();
    handleTabClick("home");
    router.push("/Social");
  };

  // Handle Network click
  const handleNetworkClick = (e) => {
    e.preventDefault();
    handleTabClick("network");
    router.push("/my-network");
  };

  // Handle Saved click
  const handleSavedClick = (e) => {
    e.preventDefault();
    handleTabClick("saved");
    router.push("/saved");
  }; // Handle Profile click
  const handleProfileClick = (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/SignIn");
      return;
    }
    handleTabClick("profile");
    router.push("/Profile");
  };

  // Helper function to check if tab is active
  const isActiveTab = (tabName) => {
    return activeTab === tabName;
  };
  // Handle inbox click
  const handleInboxClick = (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/SignIn");
      return;
    }
    setActiveTab("inbox");
    setShowChat(true);
    setIsCollapsed(true);
  };
  // Close chat interface
  const handleCloseChat = () => {
    setShowChat(false);
    setCurrentChatTarget(null);
    setIsInConversation(false);
    if (activeTab === "inbox") {
      setActiveTab("home");
      if (onTabChange) {
        onTabChange("home");
      }
    }
  };

  // Handle conversation state change from ChatInterface
  const handleConversationStateChange = (inConversation) => {
    setIsInConversation(inConversation);
  };
  return (
    <>
      {" "}
      {/* Toggle button for mobile - hide when in conversation */}
      {isMobile && !(isInConversation && showChat) && (
        <button
          className={`${styles.mobileToggleButton} ${
            isCollapsed ? styles.collapsed : styles.expanded
          }`}
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Open menu" : "Close menu"}
        >
          {isCollapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
        </button>
      )}
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !isCollapsed && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setIsCollapsed(true)}
        />
      )}
      <div
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${
          showChat ? styles.chatOpen : ""
        } ${isMobile ? styles.mobile : ""}`}
      >
        {/* Desktop toggle button */}
        {!isMobile && (
          <button
            className={styles.toggleButton}
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
          </button>
        )}{" "}
        <nav className={styles.navigation}>
          {/* Home */}
          <button
            className={`${styles.navItem} ${
              isActiveTab("home") ? styles.active : ""
            }`}
            data-tooltip="Home"
            onClick={handleHomeClick}
          >
            <AiOutlineHome className={styles.icon} />
            {!isCollapsed && <span>Home</span>}
          </button>

          {/* My Network */}
          <button
            className={`${styles.navItem} ${
              isActiveTab("network") ? styles.active : ""
            }`}
            data-tooltip="My Network"
            onClick={handleNetworkClick}
          >
            <AiOutlineTeam className={styles.icon} />
            {!isCollapsed && <span>My Network</span>}
          </button>

          {/* Inbox */}
          <button
            onClick={handleInboxClick}
            className={`${styles.navItem} ${styles.inboxButton} ${
              isActiveTab("inbox") || showChat ? styles.active : ""
            }`}
            data-tooltip="Inbox"
          >
            <AiOutlineInbox className={styles.icon} />
            {!isCollapsed && <span>Inbox</span>}
          </button>

          {/* Jobs */}
          <button
            onClick={() => handleTabClick("jobs")}
            className={`${styles.navItem} ${
              isActiveTab("jobs") ? styles.active : ""
            }`}
            data-tooltip="Jobs"
          >
            <HiOutlineBriefcase className={styles.icon} />
            {!isCollapsed && <span>Jobs</span>}
          </button>

          {/* Saved */}
          <button
            className={`${styles.navItem} ${
              isActiveTab("saved") ? styles.active : ""
            }`}
            data-tooltip="Saved"
            onClick={handleSavedClick}
          >
            <AiOutlineHeart className={styles.icon} />
            {!isCollapsed && <span>Saved</span>}
          </button>

          {/* Profile */}
          <button
            className={`${styles.navItem} ${
              isActiveTab("profile") ? styles.active : ""
            }`}
            data-tooltip="Profile"
            onClick={handleProfileClick}
          >
            <AiOutlineUser className={styles.icon} />
            {!isCollapsed && <span>Profile</span>}
          </button>
        </nav>{" "}
        {!isCollapsed && (
          <div className={styles.footer}>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>
                Terms of Service
              </a>
              <a href="#" className={styles.footerLink}>
                Policy service
              </a>
              <a href="#" className={styles.footerLink}>
                Cookie Policy
              </a>
              <a href="#" className={styles.footerLink}>
                Partners
              </a>
            </div>
            <div className={styles.copyright}>
              © 2024 SuperStars. All rights reserved
            </div>
          </div>
        )}
      </div>{" "}
      {/* Chat Interface */}
      {showChat && user && (
        <ChatInterface
          onClose={handleCloseChat}
          initialChatTarget={currentChatTarget}
          onConversationStateChange={handleConversationStateChange}
        />
      )}
    </>
  );
}

export default TabLeftSocial;
