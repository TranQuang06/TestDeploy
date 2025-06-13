import React, { useState, useEffect } from "react";
import { Card, Tag, Button, Avatar, message, Spin, Empty } from "antd";
import {
  AiOutlineEnvironment,
  AiOutlineDollar,
  AiOutlineClockCircle,
  AiOutlineEye,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineFileText,
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineShare,
} from "react-icons/ai";
import { getJobPosts, incrementJobViewCount } from "../../utils/jobService";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./SimpleJobsList.module.css";

const SimpleJobsList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading jobs from Firebase...");

      const jobsData = await getJobPosts({
        status: "active",
      });

      console.log("✅ Jobs loaded:", jobsData);
      setJobs(jobsData);
    } catch (error) {
      console.error("❌ Error loading jobs:", error);
      setError("Có lỗi xảy ra khi tải danh sách việc làm");
      message.error("Không thể tải danh sách việc làm");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Đang tải việc làm...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Lỗi: {error}</div>;
  }

  if (jobs.length === 0) {
    return <div style={{ padding: "20px" }}>Không có việc làm nào.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách việc làm ({jobs.length})</h2>
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "8px",
          }}
        >
          <h3>{job.jobTitle}</h3>
          <p>
            <strong>Công ty:</strong> {job.companyName}
          </p>
          <p>
            <strong>Loại:</strong> {job.jobType}
          </p>
          <p>
            <strong>Địa điểm:</strong> {job.location}
          </p>
          <p>
            <strong>Lương:</strong>{" "}
            {job.salaryNegotiable
              ? "Thỏa thuận"
              : job.salaryMin && job.salaryMax
              ? `${job.salaryMin}-${job.salaryMax} triệu`
              : "Chưa cập nhật"}
          </p>
          <p>
            <strong>ID:</strong> {job.id}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SimpleJobsList;
