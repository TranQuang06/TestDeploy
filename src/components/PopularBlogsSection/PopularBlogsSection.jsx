// src/components/PopularBlogsSection/PopularBlogsSection.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./PopularBlogsSection.module.css";
import { gsap } from 'gsap';

export default function PopularBlogsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    fetch("/api/popular-blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then((data) => {
        if (data.articles) {
          setArticles(data.articles);
        } else {
          setError("Không có dữ liệu bài viết.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Không tải được bài viết.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Add null check before accessing DOM elements
    if (!sectionRef.current) return;
    
    // Wait for next frame to ensure DOM is ready
    setTimeout(() => {
      const cards = sectionRef.current?.querySelectorAll(`.${styles.card}`);
      
      // Check if cards exist and have length
      if (cards && cards.length > 0) {
        // Set initial state (invisible)
        gsap.set(cards, { opacity: 0, y: 30 });
        
        gsap.to(
          cards,
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.1, 
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",     // Start when 75% of section is in view
              end: "top 30%",       // End when 30% of section is in view
              toggleActions: "play none none reverse", // Play on enter, reverse on leave
              markers: false        // Set to true for debugging
            }
          }
        );
      }
    }, 0);
  }, [articles]); // Add articles as dependency to run after data is loaded

  if (loading) {
    return <p className={styles.loading}>Đang tải bài viết phổ biến…</p>;
  }
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }
  if (!articles.length) {
    return <p className={styles.empty}>Chưa có bài viết nào.</p>;
  }

  // Hàm ước tính readTime: giả sử đọc ~200 từ/phút
  const estimateReadTime = (text) => {
    if (!text) return "";
    const words = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <section className={styles.section} ref={sectionRef}>
      <h2 className={styles.heading}>Popular Blogs</h2>
      <div className={styles.grid}>
        {articles.map((item, idx) => {
          // GNews fields: item.title, item.description, item.content, item.url, item.image, item.publishedAt, item.source.name
          const title = item.title;
          const imageUrl = item.image || "/images/placeholder.png";
          const publishedAt = item.publishedAt;
          const dateStr = publishedAt
            ? new Date(publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "";
          // Ước tính readTime dựa description hoặc content
          const textForEstimate = item.content || item.description || "";
          const readTime = estimateReadTime(textForEstimate);

          return (
            <article key={item.url || idx} className={styles.card}>
              {/* Ảnh thumbnail */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.imageWrapper}
              >
                <img src={imageUrl} alt={title} className={styles.thumbnail} />
              </a>

              {/* Phần thông tin */}
              <div className={styles.info}>
                <h3 className={styles.title}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.titleLink}
                  >
                    {title}
                  </a>
                </h3>

                <div className={styles.metaRow}>
                  <time className={styles.date}>{dateStr}</time>
                  {readTime && (
                    <span className={styles.readTime}>{readTime}</span>
                  )}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.readMore}
                >
                  Read more
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
