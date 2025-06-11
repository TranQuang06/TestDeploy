// src/components/PopularBlogsSection/PopularBlogsSection.jsx
import React, { useState, useEffect } from "react";
import styles from "./PopularBlogsSection.module.css";

export default function PopularBlogsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <section className={styles.section}>
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
