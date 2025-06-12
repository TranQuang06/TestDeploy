import React from 'react';
import styles from './LogosCarousel.module.css';

const logos = [
  '/assets/logos/google.png',
  '/assets/logos/uber.png',
  '/assets/logos/samsung.png',
  '/assets/logos/adidas.png',
  '/assets/logos/amazon.png',
];

export default function LogosCarousel() {
  return (
    <section className={styles.logosSection}>
      <div className={styles.container}>
        <h3 className={styles.heading}>Join the group of real specialists</h3>
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
