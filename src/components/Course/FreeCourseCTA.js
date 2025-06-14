import React from 'react';
import styles from './FreeCourseCTA.module.css';

export default function FreeCourseCTA() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.textWrapper}>
          <h2>Vẫn còn băn khoăn?</h2>
          <p>Hãy nhận ngay một khóa học miễn phí để trải nghiệm nền tảng học tập hòa nhập của chúng tôi!</p>
          <div className={styles.actionRow}>
            <button className={styles.ctaButton}>Nhận quyền truy cập miễn phí</button>
    
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img src="/assets/img/Course/Free.png" alt="Free course preview" />
        </div>
      </div>
    </section>
  );
}
