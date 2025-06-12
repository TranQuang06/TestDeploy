import { useEffect } from "react";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Import Leaflet CSS chỉ ở phía client
    import("leaflet/dist/leaflet.css");
  }, []);

  return <Component {...pageProps} />;
}
