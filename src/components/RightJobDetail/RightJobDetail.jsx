import React from "react";
import {
  FaBookmark,
  FaRegBookmark,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";
import styles from "./RightJobDetail.module.css";

export default function RightJobDetail({ job, onBookmarkToggle, onApply }) {
  if (!job) {
    return (
      <div className={styles.placeholder}>
        <p>Select a job to view details</p>
      </div>
    );
  }

  // Hàm để render HTML an toàn từ API
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className={styles.companyLogo}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
          ) : (
            <div className={styles.companyInitial}>
              {job.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
            </div>
          )}
        </div>
        <div className={styles.info}>
          <h2 className={styles.companyName}>{job.companyName}</h2>
          <h3 className={styles.positionTitle}>{job.title}</h3>
          <p className={styles.location}>
            <FaMapMarkerAlt /> {job.location}
          </p>
        </div>
        <button
          className={styles.bookmarkBtn}
          onClick={() => onBookmarkToggle && onBookmarkToggle(job.id)}
          aria-label={job.bookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {job.bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      <div className={styles.tagsRow}>
        <div className={`${styles.tag} ${styles.salaryTag}`}>
          <span className={styles.tagLabel}>Salary</span>
          <span className={styles.tagValue}>
            {job.salary || "Not specified"}
          </span>
        </div>
        <div className={`${styles.tag} ${styles.jobTypeTag}`}>
          <span className={styles.tagLabel}>Job Type</span>
          <span className={styles.tagValue}>
            {job.jobType || "Not specified"}
          </span>
        </div>
        <div className={`${styles.tag} ${styles.applicantsTag}`}>
          <span className={styles.tagLabel}>Posted</span>
          <span className={styles.tagValue}>{job.timeAgo || "Recently"}</span>
        </div>
        <div className={`${styles.tag} ${styles.skillTag}`}>
          <span className={styles.tagLabel}>Level</span>
          <span className={styles.tagValue}>
            {job.level || "Not specified"}
          </span>
        </div>
      </div>

      <div className={styles.contentArea}>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Job Description</h4>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={renderHTML(
              job.description || "<p>No description available</p>"
            )}
          />
        </div>

        {job.requirements && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Requirements</h4>
            <ul className={styles.list}>
              {job.requirements.map((req, index) => (
                <li key={index} className={styles.listItem}>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Benefits</h4>
            <ul className={styles.list}>
              {job.benefits.map((benefit, index) => (
                <li key={index} className={styles.listItem}>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.applyRow}>
        {job.paymentVerified && (
          <div className={styles.verifiedBadge}>
            <FaCheckCircle className={styles.verifiedIcon} />
            <span>Payment Verified</span>
          </div>
        )}
        <button
          className={styles.applyButton}
          onClick={() => onApply && onApply(job)}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
