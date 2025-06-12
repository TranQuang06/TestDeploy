import React, { useEffect, useRef } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import styles from "./JobListSidebar.module.css";

export default function JobListSidebar({
  jobData = [],
  totalCount = 0,
  selectedJobId,
  onSelectJob,
  onBookmarkToggle,
}) {
  // refs để scroll tới item khi selected thay đổi
  const itemRefs = useRef({});

  useEffect(() => {
    if (selectedJobId != null && itemRefs.current[selectedJobId]) {
      itemRefs.current[selectedJobId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedJobId]);

  // Hàm kiểm tra job mới trong 7 ngày
  const isNewJob = (job) => {
    if (!job.created) return false;
    const createdDate = new Date(job.created);
    const diffDays = (Date.now() - createdDate.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 7;
  };

  // Hàm kiểm tra “Perfect Job” giả lập (ví dụ salary max >= 20k)
  const isPerfectJob = (job) => {
    if (!job.salary) return false;
    // expect format "8.8k - 12.7k PLN"
    const m = job.salary.match(/([\d.]+)k\s*-\s*([\d.]+)k/);
    if (m) {
      const maxK = parseFloat(m[2]);
      return maxK >= 20;
    }
    return false;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.headerPill}>
        <span className={styles.title}>Search Result</span>
        <span className={styles.count}>{totalCount} Results</span>
      </div>
      <ul className={styles.jobList}>
        {jobData.map((job) => {
          const isSelected = job.id === selectedJobId;
          return (
            <li
              key={job.id}
              ref={(el) => {
                if (el) itemRefs.current[job.id] = el;
              }}
              className={`${styles.jobCard} ${isSelected ? styles.active : ""}`}
              onClick={() => onSelectJob && onSelectJob(job)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.logoWrapper}>
                  <img
                    src={job.companyLogo}
                    alt={`${job.companyName} logo`}
                    className={styles.companyLogo}
                  />
                </div>
                <div className={styles.jobInfo}>
                  <h3 className={styles.companyName}>{job.companyName}</h3>
                  <p className={styles.positionTitle}>{job.title}</p>
                  <p className={styles.location}>{job.locationText}</p>
                </div>
                <button
                  className={styles.bookmarkBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmarkToggle && onBookmarkToggle(job.id);
                  }}
                  aria-label={
                    job.bookmarked ? "Remove bookmark" : "Bookmark job"
                  }
                >
                  {job.bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              </div>

              <div className={styles.badgesRow}>
                {isPerfectJob(job) && (
                  <span className={styles.badgePerfect}>Perfect Job</span>
                )}
                {isNewJob(job) && <span className={styles.badgeNew}>New</span>}
              </div>

              <div className={styles.tagsRow}>
                {job.salary && <span className={styles.tag}>{job.salary}</span>}
                {job.jobType && (
                  <span className={styles.tag}>{job.jobType}</span>
                )}
              </div>

              <div className={styles.footerRow}>
                {job.created && (
                  <span className={styles.timeAgo}>
                    {new Date(job.created).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
