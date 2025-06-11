import React, { useState, useEffect, useRef } from 'react';
import styles from './ImpressiveNumbersSection.module.css';

// Inline count-up logic triggered by scroll into view
function useCountUp(end, duration = 1500, start = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }
    let frameId;
    const startTime = performance.now();
    const animate = now => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(end * progress));
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration, start]);
  return value;
}

const STATS = [
  { end: 540000,  label: 'Nhà tuyển dụng uy tín',  text: 'Các nhà tuyển dụng đến từ tất cả các ngành nghề và được xác thực bởi TopCV' },
  { end: 200000,  label: 'Doanh nghiệp hàng đầu',  text: 'TopCV được nhiều doanh nghiệp hàng đầu tin tưởng và đồng hành như Samsung, Viettel, …' },
  { end: 2000000, label: 'Việc làm đã được kết nối', text: 'TopCV đồng hành và kết nối hàng nghìn ứng viên với cơ hội việc làm hấp dẫn.' },
  { end: 1200000, label: 'Lượt tải ứng dụng',     text: 'Hàng triệu ứng viên sử dụng TopCV, trong đó 60% có kinh nghiệm từ 3 năm trở lên.' },
];

export default function ImpressiveNumbersSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setHasAnimated(true);
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Con số ấn tượng</h2>
        <p className={styles.description}>
          TopCV là công ty công nghệ nhân sự (HR Tech) hàng đầu Việt Nam. Với năng lực lõi là
          công nghệ, đặc biệt là trí tuệ nhân tạo (AI), sứ mệnh của TopCV đặt ra cho mình là thay đổi
          thị trường tuyển dụng – nhân sự ngày một hiệu quả hơn.
        </p>

        <div className={styles.statsGrid}>
          {STATS.map((stat, idx) => {
            const count = useCountUp(stat.end, 1500, hasAnimated);
            const formatted = count.toLocaleString('vi-VN') + '+';
            return (
              <div key={idx} className={styles.card}>
                <div className={styles.divider} />
                <h3 className={styles.number}>{formatted}</h3>
                <p className={styles.label}>{stat.label}</p>
                <p className={styles.text}>{stat.text}</p>
              </div>
            );
          })}
          <div className={styles.logoWrapper}>
            <img src="/topcv-chip.svg" alt="TopCV" />
          </div>
        </div>
      </div>
    </section>
    
  );
}