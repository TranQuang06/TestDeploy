import styles from "../FindJob/FindJob.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

function FindJob() {
  const [totalJobs, setTotalJobs] = useState(0);
  const [displayJobs, setDisplayJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [jobsData, setJobsData] = useState([]);
  const [filters, setFilters] = useState({
    jobTypes: [],
    locations: [],
    companies: [],
  });
  // Hàm xử lý dữ liệu và tạo filters
  const processFiltersData = (jobs) => {
    const jobTypeCounts = {};
    const locationCounts = {};
    const companyCounts = {};

    jobs.forEach((job) => {
      // Job Types
      if (job.job_type) {
        jobTypeCounts[job.job_type] = (jobTypeCounts[job.job_type] || 0) + 1;
      }

      // Locations (candidate_required_location)
      if (job.candidate_required_location) {
        locationCounts[job.candidate_required_location] =
          (locationCounts[job.candidate_required_location] || 0) + 1;
      }

      // Companies
      if (job.company_name) {
        companyCounts[job.company_name] =
          (companyCounts[job.company_name] || 0) + 1;
      }
    });

    // Sắp xếp theo số lượng giảm dần và lấy top items
    const sortedJobTypes = Object.entries(jobTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([type, count]) => ({ name: type, count }));

    const sortedLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([location, count]) => ({ name: location, count }));

    const sortedCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([company, count]) => ({ name: company, count }));

    setFilters({
      jobTypes: sortedJobTypes,
      locations: sortedLocations,
      companies: sortedCompanies,
    });
  };

  // Hàm tạo hiệu ứng counter animation
  const animateCounter = (targetValue) => {
    const duration = 2000; // 2 giây
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function để tạo hiệu ứng mượt
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      // Tính toán giá trị hiện tại với một chút random để tạo hiệu ứng nhảy số
      const currentValue = Math.floor(startValue + targetValue * easedProgress);
      const randomVariation =
        progress < 0.9 ? Math.floor(Math.random() * 100) : 0;

      setDisplayJobs(currentValue + randomVariation);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayJobs(targetValue); // Đảm bảo kết thúc đúng số
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Hàm lấy ngày hôm nay theo định dạng
  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }; // Fetch API để lấy số lượng việc làm
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://remotive.com/api/remote-jobs");
        const data = await response.json();

        if (data && data["total-job-count"] && data.jobs) {
          setTotalJobs(data["total-job-count"]);
          setJobsData(data.jobs);

          // Process filter data
          processFiltersData(data.jobs);

          // Bắt đầu animation counter khi có dữ liệu
          setTimeout(() => {
            setLoading(false);
            animateCounter(data["total-job-count"]);
          }, 500); // Delay 500ms để tạo hiệu ứng
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // Fallback number nếu API lỗi
        const fallbackValue = 1000;
        setTotalJobs(fallbackValue);
        setTimeout(() => {
          setLoading(false);
          animateCounter(fallbackValue);
        }, 500);
      }
    };

    fetchJobs();
  }, []);
  return (
    <>
      {/* <Header /> */}
      {" "}
      <div className={styles.sectionBanner}>
        <div className="container">
          <div className={styles.bannerContent}>
            <h1>Find your dream job</h1>
          </div>
        </div>
        <div className={styles.searchBar}>
          <div className="container">
            {" "}
            <div className={styles.searchForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="searchInput"
                  className={styles.searchInput}
                  placeholder=" "
                />
                <label htmlFor="searchInput" className={styles.inputLabel}>
                  Search job title, keywords or company
                </label>
                <SearchOutlined className={styles.searchIcon} />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="locationInput"
                  className={styles.locationInput}
                  placeholder=" "
                />
                <label htmlFor="locationInput" className={styles.inputLabel}>
                  Location
                </label>
              </div>
              <button className={styles.searchButton}>Search</button>
            </div>
          </div>
        </div>{" "}
      </div>
      <div className={styles.sectionFind}>
        <div className="container">
          {" "}
          <div className={styles.totalJobs}>
            Tuyển dụng{" "}
            <span className={styles.jobCount}>
              {loading ? "..." : displayJobs.toLocaleString()}
            </span>{" "}
            việc làm <span className={styles.jobType}></span> [Update{" "}
            {getCurrentDate()}]
          </div>
        </div>{" "}
        <div className={styles.contentWrapper}>
          <div className={styles.leftSide}>
            <div className={styles.filterSection}>
              <div className={styles.filterHeader}>
                <h3>Filters</h3>
                <button className={styles.clearAll}>Clear All</button>
              </div>

              {/* Job Type Filter */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <h4>JOB TYPE</h4>
                  <button className={styles.clearFilter}>Clear</button>
                </div>
                <div className={styles.filterOptions}>
                  <div className={styles.filterOption}>
                    <span className={styles.optionName}>All ({totalJobs})</span>
                  </div>
                  {filters.jobTypes.map((jobType, index) => (
                    <div key={index} className={styles.filterOption}>
                      <span className={styles.optionName}>
                        {jobType.name} ({jobType.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <h4>LOCATION</h4>
                  <button className={styles.clearFilter}>Clear</button>
                </div>
                <div className={styles.filterOptions}>
                  {filters.locations.map((location, index) => (
                    <div key={index} className={styles.filterOption}>
                      <span className={styles.optionName}>
                        {location.name} ({location.count})
                      </span>
                    </div>
                  ))}
                  <button className={styles.showMore}>More +</button>
                </div>
              </div>

              {/* Company Filter */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <h4>COMPANY</h4>
                  <button className={styles.clearFilter}>Clear</button>
                </div>
                <div className={styles.filterOptions}>
                  <div className={styles.filterOption}>
                    <span className={styles.optionName}>All ({totalJobs})</span>
                  </div>
                  {filters.companies.map((company, index) => (
                    <div key={index} className={styles.filterOption}>
                      <span className={styles.optionName}>
                        {company.name} ({company.count})
                      </span>
                    </div>
                  ))}
                  <button className={styles.showMore}>More +</button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.center}></div>
          <div className={styles.rightSide}></div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default FindJob;
