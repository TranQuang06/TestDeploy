import dynamic from "next/dynamic";
import { memo } from "react";
import MainLayout from "../components/layout/MainLayout";
import Loading from "../components/ui/Loading";

// Dynamic import HomePage for better performance
const HomePage = dynamic(() => import("./HomePage"), {
  loading: () => <Loading.Page message="Đang tải trang chủ..." />,
  ssr: true,
});

/**
 * Home Page - Main entry point
 * Optimized with dynamic imports and proper SEO
 */
const Home = memo(() => {
  return (
    <MainLayout
      title="Trang chủ"
      description="Nền tảng tuyển dụng và tạo CV chuyên nghiệp hàng đầu Việt Nam. Tìm việc làm, tạo CV đẹp, kết nối với nhà tuyển dụng."
      keywords="tuyển dụng, việc làm, tạo CV, tìm việc, nhà tuyển dụng, BWD 2025"
      showHeader={false} // HomePage has its own header
      showFooter={false} // HomePage has its own footer
      showChat={false} // HomePage has its own chat
    >
      <HomePage />
    </MainLayout>
  );
});

Home.displayName = "Home";

export default Home;
