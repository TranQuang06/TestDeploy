import React, { useState, useEffect } from "react";
import { Card, Tag, Button, Avatar, Tooltip, Empty, Spin, message } from "antd";
import {
  AiOutlineEnvironment,
  AiOutlineDollar,
  AiOutlineClockCircle,
  AiOutlineEye,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineFileText,
} from "react-icons/ai";
import { getJobPosts, incrementJobViewCount } from "../../utils/jobService";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./JobPostsList.module.css";

const { Meta } = Card;

const JobPostsList = ({ filters = {}, searchTerm = "", limit }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, [filters, searchTerm]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsData = await getJobPosts({
        ...filters,
        status: "active",
        limit: limit || 20,
      });

      console.log("🔍 Loaded jobs data:", jobsData);

      // Client-side search if search term is provided
      let filteredJobs = jobsData;
      if (searchTerm) {
        filteredJobs = jobsData.filter((job) => {
          const searchFields = [
            job.jobTitle,
            job.companyName,
            job.jobDescription,
            job.location,
            job.category,
          ]
            .join(" ")
            .toLowerCase();

          return searchFields.includes(searchTerm.toLowerCase());
        });
      }

      setJobs(filteredJobs);
    } catch (error) {
      console.error("❌ Error loading jobs:", error);
      setError("Có lỗi xảy ra khi tải danh sách việc làm");
      message.error("Không thể tải danh sách việc làm");
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = async (jobId) => {
    try {
      await incrementJobViewCount(jobId);
      // Update local state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId
            ? { ...job, viewCount: (job.viewCount || 0) + 1 }
            : job
        )
      );
    } catch (error) {
      console.error("❌ Error incrementing view count:", error);
    }
  };

  const formatSalary = (job) => {
    if (job.salaryNegotiable) {
      return "Lương thỏa thuận";
    }

    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin} - ${job.salaryMax} triệu VNĐ`;
    }

    if (job.salaryMin) {
      return `Từ ${job.salaryMin} triệu VNĐ`;
    }

    if (job.salaryMax) {
      return `Lên đến ${job.salaryMax} triệu VNĐ`;
    }

    return "Lương thỏa thuận";
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      "full-time": "blue",
      "part-time": "green",
      intern: "orange",
      contract: "purple",
      freelance: "cyan",
      remote: "magenta",
    };
    return colors[jobType] || "default";
  };

  const getJobTypeLabel = (jobType) => {
    const labels = {
      "full-time": "Full-time",
      "part-time": "Part-time",
      intern: "Intern/Thực tập",
      contract: "Contract",
      freelance: "Freelance",
      remote: "Remote",
    };
    return labels[jobType] || jobType;
  };

  const getExperienceLabel = (experienceLevel) => {
    const labels = {
      entry: "Entry Level",
      junior: "Junior (1-2 năm)",
      middle: "Middle (2-5 năm)",
      senior: "Senior (5+ năm)",
      lead: "Lead/Manager",
    };
    return labels[experienceLevel] || experienceLevel;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa đăng";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;

    return `${Math.floor(diffInDays / 30)} tháng trước`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p>Đang tải danh sách việc làm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={loadJobs}>
            Thử lại
          </Button>
        </Empty>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Empty
          description="Không tìm thấy việc làm phù hợp"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className={styles.jobsList}>
      {jobs.map((job) => (
        <Card
          key={job.id}
          className={styles.jobCard}
          actions={[
            <Button
              type="primary"
              size="large"
              onClick={() => handleViewJob(job.id)}
              className={styles.applyBtn}
            >
              Xem chi tiết
            </Button>,
          ]}
        >
          <div className={styles.jobHeader}>
            <div className={styles.companyInfo}>
              <Avatar
                size={48}
                icon={<AiOutlineFileText />}
                src={job.postedByAvatar}
                style={{ backgroundColor: "#1890ff" }}
              />
              <div className={styles.headerText}>
                <h3 className={styles.jobTitle}>{job.jobTitle}</h3>
                <p className={styles.companyName}>{job.companyName}</p>
              </div>
            </div>
            <div className={styles.jobMeta}>
              <span className={styles.timeAgo}>
                <AiOutlineClockCircle />
                {getTimeAgo(
                  job.createdAt?.seconds
                    ? new Date(job.createdAt.seconds * 1000).toISOString()
                    : job.createdAt
                )}
              </span>
              <span className={styles.viewCount}>
                <AiOutlineEye />
                {job.viewCount || 0} lượt xem
              </span>
            </div>
          </div>

          <div className={styles.jobTags}>
            <Tag
              color={getJobTypeColor(job.jobType)}
              className={styles.jobTypeTag}
            >
              {getJobTypeLabel(job.jobType)}
            </Tag>
            <Tag color="blue" className={styles.experienceTag}>
              {getExperienceLabel(job.experienceLevel)}
            </Tag>
          </div>

          <div className={styles.jobDetails}>
            <div className={styles.detailItem}>
              <AiOutlineEnvironment className={styles.detailIcon} />
              <span>{job.location}</span>
            </div>
            <div className={styles.detailItem}>
              <AiOutlineDollar className={styles.detailIcon} />
              <span>{formatSalary(job)}</span>
            </div>
            {job.expiryDate && (
              <div className={styles.detailItem}>
                <AiOutlineCalendar className={styles.detailIcon} />
                <span>Hạn nộp: {formatDate(job.expiryDate)}</span>
              </div>
            )}
          </div>

          {job.jobDescription && (
            <div className={styles.jobDescription}>
              <p>
                {job.jobDescription.substring(0, 200)}
                {job.jobDescription.length > 200 && "..."}
              </p>
            </div>
          )}

          <div className={styles.jobFooter}>
            <div className={styles.postedBy}>
              <span>Đăng bởi: {job.postedByName}</span>
            </div>
            <div className={styles.applicationCount}>
              <AiOutlineUser />
              <span>{job.applicationCount || 0} ứng tuyển</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default JobPostsList;
