import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import MyNetworkPage from "../components/MyNetworkPage/MyNetworkPage";

export default function MyNetwork() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/SignIn");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Dashboard>
      <MyNetworkPage />
    </Dashboard>
  );
}
