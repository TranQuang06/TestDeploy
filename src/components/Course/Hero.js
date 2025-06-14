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
        Hơn 20 khóa học dành riêng cho nhân viên khuyết tật
        </h1>

        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Bạn cần gì?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Tìm kiếm"
            />
            <button type="submit" className={styles.searchButton}>
              Tìm kiếm
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
              <h3 className={styles.featureTitle}>Truy cập trọn đời</h3>
              <p className={styles.featureDesc}>Học mọi lúc, mọi nơi bạn muốn, với sự hỗ trợ đầy đủ về công nghệ tiếp cận.</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className={styles.featureItem}>
            <div className={styles.iconCircle}>
              <SyncOutlined className={styles.featureIcon} />
            </div>
            <div className={styles.featureText}>
              <h3 className={styles.featureTitle}>Cập nhật thường xuyên & đa dạng</h3>
              <p className={styles.featureDesc}> Tài liệu, ví dụ thực tế và dự án mẫu được tinh chỉnh để phù hợp với nhiều phương pháp học.</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className={styles.featureItem}>
            <div className={styles.iconCircle}>
              <SafetyCertificateOutlined className={styles.featureIcon} />
            </div>
            <div className={styles.featureText}>
              <h3 className={styles.featureTitle}>Chứng chỉ được công nhận</h3>
              <p className={styles.featureDesc}>Nâng cao hồ sơ nghề nghiệp và tăng cường cơ hội việc làm thông qua chứng nhận uy tín.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
