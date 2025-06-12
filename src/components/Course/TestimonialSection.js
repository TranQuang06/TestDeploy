import React, { useState } from 'react';
import styles from './TestimonialSection.module.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const testimonials = [
  {
    name: 'Pawel Nawara',
    title: 'Product Designer',
    avatar: '/assets/avatars/pawel.jpg', // avatar thật
    text: 'Consultants showed high flexibility and perfect organization - in addition to the planned activities, they supported the company in ongoing initiatives. One of such activities was the planning of equipment for the design of a new production hall, where the extensive knowledge and experience of consultants was an invaluable help.',
  },
  {
    name: 'Tomasz Osowski',
    title: 'Head of Design',
    avatar: '/assets/avatars/tomasz.jpg',
    text: 'Consultants showed high flexibility and perfect organization - in addition to the planned activities, they supported the company in ongoing initiatives. Their knowledge and experience were invaluable.',
  },
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);

  const t = testimonials[index];

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.grid}>
        {/* Left: Tiêu đề và nút */}
        <div className={styles.left}>
          <h2 className={styles.heading}>
            See what participants say<br />about our courses
          </h2>
          <button className={styles.checkAllBtn}>Check all courses</button>
        </div>

        {/* Right: Card đánh giá */}
        <div className={styles.right}>
          <div className={styles.slider}>
            <button onClick={prev} className={styles.arrowBtn}><LeftOutlined /></button>
            <div className={styles.card}>
              <div className={styles.userRow}>
                <img src={t.avatar} alt={t.name} className={styles.avatar} />
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.title}>{t.title}</div>
                </div>
              </div>
              <div className={styles.text}>
                <span className={styles.quoteMark}>&ldquo;</span>
                {t.text}
              </div>
            </div>
            <button onClick={next} className={styles.arrowBtn}><RightOutlined /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
