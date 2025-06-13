import styles from "./TabLeftSocial.module.css";
import Link from "next/link";
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

function TabLeftSocial({ onSidebarToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isCollapsed);
    }
  }, [isCollapsed, onSidebarToggle]);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Helper function to check if route is active
  const isActiveRoute = (href) => {
    return router.pathname === href;
  };
  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
      </button>{" "}
      <nav className={styles.navigation}>
        <Link
          href="/Social"
          className={`${styles.navItem} ${
            isActiveRoute("/Social") ? styles.active : ""
          }`}
          data-tooltip="Home"
        >
          <AiOutlineHome className={styles.icon} />
          {!isCollapsed && <span>Home</span>}
        </Link>
        <Link
          href="/my-network"
          className={`${styles.navItem} ${
            isActiveRoute("/my-network") ? styles.active : ""
          }`}
          data-tooltip="My Network"
        >
          <AiOutlineTeam className={styles.icon} />
          {!isCollapsed && <span>My Network</span>}
        </Link>
        <Link
          href="/inbox"
          className={`${styles.navItem} ${
            isActiveRoute("/inbox") ? styles.active : ""
          }`}
          data-tooltip="Inbox"
        >
          <AiOutlineInbox className={styles.icon} />
          {!isCollapsed && <span>Inbox</span>}
        </Link>
        <Link
          href="/jobs"
          className={`${styles.navItem} ${
            isActiveRoute("/jobs") ? styles.active : ""
          }`}
          data-tooltip="Jobs"
        >
          <HiOutlineBriefcase className={styles.icon} />
          {!isCollapsed && <span>Jobs</span>}
        </Link>        <Link
          href="/saved"
          className={`${styles.navItem} ${
            isActiveRoute("/saved") ? styles.active : ""
          }`}
          data-tooltip="Saved"
        >
          <AiOutlineHeart className={styles.icon} />
          {!isCollapsed && <span>Saved</span>}
        </Link>
        <Link
          href="/Profile"
          className={`${styles.navItem} ${
            isActiveRoute("/Profile") ? styles.active : ""
          }`}
          data-tooltip="Profile"
        >
          <AiOutlineUser className={styles.icon} />
          {!isCollapsed && <span>Profile</span>}
        </Link>
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
    </div>
  );
}

export default TabLeftSocial;
