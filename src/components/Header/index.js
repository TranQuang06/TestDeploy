import React, { useState, useEffect } from "react";
import {
  RiseOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Space, Button, Dropdown } from "antd";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../Header/Header.module.css";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const { user, userProfile, loading, logout, isAuthenticated } = useAuth();

  // Helper functions for user data
  const getUserDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (userProfile?.displayName) {
      return userProfile.displayName;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getUserAvatar = () => {
    return userProfile?.avatar || user?.photoURL || null;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // More accurate background detection
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Check elements behind header to determine background color
      const headerElement = document.querySelector("header");
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = headerRect.top + headerRect.height / 2;

        // Get element behind the header center
        const elementBehind = document.elementFromPoint(
          centerX,
          centerY + headerRect.height
        );

        if (elementBehind) {
          const computedStyle = window.getComputedStyle(elementBehind);
          const backgroundColor = computedStyle.backgroundColor;

          // Simple heuristic: if background is very light or transparent, assume light background
          const isLightBackground =
            backgroundColor === "rgba(0, 0, 0, 0)" ||
            backgroundColor === "transparent" ||
            backgroundColor.includes("255, 255, 255") ||
            backgroundColor.includes("rgb(255, 255, 255)");

          setIsDarkBackground(!isLightBackground);
        } else {
          // Fallback: use scroll position
          if (scrollY < windowHeight * 0.7) {
            setIsDarkBackground(true); // Assume hero section is dark
          } else {
            setIsDarkBackground(false); // Other sections are light
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // Call once to set initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  // User dropdown menu items
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => {
        window.location.href = "/profile";
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => {
        window.location.href = "/settings";
      },
    },
    // Add admin link for admin users
    ...(userProfile?.role === "admin"
      ? [
          {
            key: "admin",
            icon: <RiseOutlined />,
            label: "Admin Panel",
            onClick: () => {
              window.location.href = "/Admin";
            },
          },
        ]
      : []),
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ""} ${
        isDarkBackground ? styles.headerOnDark : styles.headerOnLight
      }`}
    >
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <img
              src="/assets/img/logo.png"
              alt="logo"
              className={styles.logoImg}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          <ul className={styles.navigationList}>
            <li className={styles.navItem}>
              <Link href="/services" className={styles.navLink}>
                Services
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/specialists" className={styles.navLink}>
                Specialists
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/works" className={styles.navLink}>
                Our works
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/subscriptions" className={styles.navLink}>
                Subscriptions
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* Auth Section */}
        <div className={styles.authSection}>
          <Space size={12}>
            {isAuthenticated ? (
              /* User is logged in - show avatar with dropdown */
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
                overlayClassName={styles.userDropdown}
              >
                <div className={styles.userInfo}>
                  <Avatar
                    size={40}
                    src={getUserAvatar()}
                    icon={!getUserAvatar() ? <UserOutlined /> : null}
                    className={styles.userAvatar}
                    style={{
                      backgroundColor: "#87d068",
                      cursor: "pointer",
                    }}
                  />
                  <span className={styles.userName}>
                    {getUserDisplayName()}
                  </span>
                </div>
              </Dropdown>
            ) : (
              /* User is not logged in - show Sign In and Register buttons */
              <>
                <Link href="/SignIn">
                  <Button type="text" className={styles.signInBtn}>
                    Sign In
                  </Button>
                </Link>

                <Link href="/Register">
                  <Button type="primary" className={styles.registerBtn}>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </Space>
        </div>
      </div>
    </header>
  );
}

export default Header;
