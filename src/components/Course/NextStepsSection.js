import React from 'react';
import styles from './NextStepsSection.module.css';

export default function NextStepsSection() {
  const steps = [
    {
      icon: '/assets/img/Course/Next1.png',
      title: 'Chọn khóa học phù hợp với mục tiêu của bạn',
      desc: 'Chúng tôi tin rằng mỗi cá nhân đều có tiềm năng to lớn. Hãy chọn khóa học giúp bạn phát triển tối đa năng lực và đam mê của mình.',
    },
    {
      icon: '/assets/img/Course/Next2.png',
      title: 'Đăng ký và bắt đầu hành trình học tập',
      desc: ' Quy trình đăng ký đơn giản, dễ dàng. Chúng tôi sẽ hướng dẫn bạn từng bước để nhanh chóng bắt đầu trải nghiệm học tập của mình.',
    },
    {
      icon: '/assets/img/COurse/Next3.png',
      title: 'Tận hưởng quyền truy cập trọn đời và phát triển không ngừng',
      desc: 'Với quyền truy cập không giới hạn, bạn có thể học theo nhịp độ của riêng mình, ôn lại kiến thức và luôn cập nhật những nội dung mới nhất.',
    },
  ];
  return (
    <section className={styles.nextSection}>
      <div className={styles.container}>
        <h2>Bạn nên làm gì tiếp theo?</h2>
        <div className={styles.stepsGrid}>
          {steps.map((s, idx) => (
            <div key={idx} className={styles.stepCard}>
              <div className={styles.iconWrapper}>
                <img src={s.icon} alt="" />
              </div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
              <span className={styles.stepNumber}>{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
