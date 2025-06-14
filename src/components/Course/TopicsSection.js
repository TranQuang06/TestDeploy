import React, { useRef, useState, useEffect } from "react";
import styles from "./TopicsSection.module.css";
import { Input } from "antd";
import { Button } from "antd";

// Hàm chuyển level thành số dot
const getLevelDots = (level) => {
  if (!level) return [];
  const lvl = level.toLowerCase();
  let count = 0;
  if (lvl.includes("beginner")) count = 1;
  else if (lvl.includes("intermediate")) count = 2;
  else if (lvl.includes("advanced")) count = 3;
  else count = 0;
  return Array.from({ length: count });
};

export default function TopicsSection({
  defaultQuery = "python",
  pageSize = 10,
}) {
  const containerRef = useRef(null);
  const [topicsData, setTopicsData] = useState([]);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState(defaultQuery); // giá trị search hiện tại
  const [inputValue, setInputValue] = useState(defaultQuery);


  const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;
  const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

  useEffect(() => {
    setLoading(true);
    setError(null);
  
    if (!RAPIDAPI_KEY) {
      setError("Missing RapidAPI key.");
      setTopicsData([]);
      setLoading(false);
      return;
    }
  
    fetch(`https://udemy13.p.rapidapi.com/course/search/?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.courses || data.courses.length === 0) {
          setError("No topics found.");
          setTopicsData([]);
          setRawData(null);
          setLoading(false);
          return;
        }
  
        const mapped = data.courses.slice((page - 1) * pageSize, page * pageSize).map((item) => ({
          img: item.image_480x270,
          title: item.title,
          level: item.instructional_level || "Intermediate",
          description: item.headline,
          price: item.price,
          url: item.url,
        }));
  
        setTopicsData(mapped);
        setRawData(data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load topics.");
        setTopicsData([]);
        setRawData(null);
      })
      .finally(() => setLoading(false));
  }, [query, page, pageSize]);
  
  

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Khi user submit, cập nhật query => useEffect gọi lại
    setPage(1);
    setQuery(inputValue.trim());
  };

  const scrollLeft = () => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };
  const scrollRight = () => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className={styles.topicsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          Chọn một chủ đề bạn quan tâm
        </h2>
        {/* Search input */}
        <form
          onSubmit={handleSearchSubmit}
          style={{ marginBottom: "16px", textAlign: "center" }}
        >
          <Input.Search
            placeholder="Enter keyword to search..."
            enterButton="Search"
            size="large"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSearch={(value) => {
              setPage(1);
              setQuery(value.trim());
            }}
            style={{ maxWidth: 370, margin: "0 auto 16px", display: "block" }}
          />
        </form>

        {loading && <p className={styles.statusMessage}>Loading...</p>}
        {error && <p className={styles.statusMessageError}>{error}</p>}

        {!loading && !error && topicsData.length === 0 && (
          <p className={styles.statusMessage}>No topics found.</p>
        )}

        {!loading && !error && topicsData.length > 0 && (
          <div className={styles.carouselWrapper}>
            <button
              className={styles.arrowBtn}
              onClick={scrollLeft}
              aria-label="Scroll Left"
            >
              &#8592;
            </button>
            <div className={styles.cardsContainer} ref={containerRef}>
              {topicsData.map((item, idx) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        className={styles.cardImage}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>No Image</div>
                    )}
                    {item.price && (
                      <span className={styles.priceBadge}>{item.price}</span>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.cardLink}
                        >
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <div className={styles.levelWrapper}>
                      {getLevelDots(item.level).map((_, i) => (
                        <span key={i} className={styles.dot} />
                      ))}
                      <span className={styles.levelText}>{item.level}</span>
                    </div>
                    <p className={styles.cardDesc}>{item.description}</p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.learnMore}
                      >
                        Learn more{" "}
                        <span className={styles.arrowIcon}>&rarr;</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              className={styles.arrowBtn}
              onClick={scrollRight}
              aria-label="Scroll Right"
            >
              &#8594;
            </button>
          </div>
        )}

        {/* Pagination đơn giản: nếu muốn */}
        {!loading && topicsData.length > 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            {page > 1 && (
              <Button
                size="large"
                onClick={() => setPage((p) => p - 1)}
                style={{ minWidth: 90 }}
              >
                Previous
              </Button>
            )}
            <span style={{ fontSize: 18, fontWeight: 500 }}>Page {page}</span>
            {topicsData.length === pageSize && (
              <Button
                type="primary"
                size="large"
                onClick={() => setPage((p) => p + 1)}
                style={{ minWidth: 90 }}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
