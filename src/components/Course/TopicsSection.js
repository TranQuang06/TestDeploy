import React, { useRef, useState, useEffect } from 'react';
import styles from './TopicsSection.module.css';

// Hàm chuyển level thành số dot
const getLevelDots = (level) => {
  if (!level) return [];
  const lvl = level.toLowerCase();
  let count = 0;
  if (lvl.includes('beginner')) count = 1;
  else if (lvl.includes('intermediate')) count = 2;
  else if (lvl.includes('advanced')) count = 3;
  else count = 0;
  return Array.from({ length: count });
};

export default function TopicsSection({ defaultQuery = 'python', pageSize = 10 }) {
  const containerRef = useRef(null);
  const [topicsData, setTopicsData] = useState([]);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState(defaultQuery); // giá trị search hiện tại
  const [inputValue, setInputValue] = useState(defaultQuery);

  // Đọc env Next.js client-side
  const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;
  const RAPIDAPI_KEY  = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

  useEffect(() => {
    const fetchTopics = async () => {
      if (!RAPIDAPI_HOST || !RAPIDAPI_KEY) {
        console.warn('Missing RapidAPI host or key');
        setError('Missing API configuration');
        setTopicsData([]);
        setRawData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        let url = '';
        let isSearch = false;
        if (query && query.trim() !== '') {
          // Search endpoint
          isSearch = true;
          // Đảm bảo path đúng theo RapidAPI
          url = `https://${RAPIDAPI_HOST}/rapidapi/courses/search?page=${page}&page_size=${pageSize}&query=${encodeURIComponent(query)}`;
        } else {
          // List Available courses endpoint (không query)
          url = `https://${RAPIDAPI_HOST}/rapidapi/courses?page=${page}&page_size=${pageSize}`;
        }
        console.log('Fetching URL:', url);
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': RAPIDAPI_HOST,
            'x-rapidapi-key': RAPIDAPI_KEY,
          },
        });
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Raw data:', data);
        setRawData(data);
        // Theo rawData: data.courses là array
        const results = Array.isArray(data.courses) ? data.courses : [];
        console.log('Extracted courses length:', results.length);
        // Map thành topicsData
        const mapped = results.map((item) => ({
          img: item.image || item.image_480x270 || item.thumbnail || '',
          title: item.title || item.name || 'No title',
          level: item.instructional_level || item.level || '',
          description: item.headline || item.description || '',
          price: item.price ? `${item.price}` : null,
          url: item.url || item.course_url || item.link || '#',
        }));
        console.log('Mapped topicsData:', mapped);
        setTopicsData(mapped);
      } catch (err) {
        console.error('Fetch topics error:', err);
        setError('Failed to load topics');
        setTopicsData([]);
        setRawData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [query, page, pageSize, RAPIDAPI_HOST, RAPIDAPI_KEY]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Khi user submit, cập nhật query => useEffect gọi lại
    setPage(1);
    setQuery(inputValue.trim());
  };

  const scrollLeft = () => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
  };
  const scrollRight = () => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className={styles.topicsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Choose a topic that interests you</h2>
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: '16px', textAlign: 'center' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter keyword to search..."
            style={{
              padding: '8px 12px',
              width: '200px',
              borderRadius: '4px 0 0 4px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderLeft: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        {loading && <p className={styles.statusMessage}>Loading...</p>}
        {error && <p className={styles.statusMessageError}>{error}</p>}

        {!loading && !error && topicsData.length === 0 && (
          <p className={styles.statusMessage}>No topics found.</p>
        )}

        {/* Debug rawData nếu cần */}
        {!loading && rawData && (
          <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', maxHeight: '200px', overflow: 'auto' }}>
            <strong>DEBUG rawData:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        )}

        {!loading && !error && topicsData.length > 0 && (
          <div className={styles.carouselWrapper}>
            <button className={styles.arrowBtn} onClick={scrollLeft} aria-label="Scroll Left">
              &#8592;
            </button>
            <div className={styles.cardsContainer} ref={containerRef}>
              {topicsData.map((item, idx) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {item.img ? (
                      <img src={item.img} alt={item.title} className={styles.cardImage} />
                    ) : (
                      <div className={styles.imagePlaceholder}>No Image</div>
                    )}
                    {item.price && <span className={styles.priceBadge}>{item.price}</span>}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
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
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.learnMore}>
                        Learn more <span className={styles.arrowIcon}>&rarr;</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.arrowBtn} onClick={scrollRight} aria-label="Scroll Right">
              &#8594;
            </button>
          </div>
        )}

        {/* Pagination đơn giản: nếu muốn */}
        {!loading && topicsData.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            {page > 1 && (
              <button onClick={() => setPage((p) => p - 1)} style={{ marginRight: '8px' }}>
                Previous
              </button>
            )}
            <span>Page {page}</span>
            {topicsData.length === pageSize && ( // nếu đủ pageSize có thể có trang sau
              <button onClick={() => setPage((p) => p + 1)} style={{ marginLeft: '8px' }}>
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
