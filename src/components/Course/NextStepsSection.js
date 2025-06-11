import React from 'react';
import styles from './NextStepsSection.module.css';

export default function NextStepsSection() {
  const steps = [
    {
      icon: '/assets/icons/icon1.svg',
      title: 'Choose a course that suits your needs',
      desc: 'We are passionate about good and smart work. We believe that each of us, through our own actions.',
    },
    {
      icon: '/assets/icons/icon2.svg',
      title: 'Add it to your cart and make the payment',
      desc: 'We accelerate the development of production companies on a daily basis using lean tools.',
    },
    {
      icon: '/assets/icons/icon3.svg',
      title: 'Enjoy lifetime access to our courses',
      desc: 'We do this for everyone who wants to be better tomorrow than it is today.',
    },
  ];
  return (
    <section className={styles.nextSection}>
      <div className={styles.container}>
        <h2>What should you do next?</h2>
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
        <button className={styles.checkBtn}>Check all courses</button>
      </div>
    </section>
  );
}
