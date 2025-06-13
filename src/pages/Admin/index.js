import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
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
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("setup");
  useEffect(() => {
    // Only redirect if not logged in at all
    // Allow access to Admin Setup tab even if not admin yet
    if (!loading && !user) {
      router.push("/SignIn");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <AiOutlineLoading3Quarters className={styles.loadingIcon} />
        <span>Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  if (!user || (userProfile && userProfile.role !== "admin")) {
    return null; // Will redirect
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
