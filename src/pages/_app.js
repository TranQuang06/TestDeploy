import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "../contexts/AuthContext";

// Import chat utilities for development/testing
if (typeof window !== "undefined") {
  import("../utils/testChatFunctions");
  import("../utils/quickChatTest");
  import("../utils/debugChatData");
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
