import React from 'react';
import styles from './WhySection.module.css';
import { ToolOutlined, KeyOutlined, BookOutlined, ShareAltOutlined, ArrowRightOutlined } from '@ant-design/icons';

export default function WhySection() {
  return (
    <section className={styles.whySection}>
      <div className={styles.container}>
        {/* Left Card */}
        <div className={styles.leftCard}>
          <h2>Why we are different</h2>
          <p>
            A place where failures, successes and experiences are transformed into specific guidelines, turning theory into practice.
          </p>
          <a href="#learn-more" className={styles.learnMore}>
            Learn more <ArrowRightOutlined className={styles.learnMoreArrow} />
          </a>
        </div>

        {/* Features List (2 columns x 2 rows) */}
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <div className={styles.iconWrap}><ToolOutlined /></div>
            <div>
              <h3>Specific tools</h3>
              <p>Act quickly and effectively thanks to ready-made tools</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrap}><KeyOutlined /></div>
            <div>
              <h3>Implementation examples</h3>
              <p>Real examples will accelerate successful implementation</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrap}><BookOutlined /></div>
            <div>
              <h3>Practical knowledge</h3>
              <p>Applying knowledge in practice will translate into real benefits</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrap}><ShareAltOutlined /></div>
            <div>
              <h3>Exchange of experiences</h3>
              <p>Join the real specialists community</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
