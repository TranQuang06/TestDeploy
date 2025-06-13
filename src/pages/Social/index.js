import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Dashboard from "../../components/Dashboard/Dashboard";
import styles from "./Social.module.css";

function Social() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/SignIn");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <span>Đang tải...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Dashboard />;
}

export default Social;
