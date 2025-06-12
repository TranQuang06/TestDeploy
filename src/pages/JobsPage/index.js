import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LeftJobList from "../../components/LeftJobList/LeftJobList";
import RightJobDetail from "../../components/RightJobDetail/RightJobDetail";
import styles from "./jobs.module.css";

export default function JobsPage() {
  const router = useRouter();
  const { jobId: selectedJobId, location: selectedLocation } = router.query;

  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(3); // Giới hạn 3 job mỗi trang
  const [totalJobs, setTotalJobs] = useState(0);

  // Fetch jobs từ Remotive API với giới hạn số lượng
  useEffect(() => {
    // Đảm bảo router.isReady trước khi sử dụng router.query
    if (!router.isReady) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://remotive.com/api/remote-jobs?limit=100"
        ); // Giới hạn 100 job từ API

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.jobs) {
          // Lưu tổng số job
          setTotalJobs(data.jobs.length);

          // Format dữ liệu job
          const formattedJobs = data.jobs.map((job) => ({
            id: job.id,
            title: job.title,
            companyName: job.company_name,
            companyLogo: job.company_logo,
            location: job.candidate_required_location || "Remote",
            jobType: job.job_type || "Full-time",
            salary: job.salary || "Competitive",
            description: job.description,
            timeAgo: formatPublicationDate(job.publication_date),
            level: "Entry Level", // Mặc định
            bookmarked: false, // Mặc định không bookmark
            paymentVerified: Math.random() > 0.5, // Random cho demo
            paymentSpent: "$10k+", // Mặc định
            url: job.url, // Thêm URL để có thể apply
            requirements: [
              "Bachelor's degree in Computer Science or related field",
              "2+ years of experience in software development",
              "Proficiency in JavaScript, React, and Node.js",
              "Strong problem-solving skills and attention to detail",
            ],
            benefits: [
              "Competitive salary and benefits package",
              "Remote work options",
              "Flexible working hours",
              "Professional development opportunities",
            ],
          }));

          setJobData(formattedJobs);

          // Nếu có selectedLocation từ query params, lọc jobs theo location
          if (selectedLocation) {
            const jobsInSameLocation = formattedJobs.filter((job) =>
              job.location
                .toLowerCase()
                .includes(selectedLocation.toLowerCase())
            );
            setFilteredJobs(jobsInSameLocation);

            // Cập nhật URL để phản ánh bộ lọc location
            if (!selectedJobId) {
              router.replace(
                `/JobsPage?location=${encodeURIComponent(selectedLocation)}`,
                undefined,
                { shallow: true }
              );
            }
          } else {
            setFilteredJobs(formattedJobs);
          }

          // Nếu có selectedJobId từ query params, tìm và chọn job đó
          if (selectedJobId) {
            const jobToSelect = formattedJobs.find(
              (job) => job.id.toString() === selectedJobId
            );
            if (jobToSelect) {
              setSelectedJob(jobToSelect);

              // Nếu không có selectedLocation, lọc jobs theo location của job được chọn
              if (!selectedLocation) {
                const jobsInSameLocation = formattedJobs.filter((job) =>
                  job.location
                    .toLowerCase()
                    .includes(jobToSelect.location.toLowerCase())
                );
                setFilteredJobs(jobsInSameLocation);

                // Cập nhật URL để phản ánh bộ lọc location
                router.replace(
                  `/JobsPage?jobId=${selectedJobId}&location=${encodeURIComponent(
                    jobToSelect.location
                  )}`,
                  undefined,
                  { shallow: true }
                );
              }
            }
          } else if (formattedJobs.length > 0) {
            // Nếu không có selectedJobId, chọn job đầu tiên
            setSelectedJob(formattedJobs[0]);
          }
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedJobId, selectedLocation, router.isReady]);

  // Hàm định dạng ngày đăng
  const formatPublicationDate = (dateString) => {
    if (!dateString) return "Recently";

    const publishDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - publishDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };

  // Lấy jobs cho trang hiện tại
  const getCurrentPageJobs = () => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);

    // Cập nhật URL khi chọn job mới
    router.replace(
      `/JobsPage?jobId=${job.id}&location=${encodeURIComponent(job.location)}`,
      undefined,
      { shallow: true }
    );

    // Trên mobile, scroll lên đầu trang khi chọn job mới
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBookmarkToggle = (jobId) => {
    setJobData((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, bookmarked: !j.bookmarked } : j
      )
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => ({ ...prev, bookmarked: !prev.bookmarked }));
    }
  };

  const handleApply = (job) => {
    // Mở URL apply trong tab mới
    if (job && job.url) {
      window.open(job.url, "_blank");
    } else {
      alert(`Applied to: ${job.title} at ${job.companyName}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải danh sách công việc...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Không thể tải danh sách công việc</h3>
        <p>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Nội dung chính */}
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <LeftJobList
            jobData={getCurrentPageJobs()} // Chỉ truyền jobs của trang hiện tại
            totalCount={filteredJobs.length}
            onSelectJob={handleSelectJob}
            selectedJobId={selectedJob?.id}
          />

          {/* Phân trang */}
          {filteredJobs.length > jobsPerPage && (
            <div className={styles.pagination}>
              <button
                className={`${styles.pageButton} ${
                  currentPage === 1 ? styles.disabled : ""
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  // Hiển thị tối đa 3 nút trang thay vì 5 để tiết kiệm không gian
                  let pageNum;
                  if (totalPages <= 3) {
                    // Nếu tổng số trang <= 3, hiển thị tất cả
                    pageNum = i + 1;
                  } else if (currentPage <= 2) {
                    // Nếu đang ở trang đầu, hiển thị 1-3
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    // Nếu đang ở trang cuối, hiển thị totalPages-2 đến totalPages
                    pageNum = totalPages - 2 + i;
                  } else {
                    // Nếu đang ở giữa, hiển thị currentPage-1 đến currentPage+1
                    pageNum = currentPage - 1 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageNumber} ${
                        currentPage === pageNum ? styles.activePage : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className={`${styles.pageButton} ${
                  currentPage === totalPages ? styles.disabled : ""
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
        <div className={styles.rightPane}>
          {selectedJob ? (
            <RightJobDetail
              job={selectedJob}
              onBookmarkToggle={handleBookmarkToggle}
              onApply={handleApply}
            />
          ) : (
            <div className={styles.noJobSelected}>
              <h3>
                {filteredJobs.length === 0
                  ? "Không tìm thấy công việc phù hợp. Vui lòng thử lại với từ khóa khác."
                  : "Vui lòng chọn một công việc từ danh sách bên trái"}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
