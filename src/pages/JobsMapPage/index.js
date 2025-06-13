// pages/JobsMapPage/index.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import JobListSidebar from "../../components/JobListSidebar/JobListSidebar";
import JobMap from "../../components/JobMap/JobMap";
import styles from "./JobsMapPage.module.css";

export default function JobsMapPage() {
  const router = useRouter();
  const {
    what: initialWhat,
    where: initialWhere,
    country: initialCountry,
  } = router.query;

  const [jobData, setJobData] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [country, setCountry] = useState("pl"); // mặc định Poland

  // Cập nhật state từ query params khi router sẵn sàng
  useEffect(() => {
    if (!router.isReady) return;

    if (initialWhat) setWhat(initialWhat);
    if (initialWhere) setWhere(initialWhere);
    if (initialCountry) setCountry(initialCountry);

    // Fetch jobs khi có query params
    if (initialWhat || initialWhere || initialCountry) {
      fetchJobs();
    }
  }, [router.isReady, initialWhat, initialWhere, initialCountry]);

  // Hàm fetch từ API route /api/adzuna
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (what) params.append("what", what);
      if (where) params.append("where", where);
      if (country) params.append("country", country);
      const res = await fetch(`/api/adzuna?${params.toString()}`);
      const json = await res.json();
      if (res.ok) {
        // Lọc chỉ job có lat & lng
        const jobs = (json.jobs || []).filter(
          (j) => j.lat != null && j.lng != null
        );
        setJobData(jobs);
        setSelectedJobId(null);

        // Cập nhật URL với các tham số tìm kiếm
        updateUrlParams();
      } else {
        setError(json.error || "Fetch failed");
      }
    } catch (e) {
      console.error(e);
      setError("Fetch error");
    }
    setLoading(false);
  };

  // Cập nhật URL params mà không reload trang
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (what) params.append("what", what);
    if (where) params.append("where", where);
    if (country) params.append("country", country);

    const queryString = params.toString();
    const url = `/JobsMapPage${queryString ? `?${queryString}` : ""}`;

    router.replace(url, undefined, { shallow: true });
  };

  // Fetch khi mount lần đầu nếu không có query params
  useEffect(() => {
    if (router.isReady && !initialWhat && !initialWhere && !initialCountry) {
      fetchJobs();
    }
  }, [router.isReady]);

  const handleSelectJob = (job) => {
    setSelectedJobId(job.id);

    // Cập nhật URL với jobId được chọn
    const params = new URLSearchParams();
    if (what) params.append("what", what);
    if (where) params.append("where", where);
    if (country) params.append("country", country);
    params.append("jobId", job.id);

    const queryString = params.toString();
    router.replace(`/JobsMapPage?${queryString}`, undefined, { shallow: true });
  };

  const handleBookmarkToggle = (jobId) => {
    setJobData((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, bookmarked: !j.bookmarked } : j
      )
    );
    if (selectedJobId === jobId) setSelectedJobId(jobId);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        {/* Sidebar trái */}
        <section className={styles.leftPane}>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search job title or keyword"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              className={styles.searchInput}
            />
            <input
              type="text"
              placeholder="City"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={styles.searchSelect}
            >
              <option value="pl">Poland</option>
              <option value="gb">United Kingdom</option>
              <option value="us">United States</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
              <option value="it">Italy</option>
              <option value="es">Spain</option>
              <option value="nl">Netherlands</option>
              <option value="at">Austria</option>
              <option value="be">Belgium</option>
              <option value="ch">Switzerland</option>
              <option value="se">Sweden</option>
              <option value="dk">Denmark</option>
            </select>
            <button type="submit" className={styles.searchBtn}>
              Search
            </button>
          </form>

          {loading && <p className={styles.statusMessage}>Loading...</p>}
          {error && <p className={styles.statusMessageError}>{error}</p>}
          {!loading && !error && (
            <JobListSidebar
              jobData={jobData}
              totalCount={jobData.length}
              selectedJobId={selectedJobId}
              onSelectJob={handleSelectJob}
              onBookmarkToggle={handleBookmarkToggle}
            />
          )}
        </section>

        {/* Map phải */}
        <section className={styles.rightPane}>
          {!loading && !error && (
            <JobMap
              jobData={jobData}
              selectedJobId={selectedJobId}
              onSelectJob={(job) => handleSelectJob(job)}
            />
          )}
          {loading && <div className={styles.mapOverlay}>Loading map...</div>}
          {error && (
            <div className={styles.mapOverlayError}>Error loading data</div>
          )}
        </section>
      </main>
    </div>
  );
}
