import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import styles from "./JobMap.module.css";

// Fix default icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component để fit bounds khi map đã sẵn sàng
function FitBounds({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      // Đảm bảo map đã được khởi tạo đầy đủ
      setTimeout(() => {
        try {
          map.fitBounds(bounds, { padding: [50, 50] });
        } catch (e) {
          console.error("Error fitting bounds:", e);
        }
      }, 250); // Đợi một chút để map render hoàn toàn
    }
  }, [map, bounds]);

  return null;
}

// Component để xử lý việc fly to marker khi chọn job
function FlyToMarker({ selectedJobId, jobData }) {
  const map = useMap();

  useEffect(() => {
    if (selectedJobId != null) {
      const job = jobData.find((j) => j.id === selectedJobId);
      if (job && job.lat != null && job.lng != null) {
        const latlng = [job.lat, job.lng];
        // Đợi một chút để map render hoàn toàn
        setTimeout(() => {
          try {
            map.flyTo(latlng, 13, { duration: 1.0 });
          } catch (e) {
            console.error("Error flying to marker:", e);
          }
        }, 250);
      }
    }
  }, [map, selectedJobId, jobData]);

  return null;
}

export default function MapComponent({
  jobData = [],
  selectedJobId,
  onSelectJob,
  onError,
}) {
  const [isMapReady, setIsMapReady] = useState(false);
  const markerRefs = useRef({});

  // Xử lý lỗi
  const handleError = (error) => {
    console.error("MapComponent error:", error);
    if (onError) {
      onError(error);
    }
  };

  // Kiểm tra và lọc các job có tọa độ hợp lệ
  const validJobs = jobData.filter(
    (j) =>
      typeof j.lat === "number" &&
      typeof j.lng === "number" &&
      !isNaN(j.lat) &&
      !isNaN(j.lng) &&
      j.lat >= -90 &&
      j.lat <= 90 &&
      j.lng >= -180 &&
      j.lng <= 180
  );

  const bounds =
    validJobs.length > 0
      ? validJobs.map((j) => [j.lat, j.lng])
      : [[52.2297, 21.0122]]; // Default to Warsaw if no valid jobs
  // Nếu không có job hợp lệ, hiển thị bản đồ mặc định
  if (validJobs.length === 0) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {" "}
        <MapContainer
          center={[52.2297, 21.0122]} // Warsaw, Poland (mặc định)
          zoom={5}
          scrollWheelZoom
          style={{ width: "100%", height: "100%" }}
          whenCreated={(map) => {
            try {
              setIsMapReady(true);
              setTimeout(() => {
                map.invalidateSize();
              }, 250);
            } catch (error) {
              handleError(error);
            }
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            onError={(error) =>
              handleError(new Error("Failed to load map tiles"))
            }
          />
        </MapContainer>
        <div className={styles.noJobsOverlay}>
          No jobs with location data found. Try a different search.
        </div>
      </div>
    );
  }

  // Xử lý khi có marker được click
  const handleMarkerClick = (job) => {
    if (onSelectJob) {
      onSelectJob(job);
    }
  };
  return (
    <MapContainer
      center={bounds[0]} // Lấy vị trí đầu tiên làm center
      zoom={5}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
      whenCreated={(map) => {
        try {
          setIsMapReady(true);
          // Invalidate size để đảm bảo map render đúng
          setTimeout(() => {
            map.invalidateSize();
          }, 250);
        } catch (error) {
          handleError(error);
        }
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        onError={(error) => handleError(new Error("Failed to load map tiles"))}
      />

      {/* Chỉ fit bounds khi map đã sẵn sàng và có ít nhất 2 marker */}
      {isMapReady && bounds.length > 1 && <FitBounds bounds={bounds} />}

      {/* Xử lý fly to marker khi chọn job */}
      {isMapReady && selectedJobId && (
        <FlyToMarker selectedJobId={selectedJobId} jobData={jobData} />
      )}

      {validJobs.map((job) => {
        const position = [job.lat, job.lng];
        return (
          <Marker
            key={job.id}
            position={position}
            eventHandlers={{
              click: () => handleMarkerClick(job),
            }}
            ref={(el) => {
              if (el) markerRefs.current[job.id] = el;
            }}
          >
            <Popup>
              <div className={styles.popup}>
                <div className={styles.popupHeader}>
                  <div className={styles.popupLogo}>
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className={styles.logoImg}
                      onError={(e) => {
                        // Nếu logo lỗi, hiển thị chữ cái đầu của tên công ty
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className={styles.logoFallback}>
                      {job.companyName.charAt(0)}
                    </div>
                  </div>
                  <h4 className={styles.companyName}>{job.companyName}</h4>
                </div>
                <p className={styles.title}>{job.title}</p>
                <p className={styles.location}>{job.locationText}</p>
                {job.salary && <p className={styles.salary}>{job.salary}</p>}
                <button
                  className={styles.viewBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerClick(job);
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
