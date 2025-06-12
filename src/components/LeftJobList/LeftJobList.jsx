import React from "react";
import {
  FaBookmark,
  FaRegBookmark,
  FaCheckCircle,
  FaArrowRight,
  FaBuilding,
} from "react-icons/fa";
import styles from "./LeftJobList.module.css";

// Hàm để loại bỏ các thẻ HTML từ chuỗi
const stripHtml = (html) => {
  if (!html) return "";
  // Tạo một phần tử div tạm thời
  const tempDiv = document.createElement("div");
  // Gán HTML vào div
  tempDiv.innerHTML = html;
  // Lấy văn bản thuần túy
  const text = tempDiv.textContent || tempDiv.innerText || "";
  // Trả về văn bản đã được cắt ngắn nếu quá dài
  return text.length > 150 ? text.substring(0, 150) + "..." : text;
};

export default function LeftJobList({
  jobData = [],
  totalCount = 0,
  onSelectJob,
  selectedJobId,
  loading = false,
}) {
  // Kiểm tra nếu đang loading
  if (loading) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.headerPill}>
          <span className={styles.title}>Search Result</span>
          <span className={styles.count}>Loading...</span>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading jobs...</p>
        </div>
      </aside>
    );
  }

  // Kiểm tra nếu không có dữ liệu
  if (!jobData || jobData.length === 0) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.headerPill}>
          <span className={styles.title}>Search Result</span>
          <span className={styles.count}>0 Jobs Found</span>
        </div>
        <div className={styles.emptyState}>
          <p>No jobs found matching your criteria.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.headerPill}>
        <span className={styles.title}>Search Result</span>
        <span className={styles.count}>{totalCount} Jobs Found</span>
        {jobData.length > 0 && jobData[0].location && (
          <span className={styles.locationFilter}>
            Location: {jobData[0].location}
          </span>
        )}
        <span className={styles.pageInfo}>Showing {jobData.length} jobs</span>
      </div>
      <ul className={styles.jobList}>
        {jobData.map((job) => (
          <li
            key={job.id}
            className={`${styles.jobCard} ${
              selectedJobId === job.id ? styles.selectedJob : ""
            }`}
            onClick={() => onSelectJob && onSelectJob(job)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.logoWrapper}>
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={`${job.companyName || "Company"} logo`}
                    className={styles.companyLogo}
                    onError={(e) => {
                      // Thay vì đặt src mới, hiển thị icon mặc định
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={styles.defaultLogoIcon}
                  style={{ display: job.companyLogo ? "none" : "flex" }}
                >
                  <FaBuilding />
                </div>
              </div>
              <div className={styles.jobInfo}>
                <h3 className={styles.companyName}>
                  {job.companyName || "Company"}
                </h3>
                <p className={styles.positionTitle}>
                  {job.title || "Job Position"}
                </p>
                <p className={styles.location}>
                  {job.location || "Location not specified"}
                </p>
              </div>
              <button
                className={styles.bookmarkBtn}
                aria-label="Bookmark job"
                onClick={(e) => {
                  e.stopPropagation();
                  // Thêm xử lý bookmark ở đây nếu cần
                }}
              >
                {job.bookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>
            <div className={styles.tagsRow}>
              <span className={styles.tag}>
                {job.salary || "Salary not specified"}
              </span>
              <span className={styles.tag}>
                {job.jobType || "Job type not specified"}
              </span>
              <span className={styles.tag}>
                {job.level || "Level not specified"}
              </span>
            </div>
            <p className={styles.description}>
              {stripHtml(job.description) || "No description available"}
            </p>
            <div className={styles.footerRow}>
              <div className={styles.leftFooter}>
                {job.paymentVerified && (
                  <div className={styles.paymentVerified}>
                    <FaCheckCircle className={styles.verifiedIcon} /> Payment
                    verified {job.paymentSpent || ""}
                  </div>
                )}
                <span className={styles.timeAgo}>
                  {job.timeAgo || "Recently"}
                </span>
              </div>
              <button
                className={styles.viewDetailsBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectJob && onSelectJob(job);
                }}
                aria-label="View job details"
              >
                <span>View Details</span>
                <FaArrowRight className={styles.arrowIcon} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
