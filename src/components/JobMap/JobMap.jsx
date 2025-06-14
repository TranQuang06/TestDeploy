import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./JobMap.module.css";

// Dynamic import cho Leaflet components để tránh lỗi SSR
const MapWithNoSSR = dynamic(
  () => import("./MapComponent"), // Tạo một component riêng cho Map
  {
    ssr: false, // Không render ở server
    loading: () => <div className={styles.loadingMap}>Loading map...</div>,
  }
);

export default function JobMap({ jobData = [], selectedJobId, onSelectJob }) {
  const [mapError, setMapError] = useState(null);

  // Xử lý lỗi từ MapComponent
  const handleMapError = (error) => {
    console.error("Map error:", error);
    setMapError(error.message || "Error loading map");
  };

  // Reset error khi có dữ liệu mới
  React.useEffect(() => {
    if (mapError && jobData.length > 0) {
      setMapError(null);
    }
  }, [jobData, mapError]);

  if (mapError) {
    return (
      <div className={styles.mapError}>
        <p>Error loading map: {mapError}</p>
        <button onClick={() => setMapError(null)}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <MapWithNoSSR
        jobData={jobData}
        selectedJobId={selectedJobId}
        onSelectJob={onSelectJob}
        onError={handleMapError}
      />
    </div>
  );
}
