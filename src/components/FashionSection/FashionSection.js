import styles from "./FashionSection.module.css";

export default function FashionSection() {
  return (
    <section className={styles.section}>
      {/* Left side */}
      <div className={styles.left}>
        <h2 className={styles.title}>
          Sustainable and <br />
          Ethical Fashion for <br />
          <span>Urban Explorers</span>
        </h2>
        <p className={styles.subtitle}>
          → Explore the world sustainably and ethically with our urban-inspired
          fashion.
        </p>
        <button className={styles.ctaBtn}>Shop the Collection</button>
      </div>

      {/* Right side */}
      <div className={styles.collage}>
        {/* 1. Small text card */}
        <div className={styles.smallCard}>
          <h4>Exclusive Limited Editions</h4>
          <p>Inspired by different urban landscapes.</p>
          <span className={styles.smallCardArrow}>→</span>
        </div>

        {/* 2. Top-right image */}
        <img
          src="../../assets/img/HomePage/bg_03.avif"
          alt="Cap"
          className={styles.smallImage}
        />

        {/* 3. Bottom-left image */}
        <img
          src="../../assets/img/HomePage/bg_02.avif"
          alt="Urban portrait"
          className={styles.largeImage}
        />

        {/* 4. Big overlay card */}
        <div className={styles.overlayCard}>
          <h3>Urban Explorer Aesthetic</h3>
          <p>
            Our clothing is designed for the modern urban explorer – those who
            value both style and functionality. From chic streetwear to
            versatile outdoor gear, we cater to the adventurous spirit of city
            dwellers and nature enthusiasts alike.
          </p>
          <button className={styles.overlayBtn}>
            Start Your Eco-Adventure Now →
          </button>
        </div>
      </div>
    </section>
  );
}
