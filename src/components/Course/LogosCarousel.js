import React, { useRef } from 'react';
import styles from './LogosCarousel.module.css';

// Array logo paths; đặt trong public/assets/logos/
const logos = [
  '/assets/logos/google.png',
  '/assets/logos/uber.png',
  '/assets/logos/samsung.png',
  '/assets/logos/adidas.png',
  '/assets/logos/amazon.png',
];

export default function LogosCarousel() {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    const { current } = containerRef;
    if (current) {
      const scrollAmount = current.offsetWidth; // cuộn 1 lần width
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className={styles.logosSection}>
      <div className={styles.container}>
        <h3>Join the group of real specialists</h3>
        <div className={styles.carouselWrapper}>
          <button className={styles.arrowBtn} onClick={() => scroll('left')}>&larr;</button>
          <div className={styles.logosContainer} ref={containerRef}>
            {logos.map((src, idx) => (
              <div key={idx} className={styles.logoItem}>
                <img src={src} alt={`logo-${idx}`} />
              </div>
            ))}
          </div>
          <button className={styles.arrowBtn} onClick={() => scroll('right')}>&rarr;</button>
        </div>
      </div>
    </section>
  );
}
