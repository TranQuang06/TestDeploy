import React, { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NewsSection from "../../components/NewsSection/NewsSection";
import LatestNewsSection from "../../components/LatestNewsSection/LatestNewsSection";
import TeamSection from "../../components/TeamSection/TeamSection";
import TestimonialsSection from "../../components/TestimonialsSection/TestimonialsSection";
import PopularBlogsSection from "../../components/PopularBlogsSection/PopularBlogsSection";
import styles from "./Blog.module.css";

function Blog() {
  // Kiểm tra và xử lý scroll ngang khi component mount
  useEffect(() => {
    // Đảm bảo không có scroll ngang
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    // Kiểm tra nếu có phần tử nào gây scroll ngang
    const checkForHorizontalScroll = () => {
      const bodyWidth = document.body.offsetWidth;
      const windowWidth = window.innerWidth;
      
      if (bodyWidth > windowWidth) {
        console.warn('Phát hiện scroll ngang:', bodyWidth, '>', windowWidth);
      }
    };
    
    // Chạy kiểm tra sau khi trang đã load
    setTimeout(checkForHorizontalScroll, 1000);
    
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.section}>
        <div className={styles.container}>
          <NewsSection />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.container}>
          <LatestNewsSection />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.container}>
          <TeamSection />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.container}>
          <TestimonialsSection />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.container}>
          <PopularBlogsSection />
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
export default Blog;
