// src/components/JobsSection/JobsSection.js

import React, { useEffect, useState } from "react";
import styles from "./JobsSection.module.css";

export default function JobsSection() {
  const [jobs, setJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [fade, setFade] = useState(false); // Thêm state cho hiệu ứng
  const cardsPerPage = 8; // Số card mỗi trang

  // Mảng màu nền xoay vòng cho từng card
  const bgColors = [
    "#F5ECFF",
    "#FFEFF5",
    "#EFFFEE",
    "#E8F0FF",
    "#FFFBEB",
    "#F0FFF4",
    "#FFF0F0",
    "#F7F5FF",
    "#EFFCF6",
  ];

  useEffect(() => {
    fetch("https://remotive.com/api/remote-jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setJobs(data.jobs || []);
        // Lấy các kiểu công việc duy nhất và thêm 'All' ở đầu
        const types = Array.from(
          new Set((data.jobs || []).map((j) => j.job_type))
        );
        setJobTypes(["All", ...types]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Reset về trang 1 khi đổi loại job
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType]);

  // Lọc jobs theo tab đang chọn
  const filteredJobs =
    activeType === "All" ? jobs : jobs.filter((j) => j.job_type === activeType);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / cardsPerPage);
  const startIdx = (currentPage - 1) * cardsPerPage;
  const endIdx = startIdx + cardsPerPage;
  const jobsToShow = filteredJobs.slice(startIdx, endIdx);

  // Hàm chuyển trang có hiệu ứng
  const handleChangePage = (newPage) => {
    setFade(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setFade(false);
    }, 250); // thời gian trùng với CSS transition
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <section className={styles.section}>
      {/* Hint */}
      {/* Tabs */}
      <div className={styles.tabs}>
        {jobTypes.map((type) => (
          <button
            key={type}
            className={`${styles.tabButton} ${
              activeType === type ? styles.active : ""
            }`}
            onClick={() => setActiveType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid cards */}
      <div
        className={`${styles.grid} ${fade ? styles.fadeOut : styles.fadeIn}`}
      >
        {jobsToShow.map((job, idx) => (
          <div
            key={job.id}
            className={styles.card}
            style={{
              backgroundColor: bgColors[(startIdx + idx) % bgColors.length],
            }}
          >
            {/* Header */}
            <div className={styles.cardHeader}>
              <img
                src={job.company_logo}
                alt={job.company_name}
                className={styles.logo}
              />
              <span className={styles.posted}>
                {new Date(job.publication_date).toLocaleDateString()}
              </span>
              <span className={styles.bookmark}>🔖</span>
            </div>

            {/* Nội dung chính */}
            <h4 className={styles.company}>{job.company_name}</h4>
            <h3 className={styles.title}>{job.title}</h3>
            <div className={styles.tags}>
              <span className={styles.tag}>{job.job_type}</span>
              <span className={styles.tag}>{job.category}</span>
            </div>

            {/* Footer */}
            <div className={styles.cardFooter}>
              <div>
                <span className={styles.salary}>{job.salary || "N/A"}</span>
                <span className={styles.location}>
                  {" "}
                  · {job.candidate_required_location}
                </span>
              </div>
              <button
                className={styles.detailsBtn}
                onClick={() => window.open(job.url, "_blank")}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className={styles.pagination}>
        <button
          onClick={() => handleChangePage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={styles.pageBtn}
        >
          Prev
        </button>
        <span className={styles.pageInfo}>
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            handleChangePage(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className={styles.pageBtn}
        >
          Next
        </button>
      </div>
    </section>
  );
}