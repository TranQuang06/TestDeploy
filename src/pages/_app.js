import { useEffect } from "react";
import { useRouter } from "next/router";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { AuthProvider } from "../contexts/AuthContext";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import Loading from "../components/ui/Loading";
import {
  initializeAnalytics,
  trackPageView,
  reportWebVitals,
} from "../lib/analytics";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

// Ant Design theme configuration
const antdTheme = {
  token: {
    colorPrimary: "#ff6701",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",
    borderRadius: 6,
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    },
  },
};

// Import development utilities only in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  Promise.all([
    import("../utils/testChatFunctions"),
    import("../utils/quickChatTest"),
    import("../utils/debugChatData"),
  ]).catch(console.error);
}

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Initialize analytics and page tracking
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Page loading and analytics
  useEffect(() => {
    const handleStart = () => {
      // You can add global loading state here
    };

    const handleComplete = (url) => {
      // Track page view
      trackPageView(url);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      <ConfigProvider locale={viVN} theme={antdTheme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

// Export reportWebVitals for Next.js
export { reportWebVitals };
