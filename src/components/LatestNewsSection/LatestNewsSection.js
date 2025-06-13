// src/components/LatestNewsSection/LatestNewsSection.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./LatestNewsSection.module.css";
import { gsap } from 'gsap';

export default function LatestNewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data) => setArticles(data.articles || []))
      .catch((err) => {
        console.error(err);
        setError("Không tải được tin tức.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Add animation effect
    if (loading || error || !sectionRef.current) return;
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Safely access DOM elements with optional chaining
      const latestItems = sectionRef.current?.querySelectorAll(`.${styles.latestItem}`);
      const trendingItems = sectionRef.current?.querySelectorAll(`.${styles.trendingItem}`);
      
      // Check if elements exist before animating
      if (latestItems && latestItems.length > 0) {
        // Set initial state (invisible)
        gsap.set(latestItems, { opacity: 0, x: -30 });
        
        gsap.to(
          latestItems,
          { 
            opacity: 1, 
            x: 0, 
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
      
      if (trendingItems && trendingItems.length > 0) {
        // Set initial state (invisible)
        gsap.set(trendingItems, { opacity: 0, x: 30 });
        
        gsap.to(
          trendingItems,
          { 
            opacity: 1, 
            x: 0, 
            stagger: 0.1, 
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",     // Start when 75% of section is in view
              end: "top 35%",       // End when 35% of section is in view
              toggleActions: "play none none reverse", // Play on enter, reverse on leave
              markers: false        // Set to true for debugging
            }
          }
        );
      }
    }, 0);
  }, [loading, error, articles]); // Add articles as dependency

  if (loading) {
    return <p className={styles.loading}>Đang tải tin tức…</p>;
  }
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  // Lấy 4 bài mới nhất & 5 bài kế tiếp làm Trending
  const latest = articles.slice(0, 4);
  const trending = articles.slice(4, 9);

  return (
    <section className={styles.section} ref={sectionRef}>
      <h2 className={styles.heading}>Latest News</h2>

      <div className={styles.content}>
        {/* Left: danh sách tin mới */}
        <div className={styles.newsList}>
          {latest.map((item) => (
            <div key={item.url} className={`${styles.newsCard} ${styles.latestItem}`}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.thumbnail}
                />
              )}
              <div className={styles.newsInfo}>
                <h3 className={styles.newsTitle}>{item.title}</h3>
                <p className={styles.newsDesc}>{item.description ?? ""}…</p>
                <div className={styles.newsMeta}>
                  <span className={styles.category}>
                    {item.source?.name || "Unknown"}
                  </span>
                  <span className={styles.date}>
                    {new Date(item.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button className={styles.viewAll}>View All</button>
        </div>

        {/* Right: Trending News */}
         <aside className={styles.trending}>
          <h3 className={styles.trendHeading}>Trending News</h3>
          <ul className={styles.trendList}>
            {trending.map((item) => (
              <li key={item.url} className={`${styles.trendItem} ${styles.trendingItem}`}>
                <span className={styles.bullet} />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trendLink}
                >
                  <p className={styles.trendTitle}>{item.title}</p>
                  <p className={styles.trendMeta}>
                    {new Date(item.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    • {item.author || item.source?.name || "Unknown"}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
