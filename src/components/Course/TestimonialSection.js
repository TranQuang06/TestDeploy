import React, { useState } from 'react';
import styles from './TestimonialSection.module.css';

// Dữ liệu mẫu; thay avatar và text cho đúng
const testimonials = [
  {
    name: 'Pawel Nawara',
    title: 'Product Designer',
    avatar: '/assets/avatars/paweł.jpg',
    text: 'Consultants showed high flexibility and perfect organization - in addition to the planned activities, they supported the company in ongoing initiatives. One of such activities was the planning of equipment for the design of a new production hall, where the extensive knowledge and experience of consultants was an invaluable help.',
  },
  {
    name: 'Tomasz Osowski',
    title: 'Head of Design',
    avatar: '/assets/avatars/tomasz.jpg',
    text: 'Consultants showed high flexibility and perfect organization - in addition to the planned activities ... (nội dung tương tự)',
  },
  // Thêm nếu cần
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const t = testimonials[index];

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.container}>
        <h2>See what participants say about our courses</h2>
        <button className={styles.checkAllBtn}>Check all courses</button>
        <div className={styles.cardWrapper}>
          <button onClick={prev} className={styles.arrowBtn}>&larr;</button>
          <div className={styles.card}>
            <div className={styles.header}>
              <img src={t.avatar} alt={t.name} className={styles.avatar} />
              <div>
                <p className={styles.name}>{t.name}</p>
                <p className={styles.title}>{t.title}</p>
              </div>
            </div>
            <p className={styles.text}>"{t.text}"</p>
          </div>
          <button onClick={next} className={styles.arrowBtn}>&rarr;</button>
        </div>
      </div>
    </section>
  );
}
