// src/components/NewsSection/NewsSection.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./NewsSection.module.css";
import { gsap } from 'gsap';

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        
        // Kiểm tra cấu trúc dữ liệu từ API
        console.log("API response:", data);
        
        // Xác định mảng articles từ response
        let newsArticles = [];
        if (data.articles && Array.isArray(data.articles)) {
          // GNews API format
          newsArticles = data.articles;
        } else if (Array.isArray(data)) {
          // Mảng trực tiếp
          newsArticles = data;
        } else if (data.data && Array.isArray(data.data)) {
          // Format khác
          newsArticles = data.data;
        }
        
        // Đảm bảo có ít nhất 3 bài viết
        if (newsArticles.length > 0) {
          setArticles(newsArticles.slice(0, 3));
        } else {
          console.error("Không có bài viết nào từ API");
        }
      } catch (err) {
        console.error("Lỗi khi fetch API:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  useEffect(() => {
    // Only run animation when data is loaded and component is mounted
    if (loading || !sectionRef.current) return;
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const newsItems = sectionRef.current?.querySelectorAll(`.${styles.newsItem}`);
      
      // Check if elements exist before animating
      if (newsItems && newsItems.length > 0) {
        // Set initial state (invisible)
        gsap.set(newsItems, { opacity: 0, y: 20 });
        
        gsap.to(
          newsItems,
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.15, 
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",     // Start when 80% of section is in view
              end: "top 40%",       // End when 40% of section is in view
              toggleActions: "play none none reverse", // Play on enter, reverse on leave
              markers: false        // Set to true for debugging
            }
          }
        );
      }
    }, 0);
  }, [loading, articles]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <h1 className={styles.title}>NEWS 24</h1>

      {loading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : articles.length > 0 ? (
        <div className={styles.grid}>
          {/* Ô lớn bên trái */}
          {articles[0] && (
            <a 
              href={articles[0].url || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              <div className={`${styles.mainCard} ${styles.fadeIn} ${styles.newsItem}`}>
                {articles[0].image || articles[0].imageUrl ? (
                  <img 
                    src={articles[0].image || articles[0].imageUrl} 
                    alt={articles[0].title}
                    className={styles.cardImage}
                  />
                ) : null}
                <div className={styles.cardContent}>
                  <span
                    className={`${styles.tag} ${
                      articles[0].category ? styles[articles[0].category.toLowerCase()] || styles.economy : styles.economy
                    }`}
                  >
                    {articles[0].category || 'ECONOMY'}
                  </span>
                  <h3 className={styles.mainCardTitle}>{articles[0].title}</h3>
                  <p className={styles.mainCardDesc}>
                    {articles[0].description ? articles[0].description.substring(0, 100) + '...' : ''}
                  </p>
                </div>
              </div>
            </a>
          )}

          {/* Hai ô nhỏ bên phải - stack dọc */}
          <div className={styles.sideContainer}>
            {articles.slice(1, 3).map((article, index) => (
              <a
                key={index}
                href={article.url || "#"}
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.cardLink}
              >
                <div className={`${styles.sideCard} ${styles.fadeIn} ${styles.newsItem}`}>
                  {article.image || article.imageUrl ? (
                    <img 
                      src={article.image || article.imageUrl} 
                      alt={article.title}
                      className={styles.cardImage}
                    />
                  ) : null}
                  <div className={styles.cardContent}>
                    <span
                      className={`${styles.tag} ${
                        index === 0 ? styles.style : styles.art
                      }`}
                    >
                      {index === 0 ? 'STYLE' : 'ART'}
                    </span>
                    <h4 className={styles.sideCardTitle}>{article.title}</h4>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.error}>Không có tin tức nào</div>
      )}
    </section>
  );
}
