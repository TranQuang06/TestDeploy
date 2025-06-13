import React, { useEffect, useRef } from "react";
import { gsap } from "gsap"; // Add GSAP import
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Add ScrollTrigger
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NewsSection from "../../components/NewsSection/NewsSection";
import LatestNewsSection from "../../components/LatestNewsSection/LatestNewsSection";
import TeamSection from "../../components/TeamSection/TeamSection";
import TestimonialsSection from "../../components/TestimonialsSection/TestimonialsSection";
import PopularBlogsSection from "../../components/PopularBlogsSection/PopularBlogsSection";
import styles from "./Blog.module.css";

function Blog() {
  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Prevent horizontal scroll
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      // References to section containers
      const sections = document.querySelectorAll(`.${styles.section}`);
      
      // Check if sections exist before animating
      if (sections && sections.length > 0) {
        // Create animations for each section
        sections.forEach((section, index) => {
          // Set initial state (invisible)
          gsap.set(section, { opacity: 0, y: 50 });
          
          gsap.to(
            section,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%", // Only start when section is 85% into viewport
                end: "top 40%",   // End animation when section is 40% into viewport
                toggleActions: "play none none reverse", // Play on enter, reverse on leave
                markers: false,   // Set to true for debugging
                once: false       // Allow animation to replay if scrolling back up
              }
            }
          );
        });
      }
    }, 100); // Small delay to ensure DOM is ready
    
    return () => {
      // Cleanup ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={`${styles.section} ${styles.fadeIn}`}>
        <div className={styles.container}>
          <NewsSection />
        </div>
      </div>

      <div className={`${styles.section} ${styles.fadeIn}`}>
        <div className={styles.container}>
          <LatestNewsSection />
        </div>
      </div>

      <div className={`${styles.section} ${styles.fadeIn}`}>
        <div className={styles.container}>
          <TeamSection />
        </div>
      </div>

      <div className={`${styles.section} ${styles.fadeIn}`}>
        <div className={styles.container}>
          <TestimonialsSection />
        </div>
      </div>

      <div className={`${styles.section} ${styles.fadeIn}`}>
        <div className={styles.container}>
          <PopularBlogsSection />
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default Blog;
