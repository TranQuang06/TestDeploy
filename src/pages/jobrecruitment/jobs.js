import React, { useState } from "react";
import { Input, Select, Button, Row, Col, Space, Card } from "antd";
import {
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlinePlus,
} from "react-icons/ai";
import JobPostsList from "../../components/JobPostsList/JobPostsList";
import JobPostingModal from "../../components/JobPostingModal/JobPostingModal";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./jobs.module.css";

const { Option } = Select;
const { Search } = Input;

const JobsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showJobModal, setShowJobModal] = useState(false);

  // Filter options
  const jobTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "intern", label: "Intern/Thực tập" },
    { value: "contract", label: "Contract/Hợp đồng" },
    { value: "freelance", label: "Freelance" },
    { value: "remote", label: "Remote" },
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level/Fresher" },
    { value: "junior", label: "Junior (1-2 năm)" },
    { value: "middle", label: "Middle (2-5 năm)" },
    { value: "senior", label: "Senior (5+ năm)" },
    { value: "lead", label: "Lead/Manager" },
  ];

  const jobCategories = [
    { value: "technology", label: "Công nghệ thông tin" },
    { value: "marketing", label: "Marketing" },
    { value: "finance", label: "Tài chính" },
    { value: "sales", label: "Bán hàng" },
    { value: "hr", label: "Nhân sự" },
    { value: "design", label: "Thiết kế" },
    { value: "education", label: "Giáo dục" },
    { value: "healthcare", label: "Y tế" },
    { value: "manufacturing", label: "Sản xuất" },
    { value: "other", label: "Khác" },
  ];

  const locations = [
    { value: "hanoi", label: "Hà Nội" },
    { value: "hcm", label: "TP. Hồ Chí Minh" },
    { value: "danang", label: "Đà Nẵng" },
    { value: "haiphong", label: "Hải Phòng" },
    { value: "cantho", label: "Cần Thơ" },
    { value: "remote", label: "Remote" },
    { value: "other", label: "Khác" },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).length > 0 || searchTerm;
  };

  return (
    <div className={styles.jobsPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <AiOutlineSearch className={styles.titleIcon} />
            Tìm việc làm
          </h1>
          <p className={styles.pageDescription}>
            Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu
          </p>

          {user && (
            <Button
              type="primary"
              size="large"
              icon={<AiOutlinePlus />}
              onClick={() => setShowJobModal(true)}
              className={styles.postJobBtn}
            >
              Đăng tin tuyển dụng
            </Button>
          )}
        </div>
      </div>

      <div className={styles.pageContent}>
        {/* Search and Filters */}
        <Card className={styles.searchSection}>
          <div className={styles.searchRow}>
            <Search
              placeholder="Tìm kiếm theo vị trí, công ty, kỹ năng..."
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className={styles.searchInput}
              enterButton={
                <Button type="primary" icon={<AiOutlineSearch />}>
                  Tìm kiếm
                </Button>
              }
            />

            <Button
              icon={<AiOutlineFilter />}
              size="large"
              className={styles.filterToggleBtn}
              onClick={() => {
                const filterSection = document.querySelector(
                  `.${styles.filtersSection}`
                );
                if (filterSection) {
                  filterSection.style.display =
                    filterSection.style.display === "none" ? "block" : "none";
                }
              }}
            >
              Bộ lọc
            </Button>
          </div>

          <div className={styles.filtersSection}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className={styles.filterGroup}>
                  <label>Loại công việc</label>
                  <Select
                    placeholder="Chọn loại công việc"
                    style={{ width: "100%" }}
                    allowClear
                    value={filters.jobType}
                    onChange={(value) => handleFilterChange("jobType", value)}
                  >
                    {jobTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className={styles.filterGroup}>
                  <label>Kinh nghiệm</label>
                  <Select
                    placeholder="Chọn mức kinh nghiệm"
                    style={{ width: "100%" }}
                    allowClear
                    value={filters.experienceLevel}
                    onChange={(value) =>
                      handleFilterChange("experienceLevel", value)
                    }
                  >
                    {experienceLevels.map((level) => (
                      <Option key={level.value} value={level.value}>
                        {level.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className={styles.filterGroup}>
                  <label>Lĩnh vực</label>
                  <Select
                    placeholder="Chọn lĩnh vực"
                    style={{ width: "100%" }}
                    allowClear
                    value={filters.category}
                    onChange={(value) => handleFilterChange("category", value)}
                  >
                    {jobCategories.map((category) => (
                      <Option key={category.value} value={category.value}>
                        {category.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className={styles.filterGroup}>
                  <label>Địa điểm</label>
                  <Select
                    placeholder="Chọn địa điểm"
                    style={{ width: "100%" }}
                    allowClear
                    value={filters.location}
                    onChange={(value) => handleFilterChange("location", value)}
                  >
                    {locations.map((location) => (
                      <Option key={location.value} value={location.value}>
                        {location.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>

            {hasActiveFilters() && (
              <div className={styles.filterActions}>
                <Button onClick={clearFilters}>Xóa tất cả bộ lọc</Button>
              </div>
            )}
          </div>
        </Card>

        {/* Results Section */}
        <div className={styles.resultsSection}>
          <JobPostsList filters={filters} searchTerm={searchTerm} />
        </div>
      </div>

      {/* Job Posting Modal */}
      <JobPostingModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onJobPosted={(newJob) => {
          console.log("✅ New job posted:", newJob);
          // Optionally refresh the job list or add the new job to the state
        }}
      />
    </div>
  );
};

export default JobsPage;
