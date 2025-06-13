// src/components/JobsSection/JobsSection.js

import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  AiOutlineFileText,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import { getJobPosts } from "../../utils/jobService";
import { useAuth } from "../../contexts/AuthContext";
import JobPostingModal from "../JobPostingModal/JobPostingModal";
import styles from "./JobsSection.module.css";

export default function JobsSection() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

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
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await getJobPosts({
        status: "active",
        limit: 20,
      });

      setJobs(jobsData);

      // Lấy các kiểu công việc duy nhất và thêm 'All' ở đầu
      const types = Array.from(new Set(jobsData.map((j) => j.jobType))).filter(
        Boolean
      );
      setJobTypes(["All", ...types]);
    } catch (err) {
      setError(err.message);
      message.error("Không thể tải danh sách việc làm");
    } finally {
      setLoading(false);
    }
  };

  // Reset về trang 1 khi đổi loại job
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType]);
  // Lọc jobs theo tab đang chọn
  const filteredJobs =
    activeType === "All" ? jobs : jobs.filter((j) => j.jobType === activeType);

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
      {/* Header with Actions */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.sectionTitle}>
            <AiOutlineFileText className={styles.titleIcon} />
            Việc làm mới nhất
          </h2>
          <p className={styles.hint}>
            ⚡ Upload your resume – let employers find you
          </p>
        </div>

        <div className={styles.headerActions}>
          {user && (
            <Button
              type="primary"
              icon={<AiOutlinePlus />}
              onClick={() => setShowJobModal(true)}
              className={styles.postJobBtn}
            >
              Đăng tin tuyển dụng
            </Button>
          )}
          <Button
            icon={<AiOutlineSearch />}
            onClick={() => (window.location.href = "/jobs")}
            className={styles.viewAllBtn}
          >
            Xem tất cả
          </Button>
        </div>
      </div>

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
            {" "}
            {/* Header */}
            <div className={styles.cardHeader}>
              <div className={styles.companyLogo}>
                {job.postedByAvatar ? (
                  <img
                    src={job.postedByAvatar}
                    alt={job.companyName}
                    className={styles.logo}
                  />
                ) : (
                  <div className={styles.logoPlaceholder}>
                    <AiOutlineFileText />
                  </div>
                )}
              </div>
              <span className={styles.posted}>
                {job.createdAt &&
                  new Date(
                    job.createdAt.seconds
                      ? job.createdAt.seconds * 1000
                      : job.createdAt
                  ).toLocaleDateString("vi-VN")}
              </span>
              <span className={styles.bookmark}>🔖</span>
            </div>
            {/* Nội dung chính */}
            <h4 className={styles.company}>{job.companyName}</h4>
            <h3 className={styles.title}>{job.jobTitle}</h3>{" "}
            <div className={styles.tags}>
              <span className={styles.tag}>{job.jobType}</span>
              <span className={styles.tag}>{job.category}</span>
              <span className={styles.tag}>{job.experienceLevel}</span>
            </div>
            {/* Footer */}
            <div className={styles.cardFooter}>
              <div>
                <span className={styles.salary}>
                  {job.salaryNegotiable
                    ? "Lương TT"
                    : job.salaryMin && job.salaryMax
                    ? `${job.salaryMin}-${job.salaryMax}tr`
                    : job.salaryMin
                    ? `Từ ${job.salaryMin}tr`
                    : "Lương TT"}
                </span>
                <span className={styles.location}> · {job.location}</span>
              </div>
              <button
                className={styles.detailsBtn}
                onClick={() => {
                  // Có thể mở modal chi tiết hoặc redirect
                  console.log("View job details:", job);
                }}
              >
                Chi tiết
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
          Prev{" "}
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

      {/* Job Posting Modal */}
      <JobPostingModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onJobPosted={(newJob) => {
          console.log("✅ New job posted:", newJob);
          message.success("Đăng tin tuyển dụng thành công!");
          loadJobs(); // Reload danh sách jobs
        }}
      />
    </section>
  );
}
