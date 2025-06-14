import React from 'react';
import styles from './LogosCarousel.module.css';

const logos = [
  '/assets/img/Course/Group1.png',
  '/assets/img/Course/Group2.png',
  '/assets/img/Course/Group3.png',
  '/assets/img/Course/Group4.png',
];

export default function LogosCarousel() {
  return (
    <section className={styles.logosSection}>
      <div className={styles.container}>
        <h3 className={styles.heading}>Tham gia nhóm các chuyên gia thực thụ
</h3>
        <div className={styles.logosRow}>
          {logos.map((src, idx) => (
            <div key={idx} className={styles.logoItem}>
              <img src={src} alt={`logo-${idx}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
