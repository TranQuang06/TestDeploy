import React, { useState, useEffect } from "react";
import {
  RiseOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  AudioOutlined,
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

        // Determine if background is dark or light
        if (elementBehind) {
          const bgColor = window.getComputedStyle(elementBehind).backgroundColor;
          const isColorDark = isDarkColor(bgColor);
          setIsDarkBackground(isColorDark);
        }
      }
    };

    // Helper to determine if a color is dark
    const isDarkColor = (color) => {
      // Simple implementation - can be improved
      if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") {
        return false;
      }
      
      // Extract RGB values
      const rgb = color.match(/\d+/g);
      if (!rgb || rgb.length < 3) return false;
      
      // Calculate brightness
      const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
      return brightness < 128; // If less than 128, consider it dark
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

  // Dropdown menu cho "Việc làm" với icons
  const jobsMenuItems = [
    {
      key: "find-job",
      icon: <SearchOutlined />,
      label: <Link href="/FindJob">Tìm việc làm ngay</Link>,
      description: "Khám phá cơ hội việc làm phù hợp với bạn",
    },
    {
      key: "jobs-map",
      icon: <EnvironmentOutlined />,
      label: <Link href="/JobsMapPage">Bản đồ việc làm</Link>,
      description: "Xem việc làm theo vị trí địa lý",
    },
  ];

  // Dropdown menu cho "Công cụ" với icons
  const toolsMenuItems = [
    {
      key: "create-cv",
      icon: <FileTextOutlined />,
      label: <Link href="/CreateCV">Tạo CV</Link>,
      description: "Tạo CV chuyên nghiệp trong vài phút",
    },
    {
      key: "text-to-speech",
      icon: <AudioOutlined />,
      label: <Link href="/TextToSpeech">Chuyển văn bản thành giọng nói</Link>,
      description: "Chuyển đổi văn bản thành âm thanh tự nhiên",
    },
  ];

  // Custom dropdown render để hiển thị menu hiện đại hơn
  const renderDropdownMenu = (items) => ({
    items: items.map(item => ({
      key: item.key,
      label: (
        <div className={styles.customDropdownItem}>
          <div className={styles.dropdownItemIcon}>{item.icon}</div>
          <div className={styles.dropdownItemContent}>
            <div className={styles.dropdownItemLabel}>{item.label}</div>
            <div className={styles.dropdownItemDescription}>{item.description}</div>
          </div>
        </div>
      )
    }))
  });

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
            {/* Việc làm với dropdown */}
            <li className={`${styles.navItem} ${styles.hasDropdown}`}>
              <Dropdown
                menu={renderDropdownMenu(jobsMenuItems)}
                placement="bottomLeft"
                arrow={false}
                trigger={['hover']}
                overlayClassName={styles.navDropdown}
                align={{ offset: [-20, 10] }}
              >
                <div className={styles.navLinkWithDropdown}>
                  <Link href="/FindJob" className={styles.navLink}>
                    Việc làm
                  </Link>
                  <DownOutlined className={styles.dropdownIcon} />
                </div>
              </Dropdown>
            </li>

            {/* Công cụ với dropdown */}
            <li className={`${styles.navItem} ${styles.hasDropdown}`}>
              <Dropdown
                menu={renderDropdownMenu(toolsMenuItems)}
                placement="bottomLeft"
                arrow={false}
                trigger={['hover']}
                overlayClassName={styles.navDropdown}
                align={{ offset: [-20, 10] }}
              >
                <div className={styles.navLinkWithDropdown}>
                  <Link href="/CreateCV" className={styles.navLink}>
                    Công cụ
                  </Link>
                  <DownOutlined className={styles.dropdownIcon} />
                </div>
              </Dropdown>
            </li>

            {/* Về chúng tôi - không có dropdown */}
            <li className={styles.navItem}>
              <Link href="/Blog" className={styles.navLink}>
                Về chúng tôi
              </Link>
            </li>

            {/* Social - không có dropdown */}
            <li className={styles.navItem}>
              <Link href="/Social" className={styles.navLink}>
                Social
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
                <Link href="/SignUp">
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
