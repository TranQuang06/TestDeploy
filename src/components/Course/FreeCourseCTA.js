import React from 'react';
import styles from './FreeCourseCTA.module.css';

export default function FreeCourseCTA() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.textWrapper}>
          <h2>Still undecided?</h2>
          <p>Get access to a free course on our platform</p>
          <button className={styles.ctaButton}>Get access</button>
          <a href="#download" className={styles.downloadLink}>Download site map &rarr;</a>
        </div>
        <div className={styles.imageWrapper}>
          <img src="/assets/images/free-course.jpg" alt="Free course preview" />
        </div>
      </div>
    </section>
  );
}
