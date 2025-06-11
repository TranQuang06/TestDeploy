import React, { useState } from 'react';
import styles from './Hero.module.css';
import { ClockCircleOutlined, SyncOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const Hero = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      console.log('Search for:', query);
    }
  };

  return (
    <section className={styles.heroSection}>
      {/* Optional overlay nếu muốn làm tối nhẹ gradient */}
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          Over <span className={styles.highlight}>20 courses</span> dedicated to employees of <span className={styles.highlight}>lean organizations</span>
        </h1>

        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="What do you need?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search courses"
            />
            <button type="submit" className={styles.searchButton}>
              Search course
            </button>
          </div>
        </form>

        <div className={styles.features}>
          {/* Feature 1 */}
          <div className={styles.featureItem}>
            <div className={styles.iconCircle}>
              <ClockCircleOutlined className={styles.featureIcon} />
            </div>
            <div className={styles.featureText}>
              <h3 className={styles.featureTitle}>Lifetime access</h3>
              <p className={styles.featureDesc}>Use whenever and wherever you want</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className={styles.featureItem}>
            <div className={styles.iconCircle}>
              <SyncOutlined className={styles.featureIcon} />
            </div>
            <div className={styles.featureText}>
              <h3 className={styles.featureTitle}>Regular updates</h3>
              <p className={styles.featureDesc}>Files, examples, case studies from real projects</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className={styles.featureItem}>
            <div className={styles.iconCircle}>
              <SafetyCertificateOutlined className={styles.featureIcon} />
            </div>
            <div className={styles.featureText}>
              <h3 className={styles.featureTitle}>Certificates</h3>
              <p className={styles.featureDesc}>Accelerate recruitment thanks to a rich CV</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
