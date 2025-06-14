import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ChatButton from "../../components/ChatButton/ChatButton";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Pagination, Slider, InputNumber } from "antd";
import styles from "../FindJob/FindJob.module.css";
import { useRouter } from "next/router"; // Sử dụng useRouter từ Next.js

function FindJob() {
  const router = useRouter(); // Sử dụng router thay vì navigate
  const [totalJobs, setTotalJobs] = useState(0);
  const [displayJobs, setDisplayJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [jobsData, setJobsData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    jobTypes: [],
    locations: [],
    companies: [],
    categories: [],
  });
  const [showMore, setShowMore] = useState({
    locations: false,
    companies: false,
    categories: false,
    popularCompanies: false,
  });
  const [displayCount, setDisplayCount] = useState({
    locations: 8,
    companies: 10,
    categories: 8,
    popularCompanies: 8,
  });
  const [allFilters, setAllFilters] = useState({
    jobTypes: [],
    locations: [],
    companies: [],
    categories: [],
  });
  // State để track các filter đã chọn
  const [selectedFilters, setSelectedFilters] = useState({
    jobTypes: [],
    locations: [],
    companies: [],
    categories: [],
    salaryRange: [null, null],
  });
  // State cho sorting
  const [sortBy, setSortBy] = useState("date"); // "date" hoặc "salary"
  // State cho search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // State cho autocomplete
  const [showSuggestions, setShowSuggestions] = useState({
    search: false,
    location: false,
  });
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Function để tính toán dynamic filters dựa trên selected filters
  const calculateDynamicFilters = () => {
    console.log("=== CALCULATING DYNAMIC FILTERS ===");
    console.log("Current selected filters:", selectedFilters);

    // Helper function để lấy filtered jobs cho specific filter type
    const getFilteredJobsForType = (excludeType) => {
      let jobs = jobsData;

      // Apply all filters EXCEPT the excluded type
      if (excludeType !== "jobTypes" && selectedFilters.jobTypes.length > 0) {
        jobs = jobs.filter((job) =>
          selectedFilters.jobTypes.includes(job.job_type)
        );
      }

      if (excludeType !== "locations" && selectedFilters.locations.length > 0) {
        jobs = jobs.filter((job) =>
          selectedFilters.locations.includes(job.candidate_required_location)
        );
      }
      if (excludeType !== "companies" && selectedFilters.companies.length > 0) {
        jobs = jobs.filter((job) =>
          selectedFilters.companies.includes(job.company_name)
        );
      }

      if (
        excludeType !== "categories" &&
        selectedFilters.categories.length > 0
      ) {
        jobs = jobs.filter((job) =>
          selectedFilters.categories.includes(job.category)
        );
      }

      return jobs;
    };

    // Tính counts cho job types (exclude jobTypes filter)
    const jobTypeFilteredJobs = getFilteredJobsForType("jobTypes");
    const jobTypeCounts = {};
    jobTypeFilteredJobs.forEach((job) => {
      if (job.job_type) {
        jobTypeCounts[job.job_type] = (jobTypeCounts[job.job_type] || 0) + 1;
      }
    });

    // Tính counts cho locations (exclude locations filter)
    const locationFilteredJobs = getFilteredJobsForType("locations");
    const locationCounts = {};
    locationFilteredJobs.forEach((job) => {
      if (job.candidate_required_location) {
        locationCounts[job.candidate_required_location] =
          (locationCounts[job.candidate_required_location] || 0) + 1;
      }
    }); // Tính counts cho companies (exclude companies filter)
    const companyFilteredJobs = getFilteredJobsForType("companies");
    const companyCounts = {};
    companyFilteredJobs.forEach((job) => {
      if (job.company_name) {
        companyCounts[job.company_name] =
          (companyCounts[job.company_name] || 0) + 1;
      }
    });

    // Tính counts cho categories (exclude categories filter)
    const categoryFilteredJobs = getFilteredJobsForType("categories");
    const categoryCounts = {};
    categoryFilteredJobs.forEach((job) => {
      if (job.category) {
        categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
      }
    });

    console.log("JobType filtered jobs:", jobTypeFilteredJobs.length);
    console.log("Location filtered jobs:", locationFilteredJobs.length);
    console.log("Company filtered jobs:", companyFilteredJobs.length);
    console.log(
      "Sample location counts:",
      Object.entries(locationCounts).slice(0, 5)
    );

    // Sắp xếp theo số lượng giảm dần
    const sortedJobTypes = Object.entries(jobTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ name: type, count }));

    const sortedLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([location, count]) => ({ name: location, count }));
    const sortedCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([company, count]) => ({ name: company, count }));

    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({ name: category, count }));

    console.log("New sorted locations:", sortedLocations.slice(0, 5));

    // Cập nhật filters với counts mới
    setAllFilters({
      jobTypes: sortedJobTypes,
      locations: sortedLocations,
      companies: sortedCompanies,
      categories: sortedCategories,
    });

    // Hiển thị limited items với counts mới
    setFilters({
      jobTypes: sortedJobTypes.slice(0, 6),
      locations: sortedLocations.slice(
        0,
        showMore.locations
          ? Math.min(displayCount.locations, sortedLocations.length)
          : 8
      ),
      companies: sortedCompanies.slice(
        0,
        showMore.companies
          ? Math.min(displayCount.companies, sortedCompanies.length)
          : 10
      ),
      categories: sortedCategories.slice(
        0,
        showMore.categories
          ? Math.min(displayCount.categories, sortedCategories.length)
          : 8
      ),
    });

    console.log("=== END DYNAMIC FILTERS ===");
  };
  // Hàm xử lý khi click More
  const handleShowMore = (filterType) => {
    setShowMore((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));

    if (!showMore[filterType]) {
      // Hiển thị thêm 10 items
      const currentCount = displayCount[filterType];
      const newCount = Math.min(
        currentCount + 10,
        allFilters[filterType].length
      );

      setDisplayCount((prev) => ({
        ...prev,
        [filterType]: newCount,
      }));

      setFilters((prev) => ({
        ...prev,
        [filterType]: allFilters[filterType].slice(0, newCount),
      }));
    } else {
      // Ẩn bớt, trở về số lượng ban đầu
      const initialLimits = {
        locations: 8,
        companies: 10,
        categories: 8,
      };

      setDisplayCount((prev) => ({
        ...prev,
        [filterType]: initialLimits[filterType],
      }));

      setFilters((prev) => ({
        ...prev,
        [filterType]: allFilters[filterType].slice(
          0,
          initialLimits[filterType]
        ),
      }));
    }
  };
  // Function để handle show more popular companies
  const handleShowMorePopularCompanies = () => {
    console.log("=== SHOW MORE POPULAR COMPANIES DEBUG ===");
    console.log("Current state:", showMore.popularCompanies);
    console.log("Current displayCount:", displayCount.popularCompanies);

    if (!showMore.popularCompanies) {
      // Hiển thị thêm 5 companies
      const newCount = displayCount.popularCompanies + 5;
      console.log("New count will be:", newCount);

      setDisplayCount((prev) => ({
        ...prev,
        popularCompanies: newCount,
      }));
    } else {
      // Reset về 8 companies ban đầu
      console.log("Resetting to 8 companies");
      setDisplayCount((prev) => ({
        ...prev,
        popularCompanies: 8,
      }));
    }

    setShowMore((prev) => ({
      ...prev,
      popularCompanies: !prev.popularCompanies,
    }));

    console.log("=== END DEBUG ===");
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
  }; // Helper function để get jobs cho trang hiện tại
  const getCurrentPageJobs = () => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  };

  // Helper function để format thời gian
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Not specified";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };
  // Helper function để lấy logo URL từ job object
  const getCompanyLogo = (job) => {
    // Check các thuộc tính logo có thể có
    const logoUrl =
      job.company_logo ||
      job.company_logo_url ||
      job.logo ||
      job.logo_url ||
      job.company?.logo ||
      null;

    // Debug: log để xem structure của job object
    if (job.company_name === "Instacart") {
      console.log("Sample job structure for", job.company_name, ":", {
        company_logo: job.company_logo,
        company_logo_url: job.company_logo_url,
        logo: job.logo,
        logo_url: job.logo_url,
        company: job.company,
        all_keys: Object.keys(job),
      });
    }

    return logoUrl;
  };
  // Helper function để tạo placeholder logo cho company
  const getCompanyLogoFallback = (companyName) => {
    if (!companyName) return null;

    // Tạo logo placeholder từ tên company với size phù hợp
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      companyName
    )}&background=6366f1&color=ffffff&size=40`;
  };
  // Helper function để lấy logo thật từ company name (cho popular companies)
  const getCompanyLogoFromName = (companyName) => {
    if (!companyName || !jobsData.length) return null;

    // Tìm job đầu tiên của company này để lấy logo thật
    const companyJob = jobsData.find((job) => job.company_name === companyName);
    if (companyJob) {
      const logoUrl = getCompanyLogo(companyJob);

      // Debug: log để xem logo của Instacart
      if (companyName === "Instacart") {
        console.log("=== INSTACART LOGO DEBUG ===");
        console.log("Company job found:", !!companyJob);
        console.log("Logo URL:", logoUrl);
        console.log("Company logo field:", companyJob.company_logo);
        console.log("All available fields:", Object.keys(companyJob));
        console.log("=== END DEBUG ===");
      }

      return logoUrl;
    }

    return null;
  };
  // Helper function để format experience từ API
  const formatExperience = (job) => {
    // Sử dụng tags từ API để hiển thị experience/skills
    if (job.tags && job.tags.length > 0) {
      // Lấy tag đầu tiên hoặc kết hợp 2-3 tags
      if (job.tags.length === 1) {
        return job.tags[0];
      } else if (job.tags.length <= 3) {
        return job.tags.join(", ");
      } else {
        return job.tags.slice(0, 2).join(", ") + ` +${job.tags.length - 2}`;
      }
    }

    // Fallback nếu không có tags
    if (job.experience_level) {
      return job.experience_level;
    }
    if (job.seniority_level) {
      return job.seniority_level;
    }
    if (job.category && job.category.includes("Senior")) {
      return "Senior Level";
    }
    if (job.category && job.category.includes("Junior")) {
      return "Junior Level";
    }
    return "Not specified";
  };

  // Helper function để format salary từ API
  const formatSalary = (job) => {
    if (job.salary) {
      return job.salary;
    }
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min}k - $${job.salary_max}k`;
    }
    if (job.salary_range) {
      return job.salary_range;
    }
    return "Not disclosed";
  };

  // Helper function để format job type từ API
  const formatJobType = (job) => {
    if (job.job_type) {
      return job.job_type
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    if (job.employment_type) {
      return job.employment_type
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return "Full-Time";
  };

  // Fetch API để lấy số lượng việc làm
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://remotive.com/api/remote-jobs");
        const data = await response.json();
        if (data && data["total-job-count"] && data.jobs) {
          setTotalJobs(data["total-job-count"]);
          setJobsData(data.jobs);
          setFilteredJobs(data.jobs); // Initialize filtered jobs with all jobs

          // Debug: Check available logo properties
          console.log("Sample job data:", data.jobs[0]);
          console.log("Available properties:", Object.keys(data.jobs[0] || {}));

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
  // Function để handle khi click vào filter option
  const handleFilterSelection = (filterType, filterValue) => {
    setSelectedFilters((prev) => {
      if (filterValue === "All") {
        // Nếu chọn "All", clear filter của type này
        return {
          ...prev,
          [filterType]: [],
        };
      } else {
        // Chỉ chọn 1 option duy nhất cho mỗi filter type
        return {
          ...prev,
          [filterType]: [filterValue], // Luôn là array với 1 element
        };
      }
    });

    // Reset về trang 1 khi filter thay đổi
    setCurrentPage(1);
  }; // Function để clear tất cả filters
  const clearAllFilters = () => {
    setSelectedFilters({
      jobTypes: [],
      locations: [],
      companies: [],
      categories: [],
      salaryRange: [null, null], // Reset salary range về null
    });
    setCurrentPage(1);
  };

  // Function để clear filter của 1 type
  const clearFilterType = (filterType) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: [],
    }));
    setCurrentPage(1);
  }; // Function để filter jobs dựa trên selected filters và search
  const applyFilters = () => {
    let filtered = jobsData;

    console.log("=== DEBUG FILTERING ===");
    console.log("Selected filters:", selectedFilters);
    console.log("Search terms:", { searchTerm, searchLocation });
    console.log("Total jobs before filtering:", jobsData.length);

    // 1. Apply search filters FIRST
    // Search by job title, keywords, company
    if (searchTerm && searchTerm.trim() !== "") {
      filtered = searchJobs(filtered, searchTerm);
      console.log("Jobs after search filter:", filtered.length);
    }

    // Search by location
    if (searchLocation && searchLocation.trim() !== "") {
      filtered = searchByLocation(filtered, searchLocation);
      console.log("Jobs after location search:", filtered.length);
    }

    // 2. Apply other filters
    // Filter by job types
    if (selectedFilters.jobTypes.length > 0) {
      console.log("Filtering by job types:", selectedFilters.jobTypes);
      filtered = filtered.filter((job) =>
        selectedFilters.jobTypes.includes(job.job_type)
      );
      console.log("Jobs after job type filter:", filtered.length);
    }

    // Filter by locations (sidebar filter)
    if (selectedFilters.locations.length > 0) {
      console.log("Filtering by locations:", selectedFilters.locations);
      filtered = filtered.filter((job) =>
        selectedFilters.locations.includes(job.candidate_required_location)
      );
      console.log("Jobs after location filter:", filtered.length);
    } // Filter by companies (sidebar filter)
    if (selectedFilters.companies.length > 0) {
      console.log("Filtering by companies:", selectedFilters.companies);
      filtered = filtered.filter((job) =>
        selectedFilters.companies.includes(job.company_name)
      );
      console.log("Jobs after company filter:", filtered.length);
    }

    // Filter by categories (sidebar filter)
    if (selectedFilters.categories.length > 0) {
      console.log("Filtering by categories:", selectedFilters.categories);
      filtered = filtered.filter((job) =>
        selectedFilters.categories.includes(job.category)
      );
      console.log("Jobs after category filter:", filtered.length);
    }

    // Filter by salary range
    const [minSalary, maxSalary] = selectedFilters.salaryRange;
    if (minSalary !== null || maxSalary !== null) {
      console.log("Filtering by salary range:", selectedFilters.salaryRange);
      filtered = filtered.filter((job) => {
        // Parse salary từ nhiều format khác nhau
        let jobMinSalary = 0;
        let jobMaxSalary = 0;

        // Check salary string format
        if (job.salary && typeof job.salary === "string") {
          const salaryStr = job.salary.toLowerCase();

          // Handle format "$60k-$130k (depending on experience)"
          if (salaryStr.includes("k")) {
            const kNumbers = salaryStr.match(/(\d+)k/g);
            if (kNumbers && kNumbers.length >= 1) {
              jobMinSalary = parseInt(kNumbers[0].replace("k", "")) * 1000;
              if (kNumbers.length >= 2) {
                jobMaxSalary = parseInt(kNumbers[1].replace("k", "")) * 1000;
              } else {
                jobMaxSalary = jobMinSalary;
              }
            }
          }
          // Handle format "$243,865 - $286,900 usd" or "$35-$50 per hour"
          else {
            const numbers = salaryStr.match(/\$?([\d,]+)/g);
            if (numbers && numbers.length >= 1) {
              jobMinSalary = parseInt(numbers[0].replace(/[\$,]/g, ""));
              if (numbers.length >= 2) {
                jobMaxSalary = parseInt(numbers[1].replace(/[\$,]/g, ""));
              } else {
                jobMaxSalary = jobMinSalary;
              }
            }
          }
        }

        // Fallback to individual salary fields
        if (jobMinSalary === 0 && jobMaxSalary === 0) {
          jobMinSalary = job.salary_min || 0;
          jobMaxSalary = job.salary_max || job.salary_min || 0;
        }

        // Logic filtering đơn giản và chính xác
        let passesFilter = true;

        // Nếu có filter min salary, job min salary phải >= filter min
        if (minSalary !== null) {
          passesFilter = passesFilter && jobMinSalary >= minSalary;
        }

        // Nếu có filter max salary, job min salary phải <= filter max
        // (Chỉ show jobs mà ngay cả mức lương thấp nhất cũng không vượt quá filter max)
        if (maxSalary !== null) {
          passesFilter = passesFilter && jobMinSalary <= maxSalary;
        }

        return passesFilter;
      });
      console.log("Jobs after salary range filter:", filtered.length);
    }

    console.log("Final filtered jobs:", filtered.length);
    console.log("=== END DEBUG ===");

    setFilteredJobs(filtered);
  }; // UseEffect để apply filters khi selectedFilters hoặc search terms thay đổi
  useEffect(() => {
    if (jobsData.length > 0) {
      applyFilters();
      calculateDynamicFilters(); // Cập nhật filter counts
    }
  }, [selectedFilters, jobsData, searchTerm, searchLocation]);
  // Hàm xử lý dữ liệu và tạo filters ban đầu
  const processFiltersData = (jobs) => {
    const jobTypeCounts = {};
    const locationCounts = {};
    const companyCounts = {};
    const categoryCounts = {};

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

      // Categories (Professions)
      if (job.category) {
        categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
      }
    });

    // Debug: Log unique values
    console.log("=== FILTER PROCESSING DEBUG ===");
    console.log("Unique job types:", Object.keys(jobTypeCounts));
    console.log("Unique locations:", Object.keys(locationCounts));
    console.log("Unique categories:", Object.keys(categoryCounts));
    console.log("Location counts:", locationCounts);
    console.log("Category counts:", categoryCounts);
    console.log("=== END FILTER DEBUG ===");

    // Sắp xếp theo số lượng giảm dần
    const sortedJobTypes = Object.entries(jobTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ name: type, count }));

    const sortedLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([location, count]) => ({ name: location, count }));

    const sortedCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([company, count]) => ({ name: company, count }));

    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({ name: category, count }));

    // Lưu tất cả filters
    setAllFilters({
      jobTypes: sortedJobTypes,
      locations: sortedLocations,
      companies: sortedCompanies,
      categories: sortedCategories,
    });

    // Hiển thị limited items ban đầu
    setFilters({
      jobTypes: sortedJobTypes.slice(0, 6),
      locations: sortedLocations.slice(0, 8),
      companies: sortedCompanies.slice(0, 10),
      categories: sortedCategories.slice(0, 8),
    });
  }; // Function để lấy popular companies toàn cầu (khi chọn All)
  const getGlobalPopularCompanies = () => {
    if (!jobsData.length) return [];

    // Đếm số lượng jobs cho tất cả companies
    const companyCounts = {};
    jobsData.forEach((job) => {
      if (job.company_name) {
        companyCounts[job.company_name] =
          (companyCounts[job.company_name] || 0) + 1;
      }
    });

    // Sắp xếp theo số lượng jobs giảm dần và return ALL (không limit)
    return Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));
  };

  // Function để lấy popular companies trong location cụ thể
  const getPopularCompaniesInLocation = (location) => {
    if (!location || !jobsData.length) return [];

    // Lọc jobs theo location
    const jobsInLocation = jobsData.filter(
      (job) => job.candidate_required_location === location
    );

    // Đếm số lượng jobs cho mỗi company trong location này
    const companyCounts = {};
    jobsInLocation.forEach((job) => {
      if (job.company_name) {
        companyCounts[job.company_name] =
          (companyCounts[job.company_name] || 0) + 1;
      }
    });

    // Sắp xếp theo số lượng jobs giảm dần và return ALL (không limit)
    return Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));
  }; // Function để handle salary range change
  const handleSalaryMinChange = (value) => {
    const [currentMin, currentMax] = selectedFilters.salaryRange;
    // Đảm bảo min không lớn hơn max
    const newMin = value || null;
    const newMax =
      newMin && currentMax && newMin > currentMax ? newMin : currentMax;

    setSelectedFilters((prev) => ({
      ...prev,
      salaryRange: [newMin, newMax],
    }));
    setCurrentPage(1);
  };
  const handleSalaryMaxChange = (value) => {
    const [currentMin, currentMax] = selectedFilters.salaryRange;
    // Đảm bảo max không nhỏ hơn min
    const newMax = value || null;
    const newMin =
      newMax && currentMin && newMax < currentMin ? newMax : currentMin;

    setSelectedFilters((prev) => ({
      ...prev,
      salaryRange: [newMin, newMax],
    }));
    setCurrentPage(1);
  };
  // Function để clear salary filter
  const clearSalaryFilter = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      salaryRange: [null, null],
    }));
    setCurrentPage(1);
  };

  // Function để sort jobs theo tiêu chí được chọn
  const sortJobs = (jobs) => {
    if (!jobs || jobs.length === 0) return [];

    const sortedJobs = [...jobs];

    switch (sortBy) {
      case "date":
        // Sort theo ngày post (mới nhất trước)
        return sortedJobs.sort((a, b) => {
          const dateA = new Date(a.publication_date || 0);
          const dateB = new Date(b.publication_date || 0);
          return dateB - dateA; // Descending order (newest first)
        });

      case "salary":
        // Sort theo salary (cao nhất trước)
        return sortedJobs.sort((a, b) => {
          // Parse salary từ string format
          const getSalaryValue = (job) => {
            if (job.salary && typeof job.salary === "string") {
              const salaryStr = job.salary.toLowerCase();

              // Handle "$60k-$130k" format
              if (salaryStr.includes("k")) {
                const kNumbers = salaryStr.match(/(\d+)k/g);
                if (kNumbers && kNumbers.length >= 1) {
                  return parseInt(kNumbers[0].replace("k", "")) * 1000;
                }
              }

              // Handle "$243,865 - $286,900" format
              const numbers = salaryStr.match(/\$?([\d,]+)/g);
              if (numbers && numbers.length >= 1) {
                return parseInt(numbers[0].replace(/[\$,]/g, ""));
              }
            }

            // Fallback to numeric fields
            return job.salary_min || job.salary_max || 0;
          };

          const salaryA = getSalaryValue(a);
          const salaryB = getSalaryValue(b);

          return salaryB - salaryA; // Descending order (highest first)
        });

      default:
        return sortedJobs;
    }
  };
  // Function để handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    console.log("Sort changed to:", event.target.value);
  };
  // Function để handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang 1 khi search

    // Generate suggestions
    if (value.length >= 2) {
      const suggestions = generateSearchSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions((prev) => ({
        ...prev,
        search: suggestions.length > 0,
      }));
    } else {
      setSearchSuggestions([]);
      setShowSuggestions((prev) => ({ ...prev, search: false }));
    }
  };

  // Function để handle location search change
  const handleLocationSearchChange = (event) => {
    const value = event.target.value;
    setSearchLocation(value);
    setCurrentPage(1); // Reset về trang 1 khi search

    // Generate location suggestions
    if (value.length >= 2) {
      const suggestions = generateLocationSuggestions(value);
      setLocationSuggestions(suggestions);
      setShowSuggestions((prev) => ({
        ...prev,
        location: suggestions.length > 0,
      }));
    } else {
      setLocationSuggestions([]);
      setShowSuggestions((prev) => ({ ...prev, location: false }));
    }
  };

  // Function để handle khi click vào suggestion
  const handleSuggestionClick = (suggestion, type) => {
    if (type === "search") {
      setSearchTerm(suggestion);
      setShowSuggestions((prev) => ({ ...prev, search: false }));
      setSearchSuggestions([]);
    } else if (type === "location") {
      setSearchLocation(suggestion);
      setShowSuggestions((prev) => ({ ...prev, location: false }));
      setLocationSuggestions([]);
    }
    setCurrentPage(1);
  };

  // Function để handle blur/focus
  const handleInputFocus = (type) => {
    if (type === "search" && searchSuggestions.length > 0) {
      setShowSuggestions((prev) => ({ ...prev, search: true }));
    } else if (type === "location" && locationSuggestions.length > 0) {
      setShowSuggestions((prev) => ({ ...prev, location: true }));
    }
  };

  const handleInputBlur = (type) => {
    // Delay để cho phép click vào suggestion
    setTimeout(() => {
      setShowSuggestions((prev) => ({ ...prev, [type]: false }));
    }, 200);
  };

  // Function để search jobs theo nhiều tiêu chí
  const searchJobs = (jobs, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      return jobs; // Không có search term thì return tất cả
    }

    const term = searchTerm.toLowerCase().trim();

    return jobs.filter((job) => {
      // 1. Tìm theo Job Title
      const matchesTitle = job.title && job.title.toLowerCase().includes(term);

      // 2. Tìm theo Keywords/Tags
      const matchesTags =
        job.tags && job.tags.some((tag) => tag.toLowerCase().includes(term));

      // 3. Tìm theo Company Name
      const matchesCompany =
        job.company_name && job.company_name.toLowerCase().includes(term);

      // 4. Tìm theo Job Description (nếu có)
      const matchesDescription =
        job.description && job.description.toLowerCase().includes(term);

      // 5. Tìm theo Job Category
      const matchesCategory =
        job.category && job.category.toLowerCase().includes(term);

      // Return true nếu match bất kỳ tiêu chí nào
      return (
        matchesTitle ||
        matchesTags ||
        matchesCompany ||
        matchesDescription ||
        matchesCategory
      );
    });
  };
  // Function để search theo location
  const searchByLocation = (jobs, locationTerm) => {
    if (!locationTerm || locationTerm.trim() === "") {
      return jobs;
    }

    const term = locationTerm.toLowerCase().trim();

    return jobs.filter((job) => {
      return (
        job.candidate_required_location &&
        job.candidate_required_location.toLowerCase().includes(term)
      );
    });
  };

  // Function để tạo search suggestions
  const generateSearchSuggestions = (term) => {
    if (!term || term.length < 2 || !jobsData.length) return [];

    const normalizedTerm = term.toLowerCase();
    const suggestions = new Set();

    jobsData.forEach((job) => {
      // Job titles (rút gọn)
      if (job.title && job.title.toLowerCase().includes(normalizedTerm)) {
        const words = job.title.split(" ").slice(0, 3).join(" "); // Max 3 từ
        if (words.length <= 30) suggestions.add(words);
      }

      // Company names (rút gọn)
      if (
        job.company_name &&
        job.company_name.toLowerCase().includes(normalizedTerm)
      ) {
        if (job.company_name.length <= 25) suggestions.add(job.company_name);
      }

      // Tags (individual tags)
      if (job.tags) {
        job.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(normalizedTerm) && tag.length <= 20) {
            suggestions.add(tag);
          }
        });
      }
    });

    return Array.from(suggestions).slice(0, 5); // Max 5 suggestions
  };

  // Function để tạo location suggestions
  const generateLocationSuggestions = (term) => {
    if (!term || term.length < 2 || !jobsData.length) return [];

    const normalizedTerm = term.toLowerCase();
    const suggestions = new Set();

    jobsData.forEach((job) => {
      if (
        job.candidate_required_location &&
        job.candidate_required_location.toLowerCase().includes(normalizedTerm)
      ) {
        // Rút gọn location (lấy từ đầu tiên hoặc 2 từ đầu)
        const location = job.candidate_required_location;
        const shortLocation = location.split(",")[0].trim(); // Lấy phần trước dấu phẩy
        if (shortLocation.length <= 25) {
          suggestions.add(shortLocation);
        }
      }
    });

    return Array.from(suggestions).slice(0, 5); // Max 5 suggestions
  };

  // Thêm hàm xử lý khi click vào job
  const handleJobClick = (job) => {
    // Chuyển hướng đến JobsPage với thông tin job được chọn
    router.push(
      `/jobs?jobId=${job.id}&location=${encodeURIComponent(
        job.candidate_required_location || "Remote"
      )}`
    );
  };

  return (
    <>
      <Header />
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
              {" "}
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="searchInput"
                  className={styles.searchInput}
                  placeholder=" "
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => handleInputFocus("search")}
                  onBlur={() => handleInputBlur("search")}
                />
                <label htmlFor="searchInput" className={styles.inputLabel}>
                  Search job title, keywords or company
                </label>
                <SearchOutlined className={styles.searchIcon} />

                {/* Search Suggestions */}
                {showSuggestions.search && searchSuggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={styles.suggestionItem}
                        onClick={() =>
                          handleSuggestionClick(suggestion, "search")
                        }
                      >
                        <SearchOutlined className={styles.suggestionIcon} />
                        <span className={styles.suggestionText}>
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="locationInput"
                  className={styles.locationInput}
                  placeholder=" "
                  value={searchLocation}
                  onChange={handleLocationSearchChange}
                  onFocus={() => handleInputFocus("location")}
                  onBlur={() => handleInputBlur("location")}
                />
                <label htmlFor="locationInput" className={styles.inputLabel}>
                  Location
                </label>

                {/* Location Suggestions */}
                {showSuggestions.location && locationSuggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {locationSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={styles.suggestionItem}
                        onClick={() =>
                          handleSuggestionClick(suggestion, "location")
                        }
                      >
                        <span className={styles.suggestionIcon}>📍</span>
                        <span className={styles.suggestionText}>
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                className={styles.searchButton}
                onClick={(e) => {
                  e.preventDefault();
                  applyFilters(); // Trigger search manually khi click button
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>{" "}
      </div>
      <div className={styles.sectionFind}>
        {" "}
        <div className={styles.totalJobs}>
          Tuyển dụng{" "}
          <span className={styles.jobCount}>
            {loading ? "..." : displayJobs.toLocaleString()}
          </span>{" "}
          việc làm <span className={styles.jobType}></span> [Update{" "}
          {getCurrentDate()}]
        </div>{" "}
        <div className={styles.contentWrapper}>
          <div className={styles.leftSide}>
            <div className={styles.filterSection}>
              <div className={styles.filterHeader}>
                <h3>Filters</h3>
                <button className={styles.clearAll} onClick={clearAllFilters}>
                  Clear All
                </button>
              </div>
              {/* Job Type Filter */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <h4>JOB TYPE</h4>
                  <button
                    className={styles.clearFilter}
                    onClick={() => clearFilterType("jobTypes")}
                  >
                    Clear
                  </button>
                </div>{" "}
                <div className={styles.filterOptions}>
                  <div
                    className={`${styles.filterOption} ${
                      selectedFilters.jobTypes.length === 0
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleFilterSelection("jobTypes", "All")}
                  >
                    <span className={styles.optionName}>All ({totalJobs})</span>
                  </div>
                  {filters.jobTypes.map((jobType, index) => (
                    <div
                      key={index}
                      className={`${styles.filterOption} ${
                        selectedFilters.jobTypes.includes(jobType.name)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        handleFilterSelection("jobTypes", jobType.name)
                      }
                    >
                      <span className={styles.optionName}>
                        {jobType.name} ({jobType.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>{" "}
              {/* Location Filter */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <h4>LOCATION</h4>
                  <button
                    className={styles.clearFilter}
                    onClick={() => clearFilterType("locations")}
                  >
                    Clear
                  </button>
                </div>{" "}
                <div className={styles.filterOptions}>
                  <div
                    className={`${styles.filterOption} ${
                      selectedFilters.locations.length === 0
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleFilterSelection("locations", "All")}
                  >
                    <span className={styles.optionName}>All ({totalJobs})</span>
                  </div>{" "}
                  {filters.locations.map((location, index) => (
                    <div
                      key={index}
                      className={`${styles.filterOption} ${
                        selectedFilters.locations.includes(location.name)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        handleFilterSelection("locations", location.name)
                      }
                    >
                      <span className={styles.optionName}>
                        {location.name} ({location.count})
                      </span>
                    </div>
                  ))}
                  <button
                    className={styles.showMore}
                    onClick={() => handleShowMore("locations")}
                  >
                    {showMore.locations ? "Less" : "More"}
                  </button>
                </div>
              </div>
              {/* Company Filter */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <h4>COMPANY</h4>
                  <button
                    className={styles.clearFilter}
                    onClick={() => clearFilterType("companies")}
                  >
                    Clear
                  </button>
                </div>{" "}
                <div className={styles.filterOptions}>
                  <div
                    className={`${styles.filterOption} ${
                      selectedFilters.companies.length === 0
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleFilterSelection("companies", "All")}
                  >
                    <span className={styles.optionName}>All ({totalJobs})</span>
                  </div>{" "}
                  {filters.companies.map((company, index) => (
                    <div
                      key={index}
                      className={`${styles.filterOption} ${
                        selectedFilters.companies.includes(company.name)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        handleFilterSelection("companies", company.name)
                      }
                    >
                      <span className={styles.optionName}>
                        {company.name} ({company.count})
                      </span>
                    </div>
                  ))}
                  <button
                    className={styles.showMore}
                    onClick={() => handleShowMore("companies")}
                  >
                    {showMore.companies ? "Less" : "More"}
                  </button>
                </div>
              </div>{" "}
              {/* Categories Filter */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <h4>PROFESSION</h4>
                  <button
                    className={styles.clearFilter}
                    onClick={() => clearFilterType("categories")}
                  >
                    Clear
                  </button>
                </div>
                <div className={styles.filterOptions}>
                  <div
                    className={`${styles.filterOption} ${
                      selectedFilters.categories.length === 0
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleFilterSelection("categories", "All")}
                  >
                    <span className={styles.optionName}>All ({totalJobs})</span>
                  </div>
                  {(filters.categories || []).map((category, index) => (
                    <div
                      key={index}
                      className={`${styles.filterOption} ${
                        selectedFilters.categories.includes(category.name)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        handleFilterSelection("categories", category.name)
                      }
                    >
                      <span className={styles.optionName}>
                        {category.name} ({category.count})
                      </span>
                    </div>
                  ))}
                  <button
                    className={styles.showMore}
                    onClick={() => handleShowMore("categories")}
                  >
                    {showMore.categories ? "Less" : "More"}
                  </button>
                </div>
              </div>
              {/* Salary Range Filter */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <h4>SALARY RANGE</h4>
                  <button
                    className={styles.clearFilter}
                    onClick={clearSalaryFilter}
                  >
                    Clear
                  </button>
                </div>{" "}
                <div className={styles.salaryInputs}>
                  <div className={styles.inputGroup}>
                    {" "}
                    <InputNumber
                      min={0}
                      max={selectedFilters.salaryRange[1] || 1000000}
                      value={selectedFilters.salaryRange[0]}
                      onChange={handleSalaryMinChange}
                      placeholder="Min"
                      formatter={(value) =>
                        value
                          ? `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : ""
                      }
                      parser={(value) =>
                        value.replace(/\$\s?/g, "").replace(/,/g, "")
                      }
                      className={styles.salaryInput}
                    />
                  </div>
                  <span className={styles.separator}>-</span>
                  <div className={styles.inputGroup}>
                    {" "}
                    <InputNumber
                      min={selectedFilters.salaryRange[0] || 0}
                      max={1000000}
                      value={selectedFilters.salaryRange[1]}
                      onChange={handleSalaryMaxChange}
                      placeholder="Max"
                      formatter={(value) =>
                        value
                          ? `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : ""
                      }
                      parser={(value) =>
                        value.replace(/\$\s?/g, "").replace(/,/g, "")
                      }
                      className={styles.salaryInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className={styles.center}>
            <div className={styles.jobsContainer}>
              {/* Search Results Header */}
              <div className={styles.resultsHeader}>
                <div className={styles.resultsInfo}>
                  <span className={styles.resultsCount}>
                    {filteredJobs.length} results found
                  </span>{" "}
                  <div className={styles.sortBy}>
                    <label>Sort By:</label>
                    <select
                      className={styles.sortSelect}
                      value={sortBy}
                      onChange={handleSortChange}
                    >
                      <option value="date">Date Posted</option>
                      <option value="salary">Salary</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Job Listings */}{" "}
              <div className={styles.jobsList}>
                {loading ? (
                  <div className={styles.loadingJobs}>
                    <p>Loading jobs...</p>
                  </div>
                ) : (
                  sortJobs(getCurrentPageJobs()).map((job, index) => (
                    <div
                      key={job.id || index}
                      className={styles.jobCard}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleJobClick(job)}
                    >
                      <div className={styles.jobHeader}>
                        <div className={styles.companyInfo}>
                          {" "}
                          <div className={styles.companyLogo}>
                            {getCompanyLogo(job) ? (
                              <img
                                src={getCompanyLogo(job)}
                                alt={job.company_name}
                                onError={(e) => {
                                  // Nếu logo chính lỗi, thử fallback logo
                                  const fallbackUrl = getCompanyLogoFallback(
                                    job.company_name
                                  );
                                  if (
                                    fallbackUrl &&
                                    e.target.src !== fallbackUrl
                                  ) {
                                    e.target.src = fallbackUrl;
                                  } else {
                                    // Nếu fallback cũng lỗi, ẩn img và hiện initial
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }
                                }}
                              />
                            ) : // Nếu không có logo gốc, thử fallback
                            getCompanyLogoFallback(job.company_name) ? (
                              <img
                                src={getCompanyLogoFallback(job.company_name)}
                                alt={job.company_name}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={styles.companyInitial}
                              style={{
                                display:
                                  getCompanyLogo(job) ||
                                  getCompanyLogoFallback(job.company_name)
                                    ? "none"
                                    : "flex",
                              }}
                            >
                              {job.company_name?.charAt(0) || "C"}
                            </div>
                          </div>
                          <div className={styles.jobDetails}>
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            <p className={styles.companyName}>
                              {job.company_name}
                            </p>
                          </div>
                        </div>
                        <button className={styles.saveJob}>Save Job</button>
                      </div>{" "}
                      <div className={styles.jobMeta}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Tags</span>
                          <span className={styles.metaValue}>
                            {formatExperience(job)}
                          </span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Job Type</span>
                          <span className={styles.metaValue}>
                            {formatJobType(job)}
                          </span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Salary</span>
                          <span className={styles.metaValue}>
                            {formatSalary(job)}
                          </span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Location</span>
                          <span className={styles.metaValue}>
                            {job.candidate_required_location || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div className={styles.jobFooter}>
                        <span className={styles.postDate}>
                          Posted {getTimeAgo(job.publication_date)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>{" "}
              {/* Pagination */}
              {!loading && filteredJobs.length > 0 && (
                /* wrapper để căn giữa */
                <div className={styles.paginationWrapper}>
                  <Pagination
                    /* gắn class custom lên chính component Pagination */
                    className={styles.customPagination}
                    current={currentPage}
                    total={filteredJobs.length}
                    pageSize={jobsPerPage}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showQuickJumper={false}
                    itemRender={(page, type, originalElement) => {
                      if (type === "prev") {
                        return <a>Previous</a>;
                      }
                      if (type === "next") {
                        return <a>Next</a>;
                      }
                      return originalElement;
                    }}
                  />
                </div>
              )}
            </div>
          </div>{" "}
          <div className={styles.rightSide}>
            {" "}
            {/* Subscription Widget - luôn hiển thị */}
            <div className={styles.subscriptionWidget}>
              <h3>
                {selectedFilters.locations.length > 0 ? (
                  <>
                    Be the first to see new jobs in{" "}
                    <span className={styles.locationHighlight}>
                      {selectedFilters.locations[0]}
                    </span>
                  </>
                ) : (
                  "Be the first to see new jobs"
                )}
              </h3>
              <div className={styles.emailInput}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.emailField}
                />
              </div>
              <button className={styles.subscribeBtn}>Subscribe Now</button>
              <p className={styles.notInterested}>
                Not interested. <span>Hide now</span>
              </p>
            </div>{" "}
            {/* Popular Companies */}
            <div className={styles.popularCompanies}>
              <h3>
                {selectedFilters.locations.length > 0 ? (
                  <>
                    Popular in{" "}
                    <span className={styles.locationHighlight}>
                      {selectedFilters.locations[0]}
                    </span>
                  </>
                ) : (
                  "Popular Companies"
                )}
              </h3>{" "}
              <div className={styles.companiesList}>
                {(() => {
                  const companies =
                    selectedFilters.locations.length > 0
                      ? getPopularCompaniesInLocation(
                          selectedFilters.locations[0]
                        )
                      : getGlobalPopularCompanies();

                  console.log("=== COMPANIES RENDER DEBUG ===");
                  console.log("Total companies available:", companies.length);
                  console.log("DisplayCount:", displayCount.popularCompanies);
                  console.log(
                    "Companies to show:",
                    companies.slice(0, displayCount.popularCompanies).length
                  );
                  console.log("ShowMore state:", showMore.popularCompanies);
                  console.log("=== END RENDER DEBUG ===");

                  return companies
                    .slice(0, displayCount.popularCompanies)
                    .map((company, index) => (
                      <div key={index} className={styles.companyItem}>
                        <div className={styles.companyLogo}>
                          {getCompanyLogoFromName(company.name) ? (
                            <img
                              src={getCompanyLogoFromName(company.name)}
                              alt={company.name}
                              onError={(e) => {
                                // Nếu logo thật lỗi, thử fallback logo
                                const fallbackUrl = getCompanyLogoFallback(
                                  company.name
                                );
                                if (
                                  fallbackUrl &&
                                  e.target.src !== fallbackUrl
                                ) {
                                  e.target.src = fallbackUrl;
                                } else {
                                  // Nếu fallback cũng lỗi, ẩn img và hiện initial
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }
                              }}
                            />
                          ) : // Nếu không có logo thật, thử fallback
                          getCompanyLogoFallback(company.name) ? (
                            <img
                              src={getCompanyLogoFallback(company.name)}
                              alt={company.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={styles.companyInitial}
                            style={{
                              display:
                                getCompanyLogoFromName(company.name) ||
                                getCompanyLogoFallback(company.name)
                                  ? "none"
                                  : "flex",
                            }}
                          >
                            {company.name.charAt(0)}
                          </div>
                        </div>
                        <div className={styles.companyInfo}>
                          <h4>{company.name}</h4>
                          <p>{company.count} Jobs</p>
                        </div>
                      </div>
                    ));
                })()}
              </div>
              <button
                className={styles.seeAllJobs}
                onClick={handleShowMorePopularCompanies}
              >
                {showMore.popularCompanies ? "Show less ‹" : "See more jobs ›"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ChatButton />
    </>
  );
}
export default FindJob;
