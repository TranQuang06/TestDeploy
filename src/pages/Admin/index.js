import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import { useAdminCheck } from "../../hooks/useAdminCheck";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MigrationPanel from "../../components/MigrationPanel/MigrationPanel";
import AdminSetup from "../../components/AdminSetup/AdminSetup";
import styles from "./Admin.module.css";
import {
  AiOutlineUserAdd,
  AiOutlineDatabase,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineLoading3Quarters,
  AiOutlineKey,
} from "react-icons/ai";

function Admin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("setup");
  const { isAdmin, isChecking, adminCheckError, user, userProfile } =
    useAdminCheck();

  useEffect(() => {
    // Redirect if not logged in
    if (!isChecking && !user) {
      router.push("/SignIn");
    }
  }, [user, isChecking, router]); // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className={styles.loadingContainer}>
        <AiOutlineLoading3Quarters className={styles.loadingIcon} />
        <span>Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  // Redirect to SignIn if not logged in
  if (!user) {
    return null;
  }

  // Show error if admin check failed
  if (adminCheckError) {
    return (
      <>
        <Header />
        <div className={styles.adminContainer}>
          <div className={styles.adminWrapper}>
            <div className={styles.adminHeader}>
              <h1>❌ Lỗi kiểm tra quyền</h1>
              <p>Có lỗi xảy ra khi kiểm tra quyền admin</p>
            </div>
            <div className={styles.adminContent}>
              <div className={styles.noAccessMessage}>
                <div className={styles.messageCard}>
                  <h3>🚨 System Error</h3>
                  <p>Error: {adminCheckError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className={styles.retryButton}
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // If not admin, show message and admin setup option
  if (!isAdmin) {
    return (
      <>
        <Header />
        <div className={styles.adminContainer}>
          <div className={styles.adminWrapper}>
            <div className={styles.adminHeader}>
              <h1>Admin Access Required</h1>
              <p>Bạn cần quyền admin để truy cập trang này</p>
            </div>
            <div className={styles.adminContent}>
              <div className={styles.noAccessMessage}>
                <div className={styles.messageCard}>
                  <h3>🔒 Không có quyền truy cập</h3>
                  <p>Bạn cần có quyền admin để sử dụng trang này.</p>
                  <p>Nếu bạn là admin, hãy sử dụng Admin Setup để cấp quyền.</p>

                  {/* Debug info - remove in production */}
                  <div className={styles.debugInfo}>
                    <details>
                      <summary>Debug Info (Click to expand)</summary>
                      <pre>
                        {JSON.stringify(
                          {
                            email: user?.email,
                            role: userProfile?.role,
                            isAdmin: userProfile?.isAdmin,
                            permissions: userProfile?.permissions,
                          },
                          null,
                          2
                        )}
                      </pre>
                    </details>
                  </div>

                  <div className={styles.setupSection}>
                    <AdminSetup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  const tabs = [
    {
      id: "setup",
      label: "Admin Setup",
      icon: <AiOutlineKey />,
      component: <AdminSetup />,
    },
    {
      id: "migration",
      label: "Migration",
      icon: <AiOutlineDatabase />,
      component: <MigrationPanel />,
    },
    {
      id: "users",
      label: "Quản lý Users",
      icon: <AiOutlineUserAdd />,
      component: <div className={styles.comingSoon}>Coming Soon...</div>,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <AiOutlineBarChart />,
      component: <div className={styles.comingSoon}>Coming Soon...</div>,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <AiOutlineSetting />,
      component: <div className={styles.comingSoon}>Coming Soon...</div>,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <>
      <Header />
      <div className={styles.adminContainer}>
        <div className={styles.adminWrapper}>
          <div className={styles.adminHeader}>
            <h1>Admin Dashboard</h1>
            <p>Quản lý hệ thống social media platform</p>
          </div>

          <div className={styles.adminContent}>
            {/* Sidebar Navigation */}
            <div className={styles.sidebar}>
              <nav className={styles.sidebarNav}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`${styles.navItem} ${
                      activeTab === tab.id ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className={styles.navIcon}>{tab.icon}</span>
                    <span className={styles.navLabel}>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
              <div className={styles.contentHeader}>
                <h2>
                  <span className={styles.contentIcon}>
                    {activeTabData?.icon}
                  </span>
                  {activeTabData?.label}
                </h2>
              </div>

              <div className={styles.contentBody}>
                {activeTabData?.component}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Admin;
