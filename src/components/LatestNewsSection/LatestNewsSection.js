// src/components/LatestNewsSection/LatestNewsSection.jsx
import React, { useState, useEffect } from "react";
import styles from "./LatestNewsSection.module.css";

export default function LatestNewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <section className={styles.section}>
      <h2 className={styles.heading}>Latest News</h2>

      <div className={styles.content}>
        {/* Left: danh sách tin mới */}
        <div className={styles.newsList}>
          {latest.map((item) => (
            <div key={item.url} className={styles.newsCard}>
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
              <li key={item.url} className={styles.trendItem}>
                <span className={styles.bullet} />
                <div>
                  <p className={styles.trendTitle}>{item.title}</p>
                  <p className={styles.trendMeta}>
                    {new Date(item.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    • {item.author || item.source?.name || "Unknown"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
